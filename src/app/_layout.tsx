import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { ClientProvider } from '../contexts/ClientContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';

export default function Layout() {
    return (
        <AuthProvider>
            <PaperProvider>
                <ThemeProvider>
                    <ClientProvider>
                        <Stack screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="index" />
                        </Stack>
                    </ClientProvider>
                </ThemeProvider>
            </PaperProvider>
        </AuthProvider>
    );
}