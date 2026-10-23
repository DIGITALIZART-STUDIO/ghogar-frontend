import { ContractCurrency } from "@/app/(admin)/contracts/_types/contract";
import { PaymentMethod } from "@/app/(admin)/reservations/_types/reservation";

export enum IncomeReportOrigin {
  Contract = "Contract",
  Reservation = "Reservation",
}

export interface IncomeReportItem {
  id: string;
  paymentDate: string;
  amountPaid: number;
  currency: ContractCurrency;
  paymentMethod: PaymentMethod;
  referenceNumber?: string | null;
  clientId?: string | null;
  clientName: string;
  clientDni?: string | null;
  projectId?: string | null;
  projectName?: string | null;
  contractId?: string | null;
  contractCode?: string | null;
  reservationId?: string | null;
  origin: IncomeReportOrigin;
  quotasCovered: number;
}

export interface IncomeReportCurrencyTotal {
  currency: ContractCurrency;
  paymentCount: number;
  totalAmount: number;
  reservationPaymentCount: number;
  reservationPaymentAmount: number;
}

export interface IncomeReportSummary {
  paymentCount: number;
  totalAmount: number;
  reservationPaymentCount: number;
  reservationPaymentAmount: number;
  totalsByCurrency: Array<IncomeReportCurrencyTotal>;
}

export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export interface IncomeReportResponse {
  data: Array<IncomeReportItem>;
  meta: PaginationMeta;
  summary: IncomeReportSummary;
}

export interface IncomeReportFilters {
  from: string;
  to: string;
  projectId?: string;
}
