import { useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { backend as api } from "@/types/backend";
import { useAuthContext } from "@/context/auth-provider";

// Hook para obtener todos los bloques
export function useAllBlocks() {
    const { handleAuthError } = useAuthContext();

    return api.useQuery("get", "/api/Blocks", {
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para paginación infinita de bloques por proyecto con búsqueda
export function useBlocks(projectId: string, pageSize: number = 10, preselectedId?: string) {
    const [search, setSearch] = useState<string | undefined>(undefined);
    const [orderBy, setOrderBy] = useState<string | undefined>("createdat");
    const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("desc");
    const { handleAuthError } = useAuthContext();

    const query = api.useInfiniteQuery(
        "get",
        "/api/Blocks/project/{projectId}",
        {
            params: {
                path: { projectId },
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
            enabled: !!projectId,
            onError: async (error: unknown) => {
                await handleAuthError(error);
            },
        }
    );

    // Obtener todos los bloques de todas las páginas de forma plana
    const allBlocks = query.data?.pages.flatMap((page) => page.data ?? []) ?? [];

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
        setOrderBy("createdat");
        setOrderDirection("desc");
    }, []);

    return {
        query,
        allBlocks, // Todos los bloques acumulados
        fetchNextPage: query.fetchNextPage,
        hasNextPage: query.hasNextPage,
        isFetchingNextPage: query.isFetchingNextPage,
        isLoading: query.isLoading,
        isError: query.isError,
        refetch: query.refetch,
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

// Hook para obtener bloques activos por proyecto
export function useActiveBlocks(projectId: string) {
    const { handleAuthError } = useAuthContext();

    return api.useQuery("get", "/api/Blocks/project/{projectId}/active", {
        params: {
            path: { projectId },
        },
        enabled: !!projectId,
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para obtener un bloque específico
export function useBlock(id: string) {
    const { handleAuthError } = useAuthContext();

    return api.useQuery("get", "/api/Blocks/{id}", {
        params: {
            path: { id },
        },
        enabled: !!id,
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para crear un bloque
export function useCreateBlock() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("post", "/api/Blocks", {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allBlocks"] });
            queryClient.invalidateQueries({ queryKey: ["blocks"] });
            queryClient.invalidateQueries({ queryKey: ["activeBlocks"] });
            // Invalidar queries paginadas de bloques
            queryClient.invalidateQueries({
                queryKey: ["get", "/api/Blocks/project"],
                exact: false
            });
            queryClient.invalidateQueries({
                queryKey: ["get", "/api/Blocks/project/active/paginated"],
                exact: false
            });
            queryClient.invalidateQueries({ queryKey: ["allProjects"] });
            queryClient.invalidateQueries({ queryKey: ["activeProjects"] });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para actualizar un bloque
export function useUpdateBlock() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("put", "/api/Blocks/{id}", {
        onSuccess: (_, variables) => {
            const id = variables.params.path.id;
            queryClient.invalidateQueries({ queryKey: ["allBlocks"] });
            queryClient.invalidateQueries({ queryKey: ["blocks"] });
            queryClient.invalidateQueries({ queryKey: ["activeBlocks"] });
            queryClient.invalidateQueries({ queryKey: ["block", id] });
            // Invalidar queries paginadas de bloques
            queryClient.invalidateQueries({
                queryKey: ["get", "/api/Blocks/project"],
                exact: false
            });
            queryClient.invalidateQueries({
                queryKey: ["get", "/api/Blocks/project/active/paginated"],
                exact: false
            });
            queryClient.invalidateQueries({ queryKey: ["allProjects"] });
            queryClient.invalidateQueries({ queryKey: ["activeProjects"] });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para eliminar un bloque
export function useDeleteBlock() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("delete", "/api/Blocks/{id}", {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allBlocks"] });
            queryClient.invalidateQueries({ queryKey: ["blocks"] });
            queryClient.invalidateQueries({ queryKey: ["activeBlocks"] });
            // Invalidar queries paginadas de bloques
            queryClient.invalidateQueries({
                queryKey: ["get", "/api/Blocks/project"],
                exact: false
            });
            queryClient.invalidateQueries({
                queryKey: ["get", "/api/Blocks/project/active/paginated"],
                exact: false
            });
            queryClient.invalidateQueries({ queryKey: ["allProjects"] });
            queryClient.invalidateQueries({ queryKey: ["activeProjects"] });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para activar un bloque
export function useActivateBlock() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("put", "/api/Blocks/{id}/activate", {
        onSuccess: (_, variables) => {
            const id = variables.params.path.id;
            queryClient.invalidateQueries({ queryKey: ["allBlocks"] });
            queryClient.invalidateQueries({ queryKey: ["blocks"] });
            queryClient.invalidateQueries({ queryKey: ["activeBlocks"] });
            queryClient.invalidateQueries({ queryKey: ["block", id] });
            // Invalidar queries paginadas de bloques
            queryClient.invalidateQueries({
                queryKey: ["get", "/api/Blocks/project"],
                exact: false
            });
            queryClient.invalidateQueries({
                queryKey: ["get", "/api/Blocks/project/active/paginated"],
                exact: false
            });
            queryClient.invalidateQueries({ queryKey: ["allProjects"] });
            queryClient.invalidateQueries({ queryKey: ["activeProjects"] });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para desactivar un bloque
export function useDeactivateBlock() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("put", "/api/Blocks/{id}/deactivate", {
        onSuccess: (_, variables) => {
            const id = variables.params.path.id;
            queryClient.invalidateQueries({ queryKey: ["allBlocks"] });
            queryClient.invalidateQueries({ queryKey: ["blocks"] });
            queryClient.invalidateQueries({ queryKey: ["activeBlocks"] });
            queryClient.invalidateQueries({ queryKey: ["block", id] });
            // Invalidar queries paginadas de bloques
            queryClient.invalidateQueries({
                queryKey: ["get", "/api/Blocks/project"],
                exact: false
            });
            queryClient.invalidateQueries({
                queryKey: ["get", "/api/Blocks/project/active/paginated"],
                exact: false
            });
            queryClient.invalidateQueries({ queryKey: ["allProjects"] });
            queryClient.invalidateQueries({ queryKey: ["activeProjects"] });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para obtener bloques activos paginados por proyecto con búsqueda
export function usePaginatedActiveBlocksByProjectWithSearch(
    projectId: string,
    pageSize: number = 10,
    preselectedId?: string
) {
    const [search, setSearch] = useState<string | undefined>(undefined);
    const [orderBy, setOrderBy] = useState<string | undefined>(undefined);
    const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
    const { handleAuthError } = useAuthContext();

    const query = api.useInfiniteQuery(
        "get",
        "/api/Blocks/project/{projectId}/active/paginated",
        {
            params: {
                path: {
                    projectId,
                },
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

    const allBlocks = query.data?.pages.flatMap((page) => page.data ?? []) ?? [];

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
        setOrderBy("createdat");
        setOrderDirection("desc");
    }, []);

    return {
        query,
        allBlocks,
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
        totalCount: query.data?.pages[0]?.meta?.total ?? 0,
        totalPages: query.data?.pages[0]?.meta?.totalPages ?? 0,
        currentPage: query.data?.pages[0]?.meta?.page ?? 1,
    };
}
