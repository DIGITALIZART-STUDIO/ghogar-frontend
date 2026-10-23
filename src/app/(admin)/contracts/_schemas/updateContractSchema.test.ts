import { describe, expect, it } from "vitest";

import { updateContractSchema } from "./updateContractSchema";

const validInstallments = [
  {
    sequence: 1,
    dueDate: "2025-04-01",
    amountDue: 1750,
    amountPaid: 0,
    paid: false,
    locked: false,
  },
];

const validUpdate = {
  totalPrice: 50000,
  downPaymentAmount: 8000,
  monthsFinanced: 24,
  exchangeRate: 3.75,
  startDate: "2025-03-01",
  applyRecalculatedSchedule: false,
  installments: validInstallments,
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

  it("rejects installment dates that go backwards", () => {
    const result = updateContractSchema.safeParse({
      ...validUpdate,
      monthsFinanced: 2,
      installments: [
        { ...validInstallments[0], sequence: 1, dueDate: "2025-05-01" },
        { ...validInstallments[0], sequence: 2, dueDate: "2025-04-01" },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("accepts chronological installment dates", () => {
    const result = updateContractSchema.parse({
      ...validUpdate,
      monthsFinanced: 2,
      installments: [
        { ...validInstallments[0], sequence: 1, dueDate: "2025-04-01" },
        { ...validInstallments[0], sequence: 2, dueDate: "2025-05-01", locked: true, paid: true, amountPaid: 1750 },
      ],
    });
    expect(result.installments).toHaveLength(2);
  });

  it("rejects an empty installment list", () => {
    const result = updateContractSchema.safeParse({
      ...validUpdate,
      installments: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects a financed term shorter than the locked installments", () => {
    const result = updateContractSchema.safeParse({
      ...validUpdate,
      monthsFinanced: 1,
      installments: [
        { ...validInstallments[0], sequence: 1, locked: true, paid: true, amountPaid: 1750 },
        { ...validInstallments[0], sequence: 2, dueDate: "2025-05-01", locked: true, paid: false, amountPaid: 200 },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("requires the recalculate flag used by the schedule save", () => {
    expect(
      updateContractSchema.safeParse({
        ...validUpdate,
        applyRecalculatedSchedule: undefined,
      }).success
    ).toBe(false);
  });
});
