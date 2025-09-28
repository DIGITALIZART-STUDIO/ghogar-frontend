import { useCallback } from "react";
import { backend as api } from "@/types/backend";
import { useAuthContext } from "@/context/auth-provider";
import { useBasePagination } from "./useBasePagination";

/**
 * Hook específico para paginación de usuarios
 * Combina el hook base con la lógica específica de la API de usuarios
 */
export function useUsersPagination(page: number = 1, pageSize: number = 10) {
    const { handleAuthError } = useAuthContext();

    // Filtros iniciales específicos para usuarios
    const initialFilters = {
        isActive: [] as Array<boolean>,
        roleName: [] as Array<string>,
    };

    // Usar el hook base para la lógica común
    const basePagination = useBasePagination(initialFilters);

    // Construir parámetros de query
    const queryParams = basePagination.buildQueryParams(page, pageSize);

    // Query específica para usuarios
    const query = api.useQuery("get", "/api/Users/all", {
        params: {
            query: queryParams,
        },
    }, {
        retry: false,
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });

    // Handlers específicos para usuarios
    const setIsActive = useCallback((values: Array<boolean>) => {
        basePagination.setFilter("isActive", values);
    }, [basePagination]);

    const setRoleName = useCallback((values: Array<string>) => {
        basePagination.setFilter("roleName", values);
    }, [basePagination]);

    return {
        ...query,
        // Estados del hook base
        search: basePagination.search,
        isActive: basePagination.filters.isActive,
        roleName: basePagination.filters.roleName,
        orderBy: basePagination.orderBy,
        orderDirection: basePagination.orderDirection,
        // Handlers específicos
        setSearch: basePagination.setSearch,
        setIsActive,
        setRoleName,
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
