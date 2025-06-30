import * as z from "zod";

export const reservationSchema = z.object({
    quotationId: z.string().min(1, { message: "La cotización es requerida" }),
    reservationDate: z
        .string({
            required_error: "La fecha de reserva es obligatoria",
        })
        .min(1, "Debes seleccionar una fecha válida"),
    amountPaid: z.string().min(1, { message: "El monto pagado es requerido" }),
    currency: z.enum(["SOLES", "DOLARES"], {
        required_error: "La moneda es requerida",
    }),
    paymentMethod: z.enum(["CASH", "BANK_DEPOSIT", "BANK_TRANSFER"], {
        required_error: "El método de pago es requerido",
        message: "Seleccione un método de pago"
    }),
    bankName: z.string().optional(),
    exchangeRate: z.string().min(1, { message: "El tipo de cambio es requerido" }),
    expiresAt: z
        .string({
            required_error: "La fecha de vencimiento es obligatoria",
        })
        .min(1, "Debes seleccionar una fecha válida"),
    schedule: z.string().optional(),
});

export type CreateReservationSchema = z.infer<typeof reservationSchema>;
