import React, { useEffect, useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Image, ScrollView, Platform } from 'react-native'
import { TextInput, Button, Text, Divider, Dialog, Portal } from 'react-native-paper'
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import * as LocalAuthentication from 'expo-local-authentication';



export default function LogInScreen({ navigation }: any) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const [showBiometricDialog, setShowBiometricDialog] = useState(false);
    const router = useRouter();
    const { theme } = useTheme();
    const colors = theme.colors;
    const { login, enableBiometric, user, isLoading } = useAuth();
    const styles = makeStyles(colors);
    const [errorMsg, setErrorMsg] = useState('');
    const translateAuthError = (msg: string) => {
        const m = msg.toLowerCase();
        if (m.includes('invalid login credentials')) return 'Correo o contraseña incorrectos';
        if (m.includes('email not confirmed')) return 'Formato de correo inválido';
        if (m.includes('password should be at least')) return 'La contraseña es demasiado corta';
        if (m.includes('already registered')) return 'Ese correo ya está registrado';
        return 'Error al autenticar';
    };

    useEffect(() => {
        if (!isLoading && user) {
            router.replace('/(tabs)/dashboard');
        }
    }, [isLoading, user, router]);

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.card}>
                <View style={styles.headerContainer}>
                    <Image
                        source={require('../assets/images/logo.png')} // Asegúrate de que la ruta sea correcta
                        style={styles.logo}
                        resizeMode="contain"
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
                        mode="outlined"
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
                    mode='contained'
                    onPress={async () => {
                        try {
                            setErrorMsg('');
                            await login(email, password);

                            // Preguntar si quiere usar huella
                            const hasHardware = await LocalAuthentication.hasHardwareAsync();
                            const isEnrolled = await LocalAuthentication.isEnrolledAsync();

                            if (hasHardware && isEnrolled) {
                                setShowBiometricDialog(true);
                            } else {
                                router.replace('/(tabs)/dashboard');
                            }
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
                    Iniciar Sesión
                </Button>
                {errorMsg ? <Text style={{ color: 'red', marginTop: 8 }}>{errorMsg}</Text> : null}

                <Portal>
                    <Dialog visible={showBiometricDialog} onDismiss={() => setShowBiometricDialog(false)}>
                        <Dialog.Title>Autenticación biométrica</Dialog.Title>
                        <Dialog.Content>
                            <Text>¿Quieres usar tu huella dactilar para iniciar sesión más rápido la próxima vez?</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => {
                                setShowBiometricDialog(false);
                                router.replace('/(tabs)/dashboard');
                            }}>No, gracias</Button>
                            <Button onPress={async () => {
                                await enableBiometric();
                                setShowBiometricDialog(false);
                                router.replace('/(tabs)/dashboard');
                            }}>Sí, activar</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>

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
                    <TouchableOpacity onPress={() => router.push('/register')}>
                        <Text style={styles.registerLink}>Regístrate ahora</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
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
        shadowOffset: {
            width: 0,
            height: 4,
        },
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