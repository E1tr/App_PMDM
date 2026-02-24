import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Text, FAB, Searchbar, Card, Chip } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { usePedidos } from '../../contexts/PedidoContext';
import { useClientes } from '../../contexts/ClientContext';
import { useTheme } from '../../contexts/ThemeContext';
import CustomAppBar from '../../components/CustomAppBar';
import { Pedido } from '../../types/types';

export default function PedidosScreen() {
    const router = useRouter();
    const { pedidos, isLoading, refreshPedidos, searchPedidos } = usePedidos();
    const { getClienteById } = useClientes();
    const { theme } = useTheme();
    const colors = theme.colors;
    const styles = makeStyles(colors);

    const [searchQuery, setSearchQuery] = useState('');

    const filteredPedidos = searchQuery ? searchPedidos(searchQuery) : pedidos;

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case 'PREPARADO': return '#2196F3';
            case 'ENTREGADO': return '#4CAF50';
            case 'DEVUELTO': return '#FF9800';
            case 'PENDIENTE_REVISION': return '#FFC107';
            case 'FINALIZADO': return '#9E9E9E';
            default: return colors.primary;
        }
    };

    const renderPedido = ({ item }: { item: Pedido }) => {
        const cliente = getClienteById(item.clienteId);

        return (
            <TouchableOpacity onPress={() => router.push(`/pedido/${item.id}`)}>
                <Card style={styles.card}>
                    <Card.Content>
                        <View style={styles.cardHeader}>
                            <Text variant="titleMedium" style={{ color: colors.text }}>
                                {item.codigo}
                            </Text>
                            <Chip
                                mode="flat"
                                style={{ backgroundColor: getEstadoColor(item.estado) }}
                                textStyle={{ color: '#fff' }}
                            >
                                {item.estado}
                            </Chip>
                        </View>

                        <Text variant="bodyMedium" style={{ color: colors.textSecondary, marginTop: 8 }}>
                            Cliente: {cliente?.nombre || 'Desconocido'}
                        </Text>

                        <View style={styles.dateContainer}>
                            <Text variant="bodySmall" style={{ color: colors.textSecondary }}>
                                {item.fechaInicio} → {item.fechaFin}
                            </Text>
                        </View>
                    </Card.Content>
                </Card>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <CustomAppBar title="Pedidos" />

            <View style={styles.content}>
                <Searchbar
                    placeholder="Buscar pedido..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={[styles.searchbar, { backgroundColor: colors.card }]}
                    iconColor={colors.primary}
                    placeholderTextColor={colors.textSecondary}
                    inputStyle={{ color: colors.text }}
                />

                <FlatList
                    data={filteredPedidos}
                    renderItem={renderPedido}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.list}
                    refreshControl={
                        <RefreshControl refreshing={isLoading} onRefresh={refreshPedidos} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={{ color: colors.textSecondary }}>No hay pedidos</Text>
                        </View>
                    }
                />
            </View>

            <FAB
                icon="plus"
                style={[styles.fab, { backgroundColor: colors.primary }]}
                onPress={() => router.push('/pedido/create')}
            />
        </View>
    );
}

const makeStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    searchbar: {
        marginBottom: 16,
        elevation: 2,
    },
    list: {
        paddingBottom: 80,
    },
    card: {
        marginBottom: 12,
        elevation: 2,
        backgroundColor: colors.card,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateContainer: {
        marginTop: 8,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
    },
});
