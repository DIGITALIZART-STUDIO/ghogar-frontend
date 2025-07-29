import { Building2, User } from "lucide-react";

import { ClientTypes } from "../_types/client";

export const ClientTypesLabels: Record<
  ClientTypes,
  {
    label: string;
    icon: React.ElementType;
    className: string;
  }
> = {
    [ClientTypes.Natural]: {
        label: "Cliente Natural",
        icon: User,
        className: "text-blue-700 border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800",
    },
    [ClientTypes.Juridico]: {
        label: "Cliente Jurídico",
        icon: Building2,
        className: "text-green-700 border-green-200 bg-green-50 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800",
    },
};
