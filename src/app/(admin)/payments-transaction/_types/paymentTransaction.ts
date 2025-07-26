import { components } from "@/types/api";

// Tipos DTO
export type PaymentTransaction = components["schemas"]["PaymentTransactionDTO"];
export type PaymentTransactionCreate = components["schemas"]["PaymentTransactionCreateDTO"];
export type PaymentTransactionUpdate = components["schemas"]["PaymentTransactionUpdateDTO"];
export type PaymentQuotaSimple = components["schemas"]["PaymentQuotaSimpleDTO"];

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
  PARTIAL = "PARTIAL",
}
