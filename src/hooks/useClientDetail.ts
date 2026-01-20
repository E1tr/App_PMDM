import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useClientes } from '../contexts/ClientContext';

export const useClientDetail = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { getClienteById, getClientePedidos, deleteCliente } = useClientes();
    const [dialogVisible, setDialogVisible] = useState(false);

    const clienteId = Number(id);
    const cliente = getClienteById(clienteId);
    const pedidos = getClientePedidos(clienteId);

    const handleDelete = () => {
        if (cliente) {
            deleteCliente(cliente.id);
            setDialogVisible(false);
            router.back();
        }
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

    return {
        cliente,
        pedidos,
        dialogVisible,
        setDialogVisible,
        handleDelete,
        getEstadoColor
    };
};
