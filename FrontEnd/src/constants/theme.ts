// src/constants/theme.ts

export const lightTheme = {
    dark: false,
    colors: {
        primary: '#4C3BCF',       // Azul violáceo (base logo)
        background: '#F4F6FB',    // Fondo claro con tinte azul
        card: '#FFFFFF',
        surface: '#EEF1F7',       // Para inputs y superficies elevadas
        text: '#0D1B2A',          // Azul muy oscuro para máximo contraste
        textSecondary: '#475569', // Neutro gris-azulado
        border: '#CBD5E1',        // Borde suave
        accent: '#22D3EE',        // Cian brillante para acciones secundarias
        error: '#EF4444',
        success: '#10B981',
        white: '#FFFFFF',
    }
};

export const darkTheme = {
    dark: true,
    colors: {
        primary: '#8B7BFF',       // Versión clara del violeta para modo oscuro
        background: '#0B1220',    // Azul marino casi negro
        card: '#0F172A',          // Ligeramente más claro que el fondo
        surface: '#111927',       // Para inputs/superficies
        text: '#E3E8F4',          // Texto claro
        textSecondary: '#A0AEC0', // Gris azulado suave
        border: '#1F2937',        // Borde tenue
        accent: '#22D3EE',        // Mantener cian brillante
        error: '#FCA5A5',
        success: '#34D399',
        white: '#FFFFFF',
    }
};

export const COLORS = lightTheme.colors;