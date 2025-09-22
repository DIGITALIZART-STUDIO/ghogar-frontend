import { useQueryClient } from "@tanstack/react-query";
import { backend as api } from "@/types/backend2";
import { useAuthContext } from "@/context/auth-provider";

// Obtener tareas por filtros
export function useTasksWithFilters() {
    const { handleAuthError } = useAuthContext();

    return api.useMutation("post", "/api/LeadTasks/filter", {
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Obtener tareas por ID de lead
export function useTasksByLead(leadId: string) {
    const { handleAuthError } = useAuthContext();

    return api.useQuery("get", "/api/LeadTasks/lead/{leadId}", {
        params: {
            path: { leadId },
        },
        enabled: !!leadId,
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Crear tarea
export function useCreateTask() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("post", "/api/LeadTasks", {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["leadTasksWithFilters"] });
            queryClient.invalidateQueries({ queryKey: ["leadTasksByLead"] });
            queryClient.invalidateQueries({ queryKey: ["paginatedLeads"] });
            queryClient.invalidateQueries({ queryKey: ["paginatedLeadsByAssignedTo"] });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Editar tarea
export function useUpdateTask() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("put", "/api/LeadTasks/{id}", {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["leadTasksWithFilters"] });
            queryClient.invalidateQueries({ queryKey: ["leadTasksByLead"] });
            queryClient.invalidateQueries({ queryKey: ["paginatedLeads"] });
            queryClient.invalidateQueries({ queryKey: ["paginatedLeadsByAssignedTo"] });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Eliminar tarea
export function useDeleteTask() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("delete", "/api/LeadTasks/{id}", {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["leadTasksWithFilters"] });
            queryClient.invalidateQueries({ queryKey: ["leadTasksByLead"] });
            queryClient.invalidateQueries({ queryKey: ["paginatedLeads"] });
            queryClient.invalidateQueries({ queryKey: ["paginatedLeadsByAssignedTo"] });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Completar tarea
export function useCompleteTask() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("post", "/api/LeadTasks/{id}/complete", {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["leadTasksWithFilters"] });
            queryClient.invalidateQueries({ queryKey: ["leadTasksByLead"] });
            queryClient.invalidateQueries({ queryKey: ["paginatedLeads"] });
            queryClient.invalidateQueries({ queryKey: ["paginatedLeadsByAssignedTo"] });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}
