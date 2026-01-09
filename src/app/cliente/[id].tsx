import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, Portal, Dialog } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useClientes } from '../../contexts/ClientContext';

export default function ClienteDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { getClienteById, getClientePedidos, deleteCliente } = useClientes();
    const [dialogVisible, setDialogVisible] = useState(false);

    const cliente = getClienteById(Number(id));
    const pedidos = getClientePedidos(Number(id));

    if (!cliente) {
        return (
            <View style={styles.container}>
                <Text>Cliente no encontrado</Text>
            </View>
        );
    }

    const handleDelete = () => {
        deleteCliente(cliente.id);
        setDialogVisible(false);
        router.back();
    };

    const getEstadoColor = (estado: string) => {
        const colors: { [key: string]: string } = {
            'PREPARADO': '#FFA726',
            'ENTREGADO': '#66BB6A',
            'DEVUELTO': '#42A5F5',
            'PENDIENTE_REVISION': '#FFA726',
            'FINALIZADO': '#78909C',
        };
        return colors[estado] || '#999';
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text variant="headlineMedium" style={styles.headerTitle}>
                    Detalle del Cliente
                </Text>
            </View>

            {/* Información del Cliente */}
            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="titleLarge" style={styles.clientName}>
                        {cliente.nombre}
                    </Text>

                    {cliente.nifCif && (
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>NIF/CIF:</Text>
                            <Text style={styles.infoValue}>{cliente.nifCif}</Text>
                        </View>
                    )}

                    {cliente.telefono && (
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Teléfono:</Text>
                            <Text style={styles.infoValue}>{cliente.telefono}</Text>
                        </View>
                    )}

                    {cliente.email && (
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Email:</Text>
                            <Text style={styles.infoValue}>{cliente.email}</Text>
                        </View>
                    )}

                    {cliente.notas && (
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Notas:</Text>
                            <Text style={styles.infoValue}>{cliente.notas}</Text>
                        </View>
                    )}
                </Card.Content>
            </Card>

            {/* Últimos Pedidos */}
            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                        Últimos Pedidos
                    </Text>

                    {pedidos.length === 0 ? (
                        <Text style={styles.noPedidos}>No hay pedidos registrados</Text>
                    ) : (
                        pedidos.map((pedido) => (
                            <View key={pedido.id} style={styles.pedidoItem}>
                                <View style={styles.pedidoHeader}>
                                    <Text style={styles.pedidoCodigo}>{pedido.codigo}</Text>
                                    <View
                                        style={[
                                            styles.estadoBadge,
                                            { backgroundColor: getEstadoColor(pedido.estado) }
                                        ]}
                                    >
                                        <Text style={styles.estadoText}>{pedido.estado}</Text>
                                    </View>
                                </View>
                                <Text style={styles.pedidoFecha}>
                                    {new Date(pedido.fechaInicio).toLocaleDateString()} - {new Date(pedido.fechaFin).toLocaleDateString()}
                                </Text>
                            </View>
                        ))
                    )}
                </Card.Content>
            </Card>

            {/* Botones de Acción */}
            <View style={styles.actionButtons}>
                <Button
                    mode="contained"
                    onPress={() => router.push(`/cliente/edit/${cliente.id}`)}
                    style={styles.editButton}
                    icon="pencil"
                >
                    Editar
                </Button>

                <Button
                    mode="outlined"
                    onPress={() => setDialogVisible(true)}
                    style={styles.deleteButton}
                    textColor="#f44336"
                    icon="delete"
                >
                    Eliminar
                </Button>
            </View>

            {/* Dialog de Confirmación */}
            <Portal>
                <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
                    <Dialog.Title>Confirmar eliminación</Dialog.Title>
                    <Dialog.Content>
                        <Text>¿Estás seguro de que quieres eliminar a {cliente.nombre}?</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setDialogVisible(false)}>Cancelar</Button>
                        <Button onPress={handleDelete} textColor="#f44336">Eliminar</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </ScrollView>
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
    card: {
        margin: 16,
        backgroundColor: '#fff',
        elevation: 2,
    },
    clientName: {
        color: '#1a1b4b',
        fontWeight: 'bold',
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    infoLabel: {
        fontWeight: 'bold',
        color: '#666',
        width: 100,
    },
    infoValue: {
        flex: 1,
        color: '#333',
    },
    sectionTitle: {
        color: '#1a1b4b',
        fontWeight: 'bold',
        marginBottom: 16,
    },
    noPedidos: {
        color: '#999',
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 10,
    },
    pedidoItem: {
        backgroundColor: '#f9f9f9',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
    },
    pedidoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    pedidoCodigo: {
        fontWeight: 'bold',
        color: '#1a1b4b',
    },
    estadoBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    estadoText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    pedidoFecha: {
        color: '#666',
        fontSize: 12,
    },
    actionButtons: {
        padding: 16,
        gap: 12,
    },
    editButton: {
        backgroundColor: '#5c5cff',
        marginBottom: 8,
    },
    deleteButton: {
        borderColor: '#f44336',
    },
});