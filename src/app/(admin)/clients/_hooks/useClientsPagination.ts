import { useCallback } from "react";
import { backend as api } from "@/types/backend";
import { useAuthContext } from "@/context/auth-provider";
import { useBasePagination } from "../../../../hooks/useBasePagination";

/**
 * Hook específico para paginación de clientes con búsqueda debounced
 */
export function useClientsPagination(page: number = 1, pageSize: number = 10) {
    const { handleAuthError } = useAuthContext();

    // Filtros iniciales específicos para clientes
    const initialFilters = {
        isActive: [] as Array<boolean>,
        type: [] as Array<string>,
    };

    // Usar el hook base con debounce deshabilitado (se maneja en data-table-toolbar)
    const basePagination = useBasePagination(initialFilters, { disableDebounce: true });

    // Extraer las propiedades que necesitamos
    const { search, filters, orderBy, orderDirection, setSearch, setFilter, handleOrderChange, resetFilters } = basePagination;

    // Handlers específicos para clientes
    const setIsActive = useCallback((values: Array<boolean>) => {
        setFilter("isActive", values);
    }, [setFilter]);

    const setType = useCallback((values: Array<string>) => {
        setFilter("type", values);
    }, [setFilter]);

    // Construir parámetros de query usando buildQueryParams del hook base
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

    return {
        ...query,
        // Estados de búsqueda y filtros
        search,
        isActive: filters.isActive,
        type: filters.type,
        orderBy,
        orderDirection,
        // Handlers
        setSearch,
        setIsActive,
        setType,
        handleOrderChange,
        resetFilters,
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
