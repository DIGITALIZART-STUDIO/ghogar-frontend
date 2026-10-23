import { describe, expect, it } from "vitest";

import { ContractCurrency, ContractOrigin, ContractStatus, PaymentType } from "../_types/contract";
import {
  canEditContract,
  canRegisterContractPayment,
  canToggleContractValidation,
  contractCurrencyFromProject,
  contractCurrencyLabel,
  ContractOriginLabels,
  ContractStatusLabels,
  formatContractCurrency,
  getContractPaymentRowStatus,
  isContractOrigin,
  isContractStatus,
  parseContractCoOwners,
  PaymentTypeLabels,
} from "./contracts.utils";

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
});
