import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, Text } from 'react-native-paper';
import BottomNavBar from '../../components/BotonNavBar';

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text variant="headlineMedium" style={styles.welcomeText}>OTRO</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: '#5c5cff', // Color primario del Login
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    welcomeText: {
        color: '#1a1b4b', // Color del título del Login
        fontWeight: 'bold',
        textAlign: 'center',
    }
});