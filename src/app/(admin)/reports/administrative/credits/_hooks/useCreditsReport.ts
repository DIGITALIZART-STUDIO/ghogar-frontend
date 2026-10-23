import { useCallback, useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { useAuthContext } from "@/context/auth-provider";
import { CreditsReportFilters, CreditsReportResponse, PendingInstallmentsFilter } from "../_types/creditsReport";
import { buildCreditsReportQueryParams } from "../_utils/creditsReport.query";
import { defaultReportDateRange } from "../../../_utils/report-dates";

function defaultFilters(): CreditsReportFilters {
  return {
    ...defaultReportDateRange(),
    search: undefined,
    pendingInstallments: "all",
    projectId: undefined,
  };
}

async function fetchCreditsReport(params: URLSearchParams): Promise<CreditsReportResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reports/administrative/credits/paginated?${params.toString()}`,
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

export function useCreditsReport(page: number, pageSize: number, projectId?: string) {
  const { handleAuthError } = useAuthContext();
  const [filters, setFilters] = useState<CreditsReportFilters>(defaultFilters());

  const effectiveFilters = useMemo<CreditsReportFilters>(() => ({ ...filters, projectId }), [filters, projectId]);

  const queryParams = useMemo(
    () => buildCreditsReportQueryParams(effectiveFilters, { page, pageSize }),
    [effectiveFilters, page, pageSize]
  );

  const query = useQuery({
    queryKey: ["reports", "administrative", "credits", queryParams.toString()],
    queryFn: () => fetchCreditsReport(queryParams),
    placeholderData: keepPreviousData,
    retry: false,
  });

  if (query.isError) {
    void handleAuthError(query.error);
  }

  const setDateRange = useCallback((from: string, to: string) => {
    setFilters((prev) => ({ ...prev, from, to }));
  }, []);
  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search: search.trim() || undefined }));
  }, []);
  const setPendingInstallments = useCallback((pendingInstallments: PendingInstallmentsFilter) => {
    setFilters((prev) => ({ ...prev, pendingInstallments }));
  }, []);
  const resetFilters = useCallback(() => setFilters(defaultFilters()), []);

  return {
    ...query,
    filters: effectiveFilters,
    setDateRange,
    setSearch,
    setPendingInstallments,
    resetFilters,
    data: query.data,
    totalCount: query.data?.meta?.total ?? 0,
    totalPages: query.data?.meta?.totalPages ?? 0,
  };
}
