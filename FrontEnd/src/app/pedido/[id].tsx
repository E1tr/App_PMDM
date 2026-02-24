import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, Chip } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { usePedidos } from '../../contexts/PedidoContext';
import { useClientes } from '../../contexts/ClientContext';
import { useTheme } from '../../contexts/ThemeContext';
import CustomAppBar from '../../components/CustomAppBar';

export default function PedidoDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { getPedidoById, deletePedido } = usePedidos();
    const { getClienteById } = useClientes();
    const { theme } = useTheme();
    const colors = theme.colors;
    const styles = makeStyles(colors);

    const pedido = getPedidoById(Number(id));
    const cliente = pedido ? getClienteById(pedido.clienteId) : null;

    if (!pedido) {
        return (
            <>
                <CustomAppBar title="Detalle del Pedido" />
                <View style={[styles.container, { backgroundColor: colors.background }]}>
                    <Text style={{ color: colors.text }}>Pedido no encontrado</Text>
                </View>
            </>
        );
    }

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

    const handleDelete = async () => {
        await deletePedido(pedido.id);
        router.back();
    };

    return (
        <>
            <CustomAppBar title="Detalle del Pedido" />
            <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.content}>
                    <Card style={styles.card}>
                        <Card.Content>
                            <View style={styles.header}>
                                <Text variant="headlineMedium" style={{ color: colors.text }}>
                                    {pedido.codigo}
                                </Text>
                                <Chip
                                    mode="flat"
                                    style={{ backgroundColor: getEstadoColor(pedido.estado) }}
                                    textStyle={{ color: '#fff' }}
                                >
                                    {pedido.estado}
                                </Chip>
                            </View>

                            <View style={styles.section}>
                                <Text variant="titleMedium" style={[styles.label, { color: colors.primary }]}>
                                    Cliente
                                </Text>
                                <Text variant="bodyLarge" style={{ color: colors.text }}>
                                    {cliente?.nombre || 'Desconocido'}
                                </Text>
                            </View>

                            <View style={styles.section}>
                                <Text variant="titleMedium" style={[styles.label, { color: colors.primary }]}>
                                    Fechas
                                </Text>
                                <Text variant="bodyMedium" style={{ color: colors.text }}>
                                    Inicio: {pedido.fechaInicio}
                                </Text>
                                <Text variant="bodyMedium" style={{ color: colors.text }}>
                                    Fin: {pedido.fechaFin}
                                </Text>
                            </View>

                            {pedido.notas && (
                                <View style={styles.section}>
                                    <Text variant="titleMedium" style={[styles.label, { color: colors.primary }]}>
                                        Notas
                                    </Text>
                                    <Text variant="bodyMedium" style={{ color: colors.text }}>
                                        {pedido.notas}
                                    </Text>
                                </View>
                            )}
                        </Card.Content>
                    </Card>

                    <View style={styles.actions}>
                        <Button
                            mode="contained"
                            onPress={() => router.push(`/pedido/edit/${pedido.id}`)}
                            style={styles.button}
                        >
                            Editar
                        </Button>
                        <Button
                            mode="outlined"
                            onPress={handleDelete}
                            style={styles.button}
                            textColor="#f44336"
                        >
                            Eliminar
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </>
    );
}

const makeStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 16,
        backgroundColor: colors.background,
    },
    card: {
        marginBottom: 16,
        backgroundColor: colors.card,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    section: {
        marginBottom: 16,
    },
    label: {
        marginBottom: 8,
    },
    actions: {
        gap: 12,
    },
    button: {
        marginBottom: 8,
    },
});
