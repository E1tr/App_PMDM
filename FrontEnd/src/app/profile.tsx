import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { Text, TextInput, Button, Avatar, Card } from 'react-native-paper';
import { useTheme } from '../contexts/ThemeContext';
import CustomAppBar from '../components/CustomAppBar';
import { useAuth } from '../contexts/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../lib/supabase';
import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';

export default function ProfileScreen() {
    const { theme } = useTheme();
    const colors = theme.colors;
    const { user, refreshProfile } = useAuth();

    if (!user) return <Text>No hay sesión activa</Text>;

    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || 'https://via.placeholder.com/150');

    const handleSaveProfile = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 1500);
    };

    const uriToUpload = async (uri: string) => {
        if (Platform.OS === 'web') {
            const res = await fetch(uri);
            return await res.blob();
        }
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
        return decode(base64);
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso denegado', 'Necesitamos acceso a la galería');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            const fileExt = uri.split('.').pop() || 'jpg';
            const filePath = `${user.id}/${Date.now()}.${fileExt}`;

            const fileData = await uriToUpload(uri);

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, fileData, {
                    contentType: 'image/jpeg',
                    upsert: true,
                });

            if (uploadError) {
                Alert.alert('Error', uploadError.message);
                return;
            }
            const { data: publicUrlData } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            const publicUrl = publicUrlData.publicUrl;

            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', user.id);

            if (updateError) {
                Alert.alert('Error', updateError.message);
                return;
            }

            setAvatarUrl(publicUrl);
            await refreshProfile();
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <CustomAppBar title="Mi Perfil" />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={pickImage}>
                        <Avatar.Image
                            size={100}
                            source={{ uri: avatarUrl }}
                        />
                        <View style={[styles.editBadge, { backgroundColor: colors.primary }]}>
                            <Avatar.Icon size={24} icon="camera" color="white" style={{ backgroundColor: 'transparent' }} />
                        </View>
                    </TouchableOpacity>
                    <Text variant="headlineSmall" style={[styles.userName, { color: colors.text }]}>
                        {name}
                    </Text>
                    <Text variant="bodyMedium" style={{ color: colors.textSecondary }}>
                        {user.role === 'ADMIN' ? 'Administrador Slate' : 'Gestor de Alquileres'}
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