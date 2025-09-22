import { useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { backend as api } from "@/types/backend";
import { useAuthContext } from "@/context/auth-provider";

// Hook para obtener proyectos activos
export function useActiveProjects() {
    const { handleAuthError } = useAuthContext();

    return api.useQuery("get", "/api/Projects/active", {
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para obtener un proyecto específico
export function useProject(id: string) {
    const { handleAuthError } = useAuthContext();

    return api.useQuery("get", "/api/Projects/{id}", {
        params: {
            path: { id },
        },
        enabled: !!id,
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para crear un proyecto
export function useCreateProject() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("post", "/api/Projects", {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["activeProjects"] });
            // Invalidar queries paginadas de proyectos activos
            queryClient.invalidateQueries({
                queryKey: ["get", "/api/Projects/active/paginated"]
            });
            // Invalidar queries paginadas de todos los proyectos
            queryClient.invalidateQueries({
                queryKey: ["get", "/api/Projects"]
            });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para actualizar un proyecto
export function useUpdateProject() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("put", "/api/Projects/{id}", {
        onSuccess: (_, variables) => {
            const id = variables.params.path.id;
            queryClient.invalidateQueries({ queryKey: ["activeProjects"] });
            queryClient.invalidateQueries({ queryKey: ["project", id] });
            // Invalidar queries paginadas de proyectos activos
            queryClient.invalidateQueries({
                queryKey: ["get", "/api/Projects/active/paginated"]
            });
            // Invalidar queries paginadas de todos los proyectos
            queryClient.invalidateQueries({
                queryKey: ["get", "/api/Projects"]
            });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para eliminar un proyecto
export function useDeleteProject() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("delete", "/api/Projects/{id}", {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["activeProjects"] });
            // Invalidar queries paginadas de proyectos activos
            queryClient.invalidateQueries({
                queryKey: ["get", "/api/Projects/active/paginated"]
            });
            // Invalidar queries paginadas de todos los proyectos
            queryClient.invalidateQueries({
                queryKey: ["get", "/api/Projects"]
            });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para activar un proyecto
export function useActivateProject() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("put", "/api/Projects/{id}/activate", {
        onSuccess: (_, variables) => {
            const id = variables.params.path.id;
            queryClient.invalidateQueries({ queryKey: ["allProjects"] });
            queryClient.invalidateQueries({ queryKey: ["activeProjects"] });
            queryClient.invalidateQueries({ queryKey: ["project", id] });
            // Invalidar queries paginadas de proyectos activos
            queryClient.invalidateQueries({
                queryKey: ["get", "/api/Projects/active/paginated"]
            });
            // Invalidar queries paginadas de todos los proyectos
            queryClient.invalidateQueries({
                queryKey: ["get", "/api/Projects"]
            });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para desactivar un proyecto
export function useDeactivateProject() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("put", "/api/Projects/{id}/deactivate", {
        onSuccess: (_, variables) => {
            const id = variables.params.path.id;
            queryClient.invalidateQueries({ queryKey: ["allProjects"] });
            queryClient.invalidateQueries({ queryKey: ["activeProjects"] });
            queryClient.invalidateQueries({ queryKey: ["project", id] });
            // Invalidar queries paginadas de proyectos activos
            queryClient.invalidateQueries({
                queryKey: ["get", "/api/Projects/active/paginated"]
            });
            // Invalidar queries paginadas de todos los proyectos
            queryClient.invalidateQueries({
                queryKey: ["get", "/api/Projects"]
            });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para paginación infinita de proyectos activos con búsqueda
export function usePaginatedActiveProjectsWithSearch(pageSize: number = 10, preselectedId?: string) {
    const [search, setSearch] = useState<string | undefined>(undefined);
    const [orderBy, setOrderBy] = useState<string | undefined>(undefined);
    const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
    const { handleAuthError } = useAuthContext();

    const query = api.useInfiniteQuery(
        "get",
        "/api/Projects/active/paginated",
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

    // Obtener todos los proyectos de todas las páginas de forma plana
    const allProjects = query.data?.pages.flatMap((page) => page.data ?? []) ?? [];

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
        allProjects, // Todos los proyectos acumulados
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

// Hook para paginación infinita de todos los proyectos con búsqueda
export function usePaginatedAllProjectsWithSearch(pageSize: number = 10, preselectedId?: string) {
    const [search, setSearch] = useState<string | undefined>(undefined);
    const [orderBy, setOrderBy] = useState<string | undefined>(undefined);
    const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
    const { handleAuthError } = useAuthContext();

    const query = api.useInfiniteQuery(
        "get",
        "/api/Projects",
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

    // Obtener todos los proyectos de todas las páginas de forma plana
    const allProjects = query.data?.pages.flatMap((page) => page.data ?? []) ?? [];

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
        allProjects, // Todos los proyectos acumulados
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

