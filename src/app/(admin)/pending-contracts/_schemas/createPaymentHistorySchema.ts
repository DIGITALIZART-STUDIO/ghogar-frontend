import { z } from "zod";

// Schema para validación de pagos
export const paymentHistorySchema = z.object({
    date: z.string({
        required_error: "La fecha del pago es requerida",
    }),
    amount: z.number({
        required_error: "El monto es requerido",
    }).min(0.01, "El monto debe ser mayor a 0"),
    method: z.enum(["CASH", "BANK_DEPOSIT", "BANK_TRANSFER"], {
        required_error: "El método de pago es requerido",
    }),
    bankName: z.string().optional(),
    reference: z.string().optional(),
    notes: z.string().optional(),
});

export type PaymentHistoryFormData = z.infer<typeof paymentHistorySchema>;
