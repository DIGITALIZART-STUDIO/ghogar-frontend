import { useCallback } from "react";

import { PaymentMethod, ReservationStatus } from "@/app/(admin)/reservations/_types/reservation";
import { useAuthContext } from "@/context/auth-provider";
import { backend as api } from "@/types/backend";
import { useSelectedProject } from "../../../../hooks/use-selected-project";
import { useBasePagination } from "../../../../hooks/useBasePagination";

interface ReservationsFilters extends Record<string, Array<unknown>> {
  status: Array<string>;
  paymentMethod: Array<string>;
}

export function useReservationsListPagination(page: number = 1, pageSize: number = 10, isGlobalView = false) {
  const { handleAuthError } = useAuthContext();
  const { getSelectedProjectId } = useSelectedProject();

  const { search, filters, orderBy, orderDirection, setSearch, setFilter, handleOrderChange, resetFilters } =
    useBasePagination<ReservationsFilters>(
      {
        status: [],
        paymentMethod: [],
      },
      { disableDebounce: true }
    );

  const statusEnums = filters.status?.length > 0 ? filters.status.map((s) => s as ReservationStatus) : undefined;

  const paymentMethodEnums =
    filters.paymentMethod?.length > 0 ? filters.paymentMethod.map((p) => p as PaymentMethod) : undefined;

  const selectedProjectId = getSelectedProjectId();

  const queryParams = {
    query: {
      page,
      pageSize,
      search,
      status: statusEnums,
      paymentMethod: paymentMethodEnums,
      projectId: selectedProjectId ?? undefined,
      orderBy,
    },
  };

  const globalQuery = api.useQuery(
    "get",
    "/api/Reservations/paginated",
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
    "/api/Reservations/advisor/paginated",
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

  const handlePaymentMethodChange = useCallback(
    (values: Array<string>) => {
      setFilter("paymentMethod", values);
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
    handlePaymentMethodChange,
    handleOrderChange,
    resetFilters,
  };
}
