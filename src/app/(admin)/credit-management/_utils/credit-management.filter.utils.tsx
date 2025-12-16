import { cn } from "@/lib/utils";
import {
    ReservationStatusLabels,
    PaymentMethodLabels,
    ContractValidationStatusLabels
} from "../../reservations/_utils/reservations.utils";

// Generar componentes de icono a partir de ReservationStatusLabels
const ReservationStatusIcons = Object.fromEntries(Object.entries(ReservationStatusLabels).map(([status, config]) => {
    const IconComponent: React.FC<{ className?: string }> = ({ className }) => {
        const Icon = config.icon;
        return <Icon className={cn(className, config.className)} />;
    };
    return [status, IconComponent];
}));

// Generar componentes de icono a partir de PaymentMethodLabels
const PaymentMethodIcons = Object.fromEntries(Object.entries(PaymentMethodLabels).map(([method, config]) => {
    const IconComponent: React.FC<{ className?: string }> = ({ className }) => {
        const Icon = config.icon;
        return <Icon className={cn(className, config.className)} />;
    };
    return [method, IconComponent];
}));

// Generar componentes de icono a partir de ContractValidationStatusLabels
const ContractValidationStatusIcons = Object.fromEntries(Object.entries(ContractValidationStatusLabels).map(([status, config]) => {
    const IconComponent: React.FC<{ className?: string }> = ({ className }) => {
        const Icon = config.icon;
        return <Icon className={cn(className, config.className)} />;
    };
    return [status, IconComponent];
}));

// Función para crear filtros faceted con callbacks del servidor
export const createPendingContractsFacetedFilters = (
    onStatusChange: (values: Array<string>) => void,
    onPaymentMethodChange: (values: Array<string>) => void,
    onContractValidationStatusChange: (values: Array<string>) => void,
    currentStatus: Array<string> = [],
    currentPaymentMethod: Array<string> = [],
    currentContractValidationStatus: Array<string> = []
) => [
    {
        column: "estado",
        title: "Estado",
        options: Object.entries(ReservationStatusLabels).map(([status, config]) => ({
            label: config.label,
            value: status,
            icon: ReservationStatusIcons[status],
        })),
        onFilterChange: onStatusChange,
        currentValue: currentStatus,
    },
    {
        column: "método pago",
        title: "Método de Pago",
        options: Object.entries(PaymentMethodLabels).map(([method, config]) => ({
            label: config.label,
            value: method,
            icon: PaymentMethodIcons[method],
        })),
        onFilterChange: onPaymentMethodChange,
        currentValue: currentPaymentMethod,
    },
    {
        column: "validación contrato",
        title: "Validación Contrato",
        options: Object.entries(ContractValidationStatusLabels).map(([status, config]) => ({
            label: config.label,
            value: status,
            icon: ContractValidationStatusIcons[status],
        })),
        onFilterChange: onContractValidationStatusChange,
        currentValue: currentContractValidationStatus,
    },
];

