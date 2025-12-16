import { Calendar, Check, CheckCircle, Clock, RefreshCcw, XCircle } from "lucide-react";

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
    [LeadStatus.InFollowUp]: {
        label: "En seguimiento",
        icon: RefreshCcw,
        className: "text-blue-600 border-blue-200",
    },
    [LeadStatus.Completed]: {
        label: "Completado",
        icon: Check,
        className: "text-emerald-600 border-emerald-200",
    },
    [LeadStatus.Canceled]: {
        label: "Cancelado",
        icon: XCircle,
        className: "text-red-600 border-red-200",
    },
    [LeadStatus.Expired]: {
        label: "Expirado",
        icon: Calendar,
        className: "text-gray-600 border-gray-200",
    },
};

// Status configuration
export const statusConfig = {
    [LeadStatus.Registered]: {
        color: "text-amber-500",
        bgColor: "bg-amber-50 dark:bg-amber-900/20",
        borderColor: "border-amber-200 dark:border-amber-800",
        icon: Clock,
        label: "Registrado",
    },
    [LeadStatus.Attended]: {
        color: "text-green-500",
        bgColor: "bg-green-50 dark:bg-green-900/20",
        borderColor: "border-green-200 dark:border-green-800",
        icon: CheckCircle,
        label: "Atendido",
    },
    [LeadStatus.InFollowUp]: {
        color: "text-blue-500",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        borderColor: "border-blue-200 dark:border-blue-800",
        icon: RefreshCcw,
        label: "En seguimiento",
    },
    [LeadStatus.Completed]: {
        color: "text-emerald-500",
        bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
        borderColor: "border-emerald-200 dark:border-emerald-800",
        icon: Check,
        label: "Completado",
    },
    [LeadStatus.Canceled]: {
        color: "text-red-500",
        bgColor: "bg-red-50 dark:bg-red-900/20",
        borderColor: "border-red-200 dark:border-red-800",
        icon: XCircle,
        label: "Cancelado",
    },
    [LeadStatus.Expired]: {
        color: "text-gray-500",
        bgColor: "bg-gray-50 dark:bg-gray-900/20",
        borderColor: "border-gray-200 dark:border-gray-800",
        icon: Calendar,
        label: "Expirado",
    },
    default: {
        color: "text-slate-500",
        bgColor: "bg-slate-50 dark:bg-slate-800/50",
        icon: Clock,
        borderColor: "border-slate-200 dark:border-slate-700",
        label: "Estado Desconocido",
    },
};
