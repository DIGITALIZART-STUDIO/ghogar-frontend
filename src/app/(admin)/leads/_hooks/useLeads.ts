import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { backend as api } from "@/types/backend2";
import { useAuthContext } from "@/context/auth-provider";

// Para todos los leads paginados
export function usePaginatedLeads(page: number = 1, pageSize: number = 10) {

    return useQuery({
        queryKey: ["paginatedLeads", page, pageSize],
        queryFn: async () => {
            const response = await fetch(`/api/Leads/paginated?page=${page}&pageSize=${pageSize}`, {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                const error = {
                    statusCode: response.status,
                    message: response.statusText,
                    error: response.statusText,
                };
                throw error;
            }

            return await response.json();
        },
    });
}

// Para leads asignados a un usuario, paginados
export function usePaginatedLeadsByAssignedTo(userId: string, page: number = 1, pageSize: number = 10) {

    return useQuery({
        queryKey: ["paginatedLeadsByAssignedTo", userId, page, pageSize],
        queryFn: async () => {
            const response = await fetch(`/api/Leads/assignedto/${userId}/paginated?page=${page}&pageSize=${pageSize}`, {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                const error = {
                    statusCode: response.status,
                    message: response.statusText,
                    error: response.statusText,
                };
                throw error;
            }

            return await response.json();
        },
        enabled: !!userId, // solo consulta si hay userId
    });
}

// Hook para actualizar el estado de un lead
export function useUpdateLeadStatus() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("put", "/api/Leads/{id}/status", {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["paginatedLeads"] });
            queryClient.invalidateQueries({ queryKey: ["paginatedLeadsByAssignedTo"] });
            queryClient.invalidateQueries({ queryKey: ["getAvailableLeadsForQuotation"] });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para obtener resumen de usuarios
export function useUsersSummary() {

    return useQuery({
        queryKey: ["usersSummary"],
        queryFn: async () => {
            const response = await fetch("/api/Leads/users/summary", {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                const error = {
                    statusCode: response.status,
                    message: response.statusText,
                    error: response.statusText,
                };
                throw error;
            }

            return await response.json();
        },
    });
}

export function useCreateLead() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("post", "/api/Leads", {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["paginatedLeads"] });
            queryClient.invalidateQueries({ queryKey: ["paginatedLeadsByAssignedTo"] });
            queryClient.invalidateQueries({ queryKey: ["getAvailableLeadsForQuotation"] });
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
            queryClient.invalidateQueries({ queryKey: ["paginatedLeads"] });
            queryClient.invalidateQueries({ queryKey: ["paginatedLeadsByAssignedTo"] });
            queryClient.invalidateQueries({ queryKey: ["getAvailableLeadsForQuotation"] });
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
            queryClient.invalidateQueries({ queryKey: ["paginatedLeads"] });
            queryClient.invalidateQueries({ queryKey: ["paginatedLeadsByAssignedTo"] });
            queryClient.invalidateQueries({ queryKey: ["getAvailableLeadsForQuotation"] });
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
            queryClient.invalidateQueries({ queryKey: ["paginatedLeads"] });
            queryClient.invalidateQueries({ queryKey: ["paginatedLeadsByAssignedTo"] });
            queryClient.invalidateQueries({ queryKey: ["getAvailableLeadsForQuotation"] });
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
            queryClient.invalidateQueries({ queryKey: ["paginatedLeads"] });
            queryClient.invalidateQueries({ queryKey: ["paginatedLeadsByAssignedTo"] });
            queryClient.invalidateQueries({ queryKey: ["getAvailableLeadsForQuotation"] });
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

    return useQuery({
        queryKey: ["getAvailableLeadsForQuotation", excludeQuotationId],
        queryFn: async () => {
            const response = await fetch(`/api/Leads/available-for-quotation/${excludeQuotationId ?? ""}`, {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                const error = {
                    statusCode: response.status,
                    message: response.statusText,
                    error: response.statusText,
                };
                throw error;
            }

            return await response.json();
        },
        enabled: enabled,
    });
}

export function useAssignedLeadsSummary(assignedToId: string, enabled = true) {

    return useQuery({
        queryKey: ["assignedLeadsSummary", assignedToId],
        queryFn: async () => {
            const response = await fetch(`/api/Leads/assigned/${assignedToId}/summary`, {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                const error = {
                    statusCode: response.status,
                    message: response.statusText,
                    error: response.statusText,
                };
                throw error;
            }

            return await response.json();
        },
        enabled: !!assignedToId && enabled,
    });
}

export function useDownloadLeadsExcel() {
    const { handleAuthError } = useAuthContext();

    return useMutation({
        mutationFn: async () => {
            const response = await fetch("/api/Leads/export", {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                const error = {
                    statusCode: response.status,
                    message: response.statusText,
                    error: response.statusText,
                };
                throw error;
            }

            return await response.blob();
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
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
