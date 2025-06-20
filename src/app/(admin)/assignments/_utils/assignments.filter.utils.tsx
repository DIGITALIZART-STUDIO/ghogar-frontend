import { cn } from "@/lib/utils";
import { Lead } from "../../leads/_types/lead";
import { Identifier } from "../../leads/_utils/leads.filter.utils";
import { LeadStatusLabels } from "./assignments.utils";

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
