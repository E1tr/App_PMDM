import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Avatar, Card } from 'react-native-paper';
import { useTheme } from '../contexts/ThemeContext';
import CustomAppBar from '../components/CustomAppBar';
import { useAuth } from '../contexts/AuthContext';

export default function ProfileScreen() {
    const { theme } = useTheme();
    const colors = theme.colors;
    const { user } = useAuth();

    if (!user) return <Text>No hay sesión activa</Text>;

    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSaveProfile = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 1500);
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <CustomAppBar title="Mi Perfil" />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => console.log('Cambiar foto')}>
                        <Avatar.Image
                            size={100}
                            source={{ uri: user.avatarUrl || 'https://via.placeholder.com/150' }}
                        />
                        <View style={[styles.editBadge, { backgroundColor: colors.primary }]}>
                            <Avatar.Icon size={24} icon="camera" color="white" style={{ backgroundColor: 'transparent' }} />
                        </View>
                    </TouchableOpacity>
                    <Text variant="headlineSmall" style={[styles.userName, { color: colors.text }]}>
                        {name}
                    </Text>
                    <Text variant="bodyMedium" style={{ color: colors.textSecondary }}>
                        {user.roleId === 2 ? 'Administrador Slate' : 'Gestor de Alquileres'}
                    </Text>
                </View>

                <Card style={[styles.card, { backgroundColor: colors.card }]}>
                    <Card.Content>
                        <Text variant="titleMedium" style={[styles.cardTitle, { color: colors.primary }]}>
                            Información Personal
                        </Text>
                        <TextInput
                            label="Nombre Completo"
                            value={name}
                            onChangeText={setName}
                            mode="outlined"
                            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border }]}
                            outlineColor={colors.textSecondary}
                            activeOutlineColor={colors.primary}
                            textColor={colors.text}
                            placeholderTextColor={colors.textSecondary}
                            theme={{
                                colors: {
                                    background: colors.surface,
                                    primary: colors.primary,
                                    text: colors.text,
                                    onSurface: colors.text,
                                    placeholder: colors.textSecondary,
                                    outline: colors.textSecondary,
                                },
                            }}
                        />
                        <TextInput
                            label="Correo Electrónico"
                            value={email}
                            onChangeText={setEmail}
                            mode="outlined"
                            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border }]}
                            outlineColor={colors.textSecondary}
                            activeOutlineColor={colors.primary}
                            textColor={colors.text}
                            placeholderTextColor={colors.textSecondary}
                            disabled
                            theme={{
                                colors: {
                                    background: colors.surface,
                                    primary: colors.primary,
                                    text: colors.text,
                                    onSurface: colors.text,
                                    placeholder: colors.textSecondary,
                                    outline: colors.textSecondary,
                                },
                            }}
                        />
                        <Button
                            mode="contained"
                            onPress={handleSaveProfile}
                            loading={loading}
                            style={styles.button}
                        >
                            Guardar Cambios
                        </Button>
                    </Card.Content>
                </Card>

                <Card style={[styles.card, { backgroundColor: colors.card, marginTop: 20 }]}>
                    <Card.Content>
                        <Text variant="titleMedium" style={[styles.cardTitle, { color: colors.primary }]}>
                            Seguridad
                        </Text>
                        <TextInput
                            label="Contraseña Actual"
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            secureTextEntry
                            mode="outlined"
                            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border }]}
                            outlineColor={colors.textSecondary}
                            activeOutlineColor={colors.primary}
                            textColor={colors.text}
                            placeholderTextColor={colors.textSecondary}
                            theme={{
                                colors: {
                                    background: colors.surface,
                                    primary: colors.primary,
                                    text: colors.text,
                                    onSurface: colors.text,
                                    placeholder: colors.textSecondary,
                                    outline: colors.textSecondary,
                                },
                            }}
                        />
                        <TextInput
                            label="Nueva Contraseña"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry
                            mode="outlined"
                            style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border }]}
                            outlineColor={colors.textSecondary}
                            activeOutlineColor={colors.primary}
                            textColor={colors.text}
                            placeholderTextColor={colors.textSecondary}
                            theme={{
                                colors: {
                                    background: colors.surface,
                                    primary: colors.primary,
                                    text: colors.text,
                                    onSurface: colors.text,
                                    placeholder: colors.textSecondary,
                                    outline: colors.textSecondary,
                                },
                            }}
                        />
                        <Button
                            mode="outlined"
                            onPress={() => console.log('Update password')}
                            style={[styles.button, { borderColor: colors.primary }]}
                            textColor={colors.primary}
                        >
                            Actualizar Contraseña
                        </Button>
                    </Card.Content>
                </Card>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginVertical: 30,
    },
    editBadge: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        borderRadius: 20,
        padding: 4,
        borderWidth: 2,
        borderColor: 'white',
    },
    userName: {
        marginTop: 15,
        fontWeight: 'bold',
    },
    card: {
        borderRadius: 16,
        elevation: 2,
    },
    cardTitle: {
        marginBottom: 15,
        fontWeight: 'bold',
    },
    input: {
        marginBottom: 15,
        backgroundColor: 'transparent',
        borderRadius: 12,
    },
    button: {
        marginTop: 10,
        borderRadius: 10,
    }
});