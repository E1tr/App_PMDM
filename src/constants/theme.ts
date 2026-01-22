// src/constants/theme.ts

export const lightTheme = {
    dark: false,
    colors: {
        primary: '#7C3AED',       // Un violeta "Slate" más saturado y moderno (Violet 600)
        background: '#F8FAFC',    // Slate 50: Más limpio y profesional que el gris anterior
        card: '#FFFFFF',
        text: '#0F172A',          // Slate 900: El azul oscuro profundo que define tu marca
        textSecondary: '#475569', // Slate 600: Mucho más integrado en la estética
        border: '#CBD5E1',        // Slate 300: Bordes que se ven, pero no molestan
        error: '#DC2626',
        success: '#059669',
        accent: '#8B5CF6',        // Un morado más claro para interacción
        surface: '#FFFFFF',
        white: '#FFFFFF',
    }
};

export const darkTheme = {
    dark: true,
    colors: {
        primary: '#A78BFA',       // Violeta suave que no "quema" en la oscuridad
        background: '#020617',    // Un Slate mucho más profundo, casi negro pero con alma azul
        card: '#0F172A',          // Slate 900 para las tarjetas (hace pop sobre el fondo)
        text: '#F1F5F9',          // Slate 100: Máxima legibilidad
        textSecondary: '#94A3B8', // Slate 400
        border: '#1E293B',        // Slate 800 para bordes invisibles pero definidos
        error: '#FB7185',
        success: '#34D399',
        accent: '#DDD6FE',
        surface: '#0F172A',
        white: '#FFFFFF',
    }
};

export const COLORS = lightTheme.colors;