import * as z from "zod";

import { ClientTypes } from "../_types/client";

// Schema para copropietarios
const coOwnersSchema = z.object({
    name: z.string().min(2, "El nombre es obligatorio"),
    dni: z.string().length(8, "El DNI debe tener exactamente 8 caracteres"),
    phone: z.string().optional(),
    address: z.string().min(2, "La dirección es obligatoria"),
    email: z.string().email("El correo electrónico debe ser válido")
        .optional(),
});

// Schema para datos de separación de bienes
const separatePropertySchema = z.object({
    spouseName: z.string().min(2, "El nombre del cónyuge es obligatorio"),
    spouseDni: z.string().length(8, "El DNI debe tener exactamente 8 caracteres"),
    phone: z.string().optional(),
    address: z.string().min(2, "La dirección es obligatoria"),
    email: z.string().email("El correo electrónico debe ser válido")
        .optional(),
    maritalStatus: z.enum(["Casado", "Separado", "Unión de hecho"], {
        required_error: "Debe seleccionar un estado civil",
    }),
});

export const clientSchema = z
    .object({
        name: z.string().min(2),
        dni: z.string().nullable()
            .optional(),
        ruc: z.string().nullable()
            .optional(),
        companyName: z.string().nullable()
            .optional(),
        country: z.string().min(1, { message: "El país es obligatorio" }),
        phoneNumber: z.string().min(1),
        email: z.string().email(),
        address: z.string().min(2),
        type: z.nativeEnum(ClientTypes),
        // Nuevos campos
        coOwners: z.array(coOwnersSchema).max(6, "Máximo 6 copropietarios permitidos"),
        separateProperty: z.boolean(),
        separatePropertyData: separatePropertySchema.optional(),
    })
    .refine(
        (data) => {
            if (data.type === ClientTypes.Natural) {
                return data.dni?.length === 8;
            } else if (data.type === ClientTypes.Juridico) {
                return data.ruc?.length === 11;
            }
            return true;
        },
        {
            message: "Validación incorrecta: Natural necesita DNI de 8 dígitos, Jurídico necesita RUC de 11.",
            path: ["type"],
        }
    )
    .superRefine((data, ctx) => {
    // Validaciones existentes
        if (data.type === ClientTypes.Natural && data.dni?.length !== 8) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "El DNI debe tener exactamente 8 caracteres",
                path: ["dni"],
            });
        }
        if (data.type === ClientTypes.Juridico) {
            if (data.ruc?.length !== 11) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "El RUC debe tener exactamente 11 caracteres",
                    path: ["ruc"],
                });
            }
            if (!data.companyName) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "El nombre de la empresa es obligatorio para clientes jurídicos",
                    path: ["companyName"],
                });
            }
        }

        // Validación de DNIs únicos entre cliente principal y copropietarios
        const allDnis: Array<string> = [];

        // Agregar DNI del cliente principal si existe
        if (data.dni) {
            allDnis.push(data.dni);
        }

        // Agregar DNIs de copropietarios
        data.coOwners.forEach((coprop, index) => {
            if (allDnis.includes(coprop.dni)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Este DNI ya está registrado",
                    path: ["copropietarios", index, "dni"],
                });
            } else {
                allDnis.push(coprop.dni);
            }
        });

        // Validar DNI del cónyuge si separación de bienes está activa
        if (data.separateProperty && data.separatePropertyData) {
            if (allDnis.includes(data.separatePropertyData.spouseDni)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "El DNI del cónyuge no puede ser igual al del cliente o copropietarios",
                    path: ["separacionBienesDatos", "spouseDni"],
                });
            }
        }

        // Validar que si separacionBienes es true, los datos sean obligatorios
        if (data.separateProperty && !data.separatePropertyData) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Los datos de separación de bienes son obligatorios",
                path: ["separacionBienesDatos"],
            });
        }
    });

export type CreateClientsSchema = z.infer<typeof clientSchema>;
