import * as z from "zod";

import { LeadCaptureSource } from "../_types/lead";

export const leadFromPhoneSchema = z.object({
  phoneNumber: z.string().min(1, { message: "Debe ingresar un número de teléfono" }),
  assignedToId: z.string().min(1, { message: "Debe seleccionar un asesor para este lead" }),
  projectId: z.string().min(1, { message: "Debe seleccionar un proyecto" }),
  captureSource: z.nativeEnum(LeadCaptureSource, {
    errorMap: () => ({ message: "Debes seleccionar un medio de captación" }),
  }),
});

export type CreateLeadFromPhoneSchema = z.infer<typeof leadFromPhoneSchema>;
