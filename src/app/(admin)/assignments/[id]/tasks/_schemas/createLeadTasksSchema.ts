import * as z from "zod";

import { TaskTypes } from "../_types/leadTask";

export const leadTaskSchema = z.object({
    type: z.nativeEnum(TaskTypes, {
        errorMap: () => ({ message: "Debes seleccionar un tipo de tarea" }),
    }),
    description: z
        .string({
            required_error: "La descripción es obligatoria",
        })
        .min(1, "La descripción no puede estar vacía"),
    scheduledDate: z
        .string({
            required_error: "La fecha programada es obligatoria",
        })
        .min(1, "Debes seleccionar una fecha válida"),
    completedDate: z.string().optional(),
});
export type CreateLeadTasksSchema = z.infer<typeof leadTaskSchema>;
