import { useQueryClient } from "@tanstack/react-query";

import { useAuthContext } from "@/context/auth-provider";
import { components } from "@/types/api";
import { backend as api } from "@/types/backend";

type LeadTask2 = components["schemas"]["LeadTask2"];

// Query keys constants for better maintainability
const LEAD_TASKS_QUERY_KEYS = {
  filter: ["post", "/api/LeadTasks/filter"] as const,
  byLead: (leadId: string) => ["get", "/api/LeadTasks/lead/{leadId}", { path: { leadId } }] as const,
  byId: (id: string) => ["get", "/api/LeadTasks/{id}", { path: { id } }] as const,
} as const;

// Helper function to invalidate all lead task-related queries
const invalidateLeadTaskQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
  leadId?: string,
  taskId?: string
) => {
  // Invalidar todas las queries de LeadTasks y Leads usando predicate
  queryClient.invalidateQueries({
    predicate: (query) => {
      const key = query.queryKey;
      return (
        Array.isArray(key) &&
        key.length > 0 &&
        typeof key[0] === "string" &&
        typeof key[1] === "string" &&
        (key[1].startsWith("/api/LeadTasks") || key[1].startsWith("/api/Leads"))
      );
    },
  });

  // Invalidar queries específicas si se proporcionan IDs (para mayor precisión)
  if (leadId) {
    queryClient.invalidateQueries({ queryKey: LEAD_TASKS_QUERY_KEYS.byLead(leadId) });
  }
  if (taskId) {
    queryClient.invalidateQueries({ queryKey: LEAD_TASKS_QUERY_KEYS.byId(taskId) });
  }
};

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
    onSuccess: (data: LeadTask2, variables) => {
      const leadId = data?.leadId ?? variables.body?.leadId;
      invalidateLeadTaskQueries(queryClient, leadId);
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
    onSuccess: (data: LeadTask2, variables) => {
      const taskId = variables.params?.path?.id;
      const leadId = data?.leadId ?? variables.body?.leadId;

      // Obtener el leadId anterior de la query cache si existe
      const cachedTask = queryClient.getQueryData<LeadTask2>(LEAD_TASKS_QUERY_KEYS.byId(taskId ?? ""));
      const previousLeadId = cachedTask?.leadId;

      // Invalidar queries del lead anterior si cambió
      if (previousLeadId && previousLeadId !== leadId) {
        invalidateLeadTaskQueries(queryClient, previousLeadId, taskId ?? undefined);
      }

      // Invalidar queries del lead actual (o nuevo si cambió)
      invalidateLeadTaskQueries(queryClient, leadId, taskId ?? undefined);
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
    onSuccess: (_data: void, variables) => {
      const taskId = variables.params?.path?.id;

      // Obtener el leadId de la query cache antes de eliminar
      const cachedTask = queryClient.getQueryData<LeadTask2>(LEAD_TASKS_QUERY_KEYS.byId(taskId ?? ""));
      const leadId = cachedTask?.leadId;

      invalidateLeadTaskQueries(queryClient, leadId, taskId ?? undefined);
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
    onSuccess: (data, variables) => {
      const taskId = variables.params?.path?.id;

      // Obtener el leadId de la respuesta o del cache
      const leadId = (data as LeadTask2 | undefined)?.leadId;
      const cachedTask = queryClient.getQueryData<LeadTask2>(LEAD_TASKS_QUERY_KEYS.byId(taskId ?? ""));
      const leadIdFromCache = cachedTask?.leadId;

      invalidateLeadTaskQueries(queryClient, leadId ?? leadIdFromCache, taskId ?? undefined);
    },
    onError: async (error: unknown) => {
      await handleAuthError(error);
    },
  });
}
