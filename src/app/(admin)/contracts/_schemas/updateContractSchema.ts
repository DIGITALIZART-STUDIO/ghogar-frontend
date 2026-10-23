import { z } from "zod";

import { areInstallmentDatesNonDecreasing } from "../_utils/contracts.utils";

export const contractCoOwnerSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  dni: z.string().length(8, "El DNI debe tener exactamente 8 caracteres"),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.union([z.string().email("El correo electrónico debe ser válido"), z.literal("")]).optional(),
});

export const updateContractInstallmentSchema = z.object({
  sequence: z.number().int().positive(),
  dueDate: z.string().min(1, "La fecha de vencimiento es obligatoria."),
  amountDue: z.number(),
  amountPaid: z.number(),
  paid: z.boolean(),
  locked: z.boolean(),
});

export const updateContractSchema = z
  .object({
    totalPrice: z.coerce.number().positive("El precio debe ser mayor a 0."),
    downPaymentAmount: z.coerce.number().min(0, "La inicial no puede ser negativa."),
    monthsFinanced: z.coerce.number().int().min(1, "Indica los meses financiados.").max(360),
    exchangeRate: z.coerce.number().positive("El tipo de cambio debe ser mayor a 0."),
    startDate: z.string().min(1, "La fecha de inicio es obligatoria."),
    coOwners: z.array(contractCoOwnerSchema).max(6, "Máximo 6 copropietarios.").optional(),
    applyRecalculatedSchedule: z.boolean(),
    installments: z.array(updateContractInstallmentSchema).min(1, "El contrato debe tener al menos una cuota."),
  })
  .refine((data) => data.downPaymentAmount < data.totalPrice, {
    message: "La inicial debe ser menor al precio total.",
    path: ["downPaymentAmount"],
  })
  .refine((data) => data.monthsFinanced >= data.installments.filter((installment) => installment.locked).length, {
    message: "El plazo no puede ser menor a las cuotas pagadas o con recibo.",
    path: ["monthsFinanced"],
  })
  .refine((data) => areInstallmentDatesNonDecreasing(data.installments), {
    message: "Las fechas de las cuotas deben ir en orden cronológico.",
    path: ["installments"],
  });

export type UpdateContractFormData = z.infer<typeof updateContractSchema>;
