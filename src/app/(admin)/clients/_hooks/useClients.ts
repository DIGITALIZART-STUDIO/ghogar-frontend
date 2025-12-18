import { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useClientsPagination } from "@/app/(admin)/clients/_hooks/useClientsPagination";
import { useAuthContext } from "@/context/auth-provider";
import type { components } from "@/types/api";
import { backend as api, uploadFile } from "@/types/backend";

// Hook para paginación de clientes (wrapper del nuevo hook)
export function usePaginatedClients(page: number = 1, pageSize: number = 10) {
  const clientsPagination = useClientsPagination(page, pageSize);

  return {
    data: clientsPagination.data,
    isLoading: clientsPagination.isLoading,
    isError: clientsPagination.isError,
    error: clientsPagination.error,
    refetch: clientsPagination.refetch,
    // Estados de búsqueda y filtros
    search: clientsPagination.search,
    isActive: clientsPagination.isActive,
    type: clientsPagination.type,
    orderBy: clientsPagination.orderBy,
    orderDirection: clientsPagination.orderDirection,
    // Handlers
    setSearch: clientsPagination.setSearch,
    setIsActive: clientsPagination.setIsActive,
    setType: clientsPagination.setType,
    handleOrderChange: clientsPagination.handleOrderChange,
    resetFilters: clientsPagination.resetFilters,
  };
}

// Hook para eliminar múltiples clientes
export function useDeleteClients() {
  const queryClient = useQueryClient();
  const { handleAuthError } = useAuthContext();

  return api.useMutation("delete", "/api/Clients/batch", {
    onSuccess: () => {
      // Invalidar queries de clientes con las query keys correctas
      queryClient.invalidateQueries({ queryKey: ["get", "/api/Clients/paginated"] });
      queryClient.invalidateQueries({ queryKey: ["get", "/api/Clients/summary"] });
      queryClient.invalidateQueries({ queryKey: ["get", "/api/Clients/current-user/summary"] });
    },
    onError: async (error: unknown) => {
      await handleAuthError(error);
    },
  });
}

// Hook para activar múltiples clientes
export function useActivateClients() {
  const queryClient = useQueryClient();
  const { handleAuthError } = useAuthContext();

  return api.useMutation("post", "/api/Clients/batch/activate", {
    onSuccess: () => {
      // Invalidar queries de clientes con las query keys correctas
      queryClient.invalidateQueries({ queryKey: ["get", "/api/Clients/paginated"] });
      queryClient.invalidateQueries({ queryKey: ["get", "/api/Clients/summary"] });
      queryClient.invalidateQueries({ queryKey: ["get", "/api/Clients/current-user/summary"] });
    },
    onError: async (error: unknown) => {
      await handleAuthError(error);
    },
  });
}

// Hook para crear un cliente
export function useCreateClient() {
  const queryClient = useQueryClient();
  const { handleAuthError } = useAuthContext();

  return api.useMutation("post", "/api/Clients", {
    onSuccess: () => {
      // Invalidar queries de clientes con las query keys correctas
      queryClient.invalidateQueries({ queryKey: ["get", "/api/Clients/paginated"] });
      queryClient.invalidateQueries({ queryKey: ["get", "/api/Clients/summary"] });
      queryClient.invalidateQueries({ queryKey: ["get", "/api/Clients/current-user/summary"] });
    },
    onError: async (error: unknown) => {
      // handleAuthError ahora solo procesa errores 401/403 automáticamente
      // Los errores 400 (BadRequest) y otros se ignoran y deben manejarse en el componente
      await handleAuthError(error);
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();
  const { handleAuthError } = useAuthContext();

  return api.useMutation("put", "/api/Clients/{id}", {
    onSuccess: () => {
      // Invalidar queries de clientes y leads con las query keys correctas
      queryClient.invalidateQueries({ queryKey: ["get", "/api/Clients/paginated"] });
      queryClient.invalidateQueries({ queryKey: ["get", "/api/Clients/summary"] });
      queryClient.invalidateQueries({ queryKey: ["get", "/api/Clients/current-user/summary"] });
      queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/paginated"] });
      queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/paginated-by-assigned-to"] });
    },
    onError: async (error: unknown) => {
      await handleAuthError(error);
    },
  });
}

// Hook para obtener resumen de clientes
export function useClientsSummary() {
  const { handleAuthError } = useAuthContext();

  return api.useQuery("get", "/api/Clients/summary", undefined, {
    retry: false,
    onError: async (error: unknown) => {
      await handleAuthError(error);
    },
  });
}

// Hook para obtener un cliente por ID
export function useClientById(clientId: string | undefined) {
  const { handleAuthError } = useAuthContext();

  return api.useQuery(
    "get",
    "/api/Clients/{id}",
    {
      params: {
        path: {
          id: clientId ?? "",
        },
      },
    },
    {
      enabled: !!clientId,
      retry: false,
      onError: async (error: unknown) => {
        await handleAuthError(error);
      },
    }
  );
}

// Hook para obtener clientes del usuario actual con leads asignados (nuevo endpoint)
export function useClientsByCurrentUserSummary(projectId?: string, useCurrentUser: boolean = true) {
  const { handleAuthError } = useAuthContext();

  return api.useQuery(
    "get",
    "/api/Clients/current-user/summary",
    {
      params: {
        query: {
          projectId: projectId ?? undefined,
          useCurrentUser: useCurrentUser,
        },
      },
    },
    {
      retry: false,
      onError: async (error: unknown) => {
        await handleAuthError(error);
      },
    }
  );
}

// Hook para importar clientes desde archivo
export function useImportClients() {
  const queryClient = useQueryClient();
  const { handleAuthError } = useAuthContext();

  return useMutation({
    mutationFn: async (file: File) => {
      const response = await uploadFile("post", "/api/Clients/import", file);
      return response.json();
    },
    onSuccess: () => {
      // Invalidar queries de clientes y leads con las query keys correctas
      queryClient.invalidateQueries({ queryKey: ["get", "/api/Clients/paginated"] });
      queryClient.invalidateQueries({ queryKey: ["get", "/api/Clients/summary"] });
      queryClient.invalidateQueries({ queryKey: ["get", "/api/Clients/current-user/summary"] });
      queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/paginated"] });
      queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/paginated-by-assigned-to"] });
    },
    onError: async (error: unknown) => {
      await handleAuthError(error);
    },
  });
}

// Hook para descargar el Excel de clientes
export function useDownloadClientsExcel() {
  const { handleAuthError } = useAuthContext();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Clients/excel`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.blob();
    },
    onError: async (error: unknown) => {
      await handleAuthError(error);
    },
  });
}

// Hook para descargar la plantilla de importación de clientes
export function useDownloadImportTemplate() {
  const { handleAuthError } = useAuthContext();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Clients/template`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.blob();
    },
    onError: async (error: unknown) => {
      await handleAuthError(error);
    },
  });
}

// Hook para paginación infinita de clientes con búsqueda (usando backend2)
export function usePaginatedClientsWithSearch(pageSize: number = 10, preselectedId?: string) {
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [orderBy, setOrderBy] = useState<string | undefined>(undefined);
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");

  const query = api.useInfiniteQuery(
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
          preselectedId,
        },
      },
    },
    {
      getNextPageParam: (lastPage: { meta?: { page?: number; totalPages?: number } }) => {
        // Si hay más páginas disponibles, devolver el siguiente número de página
        if (lastPage.meta?.page && lastPage.meta?.totalPages && lastPage.meta.page < lastPage.meta.totalPages) {
          return lastPage.meta.page + 1;
        }
        return undefined; // No hay más páginas
      },
      getPreviousPageParam: (firstPage: { meta?: { page?: number } }) => {
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
  const allClients =
    query.data?.pages.flatMap((page: { data?: Array<components["schemas"]["Client"]> }) => page.data ?? []) ?? [];

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
