import { useCallback } from "react";
import { backend as api } from "@/types/backend";
import { useAuthContext } from "@/context/auth-provider";
import { useBasePagination } from "../../../../hooks/useBasePagination";

/**
 * Hook específico para paginación de clientes
 * Combina el hook base con la lógica específica de la API de clientes
 */
export function useClientsPagination(page: number = 1, pageSize: number = 10) {
    const { handleAuthError } = useAuthContext();

    // Filtros iniciales específicos para clientes
    const initialFilters = {
        isActive: [] as Array<boolean>,
        type: [] as Array<string>,
    };

    // Usar el hook base para la lógica común
    const basePagination = useBasePagination(initialFilters);

    // Construir parámetros de query
    const queryParams = basePagination.buildQueryParams(page, pageSize);

    // Query específica para clientes
    const query = api.useQuery("get", "/api/Clients/paginated", {
        params: {
            query: queryParams,
        },
    }, {
        retry: false,
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });

    // Handlers específicos para clientes
    const setIsActive = useCallback((values: Array<boolean>) => {
        basePagination.setFilter("isActive", values);
    }, [basePagination]);

    const setType = useCallback((values: Array<string>) => {
        basePagination.setFilter("type", values);
    }, [basePagination]);

    return {
        ...query,
        // Estados del hook base
        search: basePagination.search,
        isActive: basePagination.filters.isActive,
        type: basePagination.filters.type,
        orderBy: basePagination.orderBy,
        orderDirection: basePagination.orderDirection,
        // Handlers específicos
        setSearch: basePagination.setSearch,
        setIsActive,
        setType,
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
