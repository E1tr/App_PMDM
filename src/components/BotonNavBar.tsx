import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useRouter, usePathname } from 'expo-router';

export default function BottomNavBar() {
    const router = useRouter();
    const pathname = usePathname();

    // Función para saber si el icono debe estar activo (color primario) o inactivo (gris)
    const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

    return (
        <View style={styles.container}>
            {/* Botón Home */}
            <TouchableOpacity
                style={styles.tab}
                onPress={() => router.push('/')}
            >
                <IconButton
                    icon="home"
                    iconColor={isActive('/') && pathname === '/' ? '#5c5cff' : '#aaa'}
                    size={30}
                />
            </TouchableOpacity>

            {/* Botón Gestión Usuarios */}
            <TouchableOpacity
                style={styles.tab}
                onPress={() => router.push('/user-management')}
            >
                <IconButton
                    icon="account-group"
                    iconColor={isActive('/user-management') ? '#5c5cff' : '#aaa'}
                    size={30}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        height: 70,
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingBottom: 10,
    },
    tab: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
});