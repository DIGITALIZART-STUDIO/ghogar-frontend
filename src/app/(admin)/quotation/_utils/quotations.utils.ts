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
        className: "text-green-700 border-green-200",
    },
    [QuotationStatus.CANCELED]: {
        label: "Cancelada",
        icon: XCircle,
        className: "text-red-700 border-red-200",
    },
    [QuotationStatus.ISSUED]: {
        label: "Emitida",
        icon: FileText,
        className: "text-blue-700 border-blue-200",
    },
};
