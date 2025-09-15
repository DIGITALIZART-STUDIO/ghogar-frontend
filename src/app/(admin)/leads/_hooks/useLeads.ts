import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { ActivateLeads, CheckAndUpdateExpiredLeads, CreateLead, DeleteLeads, DownloadLeadsExcel, GetAssignedLeadsSummary, GetAvailableLeadsForQuotation, GetPaginatedLeads, GetPaginatedLeadsByAssignedTo, GetUsersSummary, UpdateLead, UpdateLeadStatus } from "../_actions/LeadActions";
import { backend } from "@/types/backend2";
import { components } from "@/types/api";

// Para todos los leads paginados
export function usePaginatedLeads(page: number = 1, pageSize: number = 10) {
    return useQuery({
        queryKey: ["paginatedLeads", page, pageSize],
        queryFn: async () => {
            const [data, error] = await GetPaginatedLeads(page, pageSize);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
    });
}

// Para leads asignados a un usuario, paginados
export function usePaginatedLeadsByAssignedTo(userId: string, page: number = 1, pageSize: number = 10) {
    return useQuery({
        queryKey: ["paginatedLeadsByAssignedTo", userId, page, pageSize],
        queryFn: async () => {
            const [data, error] = await GetPaginatedLeadsByAssignedTo(userId, page, pageSize);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        enabled: !!userId, // solo consulta si hay userId
    });
}

// Hook para actualizar el estado de un lead
export function useUpdateLeadStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, dto }: { id: string; dto: components["schemas"]["LeadStatusUpdateDto"] }) => {
            const [data, error] = await UpdateLeadStatus(id, dto);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["paginatedLeads"] });
            queryClient.invalidateQueries({ queryKey: ["paginatedLeadsByAssignedTo"] });
            queryClient.invalidateQueries({ queryKey: ["getAvailableLeadsForQuotation"] });
        },
    });
}

// Hook para obtener resumen de usuarios
export function useUsersSummary() {
    return useQuery({
        queryKey: ["usersSummary"],
        queryFn: async () => {
            const [data, error] = await GetUsersSummary();
            if (error) {
                throw new Error(error.message);
            }
            return data ?? [];
        },
    });
}

export function useCreateLead() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (lead: components["schemas"]["LeadCreateDto"]) => {
            const [data, error] = await CreateLead(lead);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["paginatedLeads"] });
            queryClient.invalidateQueries({ queryKey: ["paginatedLeadsByAssignedTo"] });
            queryClient.invalidateQueries({ queryKey: ["getAvailableLeadsForQuotation"] });
        },
    });
}

// Actualizar lead
export function useUpdateLead() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, lead }: { id: string; lead: components["schemas"]["LeadUpdateDto"] }) => {
            const [data, error] = await UpdateLead(id, lead);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["paginatedLeads"] });
            queryClient.invalidateQueries({ queryKey: ["paginatedLeadsByAssignedTo"] });
            queryClient.invalidateQueries({ queryKey: ["getAvailableLeadsForQuotation"] });
        },
    });
}

// Eliminar múltiples leads
export function useDeleteLeads() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (ids: Array<string>) => {
            const [data, error] = await DeleteLeads(ids);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["paginatedLeads"] });
            queryClient.invalidateQueries({ queryKey: ["paginatedLeadsByAssignedTo"] });
            queryClient.invalidateQueries({ queryKey: ["getAvailableLeadsForQuotation"] });
        },
    });
}

// Activar múltiples leads
export function useActivateLeads() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (ids: Array<string>) => {
            const [data, error] = await ActivateLeads(ids);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["paginatedLeads"] });
            queryClient.invalidateQueries({ queryKey: ["paginatedLeadsByAssignedTo"] });
            queryClient.invalidateQueries({ queryKey: ["getAvailableLeadsForQuotation"] });
        },
    });
}

// Chequear y actualizar leads expirados
export function useCheckAndUpdateExpiredLeads() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const [data, error] = await CheckAndUpdateExpiredLeads();
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["paginatedLeads"] });
            queryClient.invalidateQueries({ queryKey: ["paginatedLeadsByAssignedTo"] });
            queryClient.invalidateQueries({ queryKey: ["getAvailableLeadsForQuotation"] });
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
            const [data, error] = await GetAvailableLeadsForQuotation(excludeQuotationId);
            if (error) {
                throw new Error(error.message);
            }
            return data ?? [];
        },
        enabled: enabled,
    });
}

export function useAssignedLeadsSummary(assignedToId: string, enabled = true) {
    return useQuery({
        queryKey: ["assignedLeadsSummary", assignedToId],
        queryFn: async () => {
            const [data, error] = await GetAssignedLeadsSummary(assignedToId);
            if (error) {
                throw new Error(error.message);
            }
            return data ?? [];
        },
        enabled: !!assignedToId && enabled,
    });
}

export function useDownloadLeadsExcel() {
    return useMutation({
        mutationFn: async () => {
            const [blob, error] = await DownloadLeadsExcel();
            if (error) {
                throw new Error(error.message);
            }
            return blob!;
        },
    });
}

// Hook para paginación infinita de usuarios con búsqueda (usando backend2)
export function usePaginatedUsersWithSearch(pageSize: number = 10, preselectedId?: string) {
    const [search, setSearch] = useState<string | undefined>(undefined);
    const [orderBy, setOrderBy] = useState<string | undefined>(undefined);
    const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");

    const query = backend.useInfiniteQuery(
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
    excludeQuotationId?: string,
    preselectedId?: string
) {
    const [search, setSearch] = useState<string | undefined>(undefined);
    const [orderBy, setOrderBy] = useState<string | undefined>(undefined);
    const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");

    const query = backend.useInfiniteQuery(
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
                    excludeQuotationId,
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
