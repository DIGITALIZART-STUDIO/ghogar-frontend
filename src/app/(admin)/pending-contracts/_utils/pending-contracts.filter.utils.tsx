import { cn } from "@/lib/utils";
import { ReservationStatusLabels, PaymentMethodLabels, ContractValidationStatusLabels } from "../../reservations/_utils/reservations.utils";

// Generar componentes de icono a partir de ReservationStatusLabels
const ReservationStatusIcons = Object.fromEntries(Object.entries(ReservationStatusLabels).map(([reservationStatus, config]) => {
    const IconComponent: React.FC<{ className?: string }> = ({ className }) => {
        const Icon = config.icon;
        return <Icon className={cn(className, config.className)} />;
    };
    return [reservationStatus, IconComponent];
}));

// Generar componentes de icono a partir de PaymentMethodLabels
const PaymentMethodIcons = Object.fromEntries(Object.entries(PaymentMethodLabels).map(([paymentMethod, config]) => {
    const IconComponent: React.FC<{ className?: string }> = ({ className }) => {
        const Icon = config.icon;
        return <Icon className={cn(className, config.className)} />;
    };
    return [paymentMethod, IconComponent];
}));

// Generar componentes de icono a partir de ContractValidationStatusLabels
const ContractValidationStatusIcons = Object.fromEntries(Object.entries(ContractValidationStatusLabels).map(([contractValidationStatus, config]) => {
    const IconComponent: React.FC<{ className?: string }> = ({ className }) => {
        const Icon = config.icon;
        return <Icon className={cn(className, config.className)} />;
    };
    return [contractValidationStatus, IconComponent];
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
        column: "estado_reserva",
        title: "Estado Reserva",
        options: Object.entries(ReservationStatusLabels).map(([reservationStatus, config]) => ({
            label: config.label,
            value: reservationStatus,
            icon: ReservationStatusIcons[reservationStatus],
        })),
        onFilterChange: onStatusChange,
        currentValue: currentStatus,
    },
    {
        column: "método pago",
        title: "Método de Pago",
        options: Object.entries(PaymentMethodLabels).map(([paymentMethod, config]) => ({
            label: config.label,
            value: paymentMethod,
            icon: PaymentMethodIcons[paymentMethod],
        })),
        onFilterChange: onPaymentMethodChange,
        currentValue: currentPaymentMethod,
    },
    {
        column: "estado_validacion",
        title: "Estado de Validación",
        options: Object.entries(ContractValidationStatusLabels).map(([contractValidationStatus, config]) => ({
            label: config.label,
            value: contractValidationStatus,
            icon: ContractValidationStatusIcons[contractValidationStatus],
        })),
        onFilterChange: onContractValidationStatusChange,
        currentValue: currentContractValidationStatus,
    },
];
