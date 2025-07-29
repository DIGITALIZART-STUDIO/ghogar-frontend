import { PaginationParams } from "../api/paginated-response";
import { FieldQueryParams } from "./generic-field-query-filter";

export type PaginatedQueryParams<T> = {
  pagination: PaginationParams;
  fieldFilters?: FieldQueryParams<T>;
};
