import { Ban, Banknote, CheckCircle, Clock, CreditCard, DollarSign, FileText, ShieldCheck, ShieldX } from "lucide-react";

import { ContractValidationStatus, Currency, PaymentMethod, ReservationStatus } from "../_types/reservation";

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
        className: "text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    },
    [ReservationStatus.CANCELED]: {
        label: "Cancelado",
        icon: CheckCircle,
        className: "text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
    },
    [ReservationStatus.ANULATED]: {
        label: "Anulado",
        icon: Ban,
        className: "text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
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

export const ContractValidationStatusLabels: Record<
  ContractValidationStatus,
  {
    label: string;
    icon: React.ElementType;
    className: string;
  }
> = {
    [ContractValidationStatus.None]: {
        label: "Sin estado",
        icon: ShieldX,
        className: "text-gray-500 border-gray-200",
    },
    [ContractValidationStatus.PendingValidation]: {
        label: "Pendiente de validación",
        icon: Clock,
        className: "text-amber-600 border-amber-200",
    },
    [ContractValidationStatus.Validated]: {
        label: "Validado",
        icon: ShieldCheck,
        className: "text-green-600 border-green-200",
    },
};
