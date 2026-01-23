import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native'
import { TextInput, Button, Text, Divider } from 'react-native-paper'
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { usuarios } from '../types/types';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

export default function LogInScreen({ navigation }: any) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const { theme } = useTheme();
    const colors = theme.colors;
    const { login } = useAuth();
    const styles = makeStyles(colors);

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
                            login(usuarioEncontrado);
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