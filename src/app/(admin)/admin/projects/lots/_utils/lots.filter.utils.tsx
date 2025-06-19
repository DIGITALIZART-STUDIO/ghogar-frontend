import { CheckCircle2, Clock, FileText, Package } from "lucide-react";

import { LotStatus } from "../_types/lot";

export const LotStatusConfig: Record<
  LotStatus,
  {
    label: string;
    icon: React.ElementType;
    className: string;
    bgClassName: string;
    borderClassName: string;
    textClassName: string;
    dotClassName: string;
    badgeClassName: string;
  }
> = {
    [LotStatus.Available]: {
        label: "Disponible",
        icon: Package,
        className:
      "text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950",
        bgClassName: "bg-emerald-50 dark:bg-emerald-950",
        borderClassName: "border-emerald-200 dark:border-emerald-800",
        textClassName: "text-emerald-700 dark:text-emerald-300",
        dotClassName: "bg-emerald-500 dark:bg-emerald-400",
        badgeClassName:
      "bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800",
    },
    [LotStatus.Quoted]: {
        label: "Cotizado",
        icon: FileText,
        className:
      "text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950",
        bgClassName: "bg-amber-50 dark:bg-amber-950",
        borderClassName: "border-amber-200 dark:border-amber-800",
        textClassName: "text-amber-700 dark:text-amber-300",
        dotClassName: "bg-amber-500 dark:bg-amber-400",
        badgeClassName:
      "bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800",
    },
    [LotStatus.Reserved]: {
        label: "Reservado",
        icon: Clock,
        className: "text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950",
        bgClassName: "bg-blue-50 dark:bg-blue-950",
        borderClassName: "border-blue-200 dark:border-blue-800",
        textClassName: "text-blue-700 dark:text-blue-300",
        dotClassName: "bg-blue-500 dark:bg-blue-400",
        badgeClassName:
      "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800",
    },
    [LotStatus.Sold]: {
        label: "Vendido",
        icon: CheckCircle2,
        className: "text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900",
        bgClassName: "bg-gray-50 dark:bg-gray-900",
        borderClassName: "border-gray-200 dark:border-gray-700",
        textClassName: "text-gray-700 dark:text-gray-300",
        dotClassName: "bg-gray-500 dark:bg-gray-400",
        badgeClassName:
      "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700",
    },
};

// Función helper para obtener la configuración de un status
export const getLotStatusConfig = (status: LotStatus) => LotStatusConfig[status];

// Función helper para obtener todos los status disponibles
export const getAllLotStatuses = () => Object.values(LotStatus);

// Función helper para obtener el label de un status
export const getLotStatusLabel = (status: LotStatus) => LotStatusConfig[status].label;
