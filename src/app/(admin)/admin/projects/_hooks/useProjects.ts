import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import {
    GetActiveProjects,
    GetProject,
    CreateProject,
    UpdateProject,
    DeleteProject,
    ActivateProject,
    DeactivateProject,
} from "../_actions/ProjectActions";
import { CreateProjectSchema } from "../_schemas/createProjectsSchema";
import { backend } from "@/types/backend2";

// Hook para obtener proyectos activos
export function useActiveProjects() {
    return useQuery({
        queryKey: ["activeProjects"],
        queryFn: async () => {
            const [data, error] = await GetActiveProjects();
            if (error) {
                throw new Error(error.message);
            }
            return data ?? [];
        },
    });
}

// Hook para obtener un proyecto específico
export function useProject(id: string) {
    return useQuery({
        queryKey: ["project", id],
        queryFn: async () => {
            const [data, error] = await GetProject(id);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        enabled: !!id,
    });
}

// Hook para crear un proyecto
export function useCreateProject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (project: CreateProjectSchema) => {
            const [data, error] = await CreateProject(project);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
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
    });
}

// Hook para actualizar un proyecto
export function useUpdateProject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, project }: { id: string; project: CreateProjectSchema }) => {
            const [data, error] = await UpdateProject(id, project);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        onSuccess: (_, { id }) => {
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
    });
}

// Hook para eliminar un proyecto
export function useDeleteProject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const [data, error] = await DeleteProject(id);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
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
    });
}

// Hook para activar un proyecto
export function useActivateProject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const [data, error] = await ActivateProject(id);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        onSuccess: (_, id) => {
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
    });
}

// Hook para desactivar un proyecto
export function useDeactivateProject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const [data, error] = await DeactivateProject(id);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        onSuccess: (_, id) => {
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
    });
}

// Hook para paginación infinita de proyectos activos con búsqueda
export function usePaginatedActiveProjectsWithSearch(pageSize: number = 10, preselectedId?: string) {
    const [search, setSearch] = useState<string | undefined>(undefined);
    const [orderBy, setOrderBy] = useState<string | undefined>(undefined);
    const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");

    const query = backend.useInfiniteQuery(
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

    const query = backend.useInfiniteQuery(
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

