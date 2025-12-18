import {
    Briefcase,
    Building,
    Calendar,
    Check,
    CheckCircle,
    Clock,
    Clock3,
    DollarSign,
    Facebook,
    Heart,
    RefreshCcw,
    Users,
    XCircle,
    XOctagon,
} from "lucide-react";

import { LeadCaptureSource, LeadCompletionReason, LeadStatus } from "../_types/lead";

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
    [LeadStatus.InFollowUp]: {
        label: "En seguimiento",
        icon: RefreshCcw,
        className: "text-blue-600 border-blue-200",
    },
    [LeadStatus.Completed]: {
        label: "Completado",
        icon: Check,
        className: "text-emerald-600 border-emerald-200",
    },
    [LeadStatus.Canceled]: {
        label: "Cancelado",
        icon: XCircle,
        className: "text-red-600 border-red-200",
    },
    [LeadStatus.Expired]: {
        label: "Expirado",
        icon: Calendar,
        className: "text-gray-600 border-gray-200",
    },
};

export const LeadCaptureSourceLabels: Record<
  LeadCaptureSource,
  {
    label: string;
    icon: React.ElementType;
    className: string;
  }
> = {
    [LeadCaptureSource.Company]: {
        label: "Empresa",
        icon: Building,
        className: "text-indigo-600 border-indigo-200",
    },
    [LeadCaptureSource.PersonalFacebook]: {
        label: "Facebook personal",
        icon: Facebook,
        className: "text-blue-600 border-blue-200",
    },
    [LeadCaptureSource.RealEstateFair]: {
        label: "Feria inmobiliaria",
        icon: Users,
        className: "text-orange-600 border-orange-200",
    },
    [LeadCaptureSource.Institutional]: {
        label: "Institucional",
        icon: Briefcase,
        className: "text-teal-600 border-teal-200",
    },
    [LeadCaptureSource.Loyalty]: {
        label: "Fidelización",
        icon: Heart,
        className: "text-pink-600 border-pink-200",
    },
};

export const LeadCompletionReasonLabels: Record<
  LeadCompletionReason,
  {
    label: string;
    icon: React.ElementType;
    className: string;
  }
> = {
    [LeadCompletionReason.NotInterested]: {
        label: "No interesado",
        icon: XOctagon,
        className: "text-red-600 border-red-200",
    },
    [LeadCompletionReason.InFollowUp]: {
        label: "En seguimiento",
        icon: Clock3,
        className: "text-blue-600 border-blue-200",
    },
    [LeadCompletionReason.Sale]: {
        label: "Venta concretada",
        icon: DollarSign,
        className: "text-green-600 border-green-200",
    },

};
