import { components } from "@/types/api";

export type ReservationDto = components["schemas"]["ReservationDto"];
export type ReservationWithPaymentsDto = components["schemas"]["ReservationWithPaymentsDto"];
export type ReservationCreateDto = components["schemas"]["ReservationCreateDto"];

export enum ReservationStatus {
  ISSUED = "ISSUED",
  CANCELED = "CANCELED",
  ANULATED = "ANULATED",
}

export enum Currency {
  SOLES = "SOLES",
  DOLARES = "DOLARES",
}

export enum PaymentMethod {
  CASH = "CASH",
  BANK_DEPOSIT = "BANK_DEPOSIT",
  BANK_TRANSFER = "BANK_TRANSFER",
}

export enum ContractValidationStatus {
  None = "None",
  PendingValidation = "PendingValidation",
  Validated = "Validated"
}
