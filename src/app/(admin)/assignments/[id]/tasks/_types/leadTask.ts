import { components } from "@/types/api";

// Define el tipo LeadTask basado en el esquema de tu API
export type LeadTask = components["schemas"]["LeadTask"];

export type LeadTasksByLeadId = components["schemas"]["LeadTasksResponseDto"];

export enum TaskTypes {
  Call = "Call",
  Meeting = "Meeting",
  Email = "Email",
  Visit = "Visit",
  Other = "Other",
}
