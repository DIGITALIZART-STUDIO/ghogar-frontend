import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useAuthContext } from "@/context/auth-provider";
import { backend as api } from "@/types/backend";

// Query keys constants for better maintainability - matching openapi-react-query format
const LOTS_QUERY_KEYS = {
  all: ["get", "/api/Lots"] as const,
  byBlock: (blockId: string) => ["get", "/api/Lots/block/{blockId}", { path: { blockId } }] as const,
  byBlockPaginated: (blockId: string) => ["get", "/api/Lots/block/{blockId}/paginated", { path: { blockId } }] as const,
  byProject: (projectId: string) => ["get", "/api/Lots/project/{projectId}", { path: { projectId } }] as const,
  available: ["get", "/api/Lots/available"] as const,
  byId: (id: string) => ["get", "/api/Lots/{id}", { path: { id } }] as const,
} as const;

// Helper function to invalidate all lot-related queries
const invalidateLotQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
  projectId?: string,
  blockId?: string,
  lotId?: string
) => {
  // Invalidar todas las queries de lotes, bloques y proyectos usando predicate
  // React Query invalida todas las queries que coincidan con el predicate
  queryClient.invalidateQueries({
    predicate: (query) => {
      const key = query.queryKey;
      return (
        Array.isArray(key) &&
        key.length > 0 &&
        key[0] === "get" &&
        typeof key[1] === "string" &&
        (key[1].startsWith("/api/Lots") || key[1].startsWith("/api/Blocks") || key[1].startsWith("/api/Projects"))
      );
    },
  });

  // Invalidar queries específicas si se proporcionan IDs (para mayor precisión)
  if (blockId) {
    queryClient.invalidateQueries({ queryKey: LOTS_QUERY_KEYS.byBlock(blockId) });
    queryClient.invalidateQueries({ queryKey: LOTS_QUERY_KEYS.byBlockPaginated(blockId) });
  }
  if (projectId) {
    queryClient.invalidateQueries({ queryKey: LOTS_QUERY_KEYS.byProject(projectId) });
  }
  if (lotId) {
    queryClient.invalidateQueries({ queryKey: LOTS_QUERY_KEYS.byId(lotId) });
  }
};

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

  return api.useQuery(
    "get",
    "/api/Lots/block/{blockId}",
    {
      params: {
        path: { blockId },
      },
    },
    {
      enabled: !!blockId,
      retry: false,
      onError: async (error: unknown) => {
        await handleAuthError(error);
      },
    }
  );
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

  return api.useQuery(
    "get",
    "/api/Lots/{id}",
    {
      params: {
        path: { id },
      },
    },
    {
      enabled: !!id,
      retry: false,
      onError: async (error: unknown) => {
        await handleAuthError(error);
      },
    }
  );
}

// Hook para crear un lote
export function useCreateLot() {
  const queryClient = useQueryClient();
  const { handleAuthError } = useAuthContext();

  return api.useMutation("post", "/api/Lots", {
    onSuccess: () => {
      invalidateLotQueries(queryClient);
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
    onSuccess: (data, variables) => {
      const lotId = variables.params?.path?.id;
      const newBlockId = variables.body?.blockId;
      const updatedBlockId = data?.blockId; // El blockId actualizado en la respuesta

      // Obtener el blockId anterior de la query cache si existe
      const cachedLot = queryClient.getQueryData<typeof data>(LOTS_QUERY_KEYS.byId(lotId ?? ""));
      const previousBlockId = cachedLot?.blockId ?? undefined;

      // Invalidar queries del bloque anterior si cambió
      if (previousBlockId && previousBlockId !== updatedBlockId) {
        invalidateLotQueries(queryClient, undefined, previousBlockId, lotId ?? undefined);
      }

      // Invalidar queries del nuevo bloque (o actual si no cambió)
      const blockIdToInvalidate = updatedBlockId ?? newBlockId;
      if (blockIdToInvalidate) {
        invalidateLotQueries(queryClient, undefined, blockIdToInvalidate, lotId ?? undefined);
      }

      // Invalidar todas las queries de lotes, bloques y proyectos para asegurar consistencia
      invalidateLotQueries(queryClient, undefined, undefined, lotId ?? undefined);
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
    onSuccess: (data, variables) => {
      const lotId = variables.params?.path?.id;
      invalidateLotQueries(queryClient, undefined, undefined, lotId);
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
      invalidateLotQueries(queryClient);
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
    onSuccess: (data, variables) => {
      const lotId = variables.params?.path?.id;
      invalidateLotQueries(queryClient, undefined, undefined, lotId);
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
    onSuccess: (data, variables) => {
      const lotId = variables.params?.path?.id;
      invalidateLotQueries(queryClient, undefined, undefined, lotId);
    },
    onError: async (error: unknown) => {
      await handleAuthError(error);
    },
  });
}

// Hook para obtener lotes paginados por bloque con búsqueda
export function usePaginatedLotsByBlockWithSearch(blockId: string, pageSize: number = 10, preselectedId?: string) {
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
