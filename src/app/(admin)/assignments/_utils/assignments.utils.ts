import { CheckCircle, Clock } from "lucide-react";

import { LeadStatus } from "../../leads/_types/lead";

export const LeadStatusLabels: Record<
  LeadStatus,
  {
    label: string;
    icon: React.ElementType;
    className: string;
  }
> = {
    [LeadStatus.Registered]: {
        label: "Registrado",
        icon: Clock,
        className: "text-amber-600 border-amber-200",
    },
    [LeadStatus.Attended]: {
        label: "Atendido",
        icon: CheckCircle,
        className: "text-green-600 border-green-200",
    },
};

// Status configuration
export const statusConfig = {
    Registered: {
        color: "text-amber-500",
        bgColor: "bg-amber-50 dark:bg-amber-900/20",
        borderColor: "border-amber-200 dark:border-amber-800",
        icon: Clock,
        label: "Registrado",
    },
    Attended: {
        color: "text-green-500",
        bgColor: "bg-green-50 dark:bg-green-900/20",
        borderColor: "border-green-200 dark:border-green-800",
        icon: CheckCircle,
        label: "Atendido",
    },
    default: {
        color: "text-slate-500",
        bgColor: "bg-slate-50 dark:bg-slate-800/50",
        icon: Clock,
        borderColor: "border-slate-200 dark:border-slate-700",
        label: "Estado Desconocido",
    },
};
