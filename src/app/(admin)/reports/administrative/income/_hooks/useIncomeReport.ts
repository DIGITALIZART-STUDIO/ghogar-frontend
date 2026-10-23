import { useCallback, useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { useAuthContext } from "@/context/auth-provider";
import { IncomeReportFilters, IncomeReportResponse } from "../_types/incomeReport";
import { buildIncomeReportQueryParams } from "../_utils/incomeReport.query";
import { defaultReportDateRange } from "../../../_utils/report-dates";

function defaultFilters(): IncomeReportFilters {
  return {
    ...defaultReportDateRange(),
    projectId: undefined,
  };
}

async function fetchIncomeReport(params: URLSearchParams): Promise<IncomeReportResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reports/administrative/income/paginated?${params.toString()}`,
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

export function useIncomeReport(page: number, pageSize: number, projectId?: string) {
  const { handleAuthError } = useAuthContext();
  const [filters, setFilters] = useState<IncomeReportFilters>(defaultFilters());

  const effectiveFilters = useMemo<IncomeReportFilters>(() => ({ ...filters, projectId }), [filters, projectId]);

  const queryParams = useMemo(
    () => buildIncomeReportQueryParams(effectiveFilters, { page, pageSize }),
    [effectiveFilters, page, pageSize]
  );

  const query = useQuery({
    queryKey: ["reports", "administrative", "income", queryParams.toString()],
    queryFn: () => fetchIncomeReport(queryParams),
    placeholderData: keepPreviousData,
    retry: false,
  });

  if (query.isError) {
    void handleAuthError(query.error);
  }

  const setDateRange = useCallback((from: string, to: string) => {
    setFilters((prev) => ({ ...prev, from, to }));
  }, []);
  const resetFilters = useCallback(() => setFilters(defaultFilters()), []);

  return {
    ...query,
    filters: effectiveFilters,
    setDateRange,
    resetFilters,
    data: query.data,
    totalCount: query.data?.meta?.total ?? 0,
    totalPages: query.data?.meta?.totalPages ?? 0,
  };
}
