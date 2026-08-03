import { useQuery } from "@tanstack/react-query";

import { useAuthContext } from "@/context/auth-provider";
import { AdvisorActivityTask } from "../_types/advisorActivity";

async function fetchLeadTasks(leadId: string): Promise<Array<AdvisorActivityTask>> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reports/commercial/advisor-activity/${leadId}/tasks`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const error = new Error(`HTTP error! status: ${response.status}`) as Error & { statusCode?: number };
    error.statusCode = response.status;
    throw error;
  }

  return await response.json();
}

/**
 * Hook para obtener el detalle de tareas de un lead, usado al expandir
 * una fila del reporte de actividad de asesores (carga bajo demanda).
 */
export function useAdvisorActivityTasks(leadId: string, enabled: boolean) {
  const { handleAuthError } = useAuthContext();

  const query = useQuery({
    queryKey: ["reports", "commercial", "advisor-activity", "tasks", leadId],
    queryFn: () => fetchLeadTasks(leadId),
    enabled,
    retry: false,
  });

  if (query.isError) {
    void handleAuthError(query.error);
  }

  return query;
}
