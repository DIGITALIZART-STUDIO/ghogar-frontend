import * as z from "zod";

import { LeadCaptureSource } from "../_types/lead";

export const leadSchema = z.object({
    clientId: z.string().min(1, { message: "Debe seleccionar un cliente" }),
    assignedToId: z.string().min(1, { message: "Debe seleccionar un asesor para este lead" }),
    projectId: z.string().min(1, { message: "Debe seleccionar un proyecto" }),
    captureSource: z.nativeEnum(LeadCaptureSource, {
        errorMap: () => ({ message: "Debes seleccionar un medio de captación" }),
    }),
});

export type CreateLeadSchema = z.infer<typeof leadSchema>;
