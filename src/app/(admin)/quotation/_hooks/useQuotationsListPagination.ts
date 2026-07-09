import { useCallback } from "react";

import { QuotationStatus } from "@/app/(admin)/quotation/_types/quotation";
import { useAuthContext } from "@/context/auth-provider";
import { backend as api } from "@/types/backend";
import { useSelectedProject } from "../../../../hooks/use-selected-project";
import { useBasePagination } from "../../../../hooks/useBasePagination";

interface QuotationsFilters extends Record<string, Array<unknown>> {
  status: Array<string>;
  clientId: Array<string>;
}

export function useQuotationsListPagination(page: number = 1, pageSize: number = 10, isGlobalView = false) {
  const { handleAuthError } = useAuthContext();
  const { getSelectedProjectId } = useSelectedProject();

  const { search, filters, orderBy, orderDirection, setSearch, setFilter, handleOrderChange, resetFilters } =
    useBasePagination<QuotationsFilters>(
      {
        status: [],
        clientId: [],
      },
      { disableDebounce: true }
    );

  const statusEnums = filters.status?.length > 0 ? filters.status.map((s) => s as QuotationStatus) : undefined;

  const clientIdGuids = filters.clientId?.length > 0 ? filters.clientId.map((id) => id as string) : undefined;

  const selectedProjectId = getSelectedProjectId();

  const queryParams = {
    query: {
      page,
      pageSize,
      search,
      status: statusEnums,
      clientId: clientIdGuids,
      projectId: selectedProjectId ?? undefined,
      orderBy,
    },
  };

  const globalQuery = api.useQuery(
    "get",
    "/api/Quotations/paginated",
    { params: queryParams },
    {
      enabled: isGlobalView,
      onError: async (error: unknown) => {
        await handleAuthError(error);
      },
    }
  );

  const advisorQuery = api.useQuery(
    "get",
    "/api/Quotations/advisor/paginated",
    { params: queryParams },
    {
      enabled: !isGlobalView,
      onError: async (error: unknown) => {
        await handleAuthError(error);
      },
    }
  );

  const query = isGlobalView ? globalQuery : advisorQuery;

  const handleStatusChange = useCallback(
    (values: Array<string>) => {
      setFilter("status", values);
    },
    [setFilter]
  );

  const handleClientIdChange = useCallback(
    (values: Array<string>) => {
      setFilter("clientId", values);
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
    orderBy,
    orderDirection,
    setSearch,
    handleStatusChange,
    handleClientIdChange,
    handleOrderChange,
    resetFilters,
  };
}
