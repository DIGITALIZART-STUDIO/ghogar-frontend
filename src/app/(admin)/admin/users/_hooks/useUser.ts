import { backend as api } from "@/types/backend";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@/context/auth-provider";
import { toast } from "sonner";
import { useState, useCallback } from "react";

export function useUsers() {
    const { handleAuthError, isLoggingOut } = useAuthContext();

    return api.useQuery("get", "/api/Users", undefined, {
        retry: false, // NO hacer retries automáticos
        enabled: !isLoggingOut, // No ejecutar si estamos haciendo logout
        refetchOnWindowFocus: true, // Revalidar al volver al foco
        refetchOnReconnect: true, // Revalidar al reconectar red
        onError: async (error: unknown) => {
            // Solo manejar errores si no estamos haciendo logout
            if (!isLoggingOut) {
                await handleAuthError(error);
            }
        },
    });
}

// Hook para actualizar contraseña de perfil
export function useUpdateProfilePassword() {
    const { handleAuthError } = useAuthContext();

    return api.useMutation("put", "/api/Users/profile/password", {
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para paginación de usuarios
export function usePaginatedUsers(page: number = 1, pageSize: number = 10) {
    const { handleAuthError } = useAuthContext();

    return api.useQuery("get", "/api/Users/all", {
        params: {
            query: {
                page,
                pageSize,
            },
        },
    }, {
        retry: false,
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para crear usuario
export function useCreateUser() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("post", "/api/Users", {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["paginatedUsers"] });
            toast.success("Usuario creado exitosamente");
        },
        onError: async (error: unknown) => {
            const handled = await handleAuthError(error);
            if (!handled) {
                toast.error("Error al crear usuario");
            }
        },
    });
}

// Hook para actualizar usuario
export function useUpdateUser() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("put", "/api/Users/{userId}", {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["paginatedUsers"] });
            toast.success("Usuario actualizado exitosamente");
        },
        onError: async (error: unknown) => {
            const handled = await handleAuthError(error);
            if (!handled) {
                toast.error("Error al actualizar usuario");
            }
        },
    });
}

// Hook para actualizar solo la contraseña
export function useUpdateUserPassword() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("put", "/api/Users/{userId}/password", {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["paginatedUsers"] });
            toast.success("Contraseña actualizada exitosamente");
        },
        onError: async (error: unknown) => {
            const handled = await handleAuthError(error);
            if (!handled) {
                toast.error("Error al actualizar contraseña");
            }
        },
    });
}

// Hook para desactivar usuario
export function useDeactivateUser() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("delete", "/api/Users/{userId}", {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["paginatedUsers"] });
            toast.success("Usuario desactivado exitosamente");
        },
        onError: async (error: unknown) => {
            const handled = await handleAuthError(error);
            if (!handled) {
                toast.error("Error al desactivar usuario");
            }
        },
    });
}

// Hook para reactivar usuario
export function useReactivateUser() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("patch", "/api/Users/{userId}/reactivate", {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["paginatedUsers"] });
            toast.success("Usuario reactivado exitosamente");
        },
        onError: async (error: unknown) => {
            const handled = await handleAuthError(error);
            if (!handled) {
                toast.error("Error al reactivar usuario");
            }
        },
    });
}

// Hook para obtener usuarios con mayor rango
export function useUsersWithHigherRank(name?: string, limit: number = 10) {
    const { handleAuthError } = useAuthContext();

    return api.useQuery("get", "/api/Users/higher-rank", {
        params: {
            query: {
                ...(name && { name }),
                limit,
            },
        },
    }, {
        retry: false,
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para paginación infinita de usuarios con mayor rango con búsqueda (usando backend2)
export function usePaginatedUsersWithHigherRankWithSearch(pageSize: number = 10, preselectedId?: string) {
    const [search, setSearch] = useState<string | undefined>(undefined);
    const [orderBy, setOrderBy] = useState<string | undefined>(undefined);
    const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");

    const query = api.useInfiniteQuery(
        "get",
        "/api/Users/higher-rank/paginated",
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

