import { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useClientes } from '../contexts/ClientContext';
import { Pedido } from '../types/types';

export const useClientDetail = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { getClienteById, fetchClientePedidos, deleteCliente } = useClientes();
    const [dialogVisible, setDialogVisible] = useState(false);
    const [pedidos, setPedidos] = useState<Pedido[]>([]);

    const clienteId = Number(id);
    const cliente = getClienteById(clienteId);

    useEffect(() => {
        let isMounted = true;

        const loadPedidos = async () => {
            const data = await fetchClientePedidos(clienteId);
            if (isMounted) {
                setPedidos(data);
            }
        };

        if (!Number.isNaN(clienteId)) {
            loadPedidos();
        }

        return () => {
            isMounted = false;
        };
    }, [clienteId, fetchClientePedidos]);

    const handleDelete = async () => {
        if (cliente) {
            await deleteCliente(cliente.id);
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
