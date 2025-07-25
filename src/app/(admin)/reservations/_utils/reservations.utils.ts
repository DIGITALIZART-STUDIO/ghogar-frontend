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
    description: string;
    icon: React.ElementType;
    iconClass: string;
    bgClass: string;
    className: string;
  }
> = {
    [PaymentMethod.CASH]: {
        label: "Efectivo",
        description: "Pago en efectivo",
        icon: DollarSign,
        iconClass: "text-green-700",
        bgClass: "bg-green-100",
        className: "text-green-700 border-green-200",
    },
    [PaymentMethod.BANK_DEPOSIT]: {
        label: "Depósito bancario",
        description: "Depósito en cuenta bancaria",
        icon: Banknote,
        iconClass: "text-blue-700",
        bgClass: "bg-blue-100",
        className: "text-blue-700 border-blue-200",
    },
    [PaymentMethod.BANK_TRANSFER]: {
        label: "Transferencia bancaria",
        description: "Transferencia entre bancos",
        icon: CreditCard,
        iconClass: "text-purple-700",
        bgClass: "bg-purple-100",
        className: "text-purple-700 border-purple-200",
    },
};
