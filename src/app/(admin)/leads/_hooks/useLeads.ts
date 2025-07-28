import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetPaginatedLeads, GetPaginatedLeadsByAssignedTo, GetUsersSummary, UpdateLeadStatus } from "../_actions/LeadActions";
import { components } from "@/types/api";

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

// Hook para actualizar el estado de un lead
export function useUpdateLeadStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, dto }: { id: string; dto: components["schemas"]["LeadStatusUpdateDto"] }) => {
            const [data, error] = await UpdateLeadStatus(id, dto);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["paginatedLeads"] });
            queryClient.invalidateQueries({ queryKey: ["paginatedLeadsByAssignedTo"] });
        },
    });
}

// Hook para obtener resumen de usuarios
export function useUsersSummary() {
    return useQuery({
        queryKey: ["usersSummary"],
        queryFn: async () => {
            const [data, error] = await GetUsersSummary();
            if (error) {
                throw new Error(error.message);
            }
            return data ?? [];
        },
    });
}
