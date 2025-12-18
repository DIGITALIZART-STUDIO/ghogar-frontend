import { cn } from "@/lib/utils";
import { LeadCaptureSourceLabels } from "../../leads/_utils/leads.utils";
import { LeadStatusLabels } from "./assignments.utils";

// Generar componentes de icono a partir de CustomerMaritalStatusLabels
const LeadStatusIcons = Object.fromEntries(
  Object.entries(LeadStatusLabels).map(([leadStatus, config]) => {
    const IconComponent: React.FC<{ className?: string }> = ({ className }) => {
      const Icon = config.icon;
      return <Icon className={cn(className, config.className)} />;
    };
    return [leadStatus, IconComponent];
  })
);

// Generar componentes de icono para LeadCaptureSource
const LeadCaptureSourceIcons = Object.fromEntries(
  Object.entries(LeadCaptureSourceLabels).map(([source, config]) => {
    const IconComponent: React.FC<{ className?: string }> = ({ className }) => {
      const Icon = config.icon;
      return <Icon className={cn(className, config.className)} />;
    };
    return [source, IconComponent];
  })
);

// Función para crear faceted filters con callbacks del servidor
export const createFacetedFilters = (
  onStatusChange: (values: Array<string>) => void,
  onCaptureSourceChange: (values: Array<string>) => void,
  currentStatus: Array<string> = [],
  currentCaptureSource: Array<string> = []
) => [
  {
    column: "seguimiento",
    title: "Estado del Lead",
    options: Object.entries(LeadStatusLabels).map(([leadStatus, config]) => ({
      label: config.label,
      value: leadStatus,
      icon: LeadStatusIcons[leadStatus],
    })),
    onFilterChange: onStatusChange,
    currentValue: currentStatus,
  },
  {
    column: "Medio de captación",
    title: "Medio de Captación",
    options: Object.entries(LeadCaptureSourceLabels).map(([source, config]) => ({
      label: config.label,
      value: source,
      icon: LeadCaptureSourceIcons[source],
    })),
    onFilterChange: onCaptureSourceChange,
    currentValue: currentCaptureSource,
  },
];

export const facetedFilters = [
  {
    column: "seguimiento",
    title: "Seguimiento",
    options: Object.entries(LeadStatusLabels).map(([leadStatus, config]) => ({
      label: config.label,
      value: leadStatus,
      icon: LeadStatusIcons[leadStatus],
    })),
  },
  {
    column: "Medio de captación",
    title: "Medio de captación",
    options: Object.entries(LeadCaptureSourceLabels).map(([source, config]) => ({
      label: config.label,
      value: source,
      icon: LeadCaptureSourceIcons[source],
    })),
  },
];
