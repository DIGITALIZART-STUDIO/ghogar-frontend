import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ActivateLeads, CheckAndUpdateExpiredLeads, CreateLead, DeleteLeads, DownloadLeadsExcel, GetAssignedLeadsSummary, GetAvailableLeadsForQuotation, GetPaginatedLeads, GetPaginatedLeadsByAssignedTo, GetUsersSummary, UpdateLead, UpdateLeadStatus } from "../_actions/LeadActions";
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
            queryClient.invalidateQueries({ queryKey: ["getAvailableLeadsForQuotation"] });
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

export function useCreateLead() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (lead: components["schemas"]["LeadCreateDto"]) => {
            const [data, error] = await CreateLead(lead);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["paginatedLeads"] });
            queryClient.invalidateQueries({ queryKey: ["paginatedLeadsByAssignedTo"] });
            queryClient.invalidateQueries({ queryKey: ["getAvailableLeadsForQuotation"] });
        },
    });
}

// Actualizar lead
export function useUpdateLead() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, lead }: { id: string; lead: components["schemas"]["LeadUpdateDto"] }) => {
            const [data, error] = await UpdateLead(id, lead);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["paginatedLeads"] });
            queryClient.invalidateQueries({ queryKey: ["paginatedLeadsByAssignedTo"] });
            queryClient.invalidateQueries({ queryKey: ["getAvailableLeadsForQuotation"] });
        },
    });
}

// Eliminar múltiples leads
export function useDeleteLeads() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (ids: Array<string>) => {
            const [data, error] = await DeleteLeads(ids);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["paginatedLeads"] });
            queryClient.invalidateQueries({ queryKey: ["paginatedLeadsByAssignedTo"] });
            queryClient.invalidateQueries({ queryKey: ["getAvailableLeadsForQuotation"] });
        },
    });
}

// Activar múltiples leads
export function useActivateLeads() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (ids: Array<string>) => {
            const [data, error] = await ActivateLeads(ids);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["paginatedLeads"] });
            queryClient.invalidateQueries({ queryKey: ["paginatedLeadsByAssignedTo"] });
            queryClient.invalidateQueries({ queryKey: ["getAvailableLeadsForQuotation"] });
        },
    });
}

// Chequear y actualizar leads expirados
export function useCheckAndUpdateExpiredLeads() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const [data, error] = await CheckAndUpdateExpiredLeads();
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["paginatedLeads"] });
            queryClient.invalidateQueries({ queryKey: ["paginatedLeadsByAssignedTo"] });
            queryClient.invalidateQueries({ queryKey: ["getAvailableLeadsForQuotation"] });
        },
    });
}

// Obtener leads disponibles para cotización por usuario, excluyendo una cotización opcionalmente
export function useAvailableLeadsForQuotation(
    excludeQuotationId?: string,
    enabled = true
) {
    return useQuery({
        queryKey: ["getAvailableLeadsForQuotation", excludeQuotationId],
        queryFn: async () => {
            const [data, error] = await GetAvailableLeadsForQuotation(excludeQuotationId);
            if (error) {
                throw new Error(error.message);
            }
            return data ?? [];
        },
        enabled: enabled,
    });
}

export function useAssignedLeadsSummary(assignedToId: string, enabled = true) {
    return useQuery({
        queryKey: ["assignedLeadsSummary", assignedToId],
        queryFn: async () => {
            const [data, error] = await GetAssignedLeadsSummary(assignedToId);
            if (error) {
                throw new Error(error.message);
            }
            return data ?? [];
        },
        enabled: !!assignedToId && enabled,
    });
}

export function useDownloadLeadsExcel() {
    return useMutation({
        mutationFn: async () => {
            const [blob, error] = await DownloadLeadsExcel();
            if (error) {
                throw new Error(error.message);
            }
            return blob!;
        },
    });
}
