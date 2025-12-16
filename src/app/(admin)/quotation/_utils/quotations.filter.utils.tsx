import { AlertCircle, CheckCircle, FileText, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { QuotationStatus } from "../_types/quotation";
import { QuotationStatusLabels } from "./quotations.utils";

// Generar componentes de icono a partir de CustomerMaritalStatusLabels
const QuotationStatusIcons = Object.fromEntries(Object.entries(QuotationStatusLabels).map(([quotationStatus, config]) => {
    const IconComponent: React.FC<{ className?: string }> = ({ className }) => {
        const Icon = config.icon;
        return <Icon className={cn(className, config.className)} />;
    };
    return [quotationStatus, IconComponent];
}));

// Función para crear filtros faceted con callbacks del servidor
export const createFacetedFilters = (
    onStatusChange: (values: Array<string>) => void,
    currentStatus: Array<string> = []
) => [
    {
        column: "estado",
        title: "Estado",
        options: Object.entries(QuotationStatusLabels).map(([quotationStatus, config]) => ({
            label: config.label,
            value: quotationStatus,
            icon: QuotationStatusIcons[quotationStatus],
        })),
        onFilterChange: onStatusChange,
        currentValue: currentStatus,
    },
];

export const getStatusDetails = (status: QuotationStatus) => {
    switch (status) {
    case QuotationStatus.ISSUED:
        return {
            label: "Emitida",
            icon: <FileText className="h-5 w-5" />, // Cambiado de Clock a FileText
            color: "bg-blue-100 text-blue-700", // Ajustado para coincidir con "text-blue-700 border-blue-200"
            description: "La cotización ha sido emitida y está pendiente de respuesta.",
        };
    case QuotationStatus.ACCEPTED:
        return {
            label: "Aceptada",
            icon: <CheckCircle className="h-5 w-5" />, // Se mantiene
            color: "bg-green-100 text-green-700", // Ajustado para coincidir con "text-green-700 border-green-200"
            description: "La cotización ha sido aceptada por el cliente.",
        };
    case QuotationStatus.CANCELED:
        return {
            label: "Cancelada",
            icon: <XCircle className="h-5 w-5" />, // Se mantiene
            color: "bg-red-100 text-red-700", // Ajustado para coincidir con "text-red-700 border-red-200"
            description: "La cotización ha sido cancelada.",
        };
    default:
        return {
            label: "Desconocido",
            icon: <AlertCircle className="h-5 w-5" />,
            color: "bg-gray-100 text-gray-700", // Adaptado al estilo general
            description: "Estado desconocido.",
        };
    }
};
