import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView, Platform } from 'react-native';
import { TextInput, Button, Text, Divider } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const router = useRouter();
    const { theme } = useTheme();
    const colors = theme.colors;
    const { register } = useAuth();
    const styles = makeStyles(colors);
    const translateAuthError = (msg: string) => {
        const m = msg.toLowerCase();
        if (m.includes('invalid login credentials')) return 'Correo o contraseña incorrectos';
        if (m.includes('email not confirmed')) return 'Formato de correo inválido';
        if (m.includes('password should be at least')) return 'La contraseña es demasiado corta';
        if (m.includes('already registered')) return 'Ese correo ya está registrado';
        return 'Error al autenticar';
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.card}>
                <View style={styles.headerContainer}>
                    <Image
                        source={require('../assets/images/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                <Text variant="headlineMedium" style={styles.title}>Crear cuenta</Text>
                <Text variant="bodyMedium" style={styles.subtitle}>Completa tus datos para registrarte</Text>

                <View style={styles.formContainer}>
                    <Text style={styles.label}>Nombre completo</Text>
                    <TextInput
                        label="Nombre"
                        value={name}
                        onChangeText={setName}
                        style={styles.input}
                        mode="outlined"
                        left={<TextInput.Icon icon="account-outline" color={colors.textSecondary} />}
                        outlineColor={colors.border}
                        activeOutlineColor={colors.primary}
                        theme={{
                            colors: {
                                background: colors.surface,
                                primary: colors.primary,
                                text: colors.text,
                                onSurface: colors.text,
                                placeholder: colors.textSecondary,
                                outline: colors.border,
                            },
                        }}
                    />

                    <Text style={styles.label}>Correo Electrónico</Text>
                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                        mode="outlined"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        left={<TextInput.Icon icon="email-outline" color={colors.textSecondary} />}
                        outlineColor={colors.border}
                        activeOutlineColor={colors.primary}
                        theme={{
                            colors: {
                                background: colors.surface,
                                primary: colors.primary,
                                text: colors.text,
                                onSurface: colors.text,
                                placeholder: colors.textSecondary,
                                outline: colors.border,
                            },
                        }}
                    />

                    <Text style={styles.label}>Contraseña</Text>
                    <TextInput
                        label="Contraseña"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        style={styles.input}
                        mode="outlined"
                        left={<TextInput.Icon icon="lock-outline" color={colors.textSecondary} />}
                        right={
                            <TextInput.Icon
                                icon={showPassword ? "eye-off" : "eye"}
                                onPress={() => setShowPassword(!showPassword)}
                                color={colors.textSecondary}
                            />
                        }
                        outlineColor={colors.border}
                        activeOutlineColor={colors.primary}
                        theme={{
                            colors: {
                                background: colors.surface,
                                primary: colors.primary,
                                text: colors.text,
                                onSurface: colors.text,
                                placeholder: colors.textSecondary,
                                outline: colors.border,
                            },
                        }}
                    />
                </View>

                <Button
                    mode="contained"
                    onPress={async () => {
                        try {
                            setErrorMsg('');
                            await register(name, email, password);
                            router.replace('/');
                        } catch (error: any) {
                            const msg = translateAuthError(error?.message || '');
                            setErrorMsg(msg);
                            if (Platform.OS !== 'web') {
                                Alert.alert('Error de acceso', msg);
                            }
                        }
                    }}
                    style={styles.loginButton}
                    contentStyle={{ height: 50 }}
                >
                    Registrarse
                </Button>
                {errorMsg ? <Text style={{ color: 'red', marginTop: 8 }}>{errorMsg}</Text> : null}


                <Button
                    mode="outlined"
                    icon="google"
                    onPress={() => { }}
                    style={styles.googleButton}
                    textColor="#333"
                >
                    Google
                </Button>

            </View>
        </ScrollView>
    );
}

const makeStyles = (colors: any) => StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: colors.background,
    },
    card: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: colors.card,
        borderRadius: 32,
        borderColor: colors.primary,
        borderWidth: 1,
        padding: 24,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 150,
        height: 150,
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
        color: colors.text,
    },
    input: {
        backgroundColor: colors.surface,
        marginBottom: 16,
        fontSize: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },
    loginButton: {
        marginTop: 8,
        borderRadius: 12,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    divider: {
        flex: 1,
    },
    dividerText: {
        marginHorizontal: 8,
        color: colors.textSecondary,
    },
    googleButton: {
        borderRadius: 12,
        borderColor: colors.border,
    },
    footer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    registerLink: {
        color: colors.primary,
        fontWeight: '700',
    },
});