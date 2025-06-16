import * as z from "zod";

export const lotSchema = z.object({
    lotNumber: z.string().min(1, "El número de lote es requerido"),
    area: z.number().min(0.1, "El área debe ser mayor a 0"),
    price: z.number().min(1, "El precio debe ser mayor a 0"),
    status: z.enum(["Available", "Quoted", "Reserved", "Sold"]),
    blockId: z.string().min(1, "Debe seleccionar un bloque"),
});

export type CreateLotSchema = z.infer<typeof lotSchema>;
