import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/types';

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Cargar usuario del storage al montar
    useEffect(() => {
        const loadUser = async () => {
            try {
                const savedUser = await AsyncStorage.getItem('@auth_user');
                if (savedUser) {
                    setUser(JSON.parse(savedUser));
                }
            } catch (error) {
                console.error('Error al cargar usuario:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadUser();
    }, []);

    const login = async (userData: User) => {
        try {
            await AsyncStorage.setItem('@auth_user', JSON.stringify(userData));
            setUser(userData);
        } catch (error) {
            console.error('Error al guardar usuario:', error);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('@auth_user');
            setUser(null);
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
    return context;
};