import { useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { backend as api } from "@/types/backend";
import { useAuthContext } from "@/context/auth-provider";

// Hook para obtener todos los lotes
export function useAllLots() {
    const { handleAuthError } = useAuthContext();

    return api.useQuery("get", "/api/Lots", undefined, {
        retry: false,
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para obtener lotes por bloque
export function useLots(blockId: string) {
    const { handleAuthError } = useAuthContext();

    return api.useQuery("get", "/api/Lots/block/{blockId}", {
        params: {
            path: { blockId },
        },
    }, {
        enabled: !!blockId,
        retry: false,
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para paginación infinita de lotes por proyecto con búsqueda
export function useLotsByProject(projectId: string, pageSize: number = 10, preselectedId?: string, blockId?: string) {
    const [search, setSearch] = useState<string | undefined>(undefined);
    const [status, setStatus] = useState<string | undefined>(undefined);
    const [orderBy, setOrderBy] = useState<string | undefined>("createdat");
    const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("desc");
    const { handleAuthError } = useAuthContext();

    const query = api.useInfiniteQuery(
        "get",
        "/api/Lots/project/{projectId}",
        {
            params: {
                path: { projectId },
                query: {
                    blockId,
                    search,
                    page: 1,
                    pageSize,
                    orderBy,
                    orderDirection,
                    preselectedId,
                    status,
                },
            },
        },
        {
            getNextPageParam: (lastPage) => {
                if (lastPage.meta?.page && lastPage.meta?.totalPages && lastPage.meta.page < lastPage.meta.totalPages) {
                    return lastPage.meta.page + 1;
                }
                return undefined;
            },
            getPreviousPageParam: (firstPage) => {
                if (firstPage.meta?.page && firstPage.meta.page > 1) {
                    return firstPage.meta.page - 1;
                }
                return undefined;
            },
            initialPageParam: 1,
            pageParamName: "page",
            enabled: !!projectId,
            onError: async (error: unknown) => {
                await handleAuthError(error);
            },
        }
    );

    const allLots = query.data?.pages.flatMap((page) => page.data ?? []) ?? [];

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

    const handleStatusChange = useCallback(() => {
        // Esta función será manejada externamente ya que status viene como prop
    }, []);

    const resetSearch = useCallback(() => {
        setSearch(undefined);
        setOrderBy("createdat");
        setOrderDirection("desc");
    }, []);

    return {
        query,
        allLots,
        fetchNextPage: query.fetchNextPage,
        hasNextPage: query.hasNextPage,
        isFetchingNextPage: query.isFetchingNextPage,
        isLoading: query.isLoading,
        isError: query.isError,
        refetch: query.refetch,
        search,
        setSearch,
        status,
        setStatus,
        orderBy,
        orderDirection,
        handleScrollEnd,
        handleSearchChange,
        handleOrderChange,
        handleStatusChange,
        resetSearch,
        totalCount: query.data?.pages[0]?.meta?.total ?? 0,
        totalPages: query.data?.pages[0]?.meta?.totalPages ?? 0,
        currentPage: query.data?.pages[0]?.meta?.page ?? 1,
    };
}

// Hook para obtener lotes disponibles
export function useAvailableLots() {
    const { handleAuthError } = useAuthContext();

    return api.useQuery("get", "/api/Lots/available", undefined, {
        retry: false,
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para obtener un lote específico
export function useLot(id: string) {
    const { handleAuthError } = useAuthContext();

    return api.useQuery("get", "/api/Lots/{id}", {
        params: {
            path: { id },
        },
    }, {
        enabled: !!id,
        retry: false,
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para crear un lote
export function useCreateLot() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("post", "/api/Lots", {
        onSuccess: () => {
            // Invalidar queries de lotes con las query keys correctas
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Lots"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Lots/block"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Lots/project"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Lots/available"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Blocks"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Blocks/project"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Blocks/project/active"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Projects"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Projects/active"] });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para actualizar un lote
export function useUpdateLot() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("put", "/api/Lots/{id}", {
        onSuccess: () => {
            // Invalidar queries de lotes con las query keys correctas
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Lots"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Lots/block"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Lots/project"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Lots/available"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Lots/{id}"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Blocks"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Blocks/project"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Blocks/project/active"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Projects"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Projects/active"] });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para actualizar estado de un lote
export function useUpdateLotStatus() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("put", "/api/Lots/{id}/status", {
        onSuccess: () => {
            // Invalidar queries de lotes con las query keys correctas
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Lots"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Lots/block"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Lots/project"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Lots/available"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Lots/{id}"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Blocks"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Blocks/project"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Blocks/project/active"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Projects"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Projects/active"] });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para eliminar un lote
export function useDeleteLot() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("delete", "/api/Lots/{id}", {
        onSuccess: () => {
            // Invalidar queries de lotes con las query keys correctas
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Lots"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Lots/block"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Lots/project"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Lots/available"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Blocks"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Blocks/project"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Blocks/project/active"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Projects"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Projects/active"] });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para activar un lote
export function useActivateLot() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("put", "/api/Lots/{id}/activate", {
        onSuccess: () => {
            // Invalidar queries de lotes con las query keys correctas
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Lots"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Lots/block"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Lots/project"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Lots/available"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Lots/{id}"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Blocks"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Blocks/project"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Blocks/project/active"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Projects"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Projects/active"] });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para desactivar un lote
export function useDeactivateLot() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("put", "/api/Lots/{id}/deactivate", {
        onSuccess: () => {
            // Invalidar queries de lotes con las query keys correctas
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Lots"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Lots/block"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Lots/project"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Lots/available"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Lots/{id}"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Blocks"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Blocks/project"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Blocks/project/active"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Projects"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Projects/active"] });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para obtener lotes paginados por bloque con búsqueda
export function usePaginatedLotsByBlockWithSearch(
    blockId: string,
    pageSize: number = 10,
    preselectedId?: string
) {
    const [search, setSearch] = useState<string | undefined>(undefined);
    const [status, setStatus] = useState<string | undefined>(undefined);
    const [orderBy, setOrderBy] = useState<string | undefined>(undefined);
    const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");

    const query = api.useInfiniteQuery(
        "get",
        "/api/Lots/block/{blockId}/paginated",
        {
            params: {
                path: {
                    blockId,
                },
                query: {
                    search,
                    page: 1, // Este valor será reemplazado automáticamente por pageParam
                    pageSize,
                    orderBy,
                    orderDirection,
                    preselectedId,
                    status,
                },
            },
        },
        {
            getNextPageParam: (lastPage) => {
                if (lastPage.meta?.page && lastPage.meta?.totalPages && lastPage.meta.page < lastPage.meta.totalPages) {
                    return lastPage.meta.page + 1;
                }
                return undefined;
            },
            getPreviousPageParam: (firstPage) => {
                if (firstPage.meta?.page && firstPage.meta.page > 1) {
                    return firstPage.meta.page - 1;
                }
                return undefined;
            },
            initialPageParam: 1,
            pageParamName: "page",
            enabled: !!blockId,
        }
    );

    const allLots = query.data?.pages.flatMap((page) => page.data ?? []) ?? [];

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

    const handleStatusChange = useCallback((value: string) => {
        if (value === "all" || value === "" || value === null || value === undefined) {
            setStatus(undefined);
        } else {
            setStatus(value);
        }
    }, []);

    const resetSearch = useCallback(() => {
        setSearch(undefined);
        setStatus(undefined);
        setOrderBy(undefined);
        setOrderDirection("asc");
    }, []);

    return {
        query,
        allLots,
        fetchNextPage: query.fetchNextPage,
        hasNextPage: query.hasNextPage,
        isFetchingNextPage: query.isFetchingNextPage,
        isLoading: query.isLoading,
        isError: query.isError,
        search,
        setSearch,
        status,
        setStatus,
        orderBy,
        orderDirection,
        handleScrollEnd,
        handleSearchChange,
        handleOrderChange,
        handleStatusChange,
        resetSearch,
        totalCount: query.data?.pages[0]?.meta?.total ?? 0,
        totalPages: query.data?.pages[0]?.meta?.totalPages ?? 0,
        currentPage: query.data?.pages[0]?.meta?.page ?? 1,
    };
}
