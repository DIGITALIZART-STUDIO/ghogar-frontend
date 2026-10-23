import { describe, expect, it } from "vitest";

import { ContractCurrency } from "@/app/(admin)/contracts/_types/contract";
import { IncomeReportOrigin } from "../_types/incomeReport";
import { formatIncomeTotals, IncomeReportOriginLabels } from "./incomeReport.utils";

describe("formatIncomeTotals", () => {
  it("formats a single currency total", () => {
    expect(
      formatIncomeTotals(
        [
          {
            currency: ContractCurrency.SOLES,
            paymentCount: 2,
            totalAmount: 1500,
            reservationPaymentCount: 1,
            reservationPaymentAmount: 500,
          },
        ],
        0
      )
    ).toContain("1,500.00");
  });

  it("joins mixed currencies", () => {
    const formatted = formatIncomeTotals(
      [
        {
          currency: ContractCurrency.SOLES,
          paymentCount: 1,
          totalAmount: 100,
          reservationPaymentCount: 0,
          reservationPaymentAmount: 0,
        },
        {
          currency: ContractCurrency.DOLARES,
          paymentCount: 1,
          totalAmount: 50,
          reservationPaymentCount: 1,
          reservationPaymentAmount: 50,
        },
      ],
      0
    );

    expect(formatted).toContain("S/");
    expect(formatted).toContain("US$");
  });

  it("falls back to soles when there are no currency totals", () => {
    expect(formatIncomeTotals([], 250)).toContain("S/");
    expect(formatIncomeTotals([], 250)).toContain("250.00");
  });

  it("can pick a nested amount such as reservation payments", () => {
    const formatted = formatIncomeTotals(
      [
        {
          currency: ContractCurrency.SOLES,
          paymentCount: 2,
          totalAmount: 1500,
          reservationPaymentCount: 1,
          reservationPaymentAmount: 500,
        },
      ],
      0,
      (total) => total.reservationPaymentAmount
    );

    expect(formatted).toContain("500.00");
    expect(formatted).not.toContain("1,500.00");
  });
});

describe("IncomeReportOriginLabels", () => {
  it("maps every origin to a Spanish label", () => {
    expect(IncomeReportOriginLabels[IncomeReportOrigin.Contract]).toBe("Contrato");
    expect(IncomeReportOriginLabels[IncomeReportOrigin.Reservation]).toBe("Separación");
  });
});
