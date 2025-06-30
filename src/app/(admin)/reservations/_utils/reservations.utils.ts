import { FileText, Ban, CheckCircle } from "lucide-react";

import { ReservationStatus, Currency, PaymentMethod } from "../_types/reservation";

export const ReservationStatusLabels: Record<
    ReservationStatus,
    {
        label: string;
        icon: React.ElementType;
        className: string;
    }
> = {
    [ReservationStatus.ISSUED]: {
        label: "Emitida",
        icon: FileText,
        className: "text-blue-700 border-blue-200",
    },
    [ReservationStatus.CANCELED]: {
        label: "Cancelado",
        icon: CheckCircle,
        className: "text-green-700 border-green-200",
    },
    [ReservationStatus.ANULATED]: {
        label: "Anulado",
        icon: Ban,
        className: "text-red-700 border-red-200",
    },
};

export const CurrencyLabels: Record<Currency, string> = {
    [Currency.SOLES]: "Soles (S/)",
    [Currency.DOLARES]: "Dólares ($)",
};

export const PaymentMethodLabels: Record<PaymentMethod, string> = {
    [PaymentMethod.CASH]: "Efectivo",
    [PaymentMethod.BANK_DEPOSIT]: "Depósito bancario",
    [PaymentMethod.BANK_TRANSFER]: "Transferencia bancaria",
};
