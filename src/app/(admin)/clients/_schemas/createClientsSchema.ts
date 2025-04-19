import * as z from "zod";

import { ClientTypes } from "../_types/client";

export const clientSchema = z
    .object({
        name: z.string().min(2, { message: "El nombre es obligatorio y debe tener al menos 2 caracteres" }),
        coOwner: z.string().nullable()
            .optional(),
        dni: z.string().nullable()
            .optional(),
        ruc: z.string().nullable()
            .optional(),
        companyName: z.string().nullable()
            .optional(),
        phoneNumber: z.string().min(1, { message: "El número de teléfono es obligatorio" }),
        email: z.string().email({ message: "Debe ser una dirección de correo válida" }),
        address: z.string().min(2, { message: "La dirección es obligatoria" }),
        type: z.nativeEnum(ClientTypes, {
            errorMap: () => ({ message: "Debes seleccionar un tipo de cliente válido" }),
        }),
    })
    .refine(
        (data) => {
            // Validaciones condicionales basadas en el tipo de cliente
            if (data.type === ClientTypes.Natural) {
                // Para cliente Natural, se requiere DNI y debe tener 8 caracteres
                if (!data.dni) {
                    return false;
                }
                if (data.dni.length !== 8) {
                    return false;
                }
            } else if (data.type === ClientType.Juridico) {
                // Para cliente Jurídico, se requiere RUC y debe tener 11 caracteres
                if (!data.ruc) {
                    return false;
                }
                if (data.ruc.length !== 11) {
                    return false;
                }
            }
            return true;
        },
        {
            message:
        "Validación de cliente incorrecta. Para clientes Naturales se requiere DNI (8 caracteres) y para Jurídicos RUC (11 caracteres)",
            path: ["type"], // Esto indica que el error está relacionado con el campo "type"
        },
    )
    .superRefine((data, ctx) => {
        if (data.type === ClientType.Natural) {
            if (data.dni && data.dni.length !== 8) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "El DNI debe tener exactamente 8 caracteres",
                    path: ["dni"],
                });
            }
        } else if (data.type === ClientType.Juridico) {
            if (data.ruc && data.ruc.length !== 11) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "El RUC debe tener exactamente 11 caracteres",
                    path: ["ruc"],
                });
            }

            // Si no hay companyName, mostrar mensaje
            if (!data.companyName) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "El nombre de la empresa es obligatorio para clientes jurídicos",
                    path: ["companyName"],
                });
            }
        }
    });

export type CreateClientsSchema = z.infer<typeof clientSchema>;
