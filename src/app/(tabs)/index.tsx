import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
    const router = useRouter();

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text variant="headlineMedium" style={styles.welcomeText}>
                    Bienvenido
                </Text>
                <Text variant="bodyLarge" style={styles.subtitle}>
                    Panel de Gestión
                </Text>

                {/* Card para navegar a Clientes */}
                <Card
                    style={styles.card}
                    onPress={() => router.push('/(tabs)/clientes')}
                >
                    <Card.Content>
                        <View style={styles.cardContent}>
                            <Text variant="titleLarge" style={styles.cardTitle}>
                                👥 Clientes
                            </Text>
                            <Text variant="bodyMedium" style={styles.cardSubtitle}>
                                Gestiona tus clientes
                            </Text>
                        </View>
                    </Card.Content>
                </Card>

                { }
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    welcomeText: {
        color: '#1a1b4b',
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        color: '#7e7e7e',
        marginBottom: 30,
    },
    card: {
        marginBottom: 16,
        backgroundColor: '#fff',
        elevation: 2,
    },
    cardContent: {
        paddingVertical: 10,
    },
    cardTitle: {
        color: '#5c5cff',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cardSubtitle: {
        color: '#666',
    }
});