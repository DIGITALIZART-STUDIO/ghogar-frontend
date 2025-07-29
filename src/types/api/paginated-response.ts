import { components } from "../api";

export type PaginatedResponse<T> = {
  data: Array<T>;
  meta: components["schemas"]["PaginationMetadata"];
};

export type PaginationParams = { page?: number; pageSize?: number };
