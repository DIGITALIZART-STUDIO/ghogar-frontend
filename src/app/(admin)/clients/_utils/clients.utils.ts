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
        className: "text-blue-700 border-blue-200",
    },
    [ClientTypes.Juridico]: {
        label: "Cliente Jurídico",
        icon: Building2,
        className: "text-green-700 border-green-200",
    },
};
