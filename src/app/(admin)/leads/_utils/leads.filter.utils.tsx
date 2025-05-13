import { AlertTriangle, CheckCircle, CheckCircle2, Clock, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Lead, LeadStatus } from "../_types/lead";
import { LeadStatusLabels } from "./leads.utils";

// Componentes de icono con estilos integrados
const ActiveIcon: React.FC<{ className?: string }> = ({ className }) => (
    <CheckCircle2 className={cn(className, "text-emerald-500")} />
);

const InactiveIcon: React.FC<{ className?: string }> = ({ className }) => (
    <XCircle className={cn(className, "text-red-500")} />
);

// Generar componentes de icono a partir de CustomerMaritalStatusLabels
const LeadStatusIcons = Object.fromEntries(Object.entries(LeadStatusLabels).map(([leadStatus, config]) => {
    const IconComponent: React.FC<{ className?: string }> = ({ className }) => {
        const Icon = config.icon;
        return <Icon className={cn(className, config.className)} />;
    };
    return [leadStatus, IconComponent];
}));

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
    return identifiers.filter((identifier, index, self) => index === self.findIndex((i) => i.value === identifier.value && i.type === identifier.type));
};

export const facetedFilters = [
    {
        column: "estado",
        title: "Estado",
        options: [
            {
                label: "Activo",
                value: true,
                icon: ActiveIcon,
            },
            {
                label: "Inactivo",
                value: false,
                icon: InactiveIcon,
            },
        ],
    },
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
    switch (status) {
    case LeadStatus.Registered:
        return {
            label: "Registrado",
            icon: <Clock className="h-5 w-5" />, // Cambiado a Clock para coincidir con LeadStatusLabels
            color: "bg-amber-100 text-amber-600", // Adaptado para coincidir con "text-amber-600 border-amber-200"
            description: "El lead está registrado pero aún no ha sido atendido.",
        };
    case LeadStatus.Attended:
        return {
            label: "Atendido",
            icon: <CheckCircle className="h-5 w-5" />, // Cambiado a CheckCircle para coincidir con LeadStatusLabels
            color: "bg-green-100 text-green-600", // Adaptado para coincidir con "text-green-600 border-green-200"
            description: "El lead ha sido atendido por un asesor.",
        };
    default:
        return {
            label: "Desconocido",
            icon: <AlertTriangle className="h-5 w-5" />,
            color: "bg-gray-100 text-gray-700", // Color por defecto
            description: "Estado desconocido.",
        };
    }
};
