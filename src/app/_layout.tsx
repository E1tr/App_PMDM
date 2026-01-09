import { Stack } from 'expo-router';
import { ClientProvider } from '../contexts/ClientContext';

export default function Layout() {
    return (
        <ClientProvider>
            <Stack />
        </ClientProvider>
    );
}