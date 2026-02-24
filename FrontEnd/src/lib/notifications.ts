import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { supabase } from './supabase';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowList: true,
    }),
});

export async function registerForPushNotificationsAsync(userId: string): Promise<string | null> {
    if (Platform.OS === 'web') {
        console.log('Las notificaciones push no están soportadas en web');
        return null;
    }

    if (!Device.isDevice) {
        console.log('Necesitas un dispositivo físico para las notificaciones push');
        return null;
    }

    try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.log('Permisos de notificación denegados');
            return null;
        }

        const tokenData = await Notifications.getExpoPushTokenAsync({
            projectId: 'dab1746e-e62b-424c-b9c0-4fae75c9b1a9'
        });
        const token = tokenData.data;

        const { error } = await supabase
            .from('push_tokens')
            .upsert({
                user_id: userId,
                token: token,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'user_id'
            });

        if (error) {
            console.error('Error al guardar token:', error);
        }

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        return token;
    } catch (error) {
        console.error('Error al registrar notificaciones:', error);
        return null;
    }
}

export async function getAllPushTokens(): Promise<string[]> {
    try {
        const { data, error } = await supabase
            .from('push_tokens')
            .select('token');

        if (error) {
            console.error('Error al obtener tokens:', error);
            return [];
        }

        return (data || []).map(row => row.token);
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

export async function sendPushNotifications(
    tokens: string[],
    title: string,
    body: string,
    data?: Record<string, any>
): Promise<void> {
    if (tokens.length === 0) return;

    const chunkSize = 100;
    const chunks = [];

    for (let i = 0; i < tokens.length; i += chunkSize) {
        chunks.push(tokens.slice(i, i + chunkSize));
    }

    for (const chunk of chunks) {
        const messages = chunk.map(token => ({
            to: token,
            sound: 'default',
            title,
            body,
            data: data || {},
            priority: 'high' as const,
        }));

        try {
            const response = await fetch('https://exp.host/--/api/v2/push/send', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(messages),
            });

            const result = await response.json();
            console.log('Notificaciones enviadas:', result);
        } catch (error) {
            console.error('Error al enviar notificaciones:', error);
        }
    }
}