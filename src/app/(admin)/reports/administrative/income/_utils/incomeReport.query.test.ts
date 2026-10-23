import { describe, expect, it } from "vitest";

import { buildIncomeReportQueryParams } from "./incomeReport.query";

describe("buildIncomeReportQueryParams", () => {
  it("sends the payment date range and pagination", () => {
    const params = buildIncomeReportQueryParams({ from: "2026-04-01", to: "2026-04-30" }, { page: 3, pageSize: 20 });

    expect(params.get("from")).toBe("2026-04-01");
    expect(params.get("to")).toBe("2026-04-30");
    expect(params.get("page")).toBe("3");
    expect(params.get("pageSize")).toBe("20");
    expect(params.has("projectId")).toBe(false);
    expect(params.has("orderBy")).toBe(false);
  });

  it("includes the selected project and order", () => {
    const params = buildIncomeReportQueryParams(
      {
        from: "2026-04-01",
        to: "2026-04-30",
        projectId: "proj-9",
      },
      { orderBy: "paymentDate desc" }
    );

    expect(params.get("projectId")).toBe("proj-9");
    expect(params.get("orderBy")).toBe("paymentDate desc");
  });
});
