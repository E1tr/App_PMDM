import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function BottomNavBar() {
    const navigation = useNavigation();
    const route = useRoute();

    // Función para saber si el icono debe estar activo (color primario) o inactivo (gris)
    const isActive = (screenName: string) => route.name === screenName;

    return (
        <View style={styles.container}>
            {/* Botón Home */}
            <TouchableOpacity
                style={styles.tab}
                onPress={() => navigation.navigate('Home' as never)}
            >
                <IconButton
                    icon="home"
                    iconColor={isActive('Home') ? '#5c5cff' : '#aaa'}
                    size={30}
                />
            </TouchableOpacity>

            {/* Botón Gestión Usuarios */}
            <TouchableOpacity
                style={styles.tab}
                onPress={() => navigation.navigate('UserManagement' as never)} // Asumiendo que crearás esta pantalla
            >
                <IconButton
                    icon="account-group"
                    iconColor={isActive('UserManagement') ? '#5c5cff' : '#aaa'}
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
        height: 70, // Altura de la barra
        alignItems: 'center',
        justifyContent: 'space-around', // Distribuye los iconos equitativamente
        paddingBottom: 10, // Espacio para el safe area inferior
    },
    tab: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
});