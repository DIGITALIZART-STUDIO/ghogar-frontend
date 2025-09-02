import { z } from "zod";
import { PaymentMethod } from "../../reservations/_types/reservation";

// Zod enum usando los valores del enum actualizado
export const paymentMethodEnum = z.enum([
    PaymentMethod.CASH,
    PaymentMethod.BANK_DEPOSIT,
    PaymentMethod.BANK_TRANSFER,
]);

export const paymentTransactionCreateSchema = z.object({
    paymentDate: z.string({
        required_error: "Por favor ingresa la fecha de pago.",
        invalid_type_error: "La fecha debe ser un texto en formato ISO (ejemplo: 2024-07-25T14:30:00Z).",
    }),
    amountPaid: z
        .number({
            required_error: "Por favor ingresa el monto pagado.",
            invalid_type_error: "El monto debe ser un número.",
        })
        .min(0.01, "El monto debe ser mayor a 0."),
    paymentMethod: paymentMethodEnum.refine((val) => val !== undefined, {
        message: "Por favor selecciona un método de pago.",
    }),
    referenceNumber: z.string().max(100, "La referencia no puede exceder 100 caracteres.")
        .optional(),
    paymentIds: z.array(z.string().uuid()).optional(),
    reservationId: z.string().uuid("ID de reserva debe ser un UUID válido.")
        .optional(),
    comprobanteFile: z.instanceof(File).optional(),
});

export type PaymentTransactionCreateFormData = z.infer<typeof paymentTransactionCreateSchema>
