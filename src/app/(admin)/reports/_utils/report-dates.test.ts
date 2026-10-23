import { describe, expect, it, vi } from "vitest";

import {
  defaultReportDateRange,
  formatDateOnly,
  formatReportDate,
  nextReportDateRange,
  parseLocalDate,
} from "./report-dates";

describe("report-dates", () => {
  it("round-trips a local calendar date without shifting a day", () => {
    expect(formatDateOnly(parseLocalDate("2026-04-23"))).toBe("2026-04-23");
  });

  it("defaults the range to the current month through today", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 3, 23, 15, 0, 0));

    expect(defaultReportDateRange()).toEqual({ from: "2026-04-01", to: "2026-04-23" });

    vi.useRealTimers();
  });

  it("formats date-only strings as the same calendar day in Lima", () => {
    expect(formatReportDate("2026-04-23")).toBe("23/04/2026");
  });

  it("returns an em dash for missing or invalid dates", () => {
    expect(formatReportDate(null)).toBe("—");
    expect(formatReportDate(undefined)).toBe("—");
    expect(formatReportDate("")).toBe("—");
    expect(formatReportDate("not-a-date")).toBe("—");
  });

  it("ignores a date range that did not actually change", () => {
    const currentFrom = "2026-04-01";
    const currentTo = "2026-04-23";

    expect(
      nextReportDateRange({ from: parseLocalDate(currentFrom), to: parseLocalDate(currentTo) }, currentFrom, currentTo)
    ).toBeNull();
  });

  it("returns the next complete range when the selection changes", () => {
    expect(
      nextReportDateRange(
        { from: parseLocalDate("2026-03-01"), to: parseLocalDate("2026-03-31") },
        "2026-04-01",
        "2026-04-23"
      )
    ).toEqual({ from: "2026-03-01", to: "2026-03-31" });
  });

  it("falls back to the current month when the picker is cleared", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 3, 23, 15, 0, 0));

    expect(nextReportDateRange(undefined, "2026-03-01", "2026-03-31")).toEqual({
      from: "2026-04-01",
      to: "2026-04-23",
    });
    expect(nextReportDateRange({ from: parseLocalDate("2026-04-01") }, "2026-03-01", "2026-03-31")).toEqual({
      from: "2026-04-01",
      to: "2026-04-23",
    });
    expect(nextReportDateRange(undefined, "2026-04-01", "2026-04-23")).toBeNull();

    vi.useRealTimers();
  });
});
