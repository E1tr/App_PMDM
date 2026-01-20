import React, { useState } from 'react';
import { Appbar, Menu } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';

interface CustomAppBarProps {
    title: string;
}

export default function CustomAppBar({ title }: CustomAppBarProps) {
    const router = useRouter();
    const [menuVisible, setMenuVisible] = useState(false);
    const { theme, toggleTheme, isDark } = useTheme();
    const colors = theme.colors;

    const handleLogout = () => {
        setMenuVisible(false);
        setTimeout(() => {
            router.replace('/');
        }, 100);
    };



    return (
        <Appbar.Header style={{ backgroundColor: colors.primary }}>
            <Appbar.Content title={title} color={colors.white || '#fff'} />

            <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                    <Appbar.Action
                        icon="account-circle"
                        color={colors.white || '#fff'}
                        size={32}
                        onPress={() => setMenuVisible(true)}
                    />
                }
            >
                <Menu.Item
                    onPress={() => router.push('/preferences')}
                    title="Preferencias"
                    leadingIcon="cog"
                />
                <Menu.Item
                    onPress={handleLogout}
                    title="Cerrar Sesión"
                    leadingIcon="logout"
                />
            </Menu>
        </Appbar.Header>
    );
}