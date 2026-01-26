import { z } from 'zod';

// Regex para validar teléfonos españoles (móvil y fijo)
const phoneRegex = /^(\+34|0034)?[6789]\d{8}$/;

export const clientSchema = z.object({
    nombre: z.string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(100, 'El nombre es demasiado largo')
        .trim(),

    email: z.string()
        .email('Introduce un email válido')
        .optional()
        .or(z.literal('')),

    telefono: z.string()
        .regex(phoneRegex, 'Introduce un teléfono válido (ej: +34 612 345 678 o 612345678)')
        .optional()
        .or(z.literal('')),

    nifCif: z.string()
        .max(20, 'El NIF/CIF es demasiado largo')
        .optional()
        .or(z.literal('')),

    notas: z.string()
        .max(500, 'Las notas son demasiado largas')
        .optional()
        .or(z.literal(''))
});

export type ClientFormData = z.infer<typeof clientSchema>;