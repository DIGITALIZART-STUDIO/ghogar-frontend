import { useMutation } from "@tanstack/react-query";

import { useAuthContext } from "@/context/auth-provider";
import { IncomeReportFilters } from "../_types/incomeReport";
import { buildIncomeReportQueryParams } from "../_utils/incomeReport.query";

export function useExportIncomeReport() {
  const { handleAuthError } = useAuthContext();

  return useMutation({
    mutationFn: async (filters: IncomeReportFilters) => {
      const params = buildIncomeReportQueryParams(filters);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reports/administrative/income/excel?${params.toString()}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `reporte-ingresos-${filters.from}-${filters.to}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return blob;
    },
    onError: async (error: unknown) => {
      await handleAuthError(error);
    },
  });
}
