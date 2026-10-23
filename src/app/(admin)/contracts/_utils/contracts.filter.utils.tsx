import type { FC } from "react";

import { cn } from "@/lib/utils";
import { ContractOriginLabels, ContractStatusLabels } from "./contracts.utils";

const StatusIcons = Object.fromEntries(
  Object.entries(ContractStatusLabels).map(([status, config]) => {
    const IconComponent: FC<{ className?: string }> = ({ className }) => {
      const Icon = config.icon;
      return <Icon className={cn(className, config.className)} />;
    };
    return [status, IconComponent];
  })
);

const OriginIcons = Object.fromEntries(
  Object.entries(ContractOriginLabels).map(([origin, config]) => {
    const IconComponent: FC<{ className?: string }> = ({ className }) => {
      const Icon = config.icon;
      return <Icon className={cn(className, config.className)} />;
    };
    return [origin, IconComponent];
  })
);

export const createContractsFacetedFilters = (
  onStatusChange: (values: Array<string>) => void,
  onOriginChange: (values: Array<string>) => void,
  currentStatus: Array<string> = [],
  currentOrigin: Array<string> = []
) => [
  {
    column: "estado",
    title: "Estado",
    options: Object.entries(ContractStatusLabels).map(([status, config]) => ({
      label: config.label,
      value: status,
      icon: StatusIcons[status],
    })),
    onFilterChange: onStatusChange,
    currentValue: currentStatus,
  },
  {
    column: "origen",
    title: "Origen",
    options: Object.entries(ContractOriginLabels).map(([origin, config]) => ({
      label: config.label,
      value: origin,
      icon: OriginIcons[origin],
    })),
    onFilterChange: onOriginChange,
    currentValue: currentOrigin,
  },
];
