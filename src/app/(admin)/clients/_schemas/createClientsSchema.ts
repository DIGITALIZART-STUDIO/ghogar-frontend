import * as z from "zod";

import { ClientTypes } from "../_types/client";

const optionalEmail = z
    .union([z.string().email("El correo electrónico debe ser válido"), z.literal("")])
    .transform((val) => (val === "" ? undefined : val))
    .optional();

const optionalText = z
    .union([z.string(), z.literal("")])
    .transform((val) => (val === "" ? undefined : val))
    .optional();

const coOwnersSchema = z.object({
    name: z.string().min(2, "El nombre es obligatorio"),
    dni: z.string().length(8, "El DNI debe tener exactamente 8 caracteres"),
    phone: optionalText,
    address: optionalText,
    email: optionalEmail,
});

const separatePropertySchema = z.object({
    spouseName: z.string().min(2, "El nombre del cónyuge es obligatorio"),
    spouseDni: z.string().length(8, "El DNI debe tener exactamente 8 caracteres"),
    phone: optionalText,
    address: optionalText,
    email: optionalEmail,
    maritalStatus: z.enum(["Casado", "Separado", "Unión de hecho"], {
        required_error: "Debe seleccionar un estado civil",
    }),
});

export const clientSchema = z
    .object({
        name: z
            .string({
                required_error: "El nombre es obligatorio",
                invalid_type_error: "El nombre es obligatorio",
            })
            .trim()
            .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
        dni: z.string().nullable()
            .optional(),
        ruc: z.string().nullable()
            .optional(),
        companyName: z.string().nullable()
            .optional(),
        country: optionalText,
        phoneNumber: z
            .string({
                required_error: "El teléfono es obligatorio",
                invalid_type_error: "El teléfono es obligatorio",
            })
            .min(1, { message: "El teléfono es obligatorio" }),
        email: optionalEmail,
        address: optionalText,
        type: z.nativeEnum(ClientTypes, {
            required_error: "El tipo de cliente es obligatorio",
        }),
        coOwners: z.array(coOwnersSchema).max(6, "Máximo 6 copropietarios permitidos"),
        separateProperty: z.boolean(),
        separatePropertyData: separatePropertySchema.optional(),
    })
    .superRefine((data, ctx) => {
        const dni = data.dni?.trim();
        const ruc = data.ruc?.trim();

        if (data.type === ClientTypes.Natural && dni && dni.length !== 8) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "El DNI debe tener exactamente 8 caracteres",
                path: ["dni"],
            });
        }
        if (data.type === ClientTypes.Juridico && ruc && ruc.length !== 11) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "El RUC debe tener exactamente 11 caracteres",
                path: ["ruc"],
            });
        }

        const allDnis: Array<string> = [];

        if (dni) {
            allDnis.push(dni);
        }

        data.coOwners.forEach((coprop, index) => {
            if (allDnis.includes(coprop.dni)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Este DNI ya está registrado",
                    path: ["coOwners", index, "dni"],
                });
            } else {
                allDnis.push(coprop.dni);
            }
        });

        if (data.separateProperty && data.separatePropertyData) {
            if (allDnis.includes(data.separatePropertyData.spouseDni)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "El DNI del cónyuge no puede ser igual al del cliente o copropietarios",
                    path: ["separatePropertyData", "spouseDni"],
                });
            }
        }

        if (data.separateProperty && !data.separatePropertyData) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Los datos de separación de bienes son obligatorios",
                path: ["separatePropertyData"],
            });
        }
    });

export type CreateClientsSchema = z.infer<typeof clientSchema>;
