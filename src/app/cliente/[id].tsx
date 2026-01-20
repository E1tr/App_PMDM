import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, Portal, Dialog } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useClientDetail } from '../../hooks/useClientDetail';
import CustomAppBar from '../../components/CustomAppBar'; // Usar CustomAppBar para coherencia
import { useTheme } from '../../contexts/ThemeContext'; // Importar ThemeContext

export default function ClienteDetailScreen() {
    const router = useRouter();
    const {
        cliente,
        pedidos,
        dialogVisible,
        setDialogVisible,
        handleDelete,
        getEstadoColor
    } = useClientDetail();

    const { theme } = useTheme();
    const colors = theme.colors;
    const styles = makeStyles(colors);

    if (!cliente) {
        return (
            <View style={styles.container}>
                <CustomAppBar title="Detalle" />
                <View style={styles.notFoundContainer}>
                    <Text style={{ color: colors.text }}>Cliente no encontrado</Text>
                </View>
            </View>
        );
    }

    return (
        <>
            <CustomAppBar title="Detalle del Cliente" />

            <ScrollView style={styles.container}>
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
                        textColor={colors.white}
                    >
                        Editar
                    </Button>

                    <Button
                        mode="outlined"
                        onPress={() => setDialogVisible(true)}
                        style={styles.deleteButton}
                        textColor={colors.error}
                        icon="delete"
                    >
                        Eliminar
                    </Button>
                </View>

                {/* Dialog de Confirmación */}
                <Portal>
                    <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)} style={{ backgroundColor: colors.surface }}>
                        <Dialog.Title style={{ color: colors.text }}>Confirmar eliminación</Dialog.Title>
                        <Dialog.Content>
                            <Text style={{ color: colors.text }}>¿Estás seguro de que quieres eliminar a {cliente.nombre}?</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => setDialogVisible(false)} textColor={colors.text}>Cancelar</Button>
                            <Button onPress={handleDelete} textColor={colors.error}>Eliminar</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </ScrollView>
        </>
    );
}

const makeStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background, // <--- Dinámico
    },
    notFoundContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        margin: 16,
        backgroundColor: colors.card, // <--- Dinámico
        elevation: 1,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },
    clientName: {
        color: colors.primary, // <--- Dinámico
        fontWeight: 'bold',
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    infoLabel: {
        fontWeight: 'bold',
        color: colors.textSecondary, // <--- Dinámico
        width: 100,
    },
    infoValue: {
        flex: 1,
        color: colors.text, // <--- Dinámico
    },
    sectionTitle: {
        color: colors.text, // <--- Dinámico
        fontWeight: 'bold',
        marginBottom: 16,
    },
    noPedidos: {
        color: colors.textSecondary, // <--- Dinámico
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 10,
    },
    pedidoItem: {
        backgroundColor: colors.background, // <--- Dinámico (usar fondo para item en tarjeta)
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 0.5,
        borderColor: colors.border,
    },
    pedidoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    pedidoCodigo: {
        fontWeight: 'bold',
        color: colors.text, // <--- Dinámico
    },
    estadoBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    estadoText: {
        color: '#fff', // Texto siempre blanco para badges de estado
        fontSize: 10,
        fontWeight: 'bold',
    },
    pedidoFecha: {
        color: colors.textSecondary, // <--- Dinámico
        fontSize: 12,
    },
    actionButtons: {
        padding: 16,
        gap: 12,
        paddingBottom: 40,
    },
    editButton: {
        backgroundColor: colors.primary, // <--- Dinámico
        marginBottom: 8,
    },
    deleteButton: {
        borderColor: colors.error, // <--- Dinámico
    },
});