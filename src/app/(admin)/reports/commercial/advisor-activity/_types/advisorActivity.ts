import { LeadCaptureSource, LeadStatus } from "@/app/(admin)/leads/_types/lead";

export enum TaskType {
  Call = "Call",
  Meeting = "Meeting",
  Email = "Email",
  Visit = "Visit",
  Other = "Other",
}

export interface AdvisorActivityReportItem {
  leadId: string;
  leadCode: string;
  clientId: string | null;
  clientName: string;
  clientPhone: string;
  assignedToId: string | null;
  assignedToName: string | null;
  status: LeadStatus;
  captureSource: LeadCaptureSource;
  entryDate: string;
  projectId: string | null;
  projectName: string | null;
  taskCount: number;
  lastTaskDate: string | null;
}

export interface AdvisorActivityTask {
  id: string;
  type: TaskType;
  description: string;
  scheduledDate: string;
  completedDate: string | null;
  isCompleted: boolean;
}

export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export interface AdvisorActivityReportResponse {
  data: Array<AdvisorActivityReportItem>;
  meta: PaginationMeta;
}

export type HasAdvisorFilter = "all" | "with-advisor" | "without-advisor";

export interface AdvisorActivityFilters {
  from: string; // yyyy-MM-dd
  to: string; // yyyy-MM-dd
  advisorId?: string;
  status: Array<LeadStatus>;
  captureSource: Array<LeadCaptureSource>;
  hasAdvisor: HasAdvisorFilter;
  projectId?: string;
}
