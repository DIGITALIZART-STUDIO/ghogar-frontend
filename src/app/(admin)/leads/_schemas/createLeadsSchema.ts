import * as z from "zod";

export const leadSchema = z.object({
    clientId: z.string().min(1, { message: "Debe seleccionar un cliente" }),
    assignedToId: z.string().min(1, { message: "Debe seleccionar un asesor para este lead" }),
    procedency: z.string().min(1, { message: "La procedencia del lead es obligatoria" }),
});

export type CreateLeadSchema = z.infer<typeof leadSchema>;
