// src/constants/theme.ts

export const lightTheme = {
    dark: false,
    colors: {
        primary: '#694381ff',       // Un morado "Google Material" vibrante pero serio
        background: '#F9FAFB',    // No es blanco puro, es un gris muy sutil para descansar la vista
        card: '#FFFFFF',          // Las tarjetas sí son blancas puras para resaltar
        text: '#111827',          // Negro casi puro (Charcoal) para lectura perfecta
        textSecondary: '#6B7280', // Gris medio equilibrado
        border: '#E5E7EB',        // Bordes muy suaves
        error: '#EF4444',         // Rojo moderno
        success: '#10B981',       // Verde esmeralda
        accent: '#F59E0B',        // Ámbar suave
        surface: '#FFFFFF',
        white: '#FFFFFF',
    }
};

export const darkTheme = {
    dark: true,
    colors: {
        primary: '#C084FC',       // Un lavanda brillante que destaca sobre negro
        background: '#0F172A',    // "Slate 900" - Un azul muy oscuro, mucho más elegante que el negro puro
        card: '#1E293B',          // "Slate 800" - Un tono más claro para diferenciar capas
        text: '#F3F4F6',          // Blanco roto (muy legible)
        textSecondary: '#94A3B8', // Gris azulado suave
        border: '#334155',        // Bordes sutiles que encajan con el fondo
        error: '#F87171',         // Rojo pastel (menos agresivo en oscuro)
        success: '#34D399',       // Verde menta neón
        accent: '#FBBF24',        // Dorado brillante
        surface: '#1E293B',
        white: '#FFFFFF',
    }
};

// Mantenemos compatibilidad
export const COLORS = lightTheme.colors;