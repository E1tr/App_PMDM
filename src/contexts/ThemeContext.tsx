import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from '../constants/theme';

// Definimos qué forma tiene nuestro contexto
interface ThemeContextType {
    theme: typeof lightTheme;
    isDark: boolean;
    toggleTheme: () => void;
}

// Creamos el contexto
const ThemeContext = createContext<ThemeContextType>({
    theme: lightTheme,
    isDark: false,
    toggleTheme: () => { },
});

// El proveedor que envolverá la app
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [isDark, setIsDark] = useState(false);

    // Cargar tema del storage al montar
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem('@theme_isDark');
                if (savedTheme !== null) {
                    setIsDark(JSON.parse(savedTheme));
                }
            } catch (error) {
                console.error('Error al cargar tema:', error);
            }
        };
        loadTheme();
    }, []);

    const toggleTheme = async () => {
        try {
            const newTheme = !isDark;
            await AsyncStorage.setItem('@theme_isDark', JSON.stringify(newTheme));
            setIsDark(newTheme);
        } catch (error) {
            console.error('Error al guardar tema:', error);
        }
    };

    const theme = isDark ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Hook para usar el tema en cualquier componente
export const useTheme = () => useContext(ThemeContext);