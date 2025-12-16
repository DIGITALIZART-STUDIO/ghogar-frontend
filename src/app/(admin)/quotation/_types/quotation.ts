import { components } from "@/types/api";

export type SummaryQuotation = components["schemas"]["QuotationSummaryDTO"];
export type Quotation = components["schemas"]["QuotationDTO"];

export enum QuotationStatus {
  ISSUED = "ISSUED",
  ACCEPTED = "ACCEPTED",
  CANCELED = "CANCELED",
}
