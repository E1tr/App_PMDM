import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Searchbar, FAB, Card } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useClientes } from '../../contexts/ClientContext';
import { Cliente } from '../../types/types';
import CustomAppBar from '../../components/CustomAppBar';
import { useTheme } from '../../contexts/ThemeContext'; // <--- Importamos tema

export default function ClientesScreen() {
    const router = useRouter();
    const { searchClientes } = useClientes();
    const [searchQuery, setSearchQuery] = useState('');

    // Hooks de tema
    const { theme } = useTheme();
    const colors = theme.colors;
    const styles = makeStyles(colors); // Estilos dinámicos

    const clientes = searchClientes(searchQuery);

    const renderClientItem = ({ item }: { item: Cliente }) => (
        <Card
            style={styles.clientCard}
            onPress={() => router.push(`/cliente/${item.id}`)}
        >
            <Card.Content>
                <View style={styles.cardHeader}>
                    <Text variant="titleMedium" style={styles.clientName}>
                        {item.nombre}
                    </Text>
                    {/* Un pequeño indicador de estado si lo tuviéramos */}
                </View>

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
        <>
            <CustomAppBar title="Cartera de Clientes" />

            <View style={styles.container}>
                <Searchbar
                    placeholder="Buscar cliente..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                    inputStyle={{ color: colors.text }}
                    iconColor={colors.textSecondary}
                    placeholderTextColor={colors.textSecondary}
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
                    label="Nuevo"
                    color={colors.white}
                />
            </View>
        </>
    );
}

// Función generadora de estilos
const makeStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background, // <--- Dinámico
    },
    searchBar: {
        margin: 16,
        elevation: 2,
        backgroundColor: colors.card, // <--- Dinámico
        borderRadius: 10,
    },
    listContent: {
        padding: 16,
        paddingTop: 0,
        paddingBottom: 100,
    },
    clientCard: {
        marginBottom: 12,
        backgroundColor: colors.card, // <--- Dinámico
        elevation: 1,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    clientName: {
        color: colors.text, // <--- Dinámico
        fontWeight: 'bold',
    },
    clientInfo: {
        color: colors.textSecondary, // <--- Dinámico
        marginVertical: 2,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        color: colors.textSecondary,
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 24,
        backgroundColor: colors.primary, // <--- Dinámico
        borderRadius: 16,
    },
});