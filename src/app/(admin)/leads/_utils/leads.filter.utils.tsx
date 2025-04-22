import { CheckCircle2, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Lead } from "../_types/lead";
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
