import { describe, expect, it } from "vitest";

import { rolePermissions } from "./types";

describe("rolePermissions", () => {
  it("grants the new /contracts route to finance and admin roles", () => {
    expect(rolePermissions.SuperAdmin).toContain("/contracts");
    expect(rolePermissions.Admin).toContain("/contracts");
    expect(rolePermissions.Manager).toContain("/contracts");
    expect(rolePermissions.FinanceManager).toContain("/contracts");
  });

  it("keeps sales and commercial roles off cobranza contracts", () => {
    expect(rolePermissions.SalesAdvisor).not.toContain("/contracts");
    expect(rolePermissions.Supervisor).not.toContain("/contracts");
    expect(rolePermissions.CommercialManager).not.toContain("/contracts");
  });

  it("keeps pending-contracts as a redirect target for finance roles", () => {
    expect(rolePermissions.FinanceManager).toContain("/pending-contracts");
    expect(rolePermissions.FinanceManager).toContain("/payments-transaction");
    expect(rolePermissions.FinanceManager).toContain("/credit-management");
  });
});
