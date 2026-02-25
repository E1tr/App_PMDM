import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { ClientProvider } from '../contexts/ClientContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';
import { PedidoProvider } from '../contexts/PedidoContext';
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export default function Layout() {
    useEffect(() => {
        if (Platform.OS === 'web') return;

        const notificationListener = Notifications.addNotificationReceivedListener(notification => {
            console.log('Notificación recibida:', notification);
        });

        const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('Usuario tocó la notificación:', response);
        });

        return () => {
            notificationListener.remove();
            responseListener.remove();
        };
    }, []);

    return (
        <AuthProvider>
            <PaperProvider>
                <ThemeProvider>
                    <ClientProvider>
                        <PedidoProvider>
                            <Stack screenOptions={{ headerShown: false }}>
                                <Stack.Screen name="index" />
                            </Stack>
                        </PedidoProvider>
                    </ClientProvider>
                </ThemeProvider>
            </PaperProvider>
        </AuthProvider>
    );
}