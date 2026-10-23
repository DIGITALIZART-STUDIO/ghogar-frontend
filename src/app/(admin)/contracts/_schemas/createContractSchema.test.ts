import { describe, expect, it } from "vitest";

import { ContractCurrency, ContractOrigin } from "../_types/contract";
import { createContractSchema } from "./createContractSchema";

const validDirect = {
  origin: ContractOrigin.Direct,
  clientId: "11111111-1111-1111-1111-111111111111",
  projectId: "p1",
  blockId: "b1",
  lotId: "22222222-2222-2222-2222-222222222222",
  totalPrice: 40000,
  downPaymentAmount: 4000,
  monthsFinanced: 12,
  currency: ContractCurrency.SOLES,
  exchangeRate: 1,
};

describe("createContractSchema", () => {
  it("accepts a direct contract", () => {
    expect(createContractSchema.parse(validDirect).origin).toBe(ContractOrigin.Direct);
  });

  it("accepts a legacy contract with start date and paid installments", () => {
    const result = createContractSchema.parse({
      ...validDirect,
      origin: ContractOrigin.Legacy,
      startDate: "2024-01-15",
      paidInstallments: 4,
    });
    expect(result.origin).toBe(ContractOrigin.Legacy);
    expect(result.paidInstallments).toBe(4);
  });

  it("rejects a pipeline origin because the form only creates direct or legacy contracts", () => {
    const result = createContractSchema.safeParse({
      ...validDirect,
      origin: ContractOrigin.Pipeline,
    });
    expect(result.success).toBe(false);
  });

  it("rejects a legacy contract without start date", () => {
    const result = createContractSchema.safeParse({
      ...validDirect,
      origin: ContractOrigin.Legacy,
    });
    expect(result.success).toBe(false);
  });

  it("rejects down payment greater than or equal to total", () => {
    expect(
      createContractSchema.safeParse({
        ...validDirect,
        downPaymentAmount: 50000,
      }).success
    ).toBe(false);
    expect(
      createContractSchema.safeParse({
        ...validDirect,
        downPaymentAmount: 40000,
      }).success
    ).toBe(false);
  });

  it("rejects paid installments above the financed term", () => {
    const result = createContractSchema.safeParse({
      ...validDirect,
      origin: ContractOrigin.Legacy,
      startDate: "2024-01-15",
      paidInstallments: 13,
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid client or lot ids", () => {
    expect(
      createContractSchema.safeParse({
        ...validDirect,
        clientId: "not-a-uuid",
      }).success
    ).toBe(false);
    expect(
      createContractSchema.safeParse({
        ...validDirect,
        lotId: "",
      }).success
    ).toBe(false);
  });
});
