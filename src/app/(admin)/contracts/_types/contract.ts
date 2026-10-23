export enum ContractOrigin {
  Pipeline = "Pipeline",
  Direct = "Direct",
  Legacy = "Legacy",
}

export enum ContractStatus {
  Draft = "Draft",
  PendingValidation = "PendingValidation",
  Active = "Active",
  Completed = "Completed",
  Rescinded = "Rescinded",
}

export enum PaymentType {
  DownPayment = "DownPayment",
  Installment = "Installment",
  Extra = "Extra",
}

export enum ContractCurrency {
  SOLES = "SOLES",
  DOLARES = "DOLARES",
}

export type ContractDto = {
  id: string;
  code: string;
  clientId: string;
  clientName: string;
  lotId: string;
  lotNumber: string;
  blockName: string;
  projectId: string;
  projectName: string;
  reservationId?: string | null;
  quotationId?: string | null;
  quotationCode?: string | null;
  origin: ContractOrigin;
  status: ContractStatus;
  totalPrice: number;
  downPaymentAmount: number;
  amountFinanced: number;
  monthsFinanced: number;
  currency: ContractCurrency;
  exchangeRate: number;
  startDate: string;
  signedAt?: string | null;
  coOwners?: string | null;
  paymentCount: number;
  nextPaymentDueDate?: string | null;
  nextPaymentAmount: number;
  amountPaid: number;
  remainingAmount: number;
  createdAt: string;
  modifiedAt: string;
};

export type ContractPaymentDto = {
  id: string;
  reservationId: string;
  contractId?: string | null;
  type: PaymentType;
  sequence: number;
  dueDate: string;
  amountDue: number;
  amountPaid: number;
  remainingAmount: number;
  paid: boolean;
  createdAt: string;
  modifiedAt: string;
};

export type ContractListResponse = {
  data: Array<ContractDto>;
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
};

export type CreateContractPayload = {
  origin: ContractOrigin.Direct | ContractOrigin.Legacy;
  clientId: string;
  lotId: string;
  totalPrice: number;
  downPaymentAmount: number;
  monthsFinanced: number;
  currency: ContractCurrency;
  exchangeRate: number;
  startDate?: string;
  paidInstallments?: number;
};

export type ContractCoOwner = {
  name: string;
  dni: string;
  address?: string;
  phone?: string;
  email?: string;
};

export type UpdateContractPayload = {
  totalPrice: number;
  downPaymentAmount: number;
  monthsFinanced: number;
  exchangeRate: number;
  startDate?: string;
  coOwners?: string | null;
};

export type ContractScheduleTerms = {
  totalPrice: number;
  downPaymentAmount: number;
  monthsFinanced: number;
  startDate: string;
};

export type ContractSchedulePreviewPayload = ContractScheduleTerms;

export type UpdateContractScheduleItemPayload = {
  sequence: number;
  dueDate: string;
};

export type UpdateContractSchedulePayload = UpdateContractPayload & {
  applyRecalculatedSchedule: boolean;
  installments: Array<UpdateContractScheduleItemPayload>;
};

export type ClientCurrencyBalanceDto = {
  currency: ContractCurrency;
  remainingAmount: number;
  overdueAmount: number;
  totalPaid: number;
};

export type ClientFinancialSummaryDto = {
  activeContracts: number;
  nextPaymentDueDate?: string | null;
  balances: Array<ClientCurrencyBalanceDto>;
};
