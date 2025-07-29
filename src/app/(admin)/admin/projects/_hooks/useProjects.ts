import { useQuery } from "@tanstack/react-query";
import { GetActiveProjects } from "../_actions/ProjectActions";

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
