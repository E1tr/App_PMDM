import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Modal } from 'react-native';
import { Text, TextInput, Button, Chip, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pedidoSchema, PedidoFormData } from '../../schema/pedido.schema';
import { usePedidos } from '../../contexts/PedidoContext';
import { useClientes } from '../../contexts/ClientContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import CustomAppBar from '../../components/CustomAppBar';
import QRScanner from '../../components/QRScanner';
import { EstadoPedido } from '../../types/types';

export default function CreatePedidoScreen() {
    const router = useRouter();
    const { createPedido } = usePedidos();
    const { getClientes } = useClientes();
    const { user } = useAuth();
    const { theme } = useTheme();
    const colors = theme.colors;
    const styles = makeStyles(colors);

    const [selectedClienteId, setSelectedClienteId] = useState<number | null>(null);
    const [selectedEstado, setSelectedEstado] = useState<EstadoPedido>('PREPARADO');
    const [showQRScanner, setShowQRScanner] = useState(false);

    const clientes = getClientes();

    const { control, handleSubmit, formState: { errors }, setValue } = useForm<PedidoFormData>({
        resolver: zodResolver(pedidoSchema),
        defaultValues: {
            codigo: '',
            clienteId: 0,
            fechaInicio: new Date().toISOString().split('T')[0],
            fechaFin: new Date().toISOString().split('T')[0],
            estado: 'PREPARADO',
            notas: '',
        }
    });

    const onSubmit = async (data: PedidoFormData) => {
        if (!user) return;

        await createPedido({
            ...data,
            creadoPor: user.id,
        });
        router.back();
    };

    const estados: EstadoPedido[] = ['PREPARADO', 'ENTREGADO', 'DEVUELTO', 'PENDIENTE_REVISION', 'FINALIZADO'];

    const handleQRScanned = (data: string) => {
        setValue('codigo', data);
        setShowQRScanner(false);
    };

    return (
        <>
            <CustomAppBar title="Nuevo Pedido" />
            <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.form}>
                    <View style={styles.inputWithButton}>
                        <Controller
                            control={control}
                            name="codigo"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    label="Código *"
                                    value={value}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    error={!!errors.codigo}
                                    style={styles.inputFlex}
                                    mode="outlined"
                                    outlineColor={colors.border}
                                    activeOutlineColor={colors.primary}
                                    textColor={colors.text}
                                />
                            )}
                        />
                        <IconButton
                            icon="qrcode-scan"
                            size={24}
                            onPress={() => setShowQRScanner(true)}
                            style={styles.qrButton}
                            iconColor={colors.primary}
                        />
                    </View>
                    {errors.codigo && (
                        <Text style={styles.errorText}>{errors.codigo.message}</Text>
                    )}

                    <Text variant="labelLarge" style={{ color: colors.text, marginTop: 16, marginBottom: 8 }}>
                        Cliente *
                    </Text>
                    <View style={styles.chipContainer}>
                        {clientes.map(cliente => (
                            <Chip
                                key={cliente.id}
                                selected={selectedClienteId === cliente.id}
                                onPress={() => {
                                    setSelectedClienteId(cliente.id);
                                    setValue('clienteId', cliente.id);
                                }}
                                style={styles.chip}
                            >
                                {cliente.nombre}
                            </Chip>
                        ))}
                    </View>
                    {errors.clienteId && (
                        <Text style={styles.errorText}>{errors.clienteId.message}</Text>
                    )}

                    <Controller
                        control={control}
                        name="fechaInicio"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                label="Fecha Inicio *"
                                value={value}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                error={!!errors.fechaInicio}
                                style={styles.input}
                                mode="outlined"
                                placeholder="YYYY-MM-DD"
                                outlineColor={colors.border}
                                activeOutlineColor={colors.primary}
                                textColor={colors.text}
                            />
                        )}
                    />
                    {errors.fechaInicio && (
                        <Text style={styles.errorText}>{errors.fechaInicio.message}</Text>
                    )}

                    <Controller
                        control={control}
                        name="fechaFin"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                label="Fecha Fin *"
                                value={value}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                error={!!errors.fechaFin}
                                style={styles.input}
                                mode="outlined"
                                placeholder="YYYY-MM-DD"
                                outlineColor={colors.border}
                                activeOutlineColor={colors.primary}
                                textColor={colors.text}
                            />
                        )}
                    />
                    {errors.fechaFin && (
                        <Text style={styles.errorText}>{errors.fechaFin.message}</Text>
                    )}

                    <Text variant="labelLarge" style={{ color: colors.text, marginTop: 16, marginBottom: 8 }}>
                        Estado *
                    </Text>
                    <View style={styles.chipContainer}>
                        {estados.map(estado => (
                            <Chip
                                key={estado}
                                selected={selectedEstado === estado}
                                onPress={() => {
                                    setSelectedEstado(estado);
                                    setValue('estado', estado);
                                }}
                                style={styles.chip}
                            >
                                {estado}
                            </Chip>
                        ))}
                    </View>

                    <Controller
                        control={control}
                        name="notas"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                label="Notas"
                                value={value}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                style={styles.input}
                                mode="outlined"
                                multiline
                                numberOfLines={4}
                                outlineColor={colors.border}
                                activeOutlineColor={colors.primary}
                                textColor={colors.text}
                            />
                        )}
                    />

                    <Button
                        mode="contained"
                        onPress={handleSubmit(onSubmit)}
                        style={styles.button}
                    >
                        Crear Pedido
                    </Button>
                </View>
            </ScrollView>

            <Modal
                visible={showQRScanner}
                animationType="slide"
                onRequestClose={() => setShowQRScanner(false)}
            >
                <QRScanner
                    onScanned={handleQRScanned}
                    onClose={() => setShowQRScanner(false)}
                />
            </Modal>
        </>
    );
}

const makeStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
    },
    form: {
        padding: 16,
        backgroundColor: colors.background,
    },
    inputWithButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    inputFlex: {
        flex: 1,
        backgroundColor: colors.surface,
    },
    qrButton: {
        margin: 0,
    },
    input: {
        marginBottom: 8,
        backgroundColor: colors.surface,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 8,
    },
    chip: {
        marginRight: 8,
        marginBottom: 8,
    },
    errorText: {
        color: '#f44336',
        fontSize: 12,
        marginBottom: 8,
    },
    button: {
        marginTop: 24,
    },
});
