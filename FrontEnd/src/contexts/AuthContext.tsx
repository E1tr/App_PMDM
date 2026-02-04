import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, RoleName } from '../types/types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const buildUserFromSession = useCallback(async (sessionUser: { id: string; email?: string | null }) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('role, name, avatar_url')
            .eq('id', sessionUser.id)
            .single();

        if (error) {
            console.error('Error al cargar perfil:', error);
        }

        const role = (data?.role ?? 'NORMAL') as RoleName;

        const appUser: User = {
            id: sessionUser.id,
            role,
            name: data?.name ?? sessionUser.email ?? 'Usuario',
            email: sessionUser.email ?? '',
            avatarUrl: data?.avatar_url ?? undefined,
        };

        setUser(appUser);
    }, []);

    useEffect(() => {
        const loadSession = async () => {
            const { data, error } = await supabase.auth.getSession();
            if (error) {
                console.error('Error al recuperar sesión:', error);
                setIsLoading(false);
                return;
            }

            if (data.session?.user) {
                await buildUserFromSession(data.session.user);
            }

            setIsLoading(false);
        };

        loadSession();

        const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                await buildUserFromSession(session.user);
            } else {
                setUser(null);
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [buildUserFromSession]);

    const login = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            throw error;
        }

        if (data.user) {
            await buildUserFromSession(data.user);
        }
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error al cerrar sesión:', error);
        }
        setUser(null);
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