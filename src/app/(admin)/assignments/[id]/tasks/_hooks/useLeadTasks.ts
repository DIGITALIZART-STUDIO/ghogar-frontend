import { useQueryClient } from "@tanstack/react-query";
import { backend as api } from "@/types/backend";
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
            // Invalidar queries de tareas con las query keys correctas
            queryClient.invalidateQueries({ queryKey: ["post", "/api/LeadTasks/filter"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/LeadTasks/lead"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/paginated"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/paginated-by-assigned-to"] });
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
            // Invalidar queries de tareas con las query keys correctas
            queryClient.invalidateQueries({ queryKey: ["post", "/api/LeadTasks/filter"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/LeadTasks/lead"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/LeadTasks/{id}"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/paginated"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/paginated-by-assigned-to"] });
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
            // Invalidar queries de tareas con las query keys correctas
            queryClient.invalidateQueries({ queryKey: ["post", "/api/LeadTasks/filter"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/LeadTasks/lead"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/LeadTasks/{id}"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/paginated"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/paginated-by-assigned-to"] });
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
            // Invalidar queries de tareas con las query keys correctas
            queryClient.invalidateQueries({ queryKey: ["post", "/api/LeadTasks/filter"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/LeadTasks/lead"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/LeadTasks/{id}"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/paginated"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Leads/paginated-by-assigned-to"] });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}
