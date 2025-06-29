import { useQuery } from "@tanstack/react-query";
import { GetBlocksByProject } from "../_actions/BlockActions";

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
