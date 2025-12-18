import * as z from "zod";

export const editReservationSchema = z.object({
    reservationDate: z
        .string({
            required_error: "La fecha de reserva es obligatoria",
        })
        .min(1, "Debes seleccionar una fecha válida"),
    amountPaid: z.string().min(1, { message: "El monto pagado es requerido" }),
    currency: z.enum(["SOLES", "DOLARES"], {
        required_error: "La moneda es requerida",
    }),
    status: z.enum(["ISSUED", "CANCELED", "ANULATED"], {
        required_error: "El estado es requerido",
    }),
    paymentMethod: z.enum(["CASH", "BANK_DEPOSIT", "BANK_TRANSFER"], {
        required_error: "El método de pago es requerido",
    }),
    bankName: z.string().optional(),
    exchangeRate: z.string().min(1, { message: "El tipo de cambio es requerido" }),
    expiresAt: z
        .string({
            required_error: "La fecha de vencimiento es obligatoria",
        })
        .min(1, "Debes seleccionar una fecha válida"),
    notified: z.boolean(),
    schedule: z.string().optional(),
});

export type EditReservationSchema = z.infer<typeof editReservationSchema>;
