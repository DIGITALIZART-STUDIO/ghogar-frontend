import { describe, expect, it } from "vitest";

import { PaymentMethod } from "../../reservations/_types/reservation";
import { paymentTransactionCreateSchema } from "./createPaymentTransactionSchema";

const validPayment = {
  paymentDate: "2026-10-23T15:00:00Z",
  amountPaid: 1500,
  paymentMethod: PaymentMethod.BANK_TRANSFER,
  contractId: "33333333-3333-3333-3333-333333333333",
};

describe("paymentTransactionCreateSchema", () => {
  it("accepts a voucher against a contract", () => {
    expect(paymentTransactionCreateSchema.parse(validPayment).contractId).toBe(validPayment.contractId);
  });

  it("still accepts a reservation id for legacy payloads", () => {
    const result = paymentTransactionCreateSchema.parse({
      ...validPayment,
      contractId: undefined,
      reservationId: "44444444-4444-4444-4444-444444444444",
    });
    expect(result.reservationId).toBe("44444444-4444-4444-4444-444444444444");
  });

  it("rejects an invalid contract id", () => {
    const result = paymentTransactionCreateSchema.safeParse({
      ...validPayment,
      contractId: "not-a-uuid",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a zero amount", () => {
    const result = paymentTransactionCreateSchema.safeParse({
      ...validPayment,
      amountPaid: 0,
    });
    expect(result.success).toBe(false);
  });
});
