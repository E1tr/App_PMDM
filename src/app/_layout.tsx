import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { ClientProvider } from '../contexts/ClientContext';
import { ThemeProvider } from '../contexts/ThemeContext';

export default function Layout() {
    return (
        <PaperProvider>
            <ThemeProvider>
                <ClientProvider>
                    <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="index" />
                    </Stack>
                </ClientProvider>
            </ThemeProvider>
        </PaperProvider>
    );
}