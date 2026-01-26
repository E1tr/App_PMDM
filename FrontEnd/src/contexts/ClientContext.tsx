import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Cliente, clientes as clientesMock, pedidos } from '../types/types';

interface ClientContextType {
    clientes: Cliente[];
    getClientes: () => Cliente[];
    getClienteById: (id: number) => Cliente | undefined;
    getClientePedidos: (clienteId: number) => any[]; // Devuelve los pedidos del cliente
     createCliente: (cliente: Omit<Cliente, 'id'>) => Cliente;
    updateCliente: (id: number, data: Partial<Omit<Cliente, 'id'>>) => void;
    deleteCliente: (id: number) => void;
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
    const [clientes, setClientes] = useState<Cliente[]>(clientesMock);

    const getClientes = (): Cliente[] => {
        return clientes.filter(c => c.activo);
    };

    const getClienteById = (id: number): Cliente | undefined => {
        return clientes.find(cliente => cliente.id === id);
    };

    const getClientePedidos = (clienteId: number) => {
        return pedidos.filter(pedido => pedido.clienteId === clienteId)
            .sort((a, b) => new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime())
            .slice(0, 5); // Los 5 pedidos más recientes
    };

    const createCliente = (clienteData: Omit<Cliente, 'id'>): Cliente => {
        const newCliente: Cliente = {
            ...clienteData,
            id: Math.max(...clientes.map(c => c.id), 0) + 1,
        };

        setClientes(prevClientes => [...prevClientes, newCliente]);
        return newCliente;
    };

    const updateCliente = (id: number, data: Partial<Omit<Cliente, 'id'>>): void => {
        setClientes(prevClientes =>
            prevClientes.map(cliente =>
                cliente.id === id ? { ...cliente, ...data } : cliente
            )
        );
    };

    const deleteCliente = (id: number): void => {
        // En lugar de eliminar, marcamos como inactivo
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
        getClientes,
        getClienteById,
        getClientePedidos,
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