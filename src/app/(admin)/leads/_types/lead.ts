import { components } from "@/types/api";

// Define el tipo Lead basado en el esquema de tu API
export type Lead = components["schemas"]["Lead"];

export type SummaryLead = components["schemas"]["LeadSummaryDto"];

export type UserSummaryDto = components["schemas"]["UserSummaryDto"];

export enum LeadStatus {
  Registered = "Registered",
  Attended = "Attended",
  InFollowUp = "InFollowUp",
  Completed = "Completed",
  Canceled = "Canceled",
  Expired = "Expired",
}

export enum LeadCaptureSource {
  Company = "Company",
  PersonalFacebook = "PersonalFacebook",
  RealEstateFair = "RealEstateFair",
  Institutional = "Institutional",
  Loyalty = "Loyalty",
}

export enum LeadCompletionReason {
  NotInterested = "NotInterested",
  InFollowUp = "InFollowUp",
  Sale = "Sale",
}
