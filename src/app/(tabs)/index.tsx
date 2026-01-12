import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import CustomAppBar from '../../components/CustomAppBar';
import { COLORS } from '../../constants/theme';

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <CustomAppBar title="Inicio" />

            <View style={styles.content}>
                {/* Logo */}
                <View style={styles.logoContainer}>
                    <View style={styles.logoCircle}>
                        <Text style={styles.logoText}>📊</Text>
                    </View>
                    <Text variant="headlineLarge" style={styles.appName}>
                        GestorPro
                    </Text>
                    <Text variant="bodyMedium" style={styles.subtitle}>
                        Sistema de Gestión Empresarial
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    logoContainer: {
        alignItems: 'center',
    },
    logoCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        elevation: 8,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    logoText: {
        fontSize: 60,
    },
    appName: {
        color: COLORS.primary,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
});