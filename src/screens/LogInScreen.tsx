import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { TextInput, Button, Text, Avatar, Divider } from 'react-native-paper'


export default function LogInScreen() {
    // Estás dos constantes se encargan de almacenar el email y la contraseña que el usuario manda en los inputs, esto se hace con useState
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Avatar.Icon
                    size={80}
                    icon="lock-outline"
                    style={styles.avatar}
                    color="#5c5cff"
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
                    outlineStyle={styles.input}
                    style={styles.input}
                    left={<TextInput.Icon icon="email-outline" color="#aaa" />}
                    theme={{ colors: { primary: '#5c5cff', outline: '#E0E0E0' } }}
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
                    left={<TextInput.Icon icon="lock-outline" color="#aaa" />}
                    right={
                        <TextInput.Icon
                            icon={showPassword ? "eye-off" : "eye"}
                            onPress={() => setShowPassword(!showPassword)}
                            color="#aaa"
                        />
                    }
                    theme={{ colors: { primary: '#5c5cff', outline: '#E0E0E0' } }}
                />
            </View>


            <Button
                mode='contained'
                onPress={() => { }}
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


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
        backgroundColor: '#fff',
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        backgroundColor: '#E8EAF6', // Fondo lila muy clarito
    },
    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#1a1b4b',
        marginBottom: 8,
    },
    subtitle: {
        textAlign: 'center',
        color: '#7e7e7e',
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
        backgroundColor: '#fff',
        marginBottom: 16,
        fontSize: 14,
    },
    inputOutline: {
        borderRadius: 12, // Bordes redondeados del input
        borderColor: '#E0E0E0',
    },
    passwordHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    forgotPassword: {
        color: '#5c5cff',
        fontWeight: '600',
        fontSize: 12,
    },
    loginButton: {
        backgroundColor: '#5c5cff',
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
        backgroundColor: '#E0E0E0',
    },
    dividerText: {
        marginHorizontal: 10,
        color: '#888',
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
        color: '#5c5cff',
        fontWeight: 'bold',
    },
})
