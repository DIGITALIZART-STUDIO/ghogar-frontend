import { ContractCurrency, ContractOrigin } from "@/app/(admin)/contracts/_types/contract";

export type PendingInstallmentsFilter = "all" | "pending" | "overdue";

export interface CreditsReportItem {
  id: string;
  code: string;
  clientId: string;
  clientName: string;
  clientDni?: string | null;
  projectId: string;
  projectName: string;
  lotNumber: string;
  blockName: string;
  startDate: string;
  currency: ContractCurrency;
  totalPrice: number;
  downPaymentAmount: number;
  amountPaid: number;
  remainingAmount: number;
  monthsFinanced: number;
  pendingInstallmentCount: number;
  nextPaymentDueDate?: string | null;
  nextPaymentAmount: number;
  origin: ContractOrigin;
}

export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export interface CreditsReportResponse {
  data: Array<CreditsReportItem>;
  meta: PaginationMeta;
}

export interface CreditsReportFilters {
  from: string;
  to: string;
  search?: string;
  projectId?: string;
  pendingInstallments: PendingInstallmentsFilter;
}
