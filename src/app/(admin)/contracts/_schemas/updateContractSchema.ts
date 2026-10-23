import { z } from "zod";

export const contractCoOwnerSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  dni: z.string().length(8, "El DNI debe tener exactamente 8 caracteres"),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.union([z.string().email("El correo electrónico debe ser válido"), z.literal("")]).optional(),
});

export const updateContractSchema = z
  .object({
    totalPrice: z.coerce.number().positive("El precio debe ser mayor a 0."),
    downPaymentAmount: z.coerce.number().min(0, "La inicial no puede ser negativa."),
    monthsFinanced: z.coerce.number().int().min(1, "Indica los meses financiados.").max(360),
    exchangeRate: z.coerce.number().positive("El tipo de cambio debe ser mayor a 0."),
    startDate: z.string().min(1, "La fecha de inicio es obligatoria."),
    coOwners: z.array(contractCoOwnerSchema).max(6, "Máximo 6 copropietarios.").optional(),
  })
  .refine((data) => data.downPaymentAmount < data.totalPrice, {
    message: "La inicial debe ser menor al precio total.",
    path: ["downPaymentAmount"],
  });

export type UpdateContractFormData = z.infer<typeof updateContractSchema>;
