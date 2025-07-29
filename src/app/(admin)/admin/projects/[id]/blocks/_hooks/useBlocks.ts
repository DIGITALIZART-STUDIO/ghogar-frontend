import { useQuery } from "@tanstack/react-query";
import { GetActiveBlocksByProject, GetBlocksByProject } from "../_actions/BlockActions";

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
