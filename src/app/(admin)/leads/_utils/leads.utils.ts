import { CheckCircle, Clock } from "lucide-react";

import { LeadStatus } from "../_types/lead";

export const LeadStatusLabels: Record<
  LeadStatus,
  {
    label: string;
    icon: React.ElementType;
    className: string;
  }
> = {
    [LeadStatus.Registered]: {
        label: "Registrado",
        icon: Clock,
        className: "text-amber-600 border-amber-200",
    },
    [LeadStatus.Attended]: {
        label: "Atendido",
        icon: CheckCircle,
        className: "text-green-600 border-green-200",
    },
};
