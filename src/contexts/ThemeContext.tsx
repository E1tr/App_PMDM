import React, { createContext, useContext, useState } from 'react';
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

    const toggleTheme = () => {
        setIsDark((prev) => !prev);
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