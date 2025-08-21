import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    GetAllBlocks,
    GetBlocksByProject,
    GetActiveBlocksByProject,
    GetBlock,
    CreateBlock,
    UpdateBlock,
    DeleteBlock,
    ActivateBlock,
    DeactivateBlock,
} from "../_actions/BlockActions";
import type { components } from "@/types/api";

// Hook para obtener todos los bloques
export function useAllBlocks() {
    return useQuery({
        queryKey: ["allBlocks"],
        queryFn: async () => {
            const [data, error] = await GetAllBlocks();
            if (error) {
                throw new Error(error.message);
            }
            return data ?? [];
        },
    });
}

// Hook para obtener bloques por proyecto
export function useBlocks(projectId: string) {
    return useQuery({
        queryKey: ["blocks", projectId],
        queryFn: async () => {
            const [blocks, error] = await GetBlocksByProject(projectId);
            if (error) {
                throw new Error(error.message);
            }
            return blocks ?? [];
        },
        enabled: !!projectId,
    });
}

// Hook para obtener bloques activos por proyecto
export function useActiveBlocks(projectId: string) {
    return useQuery({
        queryKey: ["activeBlocks", projectId],
        queryFn: async () => {
            const [blocks, error] = await GetActiveBlocksByProject(projectId);
            if (error) {
                throw new Error(error.message);
            }
            return blocks ?? [];
        },
        enabled: !!projectId,
    });
}

// Hook para obtener un bloque específico
export function useBlock(id: string) {
    return useQuery({
        queryKey: ["block", id],
        queryFn: async () => {
            const [data, error] = await GetBlock(id);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        enabled: !!id,
    });
}

// Hook para crear un bloque
export function useCreateBlock() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (block: components["schemas"]["BlockCreateDTO"]) => {
            const [data, error] = await CreateBlock(block);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allBlocks"] });
            queryClient.invalidateQueries({ queryKey: ["blocks"] });
            queryClient.invalidateQueries({ queryKey: ["activeBlocks"] });
            queryClient.invalidateQueries({ queryKey: ["allProjects"] });
            queryClient.invalidateQueries({ queryKey: ["activeProjects"] });
        },
    });
}

// Hook para actualizar un bloque
export function useUpdateBlock() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, block }: { id: string; block: components["schemas"]["BlockUpdateDTO"] }) => {
            const [data, error] = await UpdateBlock(id, block);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["allBlocks"] });
            queryClient.invalidateQueries({ queryKey: ["blocks"] });
            queryClient.invalidateQueries({ queryKey: ["activeBlocks"] });
            queryClient.invalidateQueries({ queryKey: ["block", id] });
            queryClient.invalidateQueries({ queryKey: ["allProjects"] });
            queryClient.invalidateQueries({ queryKey: ["activeProjects"] });
        },
    });
}

// Hook para eliminar un bloque
export function useDeleteBlock() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const [data, error] = await DeleteBlock(id);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allBlocks"] });
            queryClient.invalidateQueries({ queryKey: ["blocks"] });
            queryClient.invalidateQueries({ queryKey: ["activeBlocks"] });
            queryClient.invalidateQueries({ queryKey: ["allProjects"] });
            queryClient.invalidateQueries({ queryKey: ["activeProjects"] });
        },
    });
}

// Hook para activar un bloque
export function useActivateBlock() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const [data, error] = await ActivateBlock(id);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ["allBlocks"] });
            queryClient.invalidateQueries({ queryKey: ["blocks"] });
            queryClient.invalidateQueries({ queryKey: ["activeBlocks"] });
            queryClient.invalidateQueries({ queryKey: ["block", id] });
            queryClient.invalidateQueries({ queryKey: ["allProjects"] });
            queryClient.invalidateQueries({ queryKey: ["activeProjects"] });
        },
    });
}

// Hook para desactivar un bloque
export function useDeactivateBlock() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const [data, error] = await DeactivateBlock(id);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ["allBlocks"] });
            queryClient.invalidateQueries({ queryKey: ["blocks"] });
            queryClient.invalidateQueries({ queryKey: ["activeBlocks"] });
            queryClient.invalidateQueries({ queryKey: ["block", id] });
            queryClient.invalidateQueries({ queryKey: ["allProjects"] });
            queryClient.invalidateQueries({ queryKey: ["activeProjects"] });
        },
    });
}
