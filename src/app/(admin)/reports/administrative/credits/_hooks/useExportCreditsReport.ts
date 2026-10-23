import { useMutation } from "@tanstack/react-query";

import { useAuthContext } from "@/context/auth-provider";
import { CreditsReportFilters } from "../_types/creditsReport";
import { buildCreditsReportQueryParams } from "../_utils/creditsReport.query";

export function useExportCreditsReport() {
  const { handleAuthError } = useAuthContext();

  return useMutation({
    mutationFn: async (filters: CreditsReportFilters) => {
      const params = buildCreditsReportQueryParams(filters);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reports/administrative/credits/excel?${params.toString()}`,
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
      link.download = `reporte-creditos-${filters.from}-${filters.to}.xlsx`;
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
