import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import {
    GetPaginatedClients,
    DeleteClients,
    ActivateClients,
    CreateClient,
    UpdateClient,
    GetClientsSummary,
    ImportClients,
    DownloadClientsExcel,
    DownloadImportTemplate,
} from "../_actions/ClientActions";
import { backend } from "@/types/backend2";
import type { components } from "@/types/api";

// Hook para paginación de clientes
export function usePaginatedClients(page: number = 1, pageSize: number = 10) {
    return useQuery({
        queryKey: ["paginatedClients", page, pageSize],
        queryFn: async () => {
            const [data, error] = await GetPaginatedClients(page, pageSize);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
    });
}

// Hook para eliminar múltiples clientes
export function useDeleteClients() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (ids: Array<string>) => {
            const [data, error] = await DeleteClients(ids);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["paginatedClients"] });
        },
    });
}

// Hook para activar múltiples clientes
export function useActivateClients() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (ids: Array<string>) => {
            const [data, error] = await ActivateClients(ids);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["paginatedClients"] });
        },
    });
}

// Hook para crear un cliente
export function useCreateClient() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (client: components["schemas"]["ClientCreateDto"]) => {
            const [data, error] = await CreateClient(client);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["paginatedClients"] });
        },
    });
}

export function useUpdateClient() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, client }: { id: string; client: components["schemas"]["ClientUpdateDto"] }) => {
            const [data, error] = await UpdateClient(id, client);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["paginatedClients"] });
            queryClient.invalidateQueries({ queryKey: ["paginatedLeads"] });
            queryClient.invalidateQueries({ queryKey: ["paginatedLeadsByAssignedTo"] });
        },
    });
}

// Hook para obtener resumen de clientes
export function useClientsSummary() {
    return useQuery({
        queryKey: ["clientsSummary"],
        queryFn: async () => {
            const [data, error] = await GetClientsSummary();
            if (error) {
                throw new Error(error.message);
            }
            return data ?? [];
        },
    });
}

// Hook para importar clientes desde archivo
export function useImportClients() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (file: File) => {
            const [data, error] = await ImportClients(file);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["paginatedClients"] });
            queryClient.invalidateQueries({ queryKey: ["paginatedLeads"] });
            queryClient.invalidateQueries({ queryKey: ["paginatedLeadsByAssignedTo"] });
        },
    });
}

// Hook para descargar el Excel de clientes
export function useDownloadClientsExcel() {
    return useMutation({
        mutationFn: async () => {
            const [blob, error] = await DownloadClientsExcel();
            if (error) {
                throw new Error(error.message);
            }
            return blob!;
        },
    });
}

// Hook para descargar la plantilla de importación de clientes
export function useDownloadImportTemplate() {
    return useMutation({
        mutationFn: async () => {
            const [blob, error] = await DownloadImportTemplate();
            if (error) {
                throw new Error(error.message);
            }
            return blob!;
        },
    });
}

// Hook para paginación infinita de clientes con búsqueda (usando backend2)
export function usePaginatedClientsWithSearch(pageSize: number = 10) {
    const [search, setSearch] = useState<string | undefined>(undefined);
    const [orderBy, setOrderBy] = useState<string | undefined>(undefined);
    const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");

    const query = backend.useInfiniteQuery(
        "get",
        "/api/Clients/paginated-search",
        {
            params: {
                query: {
                    search,
                    page: 1, // Este valor será reemplazado automáticamente por pageParam
                    pageSize,
                    orderBy,
                    orderDirection,
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

    // Obtener todos los clientes de todas las páginas de forma plana
    const allClients = query.data?.pages.flatMap((page) => page.data ?? []) ?? [];

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
        allClients, // Todos los clientes acumulados
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
