import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { ClientProvider } from '../contexts/ClientContext';

export default function Layout() {
    return (
        <PaperProvider>
            <ClientProvider>
                <Stack screenOptions={{ headerShown: false }} />
            </ClientProvider>
        </PaperProvider>
    );
}