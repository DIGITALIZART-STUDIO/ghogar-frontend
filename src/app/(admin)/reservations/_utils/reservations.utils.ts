import { Ban, Banknote, CheckCircle, CreditCard, DollarSign, FileText } from "lucide-react";

import { Currency, PaymentMethod, ReservationStatus } from "../_types/reservation";

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

export const PaymentMethodLabels: Record<
  PaymentMethod,
  {
    label: string;
    icon: React.ElementType;
    className: string;
  }
> = {
    [PaymentMethod.CASH]: {
        label: "Efectivo",
        icon: DollarSign,
        className: "text-green-700 border-green-200",
    },
    [PaymentMethod.BANK_DEPOSIT]: {
        label: "Depósito bancario",
        icon: Banknote,
        className: "text-blue-700 border-blue-200",
    },
    [PaymentMethod.BANK_TRANSFER]: {
        label: "Transferencia bancaria",
        icon: CreditCard,
        className: "text-purple-700 border-purple-200",
    },
};
