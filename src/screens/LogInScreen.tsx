import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { TextInput, Button, Text } from 'react-native-paper'


export default function LogInScreen() {
    // Estás dos constantes se encargan de almacenar el email y la contraseña que el usuario manda en los inputs, esto se hace con useState
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    return (
        <View style={styles.container}>
            <Text variant='headlineMedium' style={styles.title}>Iniciar Sesión</Text>
            <TextInput
                label='Email'
                value={email}
                onChangeText={text => setEmail(text)}
                style={styles.input}
            />
            <TextInput
                label='Contraseña'
                value={password}
                onChangeText={text => setPassword(text)}
                style={styles.input}
                secureTextEntry
            />
            <Button mode='contained' onPress={() => { }}>
                Iniciar Sesión
            </Button>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        textAlign: 'center',
        marginBottom: 40,
        color: '#333'
    },
    input: {
        marginBottom: 20,
    },
})
