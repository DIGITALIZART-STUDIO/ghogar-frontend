import { z } from "zod";

import { ContractCurrency, ContractOrigin } from "../_types/contract";

export const createContractSchema = z
  .object({
    origin: z.enum([ContractOrigin.Direct, ContractOrigin.Legacy], {
      required_error: "Selecciona el origen del contrato.",
    }),
    clientId: z.string().uuid("Selecciona un cliente."),
    projectId: z.string().min(1, "Selecciona un proyecto."),
    blockId: z.string().min(1, "Selecciona una manzana."),
    lotId: z.string().uuid("Selecciona un lote."),
    totalPrice: z.coerce.number().positive("El precio debe ser mayor a 0."),
    downPaymentAmount: z.coerce.number().min(0, "La inicial no puede ser negativa."),
    monthsFinanced: z.coerce.number().int().min(1, "Indica los meses financiados.").max(360),
    currency: z.nativeEnum(ContractCurrency),
    exchangeRate: z.coerce.number().positive("El tipo de cambio debe ser mayor a 0."),
    startDate: z.string().optional(),
    paidInstallments: z.coerce.number().int().min(0).optional(),
  })
  .refine((data) => data.downPaymentAmount < data.totalPrice, {
    message: "La inicial debe ser menor al precio total.",
    path: ["downPaymentAmount"],
  })
  .refine((data) => data.origin !== ContractOrigin.Legacy || Boolean(data.startDate), {
    message: "El contrato legado requiere fecha de inicio.",
    path: ["startDate"],
  })
  .refine(
    (data) =>
      data.origin !== ContractOrigin.Legacy ||
      data.paidInstallments === undefined ||
      data.paidInstallments <= data.monthsFinanced,
    {
      message: "Las cuotas pagadas no pueden superar los meses financiados.",
      path: ["paidInstallments"],
    }
  );

export type CreateContractFormData = z.infer<typeof createContractSchema>;
