import type { FC } from "react";

import { cn } from "@/lib/utils";
import { ContractStatus } from "../../contracts/_types/contract";
import { ContractStatusLabels } from "../../contracts/_utils/contracts.utils";

const StatusIcons = Object.fromEntries(
  Object.entries(ContractStatusLabels).map(([status, config]) => {
    const IconComponent: FC<{ className?: string }> = ({ className }) => {
      const Icon = config.icon;
      return <Icon className={cn(className, config.className)} />;
    };
    return [status, IconComponent];
  })
);

export const createPendingContractsFacetedFilters = (
  onStatusChange: (values: Array<string>) => void,
  _onPaymentMethodChange?: (paymentMethod: Array<string>) => void,
  _onContractValidationStatusChange?: (contractValidationStatus: Array<string>) => void,
  currentStatus: Array<string> = [],
  _currentPaymentMethod?: Array<string>,
  _currentContractValidationStatus?: Array<string>
) => createCreditManagementFacetedFilters(onStatusChange, currentStatus);

export const createCreditManagementFacetedFilters = (
  onStatusChange: (values: Array<string>) => void,
  currentStatus: Array<string> = []
) => [
  {
    column: "estado",
    title: "Estado",
    options: Object.entries(ContractStatusLabels)
      .filter(([status]) => status !== ContractStatus.Rescinded)
      .map(([status, config]) => ({
        label: config.label,
        value: status,
        icon: StatusIcons[status],
      })),
    onFilterChange: onStatusChange,
    currentValue: currentStatus,
  },
];
