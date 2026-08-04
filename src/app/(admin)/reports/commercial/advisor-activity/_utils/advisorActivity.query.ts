import { AdvisorActivityFilters } from "../_types/advisorActivity";

/**
 * Construye los query params compartidos por los endpoints de reporte
 * (paginado y export), a partir de los filtros seleccionados.
 */
export function buildAdvisorActivityQueryParams(
  filters: AdvisorActivityFilters,
  extra?: { page?: number; pageSize?: number; orderBy?: string }
): URLSearchParams {
  const params = new URLSearchParams();

  params.set("from", filters.from);
  params.set("to", filters.to);

  if (filters.advisorId) {
    params.set("advisorId", filters.advisorId);
  }

  filters.status.forEach((status) => params.append("status", status));
  filters.captureSource.forEach((source) => params.append("captureSource", source));

  if (filters.hasAdvisor === "with-advisor") {
    params.set("hasAdvisor", "true");
  } else if (filters.hasAdvisor === "without-advisor") {
    params.set("hasAdvisor", "false");
  }

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
