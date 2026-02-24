import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { Pedido } from '../types/types';
import { supabase } from '../lib/supabase';

interface PedidoContextType {
    pedidos: Pedido[];
    isLoading: boolean;
    refreshPedidos: () => Promise<void>;
    getPedidos: () => Pedido[];
    getPedidoById: (id: number) => Pedido | undefined;
    createPedido: (pedido: Omit<Pedido, 'id'>) => Promise<Pedido>;
    updatePedido: (id: number, data: Partial<Omit<Pedido, 'id'>>) => Promise<void>;
    deletePedido: (id: number) => Promise<void>;
    searchPedidos: (query: string) => Pedido[];
}

const PedidoContext = createContext<PedidoContextType | undefined>(undefined);

export const usePedidos = () => {
    const context = useContext(PedidoContext);
    if (!context) {
        throw new Error('usePedidos must be used within a PedidoProvider');
    }
    return context;
};

interface PedidoProviderProps {
    children: ReactNode;
}

export const PedidoProvider: React.FC<PedidoProviderProps> = ({ children }) => {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const mapPedido = (row: any): Pedido => ({
        id: row.id,
        codigo: row.codigo,
        clienteId: row.cliente_id,
        direccionEntregaId: row.direccion_entrega_id ?? undefined,
        direccionRecogidaId: row.direccion_recogida_id ?? undefined,
        fechaInicio: row.fecha_inicio,
        fechaFin: row.fecha_fin,
        estado: row.estado,
        creadoPor: row.creado_por,
        notas: row.notas ?? undefined,
    });

    const refreshPedidos = useCallback(async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('pedidos')
            .select('*')
            .order('fecha_inicio', { ascending: false });

        if (error) {
            console.error('Error al cargar pedidos:', error);
            setIsLoading(false);
            return;
        }

        setPedidos((data ?? []).map(mapPedido));
        setIsLoading(false);
    }, []);

    useEffect(() => {
        refreshPedidos();
    }, [refreshPedidos]);

    const getPedidos = (): Pedido[] => {
        return pedidos;
    };

    const getPedidoById = (id: number): Pedido | undefined => {
        return pedidos.find(pedido => pedido.id === id);
    };

    const createPedido = async (pedidoData: Omit<Pedido, 'id'>): Promise<Pedido> => {
        const payload = {
            codigo: pedidoData.codigo,
            cliente_id: pedidoData.clienteId,
            direccion_entrega_id: pedidoData.direccionEntregaId ?? null,
            direccion_recogida_id: pedidoData.direccionRecogidaId ?? null,
            fecha_inicio: pedidoData.fechaInicio,
            fecha_fin: pedidoData.fechaFin,
            estado: pedidoData.estado,
            creado_por: pedidoData.creadoPor,
            notas: pedidoData.notas ?? null,
        };

        const { data, error } = await supabase
            .from('pedidos')
            .insert(payload)
            .select('*')
            .single();

        if (error) {
            console.error('Error al crear pedido:', error);
            throw error;
        }

        const newPedido = mapPedido(data);
        setPedidos(prevPedidos => [newPedido, ...prevPedidos]);
        return newPedido;
    };

    const updatePedido = async (id: number, data: Partial<Omit<Pedido, 'id'>>): Promise<void> => {
        const payload = {
            ...(data.codigo !== undefined ? { codigo: data.codigo } : {}),
            ...(data.clienteId !== undefined ? { cliente_id: data.clienteId } : {}),
            ...(data.direccionEntregaId !== undefined ? { direccion_entrega_id: data.direccionEntregaId } : {}),
            ...(data.direccionRecogidaId !== undefined ? { direccion_recogida_id: data.direccionRecogidaId } : {}),
            ...(data.fechaInicio !== undefined ? { fecha_inicio: data.fechaInicio } : {}),
            ...(data.fechaFin !== undefined ? { fecha_fin: data.fechaFin } : {}),
            ...(data.estado !== undefined ? { estado: data.estado } : {}),
            ...(data.notas !== undefined ? { notas: data.notas } : {}),
        };

        const { data: updated, error } = await supabase
            .from('pedidos')
            .update(payload)
            .eq('id', id)
            .select('*')
            .single();

        if (error) {
            console.error('Error al actualizar pedido:', error);
            throw error;
        }

        const mapped = mapPedido(updated);
        setPedidos(prevPedidos =>
            prevPedidos.map(pedido => (pedido.id === id ? mapped : pedido))
        );
    };

    const deletePedido = async (id: number): Promise<void> => {
        const { error } = await supabase
            .from('pedidos')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error al eliminar pedido:', error);
            throw error;
        }

        setPedidos(prevPedidos => prevPedidos.filter(pedido => pedido.id !== id));
    };

    const searchPedidos = (query: string): Pedido[] => {
        const lowerQuery = query.toLowerCase().trim();

        if (!lowerQuery) {
            return getPedidos();
        }

        return pedidos.filter(pedido =>
            pedido.codigo.toLowerCase().includes(lowerQuery) ||
            pedido.estado.toLowerCase().includes(lowerQuery)
        );
    };

    const value: PedidoContextType = {
        pedidos,
        isLoading,
        refreshPedidos,
        getPedidos,
        getPedidoById,
        createPedido,
        updatePedido,
        deletePedido,
        searchPedidos,
    };

    return (
        <PedidoContext.Provider value={value}>
            {children}
        </PedidoContext.Provider>
    );
};
