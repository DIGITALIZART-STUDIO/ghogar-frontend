import type { ElementType } from "react";
import { CheckCircle, Clock, FileSignature, FileText, FolderOpen, ShieldX, Truck } from "lucide-react";

import {
  ContractCoOwner,
  ContractCurrency,
  ContractOrigin,
  ContractPaymentDto,
  ContractSchedulePreviewPayload,
  ContractScheduleTerms,
  ContractStatus,
  PaymentType,
  UpdateContractSchedulePayload,
} from "../_types/contract";

export const ContractStatusLabels: Record<ContractStatus, { label: string; icon: ElementType; className: string }> = {
  [ContractStatus.Draft]: {
    label: "Borrador",
    icon: FileText,
    className: "text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
  },
  [ContractStatus.PendingValidation]: {
    label: "Pendiente de validación",
    icon: Clock,
    className: "text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  },
  [ContractStatus.Active]: {
    label: "Activo",
    icon: CheckCircle,
    className: "text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
  },
  [ContractStatus.Completed]: {
    label: "Completado",
    icon: FileSignature,
    className: "text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  },
  [ContractStatus.Rescinded]: {
    label: "Anulado",
    icon: ShieldX,
    className: "text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
  },
};

export const ContractOriginLabels: Record<ContractOrigin, { label: string; icon: ElementType; className: string }> = {
  [ContractOrigin.Pipeline]: {
    label: "Separación",
    icon: FolderOpen,
    className: "text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
  },
  [ContractOrigin.Direct]: {
    label: "Directo",
    icon: FileSignature,
    className: "text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
  },
  [ContractOrigin.Legacy]: {
    label: "Legado",
    icon: Truck,
    className: "text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800",
  },
};

export const PaymentTypeLabels: Record<PaymentType, string> = {
  [PaymentType.DownPayment]: "Enganche",
  [PaymentType.Installment]: "Cuota",
  [PaymentType.Extra]: "Extra",
};

export function formatContractCurrency(amount: number, currency: string): string {
  const symbol = currency === "DOLARES" ? "US$" : "S/";
  return `${symbol} ${amount.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function contractCurrencyFromProject(projectCurrency?: string | null): ContractCurrency {
  const normalized = (projectCurrency ?? "").trim().toUpperCase();
  if (normalized === "USD" || normalized === "DOLARES") {
    return ContractCurrency.DOLARES;
  }
  if (normalized === "PEN" || normalized === "SOLES" || normalized === "") {
    return ContractCurrency.SOLES;
  }
  throw new Error(`La moneda del proyecto (${projectCurrency}) no está soportada. Use PEN o USD.`);
}

export function contractCurrencyLabel(currency: string): string {
  return currency === ContractCurrency.DOLARES ? "Dólares (US$)" : "Soles (S/)";
}

export function isContractStatus(value: string): value is ContractStatus {
  return Object.values(ContractStatus).includes(value as ContractStatus);
}

export function isContractOrigin(value: string): value is ContractOrigin {
  return Object.values(ContractOrigin).includes(value as ContractOrigin);
}

export function canToggleContractValidation(status: ContractStatus): boolean {
  return (
    status === ContractStatus.PendingValidation || status === ContractStatus.Draft || status === ContractStatus.Active
  );
}

export function canRegisterContractPayment(status: ContractStatus): boolean {
  return status === ContractStatus.Active || status === ContractStatus.PendingValidation;
}

export function canEditContract(status: ContractStatus): boolean {
  return status !== ContractStatus.Completed && status !== ContractStatus.Rescinded;
}

export function parseContractCoOwners(raw?: string | null): Array<ContractCoOwner> {
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as Array<ContractCoOwner>;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export type EditableContractInstallment = {
  sequence: number;
  dueDate: string;
  amountDue: number;
  amountPaid: number;
  paid: boolean;
  locked: boolean;
};

export function toContractDateOnly(value: string | null | undefined): string {
  if (!value) {
    return "";
  }
  return value.slice(0, 10);
}

export function toContractIsoDate(value: string): string {
  return new Date(`${toContractDateOnly(value)}T00:00:00Z`).toISOString();
}

type NumericFormValue = number | string;

type ContractScheduleTermsInput = {
  totalPrice: NumericFormValue;
  downPaymentAmount: NumericFormValue;
  monthsFinanced: NumericFormValue;
  startDate: string;
};

export function pickContractScheduleTerms(values: ContractScheduleTermsInput): ContractScheduleTerms {
  return {
    totalPrice: Number(values.totalPrice),
    downPaymentAmount: Number(values.downPaymentAmount),
    monthsFinanced: Number(values.monthsFinanced),
    startDate: toContractDateOnly(values.startDate),
  };
}

export function buildContractSchedulePreviewPayload(
  values: ContractScheduleTermsInput
): ContractSchedulePreviewPayload {
  const terms = pickContractScheduleTerms(values);
  return {
    ...terms,
    startDate: toContractIsoDate(terms.startDate),
  };
}

export function buildUpdateContractSchedulePayload(data: {
  totalPrice: NumericFormValue;
  downPaymentAmount: NumericFormValue;
  monthsFinanced: NumericFormValue;
  exchangeRate: NumericFormValue;
  startDate: string;
  coOwners?: Array<ContractCoOwner>;
  applyRecalculatedSchedule: boolean;
  installments: Array<{ sequence: number; dueDate: string }>;
}): UpdateContractSchedulePayload {
  return {
    totalPrice: Number(data.totalPrice),
    downPaymentAmount: Number(data.downPaymentAmount),
    monthsFinanced: Number(data.monthsFinanced),
    exchangeRate: Number(data.exchangeRate),
    startDate: toContractIsoDate(data.startDate),
    coOwners: JSON.stringify(data.coOwners ?? []),
    applyRecalculatedSchedule: data.applyRecalculatedSchedule,
    installments: data.installments.map((installment) => ({
      sequence: installment.sequence,
      dueDate: toContractIsoDate(installment.dueDate),
    })),
  };
}

export function scheduleTermsChanged(current: ContractScheduleTerms, baseline: ContractScheduleTerms): boolean {
  return (
    current.totalPrice !== baseline.totalPrice ||
    current.downPaymentAmount !== baseline.downPaymentAmount ||
    current.monthsFinanced !== baseline.monthsFinanced ||
    current.startDate !== baseline.startDate
  );
}

export function isContractInstallmentLocked(payment: { paid: boolean; amountPaid?: number | null }): boolean {
  return payment.paid || (payment.amountPaid ?? 0) > 0;
}

export function installmentsFromSchedule(schedule: Array<ContractPaymentDto>): Array<EditableContractInstallment> {
  return schedule
    .filter((payment) => payment.type === PaymentType.Installment)
    .sort((left, right) => left.sequence - right.sequence)
    .map((payment) => ({
      sequence: payment.sequence,
      dueDate: toContractDateOnly(payment.dueDate),
      amountDue: payment.amountDue ?? 0,
      amountPaid: payment.amountPaid ?? 0,
      paid: payment.paid,
      locked: isContractInstallmentLocked(payment),
    }));
}

export function areInstallmentDatesNonDecreasing(installments: Array<{ sequence: number; dueDate: string }>): boolean {
  const sorted = [...installments].sort((left, right) => left.sequence - right.sequence);
  for (let index = 1; index < sorted.length; index += 1) {
    const previous = sorted[index - 1]?.dueDate ?? "";
    const current = sorted[index]?.dueDate ?? "";
    if (current && previous && current < previous) {
      return false;
    }
  }
  return true;
}

export type ContractPaymentRowStatus = "paid" | "partial" | "overdue" | "pending";

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function toLocalDateOnly(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getContractPaymentRowStatus(payment: {
  paid: boolean;
  amountPaid?: number | null;
  dueDate?: string | null;
  now?: number;
}): ContractPaymentRowStatus {
  if (payment.paid) {
    return "paid";
  }
  if ((payment.amountPaid ?? 0) > 0) {
    return "partial";
  }
  if (!payment.dueDate) {
    return "pending";
  }
  const now = payment.now ?? Date.now();
  if (DATE_ONLY_PATTERN.test(payment.dueDate)) {
    return payment.dueDate < toLocalDateOnly(now) ? "overdue" : "pending";
  }
  const dueDate = new Date(payment.dueDate).getTime();
  if (!Number.isNaN(dueDate) && dueDate < now) {
    return "overdue";
  }
  return "pending";
}
