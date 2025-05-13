import { cn } from "@/lib/utils";
import { SummaryQuotation } from "../_types/quotation";
import { Identifier } from "../../leads/_utils/leads.filter.utils";
import { QuotationStatusLabels } from "./quotations.utils";

// Generar componentes de icono a partir de CustomerMaritalStatusLabels
const QuotationStatusIcons = Object.fromEntries(Object.entries(QuotationStatusLabels).map(([quotationStatus, config]) => {
    const IconComponent: React.FC<{ className?: string }> = ({ className }) => {
        const Icon = config.icon;
        return <Icon className={cn(className, config.className)} />;
    };
    return [quotationStatus, IconComponent];
}));

// Función para extraer identificadores únicos (DNI o RUC) de las cotizaciones
export const getUniqueIdentifiers = (quotations: Array<SummaryQuotation>): Array<Identifier> => {
    const identifiers: Array<Identifier> = [];

    // Extraer identificadores
    quotations.forEach((quotation) => {
        if (quotation?.clientIdentification && quotation?.clientIdentificationType === "DNI") {
            identifiers.push({
                value: quotation.clientIdentification,
                type: "DNI",
            });
        }

        if (quotation?.clientIdentification && quotation?.clientIdentificationType === "RUC") {
            identifiers.push({
                value: quotation.clientIdentification,
                type: "RUC",
            });
        }
    });

    // Eliminar duplicados (por valor y tipo)
    return identifiers.filter((identifier, index, self) => index === self.findIndex((i) => i.value === identifier.value && i.type === identifier.type));
};

export const facetedFilters = [
    {
    // Filtro para el estado de la cotización
        column: "estado",
        title: "Estado",
        options: Object.entries(QuotationStatusLabels).map(([quotationStatus, config]) => ({
            label: config.label,
            value: quotationStatus,
            icon: QuotationStatusIcons[quotationStatus],
        })),
    },
];
