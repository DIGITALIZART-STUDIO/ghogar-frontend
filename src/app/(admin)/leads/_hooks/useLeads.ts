import { useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { backend as api, downloadFileWithClient } from "@/types/backend";
import { useAuthContext } from "@/context/auth-provider";
import { useLeadsPagination } from "@/app/(admin)/leads/_hooks/useLeadsPagination";
import { useLeadsByAssignedToPagination } from "@/app/(admin)/leads/_hooks/useLeadsByAssignedToPagination";

// Para todos los leads paginados (wrapper del nuevo hook)
export function usePaginatedLeads(page: number = 1, pageSize: number = 10) {
    const leadsPagination = useLeadsPagination(page, pageSize);

    return {
        data: leadsPagination.data,
        isLoading: leadsPagination.isLoading,
        isError: leadsPagination.isError,
        error: leadsPagination.error,
        refetch: leadsPagination.refetch,
        // Estados de búsqueda y filtros
        search: leadsPagination.search,
        status: leadsPagination.status,
        captureSource: leadsPagination.captureSource,
        completionReason: leadsPagination.completionReason,
        clientId: leadsPagination.clientId,
        userId: leadsPagination.userId,
        orderBy: leadsPagination.orderBy,
        orderDirection: leadsPagination.orderDirection,
        // Handlers
        setSearch: leadsPagination.setSearch,
        setStatus: leadsPagination.setStatus,
        setCaptureSource: leadsPagination.setCaptureSource,
        setCompletionReason: leadsPagination.setCompletionReason,
        setClientId: leadsPagination.setClientId,
        setUserId: leadsPagination.setUserId,
        handleOrderChange: leadsPagination.handleOrderChange,
        resetFilters: leadsPagination.resetFilters,
    };
}

// Para leads asignados a un usuario, paginados (wrapper del nuevo hook)
export function usePaginatedLeadsByAssignedTo(page: number = 1, pageSize: number = 10) {
    const leadsPagination = useLeadsByAssignedToPagination(page, pageSize);

    return {
        data: leadsPagination.data,
        isLoading: leadsPagination.isLoading,
        isError: leadsPagination.isError,
        error: leadsPagination.error,
        refetch: leadsPagination.refetch,
        // Estados de búsqueda y filtros
        search: leadsPagination.search,
        status: leadsPagination.status,
        captureSource: leadsPagination.captureSource,
        completionReason: leadsPagination.completionReason,
        clientId: leadsPagination.clientId,
        orderBy: leadsPagination.orderBy,
        orderDirection: leadsPagination.orderDirection,
        // Handlers
        setSearch: leadsPagination.setSearch,
        setStatus: leadsPagination.setStatus,
        setCaptureSource: leadsPagination.setCaptureSource,
        setCompletionReason: leadsPagination.setCompletionReason,
        setClientId: leadsPagination.setClientId,
        handleOrderChange: leadsPagination.handleOrderChange,
        resetFilters: leadsPagination.resetFilters,
    };
}

// Hook para actualizar el estado de un lead
export function useUpdateLeadStatus() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("put", "/api/Leads/{id}/status", {
        onSuccess: () => {
            // Invalidar queries de leads con las query keys correctas
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/paginated"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/assignedto"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/assignedto/paginated"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/assigned/summary"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/available-for-quotation"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/users/with-leads/summary"] });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para obtener resumen de usuarios
export function useUsersSummary() {
    const { handleAuthError } = useAuthContext();

    return api.useQuery("get", "/api/Leads/users/summary", undefined, {
        retry: false,
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para obtener usuarios con leads asignados (nuevo endpoint)
export function useUsersWithLeadsSummary(projectId?: string) {
    const { handleAuthError } = useAuthContext();

    return api.useQuery("get", "/api/Leads/users/with-leads/summary", {
        params: {
            query: {
                projectId: projectId ?? undefined,
            },
        },
    }, {
        retry: false,
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

export function useCreateLead() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("post", "/api/Leads", {
        onSuccess: () => {
            // Invalidar queries de leads con las query keys correctas
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/paginated"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/assignedto"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/assignedto/paginated"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/assigned/summary"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/available-for-quotation"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/users/with-leads/summary"] });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Actualizar lead
export function useUpdateLead() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("put", "/api/Leads/{id}", {
        onSuccess: () => {
            // Invalidar queries de leads con las query keys correctas
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/paginated"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/assignedto"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/assignedto/paginated"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/assigned/summary"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/available-for-quotation"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/users/with-leads/summary"] });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Eliminar múltiples leads
export function useDeleteLeads() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("delete", "/api/Leads/batch", {
        onSuccess: () => {
            // Invalidar queries de leads con las query keys correctas
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/paginated"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/assignedto"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/assignedto/paginated"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/assigned/summary"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/available-for-quotation"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/users/with-leads/summary"] });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Activar múltiples leads
export function useActivateLeads() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("post", "/api/Leads/batch/activate", {
        onSuccess: () => {
            // Invalidar queries de leads con las query keys correctas
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/paginated"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/assignedto"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/assignedto/paginated"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/assigned/summary"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/available-for-quotation"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/users/with-leads/summary"] });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Chequear y actualizar leads expirados
export function useCheckAndUpdateExpiredLeads() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("post", "/api/Leads/check-expired", {
        onSuccess: () => {
            // Invalidar queries de leads con las query keys correctas
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/paginated"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/assignedto"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/assignedto/paginated"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/assigned/summary"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/available-for-quotation"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/users/with-leads/summary"] });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Obtener leads disponibles para cotización por usuario, excluyendo una cotización opcionalmente
export function useAvailableLeadsForQuotation(
    excludeQuotationId?: string,
    enabled = true
) {
    const { handleAuthError } = useAuthContext();

    return api.useQuery("get", "/api/Leads/available-for-quotation/{excludeQuotationId}", {
        params: {
            path: {
                excludeQuotationId: excludeQuotationId ?? "",
            },
        },
    }, {
        enabled: enabled,
        retry: false,
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

export function useAssignedLeadsSummary(enabled = true) {
    const { handleAuthError } = useAuthContext();

    return api.useQuery("get", "/api/Leads/assigned/summary", undefined, {
        enabled: enabled,
        retry: false,
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

export function useDownloadLeadsExcel() {
    const { handleAuthError } = useAuthContext();

    return {
        mutateAsync: async (): Promise<Blob> => {
            try {
                return await downloadFileWithClient("/api/Leads/export", { path: {} });
            } catch (error: unknown) {
                await handleAuthError(error);
                throw error;
            }
        },
        isPending: false, // Para compatibilidad con el componente
    };
}

// Hook para paginación infinita de usuarios con búsqueda (usando backend2)
export function usePaginatedUsersWithSearch(pageSize: number = 10, preselectedId?: string) {
    const [search, setSearch] = useState<string | undefined>(undefined);
    const [orderBy, setOrderBy] = useState<string | undefined>(undefined);
    const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
    const { handleAuthError } = useAuthContext();

    const query = api.useInfiniteQuery(
        "get",
        "/api/Leads/users/summary/paginated",
        {
            params: {
                query: {
                    search,
                    page: 1, // Este valor será reemplazado automáticamente por pageParam
                    pageSize,
                    orderBy,
                    orderDirection,
                    preselectedId,
                },
            },
        },
        {
            getNextPageParam: (lastPage) => {
                // Si hay más páginas disponibles, devolver el siguiente número de página
                if (lastPage.meta?.page && lastPage.meta?.totalPages && lastPage.meta.page < lastPage.meta.totalPages) {
                    return lastPage.meta.page + 1;
                }
                return undefined; // No hay más páginas
            },
            getPreviousPageParam: (firstPage) => {
                // Si no estamos en la primera página, devolver la página anterior
                if (firstPage.meta?.page && firstPage.meta.page > 1) {
                    return firstPage.meta.page - 1;
                }
                return undefined; // No hay páginas anteriores
            },
            initialPageParam: 1,
            pageParamName: "page", // Esto le dice a openapi-react-query que use "page" como parámetro de paginación
            onError: async (error: unknown) => {
                await handleAuthError(error);
            },
        }
    );

    // Obtener todos los usuarios de todas las páginas de forma plana
    const allUsers = query.data?.pages.flatMap((page) => page.data ?? []) ?? [];

    const handleScrollEnd = useCallback(() => {
        if (query.hasNextPage && !query.isFetchingNextPage) {
            query.fetchNextPage();
        }
    }, [query]);

    const handleSearchChange = useCallback((value: string) => {
        if (value !== "None" && value !== null && value !== undefined) {
            setSearch(value.trim());
        } else {
            setSearch(undefined);
        }
    }, []);

    const handleOrderChange = useCallback((field: string, direction: "asc" | "desc") => {
        setOrderBy(field);
        setOrderDirection(direction);
    }, []);

    const resetSearch = useCallback(() => {
        setSearch(undefined);
        setOrderBy(undefined);
        setOrderDirection("asc");
    }, []);

    return {
        query,
        allUsers, // Todos los usuarios acumulados
        fetchNextPage: query.fetchNextPage,
        hasNextPage: query.hasNextPage,
        isFetchingNextPage: query.isFetchingNextPage,
        isLoading: query.isLoading,
        isError: query.isError,
        search,
        setSearch,
        orderBy,
        orderDirection,
        handleScrollEnd,
        handleSearchChange,
        handleOrderChange,
        resetSearch,
        // Información de paginación
        totalCount: query.data?.pages[0]?.meta?.total ?? 0,
        totalPages: query.data?.pages[0]?.meta?.totalPages ?? 0,
        currentPage: query.data?.pages[0]?.meta?.page ?? 1,
    };
}

// Hook para paginación infinita de leads disponibles para cotización con búsqueda (usando backend2)
export function usePaginatedAvailableLeadsForQuotationWithSearch(
    pageSize: number = 10,
    preselectedId?: string
) {
    const [search, setSearch] = useState<string | undefined>(undefined);
    const [orderBy, setOrderBy] = useState<string | undefined>(undefined);
    const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
    const { handleAuthError } = useAuthContext();

    const query = api.useInfiniteQuery(
        "get",
        "/api/Leads/available-for-quotation/paginated",
        {
            params: {
                query: {
                    search,
                    page: 1, // Este valor será reemplazado automáticamente por pageParam
                    pageSize,
                    orderBy,
                    orderDirection,
                    preselectedId,
                },
            },
        },
        {
            getNextPageParam: (lastPage) => {
                // Si hay más páginas disponibles, devolver el siguiente número de página
                if (lastPage.meta?.page && lastPage.meta?.totalPages && lastPage.meta.page < lastPage.meta.totalPages) {
                    return lastPage.meta.page + 1;
                }
                return undefined; // No hay más páginas
            },
            getPreviousPageParam: (firstPage) => {
                // Si no estamos en la primera página, devolver la página anterior
                if (firstPage.meta?.page && firstPage.meta.page > 1) {
                    return firstPage.meta.page - 1;
                }
                return undefined; // No hay páginas anteriores
            },
            initialPageParam: 1,
            pageParamName: "page", // Esto le dice a openapi-react-query que use "page" como parámetro de paginación
            onError: async (error: unknown) => {
                await handleAuthError(error);
            },
        }
    );

    // Obtener todos los leads de todas las páginas de forma plana
    const allLeads = query.data?.pages.flatMap((page) => page.data ?? []) ?? [];

    const handleScrollEnd = useCallback(() => {
        if (query.hasNextPage && !query.isFetchingNextPage) {
            query.fetchNextPage();
        }
    }, [query]);

    const handleSearchChange = useCallback((value: string) => {
        if (value !== "None" && value !== null && value !== undefined) {
            setSearch(value.trim());
        } else {
            setSearch(undefined);
        }
    }, []);

    const handleOrderChange = useCallback((field: string, direction: "asc" | "desc") => {
        setOrderBy(field);
        setOrderDirection(direction);
    }, []);

    const resetSearch = useCallback(() => {
        setSearch(undefined);
        setOrderBy(undefined);
        setOrderDirection("asc");
    }, []);

    return {
        query,
        allLeads, // Todos los leads acumulados
        fetchNextPage: query.fetchNextPage,
        hasNextPage: query.hasNextPage,
        isFetchingNextPage: query.isFetchingNextPage,
        isLoading: query.isLoading,
        isError: query.isError,
        search,
        setSearch,
        orderBy,
        orderDirection,
        handleScrollEnd,
        handleSearchChange,
        handleOrderChange,
        resetSearch,
        // Información de paginación
        totalCount: query.data?.pages[0]?.meta?.total ?? 0,
        totalPages: query.data?.pages[0]?.meta?.totalPages ?? 0,
        currentPage: query.data?.pages[0]?.meta?.page ?? 1,
    };
}

// Hook para enviar notificación personalizada de lead
export function useSendPersonalizedLeadNotification() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("post", "/api/Leads/{leadId}/notify", {
        onSuccess: () => {
            // Invalidar queries de leads para refrescar datos
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/paginated"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/assignedto"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/assignedto/paginated"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/assigned/summary"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/available-for-quotation"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/users/with-leads/summary"] });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}
