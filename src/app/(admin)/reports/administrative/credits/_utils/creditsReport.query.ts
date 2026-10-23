import { CreditsReportFilters } from "../_types/creditsReport";

export function buildCreditsReportQueryParams(
  filters: CreditsReportFilters,
  extra?: { page?: number; pageSize?: number; orderBy?: string }
): URLSearchParams {
  const params = new URLSearchParams();

  params.set("from", filters.from);
  params.set("to", filters.to);

  if (filters.search?.trim()) {
    params.set("search", filters.search.trim());
  }

  if (filters.projectId) {
    params.set("projectId", filters.projectId);
  }

  if (filters.pendingInstallments !== "all") {
    params.set("pendingInstallments", filters.pendingInstallments);
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
