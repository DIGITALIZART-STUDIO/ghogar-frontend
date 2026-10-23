import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthContext } from "@/context/auth-provider";
import { useSelectedProject } from "@/hooks/use-selected-project";
import { useBasePagination } from "@/hooks/useBasePagination";
import { BACKEND_URL, downloadFileWithClient, enhancedFetch } from "@/types/backend";
import {
  ClientFinancialSummaryDto,
  ContractDto,
  ContractListResponse,
  ContractPaymentDto,
  ContractSchedulePreviewPayload,
  CreateContractPayload,
  UpdateContractPayload,
  UpdateContractSchedulePayload,
} from "../_types/contract";

const CONTRACTS_KEY = ["get", "/api/Contracts"] as const;

function buildQueryString(params: Record<string, string | number | boolean | Array<string> | undefined>): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => search.append(key, item));
      return;
    }
    search.append(key, String(value));
  });
  return search.toString();
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await enhancedFetch(`${BACKEND_URL}${path}`);
  return (await response.json()) as T;
}

interface ContractFilters extends Record<string, Array<unknown>> {
  status: Array<string>;
  origin: Array<string>;
}

export function usePaginatedContracts(
  page: number = 1,
  pageSize: number = 10,
  initialStatus: Array<string> = [],
  overdue?: boolean,
  hasBalance?: boolean
) {
  const { handleAuthError } = useAuthContext();
  const { getSelectedProjectId } = useSelectedProject();
  const { search, filters, setSearch, setFilter } = useBasePagination<ContractFilters>(
    {
      status: initialStatus,
      origin: [],
    },
    { disableDebounce: true }
  );

  const selectedProjectId = getSelectedProjectId();
  const queryString = buildQueryString({
    page,
    pageSize,
    search,
    status: filters.status,
    origin: filters.origin,
    projectId: selectedProjectId ?? undefined,
    overdue: overdue ? true : undefined,
    hasBalance: hasBalance ? true : undefined,
  });

  const query = useQuery({
    queryKey: [...CONTRACTS_KEY, queryString],
    queryFn: async () => {
      try {
        return await fetchJson<ContractListResponse>(`/api/Contracts?${queryString}`);
      } catch (error) {
        await handleAuthError(error);
        throw error;
      }
    },
  });

  const handleStatusChange = useCallback(
    (values: Array<string>) => {
      setFilter("status", values);
    },
    [setFilter]
  );

  const handleOriginChange = useCallback(
    (values: Array<string>) => {
      setFilter("origin", values);
    },
    [setFilter]
  );

  return {
    data: query.data?.data ?? [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    search,
    filters,
    setSearch,
    handleStatusChange,
    handleOriginChange,
  };
}

export function useContractById(id: string | undefined) {
  const { handleAuthError } = useAuthContext();

  return useQuery({
    queryKey: ["get", "/api/Contracts/{id}", id],
    enabled: Boolean(id),
    queryFn: async () => {
      try {
        return await fetchJson<ContractDto>(`/api/Contracts/${id}`);
      } catch (error) {
        await handleAuthError(error);
        throw error;
      }
    },
  });
}

export function useContractSchedule(id: string | undefined) {
  const { handleAuthError } = useAuthContext();

  return useQuery({
    queryKey: ["get", "/api/Contracts/{id}/schedule", id],
    enabled: Boolean(id),
    queryFn: async () => {
      try {
        return await fetchJson<Array<ContractPaymentDto>>(`/api/Contracts/${id}/schedule`);
      } catch (error) {
        await handleAuthError(error);
        throw error;
      }
    },
  });
}

export function invalidateContractQueries(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({
    predicate: (query) => {
      const key = query.queryKey;
      return (
        Array.isArray(key) &&
        key.length > 0 &&
        typeof key[1] === "string" &&
        (key[1].startsWith("/api/Contracts") || key[1].startsWith("/api/Clients"))
      );
    },
  });
}

export function useToggleContractValidation() {
  const queryClient = useQueryClient();
  const { handleAuthError } = useAuthContext();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await enhancedFetch(`${BACKEND_URL}/api/Contracts/${id}/toggle-validation-status`, {
          method: "PUT",
        });
        return (await response.json()) as ContractDto;
      } catch (error) {
        await handleAuthError(error);
        throw error;
      }
    },
    onSuccess: () => invalidateContractQueries(queryClient),
  });
}

export function useRescindContract() {
  const queryClient = useQueryClient();
  const { handleAuthError } = useAuthContext();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await enhancedFetch(`${BACKEND_URL}/api/Contracts/${id}/rescind`, {
          method: "PUT",
        });
        return (await response.json()) as ContractDto;
      } catch (error) {
        await handleAuthError(error);
        throw error;
      }
    },
    onSuccess: () => invalidateContractQueries(queryClient),
  });
}

export function useUpdateContract() {
  const queryClient = useQueryClient();
  const { handleAuthError } = useAuthContext();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateContractPayload }) => {
      try {
        const response = await enhancedFetch(`${BACKEND_URL}/api/Contracts/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        return (await response.json()) as ContractDto;
      } catch (error) {
        await handleAuthError(error);
        throw error;
      }
    },
    onSuccess: () => invalidateContractQueries(queryClient),
  });
}

export function usePreviewContractSchedule() {
  const { handleAuthError } = useAuthContext();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: ContractSchedulePreviewPayload }) => {
      try {
        const response = await enhancedFetch(`${BACKEND_URL}/api/Contracts/${id}/schedule/preview`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        return (await response.json()) as Array<ContractPaymentDto>;
      } catch (error) {
        await handleAuthError(error);
        throw error;
      }
    },
  });
}

export function useUpdateContractSchedule() {
  const queryClient = useQueryClient();
  const { handleAuthError } = useAuthContext();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateContractSchedulePayload }) => {
      try {
        const response = await enhancedFetch(`${BACKEND_URL}/api/Contracts/${id}/schedule`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        return (await response.json()) as ContractDto;
      } catch (error) {
        await handleAuthError(error);
        throw error;
      }
    },
    onSuccess: () => invalidateContractQueries(queryClient),
  });
}

export function useCreateContract() {
  const queryClient = useQueryClient();
  const { handleAuthError } = useAuthContext();

  return useMutation({
    mutationFn: async (payload: CreateContractPayload) => {
      try {
        const response = await enhancedFetch(`${BACKEND_URL}/api/Contracts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        return (await response.json()) as ContractDto;
      } catch (error) {
        await handleAuthError(error);
        throw error;
      }
    },
    onSuccess: () => invalidateContractQueries(queryClient),
  });
}

export function useDownloadContractPdf() {
  const { handleAuthError } = useAuthContext();
  return useCallback(
    async (id: string) => {
      try {
        return await downloadFileWithClient("get", "/api/Contracts/{id}/pdf", { path: { id } });
      } catch (error) {
        await handleAuthError(error);
        throw error;
      }
    },
    [handleAuthError]
  );
}

export function useDownloadContractDocx() {
  const { handleAuthError } = useAuthContext();
  return useCallback(
    async (id: string) => {
      try {
        return await downloadFileWithClient("get", "/api/Contracts/{id}/docx", { path: { id } });
      } catch (error) {
        await handleAuthError(error);
        throw error;
      }
    },
    [handleAuthError]
  );
}

export function useDownloadContractSchedulePdf() {
  const { handleAuthError } = useAuthContext();
  return useCallback(
    async (id: string) => {
      try {
        return await downloadFileWithClient("get", "/api/Contracts/{id}/schedule/pdf", { path: { id } });
      } catch (error) {
        await handleAuthError(error);
        throw error;
      }
    },
    [handleAuthError]
  );
}

export function useClientContracts(clientId: string | undefined) {
  const { handleAuthError } = useAuthContext();

  return useQuery({
    queryKey: ["get", "/api/Clients/{id}/contracts", clientId],
    enabled: Boolean(clientId),
    queryFn: async () => {
      try {
        return await fetchJson<Array<ContractDto>>(`/api/Clients/${clientId}/contracts`);
      } catch (error) {
        await handleAuthError(error);
        throw error;
      }
    },
  });
}

export function useClientFinancialSummary(clientId: string | undefined) {
  const { handleAuthError } = useAuthContext();

  return useQuery({
    queryKey: ["get", "/api/Clients/{id}/financial-summary", clientId],
    enabled: Boolean(clientId),
    queryFn: async () => {
      try {
        return await fetchJson<ClientFinancialSummaryDto>(`/api/Clients/${clientId}/financial-summary`);
      } catch (error) {
        await handleAuthError(error);
        throw error;
      }
    },
  });
}
