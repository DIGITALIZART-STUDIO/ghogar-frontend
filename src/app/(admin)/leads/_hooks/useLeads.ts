import { useQuery } from "@tanstack/react-query";
import { GetPaginatedLeads, GetPaginatedLeadsByAssignedTo } from "../_actions/LeadActions";

// Para todos los leads paginados
export function usePaginatedLeads(page: number = 1, pageSize: number = 10) {
    return useQuery({
        queryKey: ["paginatedLeads", page, pageSize],
        queryFn: async () => {
            const [data, error] = await GetPaginatedLeads(page, pageSize);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
    });
}

// Para leads asignados a un usuario, paginados
export function usePaginatedLeadsByAssignedTo(userId: string, page: number = 1, pageSize: number = 10) {
    return useQuery({
        queryKey: ["paginatedLeadsByAssignedTo", userId, page, pageSize],
        queryFn: async () => {
            const [data, error] = await GetPaginatedLeadsByAssignedTo(userId, page, pageSize);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        enabled: !!userId, // solo consulta si hay userId
    });
}
