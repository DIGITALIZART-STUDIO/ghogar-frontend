import { cn } from "@/lib/utils";
import { LeadCaptureSourceLabels, LeadStatusLabels } from "./advisorActivity.utils";

const LeadStatusIcons = Object.fromEntries(
  Object.entries(LeadStatusLabels).map(([status, config]) => {
    const IconComponent: React.FC<{ className?: string }> = ({ className }) => {
      const Icon = config.icon;
      return <Icon className={cn(className, config.className)} />;
    };
    return [status, IconComponent];
  })
);

const LeadCaptureSourceIcons = Object.fromEntries(
  Object.entries(LeadCaptureSourceLabels).map(([source, config]) => {
    const IconComponent: React.FC<{ className?: string }> = ({ className }) => {
      const Icon = config.icon;
      return <Icon className={cn(className, config.className)} />;
    };
    return [source, IconComponent];
  })
);

export const createAdvisorActivityFacetedFilters = (
  onStatusChange: (values: Array<string>) => void,
  onCaptureSourceChange: (values: Array<string>) => void,
  currentStatus: Array<string> = [],
  currentCaptureSource: Array<string> = []
) => [
  {
    // Debe coincidir con el `id` de la columna en AdvisorActivityTableColumns
    column: "Estado",
    title: "Estado del Lead",
    options: Object.entries(LeadStatusLabels).map(([status, config]) => ({
      label: config.label,
      value: status,
      icon: LeadStatusIcons[status],
    })),
    onFilterChange: onStatusChange,
    currentValue: currentStatus,
  },
  {
    column: "Medio de Captación",
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
