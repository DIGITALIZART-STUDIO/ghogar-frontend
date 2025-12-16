import { CheckCircle, FileText, XCircle } from "lucide-react";

import { QuotationStatus } from "../../quotation/_types/quotation";

export const QuotationStatusLabels: Record<
  QuotationStatus,
  {
    label: string;
    icon: React.ElementType;
    className: string;
  }
> = {
    [QuotationStatus.ACCEPTED]: {
        label: "Aceptada",
        icon: CheckCircle,
        className: "text-green-700 border-green-200 bg-green-50",
    },
    [QuotationStatus.CANCELED]: {
        label: "Cancelada",
        icon: XCircle,
        className: "text-red-700 border-red-200 bg-red-50",
    },
    [QuotationStatus.ISSUED]: {
        label: "Emitida",
        icon: FileText,
        className: "text-blue-700 border-blue-200 bg-blue-50",
    },
};

// Función para formatear moneda
export const formatCurrency = (amount: number, currency: string = "PEN"): string => {
    const currencySymbols: Record<string, string> = {
        PEN: "S/",
        USD: "$",
        EUR: "€"
    };

    const symbol = currencySymbols[currency] || currency;
    return `${symbol} ${amount.toLocaleString("es-PE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
};

// Función para formatear fechas
export const formatDate = (dateString?: string): string => {
    if (!dateString) {
        return "No definida";
    }

    const date = new Date(dateString);
    return date.toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
};

// Función para verificar si una cotización está próxima a vencer
export const isQuotationExpiringSoon = (validUntil?: string): boolean => {
    if (!validUntil) {
        return false;
    }

    const expiryDate = new Date(validUntil);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
};

// Función para obtener días restantes hasta vencimiento
export const getDaysUntilExpiry = (validUntil?: string): number => {
    if (!validUntil) {
        return -1;
    }

    const expiryDate = new Date(validUntil);
    const today = new Date();
    return Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

// Función para obtener el color del precio basado en el monto
export const getPriceColorClass = (price: number): string => {
    if (price >= 100000) {
        return "text-purple-600";
    }
    if (price >= 50000) {
        return "text-blue-600";
    }
    if (price >= 25000) {
        return "text-green-600";
    }
    return "text-slate-600";
};

