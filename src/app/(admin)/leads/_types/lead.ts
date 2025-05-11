import { components } from "@/types/api";

// Define el tipo Lead basado en el esquema de tu API
export type Lead = components["schemas"]["Lead"];

export type UserSummaryDto = components["schemas"]["UserSummaryDto"];

export enum LeadStatus {
  Registered = "Registered",
  Attended = "Attended",
}
