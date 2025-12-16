import { useCallback } from "react";
import { backend as api } from "@/types/backend";
import { useAuthContext } from "@/context/auth-provider";
import { useBasePagination } from "../../../../hooks/useBasePagination";

/**
 * Hook específico para paginación de leads
 * Combina el hook base con la lógica específica de la API de leads
 */
export function useLeadsPagination(page: number = 1, pageSize: number = 10) {
    const { handleAuthError } = useAuthContext();

    // Filtros iniciales específicos para leads
    const initialFilters = {
        status: [] as Array<string>,
        captureSource: [] as Array<string>,
        completionReason: [] as Array<string>,
        clientId: null as string | null,
        userId: null as string | null,
    };

    // Usar el hook base con debounce deshabilitado (se maneja en data-table-toolbar)
    const basePagination = useBasePagination(initialFilters, { disableDebounce: true });

    // Construir parámetros de query
    const queryParams = basePagination.buildQueryParams(page, pageSize);

    // Query específica para leads
    const query = api.useQuery("get", "/api/Leads/paginated", {
        params: {
            query: queryParams,
        },
    }, {
        retry: false,
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });

    // Handlers específicos para leads
    const setStatus = useCallback((values: Array<string>) => {
        basePagination.setFilter("status", values);
    }, [basePagination]);

    const setCaptureSource = useCallback((values: Array<string>) => {
        basePagination.setFilter("captureSource", values);
    }, [basePagination]);

    const setCompletionReason = useCallback((values: Array<string>) => {
        basePagination.setFilter("completionReason", values);
    }, [basePagination]);

    const setClientId = useCallback((value: string | null) => {
        basePagination.setFilter("clientId", value);
    }, [basePagination]);

    const setUserId = useCallback((value: string | null) => {
        basePagination.setFilter("userId", value);
    }, [basePagination]);

    return {
        ...query,
        // Estados del hook base
        search: basePagination.search,
        status: basePagination.filters.status,
        captureSource: basePagination.filters.captureSource,
        completionReason: basePagination.filters.completionReason,
        clientId: basePagination.filters.clientId,
        userId: basePagination.filters.userId,
        orderBy: basePagination.orderBy,
        orderDirection: basePagination.orderDirection,
        // Handlers específicos
        setSearch: basePagination.setSearch,
        setStatus,
        setCaptureSource,
        setCompletionReason,
        setClientId,
        setUserId,
        handleOrderChange: basePagination.handleOrderChange,
        resetFilters: basePagination.resetFilters,
        // Información de paginación
        totalCount: query.data?.meta?.total ?? 0,
        totalPages: query.data?.meta?.totalPages ?? 0,
        currentPage: query.data?.meta?.page ?? 1,
        hasNext: query.data?.meta?.hasNext ?? false,
        hasPrevious: query.data?.meta?.hasPrevious ?? false,
        // Estados de la query
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}
