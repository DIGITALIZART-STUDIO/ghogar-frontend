import { formatContractCurrency } from "@/app/(admin)/contracts/_utils/contracts.utils";
import { IncomeReportCurrencyTotal, IncomeReportOrigin } from "../_types/incomeReport";

export const IncomeReportOriginLabels: Record<IncomeReportOrigin, string> = {
  [IncomeReportOrigin.Contract]: "Contrato",
  [IncomeReportOrigin.Reservation]: "Separación",
};

export function formatIncomeTotals(
  totals: Array<IncomeReportCurrencyTotal>,
  fallbackAmount: number,
  pick: (total: IncomeReportCurrencyTotal) => number = (total) => total.totalAmount
): string {
  if (totals.length === 0) {
    return formatContractCurrency(fallbackAmount, "SOLES");
  }

  return totals.map((total) => formatContractCurrency(pick(total), total.currency)).join(" · ");
}
