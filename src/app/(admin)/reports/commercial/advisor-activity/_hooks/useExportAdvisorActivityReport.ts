import { useMutation } from "@tanstack/react-query";

import { useAuthContext } from "@/context/auth-provider";
import { AdvisorActivityFilters } from "../_types/advisorActivity";
import { buildAdvisorActivityQueryParams } from "../_utils/advisorActivity.query";

/**
 * Hook para exportar el reporte de actividad de asesores a Excel,
 * respetando los mismos filtros aplicados a la tabla.
 */
export function useExportAdvisorActivityReport() {
  const { handleAuthError } = useAuthContext();

  return useMutation({
    mutationFn: async (filters: AdvisorActivityFilters) => {
      const params = buildAdvisorActivityQueryParams(filters);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reports/commercial/advisor-activity/excel?${params.toString()}`,
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
      link.download = `reporte-actividad-asesores-${filters.from}-${filters.to}.xlsx`;
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
