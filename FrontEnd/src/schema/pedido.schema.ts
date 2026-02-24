import { z } from 'zod';

export const pedidoSchema = z.object({
    codigo: z.string().min(1, 'El código es obligatorio'),
    clienteId: z.number().min(1, 'Debe seleccionar un cliente'),
    fechaInicio: z.string().min(1, 'La fecha de inicio es obligatoria'),
    fechaFin: z.string().min(1, 'La fecha de fin es obligatoria'),
    estado: z.enum(['PREPARADO', 'ENTREGADO', 'DEVUELTO', 'PENDIENTE_REVISION', 'FINALIZADO']),
    notas: z.string().optional(),
}).refine((data) => data.fechaFin >= data.fechaInicio, {
    message: 'La fecha de fin debe ser posterior a la de inicio',
    path: ['fechaFin'],
});

export type PedidoFormData = z.infer<typeof pedidoSchema>;
