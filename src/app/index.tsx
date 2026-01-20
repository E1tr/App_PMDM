import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { TextInput, Button, Text, Avatar, Divider } from 'react-native-paper'
import { useRouter } from 'expo-router';
import { COLORS } from '../constants/theme';
import { Alert } from 'react-native';
import { usuarios } from '../types/types';
import { useTheme } from '../contexts/ThemeContext';

export default function LogInScreen({ navigation }: any) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const { theme } = useTheme();
    const colors = theme.colors;
    const styles = makeStyles(colors);



    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Avatar.Icon
                    size={80}
                    icon="lock-outline"
                    style={styles.avatar}
                    color={colors.primary}
                />

            </View>
            <Text variant='headlineMedium' style={styles.title}>Bienvenido</Text>
            <Text variant='bodyMedium' style={styles.subtitle}>Introduce tus credenciales para continuar</Text>


            <View style={styles.formContainer}>
                <Text style={styles.label}>Correo Electronico</Text>
                <TextInput
                    label='Email'
                    value={email}
                    onChangeText={text => setEmail(text)}
                    style={styles.input}
                    left={<TextInput.Icon icon="email-outline" color={colors.textSecondary} />}
                    theme={{ colors: { primary: colors.primary, outline: colors.primary } }}
                />
                <View style={styles.passwordHeader}>
                    <Text style={styles.label}>Contraseña</Text>
                    <TouchableOpacity onPress={() => console.log('Recuperar')}>
                        <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
                    </TouchableOpacity>
                </View>
                <TextInput
                    label='Contraseña'
                    value={password}
                    onChangeText={text => setPassword(text)}
                    secureTextEntry={!showPassword}
                    style={styles.input}
                    left={<TextInput.Icon icon="lock-outline" color={colors.textSecondary} />}
                    right={
                        <TextInput.Icon
                            icon={showPassword ? "eye-off" : "eye"}
                            onPress={() => setShowPassword(!showPassword)}
                            color={colors.textSecondary}
                        />
                    }
                    theme={{ colors: { primary: colors.primary, outline: colors.primary } }}
                />
            </View>


            <Button
                mode='contained'
                onPress={() => {
                    const usuarioEncontrado = usuarios.find(u => u.email === email && u.password === password);
                    if (usuarioEncontrado) {
                        router.replace('/(tabs)/dashboard');
                    } else {
                        Alert.alert('Error de acceso', 'Correo o contraseña incorrectos');
                    }
                }}
                style={styles.loginButton}
                contentStyle={{ height: 50 }}
            >
                Iniciar Sesión
            </Button>

            <View style={styles.dividerContainer}>
                <Divider style={styles.divider} />
                <Text style={styles.dividerText}>O continúa con</Text>
                <Divider style={styles.divider} />
            </View>
            <Button
                mode='outlined'
                icon="google"
                onPress={() => { }}
                style={styles.googleButton}
                textColor="#333"
            >
                Google
            </Button>
            <View style={styles.footer}>
                <Text style={{ color: '#666' }}>¿No tienes una cuenta? </Text>
                <TouchableOpacity onPress={() => { }}>
                    <Text style={styles.registerLink}>Regístrate ahora</Text>
                </TouchableOpacity>
            </View>
        </View>

    )
}


const makeStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
        backgroundColor: colors.background,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        backgroundColor: '#E8EAF6',
    },
    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 8,
    },
    subtitle: {
        textAlign: 'center',
        color: colors.textSecondary,
        marginBottom: 32,
    },
    formContainer: {
        width: '100%',
    },
    label: {
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    input: {
        backgroundColor: colors.background,
        marginBottom: 16,
        fontSize: 14,
    },
    inputOutline: {
        borderRadius: 12,
        borderColor: '#E0E0E0',
    },
    passwordHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    forgotPassword: {
        color: colors.primary,
        fontWeight: '600',
        fontSize: 12,
    },
    loginButton: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        marginTop: 10,
        marginBottom: 24,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    divider: {
        flex: 1,
        backgroundColor: colors.textSecondary,
    },
    dividerText: {
        marginHorizontal: 10,
        color: colors.textSecondary,
        fontSize: 12,
    },
    googleButton: {
        borderRadius: 12,
        borderColor: '#E0E0E0',
        marginBottom: 24,
        paddingVertical: 4,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    registerLink: {
        color: colors.primary,
        fontWeight: 'bold',
    },
})