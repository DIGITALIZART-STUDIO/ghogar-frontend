import { ClientTypes } from "@/app/(admin)/clients/_types/client";
import { components } from "@/types/api";

// Define el tipo LeadTask basado en el esquema de tu API
export type LeadTask = components["schemas"]["LeadTask"];

export type TaskFilters = components["schemas"]["TaskFilterRequest"];

export type LeadTasksByLeadId = {
  lead: LeadBydLeadId;
  tasks: Array<LeadTaskDetail>;
};

export interface LeadBydLeadId {
  id: string;
  clientId: string;
  client: {
    id: string;
    name: string;
    dni?: string;
    ruc?: string;
    companyName?: string;
    phoneNumber?: string;
    email?: string;
    address?: string;
    type: ClientTypes;
    isActive: boolean;
  };
  assignedToId: string;
  assignedTo: {
    id: string;
    userName: string;
    name: string;
    isActive: boolean;
  };
  status: string;
  procedency: string;
  isActive: boolean;
}

export interface LeadTaskDetail {
  id: string;
  leadId: string;
  lead?: LeadBydLeadId;
  assignedToId: string;
  assignedTo: {
    id: string;
    userName: string;
    name: string;
    isActive: boolean;
  };
  description: string;
  scheduledDate: string; // ISO date string
  completedDate?: string; // ISO date string
  isCompleted: boolean;
  type: TaskTypes;
  isActive: boolean;
}

export enum TaskTypes {
  Call = "Call",
  Meeting = "Meeting",
  Email = "Email",
  Visit = "Visit",
  Other = "Other",
}
