import * as z from "zod";

export const projectSchema = z.object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    location: z.string().min(5, "La ubicación debe tener al menos 5 caracteres"),

    currency: z.string().min(3, "La moneda debe tener al menos 3 caracteres"),
    defaultDownPayment: z.number().min(0)
        .max(100)
        .optional(),
    defaultFinancingMonths: z.number().min(1)
        .optional(),
    maxDiscountPercentage: z.number().min(0)
        .max(100)
        .optional(),
});

export type CreateProjectSchema = z.infer<typeof projectSchema>;
