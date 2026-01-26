import React, { useMemo } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text } from 'react-native-paper';
import CustomAppBar from '../../components/CustomAppBar';
import { useTheme } from '../../contexts/ThemeContext';

export default function HomeScreen() {
    const { theme } = useTheme();
    const colors = theme.colors;

    const styles = useMemo(() => makeStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            <CustomAppBar title="Inicio" />

            <View style={styles.content}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../../assets/images/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />

                    <Text variant="headlineLarge" style={styles.appName}>
                        SLATE
                    </Text>
                    <Text variant="titleMedium" style={styles.appTitle}>
                        MANAGEMENT
                    </Text>

                    <View style={styles.divider} />

                    <Text variant="bodyMedium" style={styles.subtitle}>
                        Control total en la palma de tu mano 🗝️
                    </Text>
                </View>
            </View>
        </View>
    );
}

const makeStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    logoContainer: {
        alignItems: 'center',
        width: '100%',
    },
    logo: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },
    appName: {
        color: colors.primary,
        fontWeight: '900',
        letterSpacing: 4,
        fontSize: 36,
    },
    appTitle: {
        color: colors.text,
        fontWeight: '300',
        letterSpacing: 2,
        marginTop: -5,
    },
    divider: {
        height: 3,
        width: 40,
        backgroundColor: colors.primary,
        marginVertical: 15,
        borderRadius: 2,
    },
    subtitle: {
        color: colors.textSecondary,
        textAlign: 'center',
        maxWidth: '80%',
    },
});