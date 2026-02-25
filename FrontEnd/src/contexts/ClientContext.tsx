import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { Cliente, Pedido } from '../types/types';
import { supabase } from '../lib/supabase';
import { getAllPushTokens, sendPushNotifications } from '../lib/notifications';

interface ClientContextType {
    clientes: Cliente[];
    isLoading: boolean;
    refreshClientes: () => Promise<void>;
    getClientes: () => Cliente[];
    getClienteById: (id: number) => Cliente | undefined;
    fetchClientePedidos: (clienteId: number) => Promise<Pedido[]>;
    createCliente: (cliente: Omit<Cliente, 'id'>) => Promise<Cliente>;
    updateCliente: (id: number, data: Partial<Omit<Cliente, 'id'>>) => Promise<void>;
    deleteCliente: (id: number) => Promise<void>;
    searchClientes: (query: string) => Cliente[];
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const useClientes = () => {
    const context = useContext(ClientContext);
    if (!context) {
        throw new Error('useClientes must be used within a ClientProvider');
    }
    return context;
};

interface ClientProviderProps {
    children: ReactNode;
}

export const ClientProvider: React.FC<ClientProviderProps> = ({ children }) => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const mapCliente = (row: any): Cliente => ({
        id: row.id,
        nombre: row.nombre,
        nifCif: row.nif_cif ?? undefined,
        telefono: row.telefono ?? undefined,
        email: row.email ?? undefined,
        notas: row.notas ?? undefined,
        activo: row.activo,
    });

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

    const refreshClientes = useCallback(async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('clientes')
            .select('*')
            .order('nombre', { ascending: true });

        if (error) {
            console.error('Error al cargar clientes:', error);
            setIsLoading(false);
            return;
        }

        setClientes((data ?? []).map(mapCliente));
        setIsLoading(false);
    }, []);

    useEffect(() => {
        refreshClientes();

        // Suscripción a cambios en tiempo real
        const clientesChannel = supabase
            .channel('clientes_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'clientes'
                },
                (payload) => {
                    console.log('Cambio detectado en clientes:', payload);

                    if (payload.eventType === 'INSERT') {
                        const newCliente = mapCliente(payload.new);
                        setClientes(prev => {
                            // Evitar duplicados
                            if (prev.some(c => c.id === newCliente.id)) {
                                return prev;
                            }
                            return [...prev, newCliente];
                        });
                    } else if (payload.eventType === 'UPDATE') {
                        const updatedCliente = mapCliente(payload.new);
                        setClientes(prev =>
                            prev.map(c => c.id === updatedCliente.id ? updatedCliente : c)
                        );
                    } else if (payload.eventType === 'DELETE') {
                        setClientes(prev => prev.filter(c => c.id !== payload.old.id));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(clientesChannel);
        };
    }, [refreshClientes]);

    const getClientes = (): Cliente[] => {
        return clientes.filter(c => c.activo);
    };

    const getClienteById = (id: number): Cliente | undefined => {
        return clientes.find(cliente => cliente.id === id);
    };

    const fetchClientePedidos = async (clienteId: number): Promise<Pedido[]> => {
        const { data, error } = await supabase
            .from('pedidos')
            .select('id, codigo, cliente_id, direccion_entrega_id, direccion_recogida_id, fecha_inicio, fecha_fin, estado, creado_por, notas')
            .eq('cliente_id', clienteId)
            .order('fecha_inicio', { ascending: false })
            .limit(5);

        if (error) {
            console.error('Error al cargar pedidos del cliente:', error);
            return [];
        }

        return (data ?? []).map(mapPedido);
    };

    const createCliente = async (clienteData: Omit<Cliente, 'id'>): Promise<Cliente> => {
        const payload = {
            nombre: clienteData.nombre,
            nif_cif: clienteData.nifCif ?? null,
            telefono: clienteData.telefono ?? null,
            email: clienteData.email ?? null,
            notas: clienteData.notas ?? null,
            activo: clienteData.activo ?? true,
        };

        const { data, error } = await supabase
            .from('clientes')
            .insert(payload)
            .select('*')
            .single();

        if (error) {
            console.error('Error al crear cliente:', error);
            throw error;
        }

        const newCliente = mapCliente(data);
        // No agregamos localmente - Realtime lo hará automáticamente
        return newCliente;
    };

    const updateCliente = async (id: number, data: Partial<Omit<Cliente, 'id'>>): Promise<void> => {
        const payload = {
            ...(data.nombre !== undefined ? { nombre: data.nombre } : {}),
            ...(data.nifCif !== undefined ? { nif_cif: data.nifCif } : {}),
            ...(data.telefono !== undefined ? { telefono: data.telefono } : {}),
            ...(data.email !== undefined ? { email: data.email } : {}),
            ...(data.notas !== undefined ? { notas: data.notas } : {}),
            ...(data.activo !== undefined ? { activo: data.activo } : {}),
        };

        const { data: updated, error } = await supabase
            .from('clientes')
            .update(payload)
            .eq('id', id)
            .select('*')
            .single();

        if (error) {
            console.error('Error al actualizar cliente:', error);
            throw error;
        }

        // No actualizamos localmente - Realtime lo hará automáticamente
    };

    const deleteCliente = async (id: number): Promise<void> => {
        const { error } = await supabase
            .from('clientes')
            .update({ activo: false })
            .eq('id', id);

        if (error) {
            console.error('Error al eliminar cliente:', error);
            throw error;
        }

        setClientes(prevClientes =>
            prevClientes.map(cliente =>
                cliente.id === id ? { ...cliente, activo: false } : cliente
            )
        );
    };

    const searchClientes = (query: string): Cliente[] => {
        const lowerQuery = query.toLowerCase().trim();

        if (!lowerQuery) {
            return getClientes();
        }

        return clientes.filter(cliente =>
            cliente.activo && (
                cliente.nombre.toLowerCase().includes(lowerQuery) ||
                cliente.email?.toLowerCase().includes(lowerQuery) ||
                cliente.telefono?.includes(lowerQuery) ||
                cliente.nifCif?.toLowerCase().includes(lowerQuery)
            )
        );
    };

    const value: ClientContextType = {
        clientes,
        isLoading,
        refreshClientes,
        getClientes,
        getClienteById,
        fetchClientePedidos,
        createCliente,
        updateCliente,
        deleteCliente,
        searchClientes,
    };

    return (
        <ClientContext.Provider value={value}>
            {children}
        </ClientContext.Provider>
    );
};