import { Banknote, CreditCard, DollarSign, Receipt } from "lucide-react";

export const getCurrencySymbol = (currency: string) => (currency === "DOLARES" ? "$" : "S/");

export const getPaymentMethodIcon = (method: string) => {
    switch (method) {
    case "CASH":
        return <Banknote className="h-4 w-4" />;
    case "CARD":
        return <CreditCard className="h-4 w-4" />;
    case "TRANSFER":
        return <Receipt className="h-4 w-4" />;
    default:
        return <DollarSign className="h-4 w-4" />;
    }
};

export const getPaymentMethodColor = (method: string) => {
    switch (method) {
    case "CASH":
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
    case "CARD":
        return "text-blue-600 bg-blue-50 border-blue-200";
    case "TRANSFER":
        return "text-purple-600 bg-purple-50 border-purple-200";
    default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
};
