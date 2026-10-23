import { LeadCaptureSourceLabels, LeadStatusLabels } from "@/app/(admin)/leads/_utils/leads.utils";
import { TaskType } from "../_types/advisorActivity";

export { formatReportDate } from "../../../_utils/report-dates";

export const TaskTypeLabels: Record<TaskType, string> = {
  [TaskType.Call]: "Llamada",
  [TaskType.Meeting]: "Reunión",
  [TaskType.Email]: "Correo",
  [TaskType.Visit]: "Visita",
  [TaskType.Other]: "Otro",
};

export { LeadCaptureSourceLabels, LeadStatusLabels };
