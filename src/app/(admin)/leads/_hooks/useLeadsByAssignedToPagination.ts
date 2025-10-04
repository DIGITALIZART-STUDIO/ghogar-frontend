import { useCallback } from "react";
import { backend as api } from "@/types/backend";
import { useAuthContext } from "@/context/auth-provider";
import { useBasePagination } from "../../../../hooks/useBasePagination";

/**
 * Hook específico para paginación de leads asignados a un usuario
 * Combina el hook base con la lógica específica de la API de leads asignados
 */
export function useLeadsByAssignedToPagination(
    userId: string,
    page: number = 1,
    pageSize: number = 10
) {
    const { handleAuthError } = useAuthContext();

    // Filtros iniciales específicos para leads
    const initialFilters = {
        status: [] as Array<string>,
        captureSource: [] as Array<string>,
        completionReason: [] as Array<string>,
        clientId: null as string | null,
    };

    // Usar el hook base para la lógica común
    const basePagination = useBasePagination(initialFilters);

    // Construir parámetros de query
    const queryParams = basePagination.buildQueryParams(page, pageSize);

    // Query específica para leads asignados
    const query = api.useQuery("get", "/api/Leads/assignedto/{userId}/paginated", {
        params: {
            path: {
                userId,
            },
            query: queryParams,
        },
    }, {
        enabled: !!userId, // solo consulta si hay userId
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

    return {
        ...query,
        // Estados del hook base
        search: basePagination.search,
        status: basePagination.filters.status,
        captureSource: basePagination.filters.captureSource,
        completionReason: basePagination.filters.completionReason,
        clientId: basePagination.filters.clientId,
        orderBy: basePagination.orderBy,
        orderDirection: basePagination.orderDirection,
        // Handlers específicos
        setSearch: basePagination.setSearch,
        setStatus,
        setCaptureSource,
        setCompletionReason,
        setClientId,
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
