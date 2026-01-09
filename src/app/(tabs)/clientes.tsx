import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Searchbar, FAB, Card } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useClientes } from '../../contexts/ClientContext';
import { Cliente } from '../../types/types';

export default function ClientesScreen() {
    const router = useRouter();
    const { searchClientes } = useClientes();
    const [searchQuery, setSearchQuery] = useState('');

    const clientes = searchClientes(searchQuery);

    const renderClientItem = ({ item }: { item: Cliente }) => (
        <Card
            style={styles.clientCard}
            onPress={() => router.push(`/cliente/${item.id}`)}
        >
            <Card.Content>
                <Text variant="titleMedium" style={styles.clientName}>
                    {item.nombre}
                </Text>
                {item.telefono && (
                    <Text variant="bodyMedium" style={styles.clientInfo}>
                        📞 {item.telefono}
                    </Text>
                )}
                {item.email && (
                    <Text variant="bodyMedium" style={styles.clientInfo}>
                        ✉️ {item.email}
                    </Text>
                )}
            </Card.Content>
        </Card>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text variant="headlineMedium" style={styles.headerTitle}>
                    Clientes
                </Text>
            </View>

            <Searchbar
                placeholder="Buscar cliente..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchBar}
            />

            <FlatList
                data={clientes}
                renderItem={renderClientItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text variant="bodyLarge" style={styles.emptyText}>
                            No se encontraron clientes
                        </Text>
                    </View>
                }
            />

            <FAB
                icon="plus"
                style={styles.fab}
                onPress={() => router.push('/cliente/create')}
                label="Nuevo Cliente"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#5c5cff',
        padding: 20,
        paddingTop: 50,
    },
    headerTitle: {
        color: '#fff',
        fontWeight: 'bold',
    },
    searchBar: {
        margin: 16,
        elevation: 2,
    },
    listContent: {
        padding: 16,
        paddingBottom: 100,
    },
    clientCard: {
        marginBottom: 12,
        backgroundColor: '#fff',
        elevation: 2,
    },
    clientName: {
        color: '#1a1b4b',
        fontWeight: 'bold',
        marginBottom: 8,
    },
    clientInfo: {
        color: '#666',
        marginVertical: 2,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        color: '#999',
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: '#5c5cff',
    },
});