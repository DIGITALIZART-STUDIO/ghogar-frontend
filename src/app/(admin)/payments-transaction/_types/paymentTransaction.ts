import { components } from "@/types/api";

// Tipos DTO
export type PaymentTransaction = components["schemas"]["PaymentTransactionDTO"];
export type PaymentQuotaSimple = components["schemas"]["PaymentQuotaSimpleDTO"];
export type PaymentQuotaStatus = components["schemas"]["PaymentQuotaStatusDTO"];

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
  PARTIAL = "PARTIAL",
}
