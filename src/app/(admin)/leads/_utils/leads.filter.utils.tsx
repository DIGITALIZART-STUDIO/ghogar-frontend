import { AlertTriangle, Check, Clock, TrendingUp, UserX, XCircle} from "lucide-react";

import { cn } from "@/lib/utils";
import { Lead, LeadCompletionReason, LeadStatus } from "../_types/lead";
import { LeadStatusLabels } from "./leads.utils";

// Generar componentes de icono a partir de CustomerMaritalStatusLabels
const LeadStatusIcons = Object.fromEntries(
    Object.entries(LeadStatusLabels).map(([leadStatus, config]) => {
        const IconComponent: React.FC<{ className?: string }> = ({ className }) => {
            const Icon = config.icon;
            return <Icon className={cn(className, config.className)} />;
        };
        return [leadStatus, IconComponent];
    })
);

// Definición de la interfaz Identifier
export interface Identifier {
  value: string;
  type: "DNI" | "RUC";
}

// Función para extraer identificadores únicos (DNI o RUC) de los leads
export const getUniqueIdentifiers = (leads: Array<Lead>): Array<Identifier> => {
    const identifiers: Array<Identifier> = [];

    // Extraer DNIs
    leads.forEach((lead) => {
        if (lead?.client?.dni) {
            identifiers.push({
                value: lead.client.dni,
                type: "DNI",
            });
        }

        if (lead?.client?.ruc) {
            identifiers.push({
                value: lead.client.ruc,
                type: "RUC",
            });
        }
    });

    // Eliminar duplicados (por valor y tipo)
    return identifiers.filter(
        (identifier, index, self) => index === self.findIndex((i) => i.value === identifier.value && i.type === identifier.type)
    );
};

export const facetedFilters = [
    {
    // Filtro para el estado civil generado dinámicamente
        column: "seguimiento",
        title: "Seguimiento",
        options: Object.entries(LeadStatusLabels).map(([leadStatus, config]) => ({
            label: config.label,
            value: leadStatus,
            icon: LeadStatusIcons[leadStatus],
        })),
    },
];

export const getStatusDetails = (status: LeadStatus) => {
    const config = LeadStatusLabels[status];
    if (config) {
        return {
            label: config.label,
            icon: <config.icon className={`h-5 w-5 ${config.className}`} />,
            color: config.className.replace("text-", "bg-").replace(" border-", " text-"),
            description: getStatusDescription(status),
        };
    }
    return {
        label: "Desconocido",
        icon: <AlertTriangle className="h-5 w-5 text-gray-700" />,
        color: "bg-gray-100 text-gray-700",
        description: "Estado desconocido.",
    };
};

// Descripciones por estado
const getStatusDescription = (status: LeadStatus): string => {
    switch (status) {
    case LeadStatus.Registered:
        return "El lead está registrado pero aún no ha sido atendido.";
    case LeadStatus.Attended:
        return "El lead ha sido atendido por un asesor.";
    case LeadStatus.InFollowUp:
        return "El lead está en proceso de seguimiento.";
    case LeadStatus.Completed:
        return "El proceso con el lead ha sido completado.";
    case LeadStatus.Canceled:
        return "El lead ha sido cancelado.";
    case LeadStatus.Expired:
        return "El lead ha expirado.";
    default:
        return "Estado desconocido.";
    }
};

export const statusOptions = [
    {
        value: LeadStatus.Registered,
        label: "Registrado",
        description: "Lead pendiente de atención",
        icon: Clock,
        color: "bg-blue-50 border-blue-200 hover:bg-blue-100 dark:bg-blue-900 dark:border-blue-700 dark:hover:bg-blue-800",
        iconColor: "text-blue-600 dark:text-blue-300",
        badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    },
    {
        value: LeadStatus.Completed,
        label: "Completado",
        description: "Lead procesado exitosamente",
        icon: Check,
        color: "bg-green-50 border-green-200 hover:bg-green-100 dark:bg-green-900 dark:border-green-700 dark:hover:bg-green-800",
        iconColor: "text-green-600 dark:text-green-300",
        badgeColor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    },
    {
        value: LeadStatus.Canceled,
        label: "Cancelado",
        description: "Lead cancelado o descartado",
        icon: XCircle,
        color: "bg-red-50 border-red-200 hover:bg-red-100 dark:bg-red-900 dark:border-red-700 dark:hover:bg-red-800",
        iconColor: "text-red-600 dark:text-red-300",
        badgeColor: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    },
];

export const reasonOptions = [
    {
        value: LeadCompletionReason.Sale,
        label: "Venta",
        description: "Se concretó la venta exitosamente",
        icon: TrendingUp,
        color: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900 dark:border-emerald-700 dark:hover:bg-emerald-800",
        iconColor: "text-emerald-600 dark:text-emerald-300",
    },
    {
        value: LeadCompletionReason.NotInterested,
        label: "No Interesado",
        description: "El cliente no mostró interés",
        icon: UserX,
        color: "bg-orange-50 border-orange-200 hover:bg-orange-100 dark:bg-orange-900 dark:border-orange-700 dark:hover:bg-orange-800",
        iconColor: "text-orange-600 dark:text-orange-300",
    },
];
