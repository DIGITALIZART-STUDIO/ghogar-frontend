import { cn } from "@/lib/utils";
import { ReservationStatusLabels, PaymentMethodLabels } from "./reservations.utils";

// Generar componentes de icono a partir de ReservationStatusLabels
const ReservationStatusIcons = Object.fromEntries(Object.entries(ReservationStatusLabels).map(([reservationStatus, config]) => {
    const IconComponent: React.FC<{ className?: string }> = ({ className }) => {
        const Icon = config.icon;
        return <Icon className={cn(className, config.className)} />;
    };
    return [reservationStatus, IconComponent];
}));

export const facetedFilters = [
    {
        // Filtro para el estado de la reserva
        column: "estado",
        title: "Estado",
        options: Object.entries(ReservationStatusLabels).map(([reservationStatus, config]) => ({
            label: config.label,
            value: reservationStatus,
            icon: ReservationStatusIcons[reservationStatus],
        })),
    },
    {
        // Filtro para el método de pago
        column: "método_pago",
        title: "Método de Pago",
        options: Object.entries(PaymentMethodLabels).map(([paymentMethod, label]) => ({
            label,
            value: paymentMethod,
        })),
    },
];
