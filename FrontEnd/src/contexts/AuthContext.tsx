import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, RoleName } from '../types/types';
import { supabase } from '../lib/supabase';
import { registerForPushNotificationsAsync } from '../lib/notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

const BIOMETRIC_FLAG_KEY = 'use_biometric';
const SESSION_LOCKED_KEY = 'session_locked';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    refreshProfile: () => Promise<void>;
    isLoading: boolean;
    enableBiometric: () => Promise<void>;
    disableBiometric: () => Promise<void>;
    checkBiometric: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const buildUserFromSession = useCallback(async (sessionUser: { id: string; email?: string | null }) => {
        const { data: initialProfile, error } = await supabase
            .from('profiles')
            .select('role, name, avatar_url')
            .eq('id', sessionUser.id)
            .maybeSingle();

        let profile = initialProfile;

        if (error) {
            console.error('Error al cargar perfil:', error);
        }

        if (!profile && sessionUser.id) {
            const { error: insertError } = await supabase
                .from('profiles')
                .upsert({
                    id: sessionUser.id,
                    name: sessionUser.email ?? 'Usuario',
                    role: 'NORMAL',
                    avatar_url: null,
                });

            if (insertError) {
                console.error('Error al crear perfil:', insertError);
            }

            const { data: createdProfile, error: createdProfileError } = await supabase
                .from('profiles')
                .select('role, name, avatar_url')
                .eq('id', sessionUser.id)
                .maybeSingle();

            if (createdProfileError) {
                console.error('Error al recargar perfil:', createdProfileError);
            }

            profile = createdProfile ?? profile;
        }

        const role = (profile?.role ?? 'NORMAL') as RoleName;

        const appUser: User = {
            id: sessionUser.id,
            role,
            name: profile?.name ?? sessionUser.email ?? 'Usuario',
            email: sessionUser.email ?? '',
            avatarUrl: profile?.avatar_url ?? undefined,
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
                const useBiometric = await AsyncStorage.getItem(BIOMETRIC_FLAG_KEY);
                const isLocked = await AsyncStorage.getItem(SESSION_LOCKED_KEY);

                if (useBiometric === 'true') {
                    const hasHardware = await LocalAuthentication.hasHardwareAsync();
                    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

                    if (hasHardware && isEnrolled) {
                        const result = await LocalAuthentication.authenticateAsync({
                            promptMessage: 'Usa tu huella para entrar',
                            fallbackLabel: 'Usar contraseña',
                        });

                        if (result.success) {
                            await AsyncStorage.removeItem(SESSION_LOCKED_KEY);
                            await buildUserFromSession(data.session.user);
                        } else {
                            if (isLocked) {
                                setUser(null);
                                setIsLoading(false);
                                return;
                            }
                            setUser(null);
                        }
                    } else {
                        await AsyncStorage.removeItem(SESSION_LOCKED_KEY);
                        await buildUserFromSession(data.session.user);
                    }
                } else {
                    await AsyncStorage.removeItem(SESSION_LOCKED_KEY);
                    await buildUserFromSession(data.session.user);
                }
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
            await registerForPushNotificationsAsync(data.user.id);
            await AsyncStorage.removeItem(SESSION_LOCKED_KEY);
        }
    };

    const refreshProfile = async () => {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
            console.error('Error al refrescar usuario:', error);
            return;
        }

        if (data.user) {
            await buildUserFromSession(data.user);
        }
    };
    const register = async (name: string, email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { name, avatar_url: null } },
        });
        if (error) {
            console.log(error);
            throw error;
        }

        if (data.user) {
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({ id: data.user.id, name, role: 'NORMAL', avatar_url: null });

            if (profileError) console.error(profileError);
            await buildUserFromSession(data.user);
        }
    };

    const logout = async () => {
        const useBiometric = await AsyncStorage.getItem(BIOMETRIC_FLAG_KEY);
        if (useBiometric === 'true') {
            await AsyncStorage.setItem(SESSION_LOCKED_KEY, 'true');
            setUser(null);
            return;
        }

        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error al cerrar sesión:', error);
        }
        setUser(null);
    };

    const enableBiometric = async () => {
        await AsyncStorage.setItem(BIOMETRIC_FLAG_KEY, 'true');
        await AsyncStorage.removeItem(SESSION_LOCKED_KEY);
    };

    const disableBiometric = async () => {
        await AsyncStorage.removeItem(BIOMETRIC_FLAG_KEY);
        await AsyncStorage.removeItem(SESSION_LOCKED_KEY);
    };

    const checkBiometric = async (): Promise<boolean> => {
        const stored = await AsyncStorage.getItem(BIOMETRIC_FLAG_KEY);
        return stored === 'true';
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading, register, refreshProfile, enableBiometric, disableBiometric, checkBiometric }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
    return context;
};