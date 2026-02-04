import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientSchema, ClientFormData } from '../../../schema/client.schema';
import { useClientes } from '../../../contexts/ClientContext';
import CustomAppBar from '../../../components/CustomAppBar';
import { useTheme } from '../../../contexts/ThemeContext';

export default function EditClientScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { getClienteById, updateCliente } = useClientes();
    const { theme } = useTheme();
    const colors = theme.colors;
    const styles = makeStyles(colors);

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
                <CustomAppBar title="Editar Cliente" />
                <View style={styles.notFoundContainer}>
                    <Text style={{ color: colors.text }}>Cliente no encontrado</Text>
                </View>
            </View>
        );
    }

    const onSubmit = async (data: ClientFormData) => {
        await updateCliente(cliente.id, data);
        router.back();
    };

    return (
        <>
            <CustomAppBar title="Editar Cliente" />
            <ScrollView style={styles.container}>
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
                                outlineColor={colors.border}
                                activeOutlineColor={colors.primary}
                                textColor={colors.text}
                                theme={{ colors: { background: colors.card, placeholder: colors.textSecondary, text: colors.text, primary: colors.primary } }}
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
                                outlineColor={colors.border}
                                activeOutlineColor={colors.primary}
                                textColor={colors.text}
                                theme={{ colors: { background: colors.card, placeholder: colors.textSecondary, text: colors.text, primary: colors.primary } }}
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
                                outlineColor={colors.border}
                                activeOutlineColor={colors.primary}
                                textColor={colors.text}
                                theme={{ colors: { background: colors.card, placeholder: colors.textSecondary, text: colors.text, primary: colors.primary } }}
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
                                outlineColor={colors.border}
                                activeOutlineColor={colors.primary}
                                textColor={colors.text}
                                theme={{ colors: { background: colors.card, placeholder: colors.textSecondary, text: colors.text, primary: colors.primary } }}
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
                                outlineColor={colors.border}
                                activeOutlineColor={colors.primary}
                                textColor={colors.text}
                                theme={{ colors: { background: colors.card, placeholder: colors.textSecondary, text: colors.text, primary: colors.primary } }}
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
                            buttonColor={colors.success}
                            textColor={colors.white}
                        >
                            Guardar Cambios
                        </Button>

                        <Button
                            mode="outlined"
                            onPress={() => router.back()}
                            style={styles.cancelButton}
                            textColor={colors.textSecondary}
                        >
                            Cancelar
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
        backgroundColor: colors.background,
    },
    notFoundContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    form: {
        padding: 16,
    },
    input: {
        marginBottom: 8,
        backgroundColor: colors.card,
    },
    errorText: {
        color: colors.error,
        fontSize: 12,
        marginBottom: 12,
        marginLeft: 12,
    },
    buttonContainer: {
        marginTop: 24,
        gap: 12,
    },
    saveButton: {
        // backgroundColor se maneja con buttonColor en Paper
    },
    cancelButton: {
        borderColor: colors.textSecondary,
    },
});