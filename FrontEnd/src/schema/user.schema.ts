import { z } from 'zod';

export const userSchema = z.object({
    name: z.string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(50, 'El nombre es demasiado largo'),
    email: z.string()
        .email('Introduce un email válido')
});

export type UserFormData = z.infer<typeof userSchema>;