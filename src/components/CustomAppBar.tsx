import React, { useState } from 'react';
import { Appbar, Avatar, Divider } from 'react-native-paper';
import { useRouter, useNavigation } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { TouchableOpacity, Modal, View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';

interface CustomAppBarProps {
    title: string;
    showBackButton?: boolean;
}

export default function CustomAppBar({ title, showBackButton }: CustomAppBarProps) {
    const router = useRouter();
    const navigation = useNavigation();
    const [menuVisible, setMenuVisible] = useState(false);
    const { theme } = useTheme();
    const { user, logout } = useAuth();
    const colors = theme.colors;

    const canGoBack = showBackButton ?? navigation.canGoBack();

    const handleLogout = () => {
        setMenuVisible(false);
        logout();
        setTimeout(() => {
            router.replace('/');
        }, 100);
    };

    const handleNavigate = (path: string) => {
        setMenuVisible(false);
        router.push(path);
    };

    return (
        <>
            <Appbar.Header style={{ backgroundColor: colors.primary }}>
                {canGoBack && (
                    <Appbar.BackAction
                        onPress={() => router.back()}
                        color={colors.white || '#fff'}
                    />
                )}

                <Appbar.Content title={title} color={colors.white || '#fff'} />

                <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ marginRight: 12 }}>
                    {user?.avatarUrl ? (
                        <Avatar.Image size={40} source={{ uri: user.avatarUrl }} />
                    ) : (
                        <Avatar.Text
                            size={40}
                            label={user?.name ? user.name.substring(0, 2).toUpperCase() : "SM"}
                            style={{ backgroundColor: colors.accent }}
                            labelStyle={{ color: colors.white }}
                        />
                    )}
                </TouchableOpacity>
            </Appbar.Header>

            <Modal
                visible={menuVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setMenuVisible(false)}
            >
                <TouchableOpacity
                    style={styles.overlay}
                    onPress={() => setMenuVisible(false)}
                    activeOpacity={1}
                >
                    <View style={[styles.menuContainer, { backgroundColor: colors.card }]}>
                        <View style={[styles.userSection, { borderBottomColor: colors.textSecondary }]}>
                            {user?.avatarUrl ? (
                                <Avatar.Image size={50} source={{ uri: user.avatarUrl }} />
                            ) : (
                                <Avatar.Text
                                    size={50}
                                    label={user?.name ? user.name.substring(0, 2).toUpperCase() : "SM"}
                                    style={{ backgroundColor: colors.accent }}
                                    labelStyle={{ color: colors.white }}
                                />
                            )}
                            <View style={{ marginLeft: 12 }}>
                                <Text style={[styles.userName, { color: colors.text }]}>
                                    {user?.name || 'Usuario'}
                                </Text>
                                <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
                                    {user?.email || 'email@example.com'}
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.menuItem, { borderBottomColor: colors.textSecondary }]}
                            onPress={() => handleNavigate('/profile')}
                        >
                            <Text style={[styles.menuItemText, { color: colors.text }]}>
                                👤 Mi Perfil
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.menuItem, { borderBottomColor: colors.textSecondary }]}
                            onPress={() => handleNavigate('/preferences')}
                        >
                            <Text style={[styles.menuItemText, { color: colors.text }]}>
                                ⚙️ Preferencias
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={handleLogout}
                        >
                            <Text style={[styles.menuItemText, { color: colors.error }]}>
                                🚪 Cerrar Sesión
                            </Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        paddingTop: 60,
        paddingRight: 16,
    },
    menuContainer: {
        width: 280,
        borderRadius: 12,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        overflow: 'hidden',
    },
    userSection: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
    },
    userName: {
        fontWeight: '600',
        fontSize: 14,
    },
    userEmail: {
        fontSize: 12,
        marginTop: 4,
    },
    menuItem: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
    },
    menuItemText: {
        fontSize: 14,
        fontWeight: '500',
    },
});