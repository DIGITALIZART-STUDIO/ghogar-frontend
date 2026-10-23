import { describe, expect, it } from "vitest";

import { CreditsReportFilters } from "../_types/creditsReport";
import { buildCreditsReportQueryParams } from "./creditsReport.query";

const baseFilters = (): CreditsReportFilters => ({
  from: "2026-04-01",
  to: "2026-04-30",
  pendingInstallments: "all",
});

describe("buildCreditsReportQueryParams", () => {
  it("sends the date range and omits empty optional filters", () => {
    const params = buildCreditsReportQueryParams(baseFilters(), { page: 2, pageSize: 10 });

    expect(params.get("from")).toBe("2026-04-01");
    expect(params.get("to")).toBe("2026-04-30");
    expect(params.get("page")).toBe("2");
    expect(params.get("pageSize")).toBe("10");
    expect(params.has("search")).toBe(false);
    expect(params.has("projectId")).toBe(false);
    expect(params.has("pendingInstallments")).toBe(false);
    expect(params.has("orderBy")).toBe(false);
  });

  it("includes client search, project, pending installments and order", () => {
    const params = buildCreditsReportQueryParams(
      {
        ...baseFilters(),
        search: " 12345678 ",
        projectId: "proj-1",
        pendingInstallments: "overdue",
      },
      { orderBy: "startDate desc" }
    );

    expect(params.get("search")).toBe("12345678");
    expect(params.get("projectId")).toBe("proj-1");
    expect(params.get("pendingInstallments")).toBe("overdue");
    expect(params.get("orderBy")).toBe("startDate desc");
  });

  it("omits whitespace-only search", () => {
    const params = buildCreditsReportQueryParams({
      ...baseFilters(),
      search: "   ",
    });

    expect(params.has("search")).toBe(false);
  });
});
