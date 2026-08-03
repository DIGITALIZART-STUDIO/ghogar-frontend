import { LeadCaptureSourceLabels, LeadStatusLabels } from "@/app/(admin)/leads/_utils/leads.utils";
import { TaskType } from "../_types/advisorActivity";

export function formatReportDate(dateString?: string | null): string {
  if (!dateString) {
    return "—";
  }

  try {
    return new Intl.DateTimeFormat("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "America/Lima",
    }).format(new Date(dateString));
  } catch {
    return "—";
  }
}

export const TaskTypeLabels: Record<TaskType, string> = {
  [TaskType.Call]: "Llamada",
  [TaskType.Meeting]: "Reunión",
  [TaskType.Email]: "Correo",
  [TaskType.Visit]: "Visita",
  [TaskType.Other]: "Otro",
};

export { LeadCaptureSourceLabels, LeadStatusLabels };
