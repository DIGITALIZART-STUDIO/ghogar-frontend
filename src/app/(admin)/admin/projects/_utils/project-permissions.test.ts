import { describe, expect, it } from "vitest";

import { canDeleteProjectContract, canEditProjectContract, canManageProject } from "./project-permissions";

describe("project-permissions", () => {
  it("treats missing roles as no access", () => {
    expect(canEditProjectContract(null)).toBe(false);
    expect(canManageProject(undefined)).toBe(false);
    expect(canDeleteProjectContract([])).toBe(false);
  });

  it("lets SuperAdmin, Admin, Manager and CommercialManager edit contracts", () => {
    expect(canEditProjectContract(["SuperAdmin"])).toBe(true);
    expect(canEditProjectContract(["Admin"])).toBe(true);
    expect(canEditProjectContract(["Manager"])).toBe(true);
    expect(canEditProjectContract(["CommercialManager"])).toBe(true);
    expect(canEditProjectContract(["SalesAdvisor"])).toBe(false);
    expect(canEditProjectContract(["FinanceManager"])).toBe(false);
  });

  it("lets only SuperAdmin and Admin manage projects", () => {
    expect(canManageProject(["SuperAdmin"])).toBe(true);
    expect(canManageProject(["Admin"])).toBe(true);
    expect(canManageProject(["Manager"])).toBe(false);
    expect(canManageProject(["CommercialManager"])).toBe(false);
  });

  it("lets only SuperAdmin delete a project contract", () => {
    expect(canDeleteProjectContract(["SuperAdmin"])).toBe(true);
    expect(canDeleteProjectContract(["Admin"])).toBe(false);
    expect(canDeleteProjectContract(["Manager"])).toBe(false);
  });

  it("grants access if any of the user roles matches", () => {
    expect(canEditProjectContract(["SalesAdvisor", "CommercialManager"])).toBe(true);
    expect(canManageProject(["Manager", "Admin"])).toBe(true);
  });
});
