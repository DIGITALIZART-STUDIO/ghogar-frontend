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
    className: "text-amber-600 border-amber-200 dark:text-amber-400 dark:border-amber-700",
  },
  [LeadStatus.Attended]: {
    label: "Atendido",
    icon: CheckCircle,
    className: "text-green-600 border-green-200 dark:text-green-400 dark:border-green-700",
  },
  [LeadStatus.InFollowUp]: {
    label: "En seguimiento",
    icon: RefreshCcw,
    className: "text-blue-600 border-blue-200 dark:text-blue-400 dark:border-blue-700",
  },
  [LeadStatus.Completed]: {
    label: "Completado",
    icon: Check,
    className: "text-emerald-600 border-emerald-200 dark:text-emerald-400 dark:border-emerald-700",
  },
  [LeadStatus.Canceled]: {
    label: "Cancelado",
    icon: XCircle,
    className: "text-red-600 border-red-200 dark:text-red-400 dark:border-red-700",
  },
  [LeadStatus.Expired]: {
    label: "Expirado",
    icon: Calendar,
    className: "text-gray-600 border-gray-200 dark:text-gray-400 dark:border-gray-600",
  },
};

export const LeadCaptureSourceLabels: Record<
  LeadCaptureSource,
  {
    label: string;
    icon: React.ElementType;
    className: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
  }
> = {
  [LeadCaptureSource.Company]: {
    label: "Empresa",
    icon: Building,
    className: "text-indigo-600 border-indigo-200 dark:text-indigo-400 dark:border-indigo-700",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/50",
    borderColor: "border-indigo-200 dark:border-indigo-700",
    textColor: "text-indigo-600 dark:text-indigo-400",
  },
  [LeadCaptureSource.PersonalFacebook]: {
    label: "Facebook personal",
    icon: Facebook,
    className: "text-blue-600 border-blue-200 dark:text-blue-400 dark:border-blue-700",
    bgColor: "bg-blue-50 dark:bg-blue-950/50",
    borderColor: "border-blue-200 dark:border-blue-700",
    textColor: "text-blue-600 dark:text-blue-400",
  },
  [LeadCaptureSource.RealEstateFair]: {
    label: "Feria inmobiliaria",
    icon: Users,
    className: "text-orange-600 border-orange-200 dark:text-orange-400 dark:border-orange-700",
    bgColor: "bg-orange-50 dark:bg-orange-950/50",
    borderColor: "border-orange-200 dark:border-orange-700",
    textColor: "text-orange-600 dark:text-orange-400",
  },
  [LeadCaptureSource.Institutional]: {
    label: "Institucional",
    icon: Briefcase,
    className: "text-teal-600 border-teal-200 dark:text-teal-400 dark:border-teal-700",
    bgColor: "bg-teal-50 dark:bg-teal-950/50",
    borderColor: "border-teal-200 dark:border-teal-700",
    textColor: "text-teal-600 dark:text-teal-400",
  },
  [LeadCaptureSource.Loyalty]: {
    label: "Fidelización",
    icon: Heart,
    className: "text-pink-600 border-pink-200 dark:text-pink-400 dark:border-pink-700",
    bgColor: "bg-pink-50 dark:bg-pink-950/50",
    borderColor: "border-pink-200 dark:border-pink-700",
    textColor: "text-pink-600 dark:text-pink-400",
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
    className: "text-red-600 border-red-200 dark:text-red-400 dark:border-red-700",
  },
  [LeadCompletionReason.InFollowUp]: {
    label: "En seguimiento",
    icon: Clock3,
    className: "text-blue-600 border-blue-200 dark:text-blue-400 dark:border-blue-700",
  },
  [LeadCompletionReason.Sale]: {
    label: "Venta concretada",
    icon: DollarSign,
    className: "text-green-600 border-green-200 dark:text-green-400 dark:border-green-700",
  },
};
