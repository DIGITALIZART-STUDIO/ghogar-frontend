import * as z from "zod";

export const blockSchema = z.object({
    name: z.string().min(1, "El nombre de la manzana es requerido"),
});

export type CreateBlockSchema = z.infer<typeof blockSchema>;
