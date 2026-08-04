import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, startOfMonth } from "date-fns";

import { LeadCaptureSource, LeadStatus } from "@/app/(admin)/leads/_types/lead";
import { useAuthContext } from "@/context/auth-provider";
import { AdvisorActivityFilters, AdvisorActivityReportResponse, HasAdvisorFilter } from "../_types/advisorActivity";
import { buildAdvisorActivityQueryParams } from "../_utils/advisorActivity.query";

function formatDate(date: Date): string {
  // Usar fecha local (no UTC) para evitar correr un día en zonas como America/Lima
  return format(date, "yyyy-MM-dd");
}

function defaultFilters(): AdvisorActivityFilters {
  const now = new Date();

  return {
    from: formatDate(startOfMonth(now)),
    to: formatDate(now),
    advisorId: undefined,
    status: [],
    captureSource: [],
    hasAdvisor: "all",
    projectId: undefined,
  };
}

async function fetchAdvisorActivityReport(params: URLSearchParams): Promise<AdvisorActivityReportResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reports/commercial/advisor-activity/paginated?${params.toString()}`,
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
 * Hook para el reporte comercial de actividad de asesores.
 * Maneja filtros, orden y paginación server-side.
 */
export function useAdvisorActivityReport(page: number, pageSize: number, projectId?: string) {
  const { handleAuthError } = useAuthContext();
  const [filters, setFilters] = useState<AdvisorActivityFilters>(defaultFilters());
  const [orderBy, setOrderBy] = useState<string | undefined>(undefined);
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("desc");

  const effectiveFilters = useMemo<AdvisorActivityFilters>(() => ({ ...filters, projectId }), [filters, projectId]);

  const queryParams = useMemo(
    () =>
      buildAdvisorActivityQueryParams(effectiveFilters, {
        page,
        pageSize,
        orderBy: orderBy ? `${orderBy} ${orderDirection}` : undefined,
      }),
    [effectiveFilters, page, pageSize, orderBy, orderDirection]
  );

  const query = useQuery({
    queryKey: ["reports", "commercial", "advisor-activity", queryParams.toString()],
    queryFn: () => fetchAdvisorActivityReport(queryParams),
    retry: false,
  });

  if (query.isError) {
    void handleAuthError(query.error);
  }

  const setDateRange = useCallback((from: string, to: string) => {
    setFilters((prev) => ({ ...prev, from, to }));
  }, []);
  const setAdvisorId = useCallback(
    (advisorId: string | undefined) => setFilters((prev) => ({ ...prev, advisorId })),
    []
  );
  const setStatus = useCallback((status: Array<LeadStatus>) => setFilters((prev) => ({ ...prev, status })), []);
  const setCaptureSource = useCallback(
    (captureSource: Array<LeadCaptureSource>) => setFilters((prev) => ({ ...prev, captureSource })),
    []
  );
  const setHasAdvisor = useCallback(
    (hasAdvisor: HasAdvisorFilter) => setFilters((prev) => ({ ...prev, hasAdvisor })),
    []
  );
  const handleOrderChange = useCallback((field: string, direction: "asc" | "desc") => {
    setOrderBy(field);
    setOrderDirection(direction);
  }, []);
  const resetFilters = useCallback(() => setFilters(defaultFilters()), []);

  return {
    ...query,
    filters: effectiveFilters,
    setDateRange,
    setAdvisorId,
    setStatus,
    setCaptureSource,
    setHasAdvisor,
    orderBy,
    orderDirection,
    handleOrderChange,
    resetFilters,
    data: query.data,
    totalCount: query.data?.meta?.total ?? 0,
    totalPages: query.data?.meta?.totalPages ?? 0,
  };
}
