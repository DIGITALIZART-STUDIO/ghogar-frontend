import { z } from "zod";

export const userCreateSchema = z.object({
    name: z
        .string({ message: "El nombre es obligatorio" })
        .min(1, { message: "El nombre es obligatorio" })
        .max(250, { message: "El nombre no puede tener más de 250 caracteres" }),
    email: z.string().email("El correo electrónico no es válido"),
    phone: z.string().min(1, { message: "El teléfono es obligatorio" })
        .max(250),
    role: z.string({ message: "El rol de usuario es obligatorio" }).min(1),
    password: z
        .string()
        .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]/, {
            message: "La contraseña debe contener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial (@$!%*?&_)",
        }),
});

export type UserCreateDTO = z.infer<typeof userCreateSchema>

export const userUpdateSchema = z.object({
    name: z
        .string({ message: "El nombre es obligatorio" })
        .min(1, { message: "El nombre es obligatorio" })
        .max(250, { message: "El nombre no puede tener más de 250 caracteres" }),
    email: z.string().email("El correo electrónico no es válido"),
    phone: z.string().min(1, { message: "El teléfono es obligatorio" })
        .max(250),
    role: z.string({ message: "El rol de usuario es obligatorio" }).min(1),
});

export type UserUpdateDTO = z.infer<typeof userUpdateSchema>;

export const userUpdatePasswordSchema = z
    .object({
        newPassword: z
            .string()
            .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]/, {
                message: "La contraseña debe contener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial (@$!%*?&_)",
            }),
        confirmPassword: z.string().min(1, { message: "Confirme la nueva contraseña" }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
    });

export type UserUpdatePasswordDTO = z.infer<typeof userUpdatePasswordSchema>
