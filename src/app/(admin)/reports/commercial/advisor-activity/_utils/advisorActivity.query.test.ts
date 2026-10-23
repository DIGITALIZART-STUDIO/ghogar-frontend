import { describe, expect, it } from "vitest";

import { LeadCaptureSource, LeadStatus } from "@/app/(admin)/leads/_types/lead";
import { AdvisorActivityFilters } from "../_types/advisorActivity";
import { buildAdvisorActivityQueryParams } from "./advisorActivity.query";

const baseFilters = (): AdvisorActivityFilters => ({
  from: "2026-04-01",
  to: "2026-04-30",
  status: [],
  captureSource: [],
  hasAdvisor: "all",
});

describe("buildAdvisorActivityQueryParams", () => {
  it("sends the date range and omits empty optional filters", () => {
    const params = buildAdvisorActivityQueryParams(baseFilters(), { page: 1, pageSize: 10 });

    expect(params.get("from")).toBe("2026-04-01");
    expect(params.get("to")).toBe("2026-04-30");
    expect(params.get("page")).toBe("1");
    expect(params.get("pageSize")).toBe("10");
    expect(params.has("advisorId")).toBe(false);
    expect(params.has("status")).toBe(false);
    expect(params.has("captureSource")).toBe(false);
    expect(params.has("hasAdvisor")).toBe(false);
    expect(params.has("projectId")).toBe(false);
  });

  it("maps assignment, advisor, project and multi-value filters", () => {
    const params = buildAdvisorActivityQueryParams({
      ...baseFilters(),
      advisorId: "user-1",
      projectId: "proj-2",
      hasAdvisor: "with-advisor",
      status: [LeadStatus.Registered, LeadStatus.Attended],
      captureSource: [LeadCaptureSource.PersonalFacebook],
    });

    expect(params.get("advisorId")).toBe("user-1");
    expect(params.get("projectId")).toBe("proj-2");
    expect(params.get("hasAdvisor")).toBe("true");
    expect(params.getAll("status")).toEqual([LeadStatus.Registered, LeadStatus.Attended]);
    expect(params.getAll("captureSource")).toEqual([LeadCaptureSource.PersonalFacebook]);
  });

  it("sends hasAdvisor=false for unassigned leads", () => {
    const params = buildAdvisorActivityQueryParams({
      ...baseFilters(),
      hasAdvisor: "without-advisor",
    });

    expect(params.get("hasAdvisor")).toBe("false");
  });
});
