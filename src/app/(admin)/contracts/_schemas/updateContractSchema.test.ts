import { describe, expect, it } from "vitest";

import { updateContractSchema } from "./updateContractSchema";

const validUpdate = {
  totalPrice: 50000,
  downPaymentAmount: 8000,
  monthsFinanced: 24,
  exchangeRate: 3.75,
  startDate: "2025-03-01",
};

describe("updateContractSchema", () => {
  it("accepts a complete commercial update", () => {
    expect(updateContractSchema.parse(validUpdate).monthsFinanced).toBe(24);
  });

  it("requires a start date", () => {
    const result = updateContractSchema.safeParse({
      ...validUpdate,
      startDate: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects down payment greater than or equal to total", () => {
    expect(
      updateContractSchema.safeParse({
        ...validUpdate,
        downPaymentAmount: 50000,
      }).success
    ).toBe(false);
  });

  it("accepts up to six co-owners with an 8-digit DNI", () => {
    const result = updateContractSchema.parse({
      ...validUpdate,
      coOwners: [{ name: "Ana Pérez", dni: "12345678", address: "Av. Lima 100" }],
    });
    expect(result.coOwners).toHaveLength(1);
  });

  it("rejects a short DNI and more than six co-owners", () => {
    expect(
      updateContractSchema.safeParse({
        ...validUpdate,
        coOwners: [{ name: "Ana Pérez", dni: "123" }],
      }).success
    ).toBe(false);
    expect(
      updateContractSchema.safeParse({
        ...validUpdate,
        coOwners: Array.from({ length: 7 }, (_, index) => ({
          name: `Persona ${index}`,
          dni: "12345678",
        })),
      }).success
    ).toBe(false);
  });

  it("rejects an invalid co-owner email", () => {
    const result = updateContractSchema.safeParse({
      ...validUpdate,
      coOwners: [{ name: "Ana Pérez", dni: "12345678", email: "no-es-correo" }],
    });
    expect(result.success).toBe(false);
  });
});
