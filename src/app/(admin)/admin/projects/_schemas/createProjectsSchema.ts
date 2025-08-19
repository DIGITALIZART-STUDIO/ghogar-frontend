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
    projectImage: z
        .instanceof(File)
        .refine((file) => file.size <= 10 * 1024 * 1024, "La imagen debe ser menor a 10MB")
        .refine(
            (file) => ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/svg+xml"].includes(file.type),
            "Solo se permiten archivos de imagen (JPG, PNG, WEBP, GIF, SVG)",
        )
        .optional(),
    projectUrlImage: z.string().url()
        .optional()
        .nullable(),
});

export type CreateProjectSchema = z.infer<typeof projectSchema>
