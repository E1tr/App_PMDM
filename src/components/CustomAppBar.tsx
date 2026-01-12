import React, { useState } from 'react';
import { Appbar, Menu } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants/theme';

interface CustomAppBarProps {
    title: string;
}

export default function CustomAppBar({ title }: CustomAppBarProps) {
    const router = useRouter();
    const [menuVisible, setMenuVisible] = useState(false);

    const handleLogout = () => {
        console.log('Logout');
        router.replace('/');
        /*         setMenuVisible(false);
                setTimeout(() => {
                    router.replace('/');
                }, 100); */
    };

    return (
        <Appbar.Header style={{ backgroundColor: COLORS.primary }}>
            <Appbar.Content title={title} color="#fff" />

            <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                    <Appbar.Action
                        icon="account-circle"
                        color="#fff"
                        size={32}
                        onPress={() => setMenuVisible(true)}
                    />
                }
            >
                <Menu.Item
                    onPress={handleLogout}
                    title="Cerrar Sesión"
                    leadingIcon="logout"
                />
            </Menu>
        </Appbar.Header>
    );
}