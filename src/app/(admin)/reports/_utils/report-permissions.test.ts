import { describe, expect, it } from "vitest";

import { canViewAdministrativeReports, canViewCommercialReports } from "./report-permissions";

describe("report permissions", () => {
  it("lets finance managers open administrative reports but not commercial ones", () => {
    expect(canViewAdministrativeReports("FinanceManager")).toBe(true);
    expect(canViewCommercialReports("FinanceManager")).toBe(false);
  });

  it("keeps supervisors and commercial managers on commercial reports only", () => {
    expect(canViewCommercialReports("Supervisor")).toBe(true);
    expect(canViewAdministrativeReports("Supervisor")).toBe(false);
    expect(canViewCommercialReports("CommercialManager")).toBe(true);
    expect(canViewAdministrativeReports("CommercialManager")).toBe(false);
  });

  it("lets admin, manager and super admin open both report sections", () => {
    expect(canViewCommercialReports("Admin")).toBe(true);
    expect(canViewAdministrativeReports("Admin")).toBe(true);
    expect(canViewCommercialReports("Manager")).toBe(true);
    expect(canViewAdministrativeReports("Manager")).toBe(true);
    expect(canViewCommercialReports("SuperAdmin")).toBe(true);
    expect(canViewAdministrativeReports("SuperAdmin")).toBe(true);
  });

  it("keeps sales advisors and missing roles out of both sections", () => {
    expect(canViewCommercialReports("SalesAdvisor")).toBe(false);
    expect(canViewAdministrativeReports("SalesAdvisor")).toBe(false);
    expect(canViewCommercialReports(undefined)).toBe(false);
    expect(canViewAdministrativeReports(undefined)).toBe(false);
    expect(canViewCommercialReports("UnknownRole")).toBe(false);
    expect(canViewAdministrativeReports("UnknownRole")).toBe(false);
  });
});
