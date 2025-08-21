import { z } from "zod";

// Schema para selección de supervisor
export const supervisorSchema = z.object({
    supervisorId: z.string().min(1, "Debe seleccionar un supervisor"),
});

// Schema para validación OTP
export const otpSchema = z.object({
    otpCode: z.string().length(6, "El código debe tener exactamente 6 dígitos"),
});

export type SupervisorFormData = z.infer<typeof supervisorSchema>
export type OtpFormData = z.infer<typeof otpSchema>
