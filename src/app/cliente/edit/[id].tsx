import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientSchema, ClientFormData } from '../../../schema/client.schema';
import { useClientes } from '../../../contexts/ClientContext';

export default function EditClientScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { getClienteById, updateCliente } = useClientes();

    const cliente = getClienteById(Number(id));

    const { control, handleSubmit, formState: { errors }, reset } = useForm<ClientFormData>({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            nombre: '',
            email: '',
            telefono: '',
            nifCif: '',
            notas: '',
        }
    });

    // Precargar datos del cliente
    useEffect(() => {
        if (cliente) {
            reset({
                nombre: cliente.nombre || '',
                email: cliente.email || '',
                telefono: cliente.telefono || '',
                nifCif: cliente.nifCif || '',
                notas: cliente.notas || '',
            });
        }
    }, [cliente, reset]);

    if (!cliente) {
        return (
            <View style={styles.container}>
                <Text>Cliente no encontrado</Text>
            </View>
        );
    }

    const onSubmit = (data: ClientFormData) => {
        updateCliente(cliente.id, data);
        router.back();
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text variant="headlineMedium" style={styles.headerTitle}>
                    Editar Cliente
                </Text>
            </View>

            <View style={styles.form}>
                {/* Nombre */}
                <Controller
                    control={control}
                    name="nombre"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            label="Nombre *"
                            value={value}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            error={!!errors.nombre}
                            style={styles.input}
                            mode="outlined"
                            textColor="#000"
                        />
                    )}
                />
                {errors.nombre && (
                    <Text style={styles.errorText}>{errors.nombre.message}</Text>
                )}

                {/* Email */}
                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            label="Email"
                            value={value}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            error={!!errors.email}
                            style={styles.input}
                            mode="outlined"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            textColor="#000"
                        />
                    )}
                />
                {errors.email && (
                    <Text style={styles.errorText}>{errors.email.message}</Text>
                )}

                {/* Teléfono */}
                <Controller
                    control={control}
                    name="telefono"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            label="Teléfono"
                            value={value}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            error={!!errors.telefono}
                            style={styles.input}
                            mode="outlined"
                            keyboardType="phone-pad"
                            textColor="#000"
                        />
                    )}
                />
                {errors.telefono && (
                    <Text style={styles.errorText}>{errors.telefono.message}</Text>
                )}

                {/* NIF/CIF */}
                <Controller
                    control={control}
                    name="nifCif"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            label="NIF/CIF"
                            value={value}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            error={!!errors.nifCif}
                            style={styles.input}
                            mode="outlined"
                            textColor="#000"
                        />
                    )}
                />
                {errors.nifCif && (
                    <Text style={styles.errorText}>{errors.nifCif.message}</Text>
                )}

                {/* Notas */}
                <Controller
                    control={control}
                    name="notas"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            label="Notas"
                            value={value}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            error={!!errors.notas}
                            style={styles.input}
                            mode="outlined"
                            multiline
                            numberOfLines={4}
                            textColor="#000"
                        />
                    )}
                />
                {errors.notas && (
                    <Text style={styles.errorText}>{errors.notas.message}</Text>
                )}

                {/* Botones */}
                <View style={styles.buttonContainer}>
                    <Button
                        mode="contained"
                        onPress={handleSubmit(onSubmit)}
                        style={styles.saveButton}
                        icon="content-save"
                    >
                        Guardar Cambios
                    </Button>

                    <Button
                        mode="outlined"
                        onPress={() => router.back()}
                        style={styles.cancelButton}
                    >
                        Cancelar
                    </Button>
                </View>
            </View>
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
    form: {
        padding: 16,
    },
    input: {
        marginBottom: 8,
        backgroundColor: '#fff',
    },
    errorText: {
        color: '#f44336',
        fontSize: 12,
        marginBottom: 12,
        marginLeft: 12,
    },
    buttonContainer: {
        marginTop: 24,
        gap: 12,
    },
    saveButton: {
        backgroundColor: '#5c5cff',
    },
    cancelButton: {
        borderColor: '#999',
    },
});