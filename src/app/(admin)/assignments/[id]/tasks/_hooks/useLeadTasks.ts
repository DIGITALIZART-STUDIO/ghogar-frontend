import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import type { components } from "@/types/api";
import {
    GetTasksWithFilters,
    GetTasksByLead,
    CreateTask,
    UpdateTask,
    DeleteTask,
    CompleteTask
} from "../_actions/LeadTaskActions";

// Obtener tareas por filtros
export function useTasksWithFilters(filter: components["schemas"]["TaskFilterRequest"]) {
    return useQuery({
        queryKey: ["leadTasksWithFilters", filter],
        queryFn: async () => {
            const [data, error] = await GetTasksWithFilters(filter);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        enabled: !!filter,
    });
}

// Obtener tareas por ID de lead
export function useTasksByLead(leadId: string) {
    return useQuery({
        queryKey: ["leadTasksByLead", leadId],
        queryFn: async () => {
            const [data, error] = await GetTasksByLead(leadId);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        enabled: !!leadId,
    });
}

// Crear tarea
export function useCreateTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (task: components["schemas"]["LeadTaskCreateDto"]) => {
            const [data, error] = await CreateTask(task);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["leadTasksWithFilters"] });
            queryClient.invalidateQueries({ queryKey: ["leadTasksByLead"] });
            queryClient.invalidateQueries({ queryKey: ["paginatedLeads"] });
            queryClient.invalidateQueries({ queryKey: ["paginatedLeadsByAssignedTo"] });
        },
    });
}

// Editar tarea
export function useUpdateTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, task }: { id: string; task: components["schemas"]["LeadTaskUpdateDto"] }) => {
            const [data, error] = await UpdateTask(id, task);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["leadTasksWithFilters"] });
            queryClient.invalidateQueries({ queryKey: ["leadTasksByLead"] });
            queryClient.invalidateQueries({ queryKey: ["paginatedLeads"] });
            queryClient.invalidateQueries({ queryKey: ["paginatedLeadsByAssignedTo"] });
        },
    });
}

// Eliminar tarea
export function useDeleteTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const [data, error] = await DeleteTask(id);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["leadTasksWithFilters"] });
            queryClient.invalidateQueries({ queryKey: ["leadTasksByLead"] });
            queryClient.invalidateQueries({ queryKey: ["paginatedLeads"] });
            queryClient.invalidateQueries({ queryKey: ["paginatedLeadsByAssignedTo"] });
        },
    });
}

// Completar tarea
export function useCompleteTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const [data, error] = await CompleteTask(id);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["leadTasksWithFilters"] });
            queryClient.invalidateQueries({ queryKey: ["leadTasksByLead"] });
            queryClient.invalidateQueries({ queryKey: ["paginatedLeads"] });
            queryClient.invalidateQueries({ queryKey: ["paginatedLeadsByAssignedTo"] });
        },
    });
}
