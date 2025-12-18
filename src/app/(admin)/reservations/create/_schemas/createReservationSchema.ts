import * as z from "zod";

// Schema para copropietarios (igual que en createClientsSchema.ts)
const coOwnersSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  dni: z.string().length(8, "El DNI debe tener exactamente 8 caracteres"),
  phone: z
    .union([z.string(), z.literal("")])
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
  address: z.string().min(2, "La dirección es obligatoria"),
  email: z
    .union([z.string().email("El correo electrónico debe ser válido"), z.literal("")])
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
});

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
    message: "Seleccione un método de pago",
  }),
  bankName: z
    .union([z.string(), z.literal("")])
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
  exchangeRate: z.string().min(1, { message: "El tipo de cambio es requerido" }),
  expiresAt: z
    .string({
      required_error: "La fecha de vencimiento es obligatoria",
    })
    .min(1, "Debes seleccionar una fecha válida"),
  schedule: z
    .union([z.string(), z.literal("")])
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
  notified: z.boolean(),
  coOwners: z.array(coOwnersSchema).max(6, "Máximo 6 copropietarios permitidos").optional(),
});

export type CreateReservationSchema = z.infer<typeof reservationSchema>;

// Schema para cambio de estado de reserva
export const reservationStatusChangeSchema = z
  .object({
    status: z.enum(["ISSUED", "CANCELED", "ANULATED"], {
      required_error: "El estado es requerido",
    }),
    isFullPayment: z.boolean().optional(),
    paymentAmount: z
      .number()
      .optional()
      .refine((val) => {
        if (!val) {
          return true;
        } // Opcional
        return val > 0;
      }, "El monto debe ser un número válido mayor a 0"),

    // Campos para PaymentHistory
    paymentDate: z
      .union([z.string(), z.literal("")])
      .transform((val) => (val === "" ? undefined : val))
      .optional(),
    paymentMethod: z.enum(["CASH", "BANK_DEPOSIT", "BANK_TRANSFER"]).optional(),
    bankName: z
      .union([z.string(), z.literal("")])
      .transform((val) => (val === "" ? undefined : val))
      .optional(),
    paymentReference: z
      .union([z.string(), z.literal("")])
      .transform((val) => (val === "" ? undefined : val))
      .optional(),
    paymentNotes: z
      .union([z.string(), z.literal("")])
      .transform((val) => (val === "" ? undefined : val))
      .optional(),
  })
  .refine(
    (data) => {
      // Solo validar paymentAmount cuando el estado es CANCELED (Completado)
      if (data.status === "CANCELED" && data.isFullPayment === false && !data.paymentAmount) {
        return false;
      }
      return true;
    },
    {
      message: "Si no es pago completo, debe especificar el monto del pago",
      path: ["paymentAmount"],
    }
  );

export type ReservationStatusChangeSchema = z.infer<typeof reservationStatusChangeSchema>;
