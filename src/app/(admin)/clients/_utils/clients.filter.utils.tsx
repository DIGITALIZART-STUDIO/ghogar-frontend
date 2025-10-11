import { CheckCircle2, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { ClientTypesLabels } from "./clients.utils";

// Componentes de icono con estilos integrados
const ActiveIcon: React.FC<{ className?: string }> = ({ className }) => (
    <CheckCircle2 className={cn(className, "text-emerald-500")} />
);

const InactiveIcon: React.FC<{ className?: string }> = ({ className }) => (
    <XCircle className={cn(className, "text-red-500")} />
);

// Generar componentes de icono a partir de CustomerMaritalStatusLabels
const ClientTypesIcons = Object.fromEntries(Object.entries(ClientTypesLabels).map(([clientTypes, config]) => {
    const IconComponent: React.FC<{ className?: string }> = ({ className }) => {
        const Icon = config.icon;
        return <Icon className={cn(className, config.className)} />;
    };
    return [clientTypes, IconComponent];
}));

// Función para crear faceted filters con callbacks del servidor
export const createFacetedFilters = (
    onIsActiveChange: (values: Array<boolean>) => void,
    onTypeChange: (values: Array<string>) => void,
    currentIsActive: Array<boolean> = [],
    currentType: Array<string> = []
) => [
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
        onFilterChange: onIsActiveChange,
        currentValue: currentIsActive,
    },
    {
        column: "tipo",
        title: "Tipo de Cliente",
        options: Object.entries(ClientTypesLabels).map(([clientTypes, config]) => ({
            label: config.label,
            value: clientTypes,
            icon: ClientTypesIcons[clientTypes],
        })),
        onFilterChange: onTypeChange,
        currentValue: currentType,
    },
];

// Filtros estáticos para compatibilidad
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
        column: "tipo",
        title: "Tipo de Cliente",
        options: Object.entries(ClientTypesLabels).map(([clientTypes, config]) => ({
            label: config.label,
            value: clientTypes,
            icon: ClientTypesIcons[clientTypes],
        })),
    },
];
