import { IncomeReportFilters } from "../_types/incomeReport";

export function buildIncomeReportQueryParams(
  filters: IncomeReportFilters,
  extra?: { page?: number; pageSize?: number; orderBy?: string }
): URLSearchParams {
  const params = new URLSearchParams();

  params.set("from", filters.from);
  params.set("to", filters.to);

  if (filters.projectId) {
    params.set("projectId", filters.projectId);
  }

  if (extra?.page) {
    params.set("page", String(extra.page));
  }
  if (extra?.pageSize) {
    params.set("pageSize", String(extra.pageSize));
  }
  if (extra?.orderBy) {
    params.set("orderBy", extra.orderBy);
  }

  return params;
}
