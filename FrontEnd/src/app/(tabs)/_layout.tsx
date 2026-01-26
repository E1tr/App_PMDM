import { Tabs } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabsLayout() {
    const { theme } = useTheme();
    const colors = theme.colors;

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: colors.card,
                    borderTopColor: colors.border,
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
            }}
        >
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: 'Inicio',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="view-dashboard" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="clientes"
                options={{
                    title: 'Clientes',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account-group" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}