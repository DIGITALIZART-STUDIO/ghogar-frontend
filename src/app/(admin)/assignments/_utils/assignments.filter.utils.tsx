import { cn } from "@/lib/utils";
import { Lead } from "../../leads/_types/lead";
import { Identifier } from "../../leads/_utils/leads.filter.utils";
import { LeadStatusLabels } from "./assignments.utils";

// Procedency configuration
export const procedencyConfig = {
    facebook: {
        color: "text-blue-500",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    instagram: {
        color: "text-pink-500",
        bgColor: "bg-pink-50 dark:bg-pink-900/20",
    },
    messenger: {
        color: "text-indigo-500",
        bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    },
    whatsapp: {
        color: "text-emerald-500",
        bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    email: {
        color: "text-amber-500",
        bgColor: "bg-amber-50 dark:bg-amber-900/20",
    },
    call: {
        color: "text-cyan-500",
        bgColor: "bg-cyan-50 dark:bg-cyan-900/20",
    },
    website: {
        color: "text-violet-500",
        bgColor: "bg-violet-50 dark:bg-violet-900/20",
    },
    default: {
        color: "text-slate-500",
        bgColor: "bg-slate-50 dark:bg-slate-800/50",
    },
};

// Generar componentes de icono a partir de CustomerMaritalStatusLabels
const LeadStatusIcons = Object.fromEntries(Object.entries(LeadStatusLabels).map(([leadStatus, config]) => {
    const IconComponent: React.FC<{ className?: string }> = ({ className }) => {
        const Icon = config.icon;
        return <Icon className={cn(className, config.className)} />;
    };
    return [leadStatus, IconComponent];
}));

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

