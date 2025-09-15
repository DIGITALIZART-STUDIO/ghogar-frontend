import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { backend } from "@/types/backend2";
import {
    GetAllLots,
    GetLotsByBlock,
    GetLotsByProject,
    GetAvailableLots,
    GetLot,
    CreateLot,
    UpdateLot,
    UpdateLotStatus,
    DeleteLot,
    ActivateLot,
    DeactivateLot,
} from "../_actions/LotActions";
import type { components } from "@/types/api";

// Hook para obtener todos los lotes
export function useAllLots() {
    return useQuery({
        queryKey: ["allLots"],
        queryFn: async () => {
            const [data, error] = await GetAllLots();
            if (error) {
                throw new Error(error.message);
            }
            return data ?? [];
        },
    });
}

// Hook para obtener lotes por bloque
export function useLots(blockId: string) {
    return useQuery({
        queryKey: ["lots", blockId],
        queryFn: async () => {
            const [lots, error] = await GetLotsByBlock(blockId);
            if (error) {
                throw new Error(error.message);
            }
            return lots ?? [];
        },
        enabled: !!blockId,
    });
}

// Hook para obtener lotes por proyecto
export function useLotsByProject(projectId: string) {
    return useQuery({
        queryKey: ["lotsByProject", projectId],
        queryFn: async () => {
            const [data, error] = await GetLotsByProject(projectId);
            if (error) {
                throw new Error(error.message);
            }
            return data ?? [];
        },
        enabled: !!projectId,
    });
}

// Hook para obtener lotes disponibles
export function useAvailableLots() {
    return useQuery({
        queryKey: ["availableLots"],
        queryFn: async () => {
            const [data, error] = await GetAvailableLots();
            if (error) {
                throw new Error(error.message);
            }
            return data ?? [];
        },
    });
}

// Hook para obtener un lote específico
export function useLot(id: string) {
    return useQuery({
        queryKey: ["lot", id],
        queryFn: async () => {
            const [data, error] = await GetLot(id);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        enabled: !!id,
    });
}

// Hook para crear un lote
export function useCreateLot() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (lot: components["schemas"]["LotCreateDTO"]) => {
            const [data, error] = await CreateLot(lot);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allLots"] });
            queryClient.invalidateQueries({ queryKey: ["lots"] });
            queryClient.invalidateQueries({ queryKey: ["lotsByProject"] });
            queryClient.invalidateQueries({ queryKey: ["availableLots"] });
            queryClient.invalidateQueries({ queryKey: ["allBlocks"] });
            queryClient.invalidateQueries({ queryKey: ["blocks"] });
            queryClient.invalidateQueries({ queryKey: ["activeBlocks"] });
            queryClient.invalidateQueries({ queryKey: ["allProjects"] });
            queryClient.invalidateQueries({ queryKey: ["activeProjects"] });
        },
    });
}

// Hook para actualizar un lote
export function useUpdateLot() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, lot }: { id: string; lot: components["schemas"]["LotUpdateDTO"] }) => {
            const [data, error] = await UpdateLot(id, lot);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["allLots"] });
            queryClient.invalidateQueries({ queryKey: ["lots"] });
            queryClient.invalidateQueries({ queryKey: ["lotsByProject"] });
            queryClient.invalidateQueries({ queryKey: ["availableLots"] });
            queryClient.invalidateQueries({ queryKey: ["lot", id] });
            queryClient.invalidateQueries({ queryKey: ["allBlocks"] });
            queryClient.invalidateQueries({ queryKey: ["blocks"] });
            queryClient.invalidateQueries({ queryKey: ["activeBlocks"] });
            queryClient.invalidateQueries({ queryKey: ["allProjects"] });
            queryClient.invalidateQueries({ queryKey: ["activeProjects"] });
        },
    });
}

// Hook para actualizar estado de un lote
export function useUpdateLotStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, statusUpdate }: { id: string; statusUpdate: components["schemas"]["LotStatusUpdateDTO"] }) => {
            const [data, error] = await UpdateLotStatus(id, statusUpdate);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["allLots"] });
            queryClient.invalidateQueries({ queryKey: ["lots"] });
            queryClient.invalidateQueries({ queryKey: ["lotsByProject"] });
            queryClient.invalidateQueries({ queryKey: ["availableLots"] });
            queryClient.invalidateQueries({ queryKey: ["lot", id] });
            queryClient.invalidateQueries({ queryKey: ["allBlocks"] });
            queryClient.invalidateQueries({ queryKey: ["blocks"] });
            queryClient.invalidateQueries({ queryKey: ["activeBlocks"] });
            queryClient.invalidateQueries({ queryKey: ["allProjects"] });
            queryClient.invalidateQueries({ queryKey: ["activeProjects"] });
        },
    });
}

// Hook para eliminar un lote
export function useDeleteLot() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const [data, error] = await DeleteLot(id);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allLots"] });
            queryClient.invalidateQueries({ queryKey: ["lots"] });
            queryClient.invalidateQueries({ queryKey: ["lotsByProject"] });
            queryClient.invalidateQueries({ queryKey: ["availableLots"] });
            queryClient.invalidateQueries({ queryKey: ["allBlocks"] });
            queryClient.invalidateQueries({ queryKey: ["blocks"] });
            queryClient.invalidateQueries({ queryKey: ["activeBlocks"] });
            queryClient.invalidateQueries({ queryKey: ["allProjects"] });
            queryClient.invalidateQueries({ queryKey: ["activeProjects"] });
        },
    });
}

// Hook para activar un lote
export function useActivateLot() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const [data, error] = await ActivateLot(id);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ["allLots"] });
            queryClient.invalidateQueries({ queryKey: ["lots"] });
            queryClient.invalidateQueries({ queryKey: ["lotsByProject"] });
            queryClient.invalidateQueries({ queryKey: ["availableLots"] });
            queryClient.invalidateQueries({ queryKey: ["lot", id] });
            queryClient.invalidateQueries({ queryKey: ["allBlocks"] });
            queryClient.invalidateQueries({ queryKey: ["blocks"] });
            queryClient.invalidateQueries({ queryKey: ["activeBlocks"] });
            queryClient.invalidateQueries({ queryKey: ["allProjects"] });
            queryClient.invalidateQueries({ queryKey: ["activeProjects"] });
        },
    });
}

// Hook para desactivar un lote
export function useDeactivateLot() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const [data, error] = await DeactivateLot(id);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ["allLots"] });
            queryClient.invalidateQueries({ queryKey: ["lots"] });
            queryClient.invalidateQueries({ queryKey: ["lotsByProject"] });
            queryClient.invalidateQueries({ queryKey: ["availableLots"] });
            queryClient.invalidateQueries({ queryKey: ["lot", id] });
            queryClient.invalidateQueries({ queryKey: ["allBlocks"] });
            queryClient.invalidateQueries({ queryKey: ["blocks"] });
            queryClient.invalidateQueries({ queryKey: ["activeBlocks"] });
            queryClient.invalidateQueries({ queryKey: ["allProjects"] });
            queryClient.invalidateQueries({ queryKey: ["activeProjects"] });
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
    const [orderBy, setOrderBy] = useState<string | undefined>(undefined);
    const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");

    const query = backend.useInfiniteQuery(
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

    const resetSearch = useCallback(() => {
        setSearch(undefined);
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
