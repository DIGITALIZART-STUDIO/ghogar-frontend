import { describe, expect, it } from "vitest";

import { ContractCurrency, ContractOrigin, ContractPaymentDto, ContractStatus, PaymentType } from "../_types/contract";
import {
  areInstallmentDatesNonDecreasing,
  buildContractSchedulePreviewPayload,
  buildUpdateContractSchedulePayload,
  canEditContract,
  canRegisterContractPayment,
  canToggleContractValidation,
  contractCurrencyFromProject,
  contractCurrencyLabel,
  ContractOriginLabels,
  ContractStatusLabels,
  formatContractCurrency,
  getContractPaymentRowStatus,
  installmentsFromSchedule,
  isContractInstallmentLocked,
  isContractOrigin,
  isContractStatus,
  parseContractCoOwners,
  PaymentTypeLabels,
  pickContractScheduleTerms,
  scheduleTermsChanged,
  toContractDateOnly,
  toContractIsoDate,
} from "./contracts.utils";

function payment(
  overrides: Partial<ContractPaymentDto> & Pick<ContractPaymentDto, "id" | "type" | "sequence">
): ContractPaymentDto {
  return {
    reservationId: "r1",
    dueDate: "2026-01-01T00:00:00Z",
    amountDue: 1000,
    amountPaid: 0,
    remainingAmount: 1000,
    paid: false,
    createdAt: "",
    modifiedAt: "",
    ...overrides,
  };
}

describe("contracts.utils", () => {
  it("maps every contract status to a finance label", () => {
    expect(ContractStatusLabels[ContractStatus.Draft].label).toBe("Borrador");
    expect(ContractStatusLabels[ContractStatus.PendingValidation].label).toBe("Pendiente de validación");
    expect(ContractStatusLabels[ContractStatus.Active].label).toBe("Activo");
    expect(ContractStatusLabels[ContractStatus.Completed].label).toBe("Completado");
    expect(ContractStatusLabels[ContractStatus.Rescinded].label).toBe("Anulado");
  });

  it("maps every contract origin to a commercial label", () => {
    expect(ContractOriginLabels[ContractOrigin.Pipeline].label).toBe("Separación");
    expect(ContractOriginLabels[ContractOrigin.Direct].label).toBe("Directo");
    expect(ContractOriginLabels[ContractOrigin.Legacy].label).toBe("Legado");
  });

  it("maps payment types", () => {
    expect(PaymentTypeLabels[PaymentType.DownPayment]).toBe("Enganche");
    expect(PaymentTypeLabels[PaymentType.Installment]).toBe("Cuota");
    expect(PaymentTypeLabels[PaymentType.Extra]).toBe("Extra");
  });

  it("formats PEN and USD amounts with two decimals", () => {
    expect(formatContractCurrency(1500, "SOLES")).toContain("S/");
    expect(formatContractCurrency(1500, "SOLES")).toMatch(/1.?500\.00/);
    expect(formatContractCurrency(1500, "DOLARES")).toContain("US$");
    expect(formatContractCurrency(0, "SOLES")).toContain("0.00");
  });

  it("maps the project ISO code to the contract currency", () => {
    expect(contractCurrencyFromProject("USD")).toBe(ContractCurrency.DOLARES);
    expect(contractCurrencyFromProject("usd")).toBe(ContractCurrency.DOLARES);
    expect(contractCurrencyFromProject("PEN")).toBe(ContractCurrency.SOLES);
    expect(contractCurrencyFromProject(undefined)).toBe(ContractCurrency.SOLES);
    expect(() => contractCurrencyFromProject("MXN")).toThrow(/no está soportada/);
    expect(contractCurrencyLabel(ContractCurrency.DOLARES)).toContain("Dólares");
    expect(contractCurrencyLabel(ContractCurrency.SOLES)).toContain("Soles");
  });

  it("narrows known contract statuses and origins", () => {
    expect(isContractStatus("Active")).toBe(true);
    expect(isContractStatus("ISSUED")).toBe(false);
    expect(isContractOrigin("Legacy")).toBe(true);
    expect(isContractOrigin("DirectSale")).toBe(false);
  });

  it("lets draft, pending and active contracts toggle validation", () => {
    expect(canToggleContractValidation(ContractStatus.Draft)).toBe(true);
    expect(canToggleContractValidation(ContractStatus.PendingValidation)).toBe(true);
    expect(canToggleContractValidation(ContractStatus.Active)).toBe(true);
    expect(canToggleContractValidation(ContractStatus.Completed)).toBe(false);
    expect(canToggleContractValidation(ContractStatus.Rescinded)).toBe(false);
  });

  it("lets only pending and active contracts receive payments", () => {
    expect(canRegisterContractPayment(ContractStatus.PendingValidation)).toBe(true);
    expect(canRegisterContractPayment(ContractStatus.Active)).toBe(true);
    expect(canRegisterContractPayment(ContractStatus.Draft)).toBe(false);
    expect(canRegisterContractPayment(ContractStatus.Rescinded)).toBe(false);
  });

  it("locks completed and rescinded contracts from editing", () => {
    expect(canEditContract(ContractStatus.Active)).toBe(true);
    expect(canEditContract(ContractStatus.Draft)).toBe(true);
    expect(canEditContract(ContractStatus.Completed)).toBe(false);
    expect(canEditContract(ContractStatus.Rescinded)).toBe(false);
  });

  it("parses co-owners JSON and ignores invalid payloads", () => {
    expect(parseContractCoOwners(null)).toEqual([]);
    expect(parseContractCoOwners("")).toEqual([]);
    expect(parseContractCoOwners("{bad")).toEqual([]);
    expect(parseContractCoOwners('{"name":"Ana"}')).toEqual([]);
    expect(parseContractCoOwners(JSON.stringify([{ name: "Ana Pérez", dni: "12345678" }]))).toEqual([
      { name: "Ana Pérez", dni: "12345678" },
    ]);
  });

  it("classifies a schedule row as paid, partial, overdue or pending", () => {
    const now = Date.parse("2026-10-23T12:00:00Z");
    expect(getContractPaymentRowStatus({ paid: true, amountPaid: 100, dueDate: "2026-01-01", now })).toBe("paid");
    expect(getContractPaymentRowStatus({ paid: false, amountPaid: 50, dueDate: "2026-01-01", now })).toBe("partial");
    expect(getContractPaymentRowStatus({ paid: false, amountPaid: 0, dueDate: "2026-10-01T00:00:00Z", now })).toBe(
      "overdue"
    );
    expect(getContractPaymentRowStatus({ paid: false, amountPaid: 0, dueDate: "2026-11-01T00:00:00Z", now })).toBe(
      "pending"
    );
  });

  it("treats a date-only due date as overdue only after that calendar day", () => {
    const now = new Date(2026, 9, 23, 12).getTime();
    expect(getContractPaymentRowStatus({ paid: false, amountPaid: 0, dueDate: "2026-10-23", now })).toBe("pending");
    expect(getContractPaymentRowStatus({ paid: false, amountPaid: 0, dueDate: "2026-10-22", now })).toBe("overdue");
    expect(getContractPaymentRowStatus({ paid: false, amountPaid: 0, dueDate: "2026-10-24", now })).toBe("pending");
  });

  it("locks paid or partially paid installments", () => {
    expect(isContractInstallmentLocked({ paid: true, amountPaid: 0 })).toBe(true);
    expect(isContractInstallmentLocked({ paid: false, amountPaid: 50 })).toBe(true);
    expect(isContractInstallmentLocked({ paid: false, amountPaid: null })).toBe(false);
    expect(isContractInstallmentLocked({ paid: false, amountPaid: 0 })).toBe(false);
  });

  it("maps the contract schedule to editable installment rows", () => {
    const rows = installmentsFromSchedule([
      payment({
        id: "dp",
        type: PaymentType.DownPayment,
        sequence: 0,
        dueDate: "2026-01-01T00:00:00Z",
        amountDue: 4000,
        amountPaid: 4000,
        remainingAmount: 0,
        paid: true,
      }),
      payment({
        id: "extra",
        type: PaymentType.Extra,
        sequence: 99,
        dueDate: "2026-06-01T00:00:00Z",
      }),
      payment({
        id: "i2",
        type: PaymentType.Installment,
        sequence: 2,
        dueDate: "2026-03-01T00:00:00Z",
        amountDue: 18000,
        remainingAmount: 18000,
      }),
      payment({
        id: "i1",
        type: PaymentType.Installment,
        sequence: 1,
        dueDate: "2026-02-01T00:00:00Z",
        amountDue: 18000,
        amountPaid: 18000,
        remainingAmount: 0,
        paid: true,
      }),
    ]);
    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({ sequence: 1, dueDate: "2026-02-01", locked: true, amountDue: 18000 });
    expect(rows[1]).toMatchObject({ sequence: 2, dueDate: "2026-03-01", locked: false, amountPaid: 0 });
  });

  it("normalizes contract dates to yyyy-MM-dd and UTC midnight", () => {
    expect(toContractDateOnly("2026-03-01T00:00:00Z")).toBe("2026-03-01");
    expect(toContractDateOnly("2026-03-01")).toBe("2026-03-01");
    expect(toContractDateOnly("")).toBe("");
    expect(toContractDateOnly(null)).toBe("");
    expect(toContractIsoDate("2026-03-01")).toBe("2026-03-01T00:00:00.000Z");
    expect(toContractIsoDate("2026-03-01T15:30:00Z")).toBe("2026-03-01T00:00:00.000Z");
  });

  it("detects commercial term changes even when the form still holds strings", () => {
    const baseline = pickContractScheduleTerms({
      totalPrice: 40000,
      downPaymentAmount: 4000,
      monthsFinanced: 12,
      startDate: "2026-01-01T00:00:00Z",
    });
    expect(baseline).toEqual({
      totalPrice: 40000,
      downPaymentAmount: 4000,
      monthsFinanced: 12,
      startDate: "2026-01-01",
    });
    expect(
      scheduleTermsChanged(
        pickContractScheduleTerms({
          totalPrice: "40000",
          downPaymentAmount: "4000",
          monthsFinanced: "12",
          startDate: "2026-01-01",
        }),
        baseline
      )
    ).toBe(false);
    expect(
      scheduleTermsChanged(
        pickContractScheduleTerms({
          totalPrice: 40000,
          downPaymentAmount: 4000,
          monthsFinanced: 18,
          startDate: "2026-01-01",
        }),
        baseline
      )
    ).toBe(true);
  });

  it("accepts chronological or equal installment dates and rejects a backward sequence", () => {
    expect(
      areInstallmentDatesNonDecreasing([
        { sequence: 2, dueDate: "2026-03-01" },
        { sequence: 1, dueDate: "2026-02-01" },
      ])
    ).toBe(true);
    expect(
      areInstallmentDatesNonDecreasing([
        { sequence: 1, dueDate: "2026-05-01" },
        { sequence: 2, dueDate: "2026-05-01" },
      ])
    ).toBe(true);
    expect(
      areInstallmentDatesNonDecreasing([
        { sequence: 1, dueDate: "2026-05-01" },
        { sequence: 2, dueDate: "2026-04-01" },
      ])
    ).toBe(false);
  });

  it("builds the preview and save payloads the edit page sends to the API", () => {
    expect(
      buildContractSchedulePreviewPayload({
        totalPrice: "50000",
        downPaymentAmount: "8000",
        monthsFinanced: "24",
        startDate: "2026-03-01",
      })
    ).toEqual({
      totalPrice: 50000,
      downPaymentAmount: 8000,
      monthsFinanced: 24,
      startDate: "2026-03-01T00:00:00.000Z",
    });

    expect(
      buildUpdateContractSchedulePayload({
        totalPrice: 50000,
        downPaymentAmount: 8000,
        monthsFinanced: 2,
        exchangeRate: 3.75,
        startDate: "2026-03-01",
        coOwners: [{ name: "Ana Pérez", dni: "12345678" }],
        applyRecalculatedSchedule: true,
        installments: [
          { sequence: 1, dueDate: "2026-04-01" },
          { sequence: 2, dueDate: "2026-05-01" },
        ],
      })
    ).toEqual({
      totalPrice: 50000,
      downPaymentAmount: 8000,
      monthsFinanced: 2,
      exchangeRate: 3.75,
      startDate: "2026-03-01T00:00:00.000Z",
      coOwners: JSON.stringify([{ name: "Ana Pérez", dni: "12345678" }]),
      applyRecalculatedSchedule: true,
      installments: [
        { sequence: 1, dueDate: "2026-04-01T00:00:00.000Z" },
        { sequence: 2, dueDate: "2026-05-01T00:00:00.000Z" },
      ],
    });
  });
});
