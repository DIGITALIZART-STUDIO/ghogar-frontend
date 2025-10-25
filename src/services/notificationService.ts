import { useQueryClient } from "@tanstack/react-query";
import { backend as api } from "@/types/backend";
import { useAuthContext } from "@/context/auth-provider";
import type {
    NotificationQueryParams
} from "@/types/notification";

// Configuración de la API usando el cliente backend existente
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5165";
const API_ENDPOINTS = {
    stream: `${API_BASE_URL}/api/notificationstream/stream`,
} as const;

// Hooks para notificaciones siguiendo el patrón de useLeads y useProjects
export function useNotifications(queryParams: NotificationQueryParams = {}) {
    const { handleAuthError } = useAuthContext();

    return api.useQuery("get", "/api/Notification", {
        params: {
            query: {
                page: queryParams.page ?? 1,
                pageSize: queryParams.pageSize ?? 20,
                isRead: queryParams.isRead,
                type: queryParams.type,
                priority: queryParams.priority,
            }
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

export function useNotificationById(id: string) {
    const { handleAuthError } = useAuthContext();

    return api.useQuery("get", "/api/Notification/{id}", {
        params: {
            path: { id }
        },
        enabled: !!id,
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

export function useNotificationStats() {
    const { handleAuthError } = useAuthContext();

    return api.useQuery("get", "/api/Notification/stats", {
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

export function useMarkAsRead() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("put", "/api/Notification/{id}/read", {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Notification"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Notification/stats"] });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

export function useMarkAsUnread() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("put", "/api/Notification/{id}/unread", {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Notification"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Notification/stats"] });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

export function useMarkAllAsRead() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("put", "/api/Notification/mark-all-read", {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Notification"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Notification/stats"] });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

export function useMarkMultipleAsRead() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("put", "/api/Notification/mark-multiple-read", {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Notification"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Notification/stats"] });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

export function useDeleteNotification() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("delete", "/api/Notification/{id}", {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Notification"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Notification/stats"] });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

export function useCreateNotification() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("post", "/api/Notification", {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Notification"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Notification/stats"] });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

export function useSendToUser() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("post", "/api/NotificationStream/send-to-user/{targetUserId}", {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Notification"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Notification/stats"] });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

export function useSendToMultiple() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("post", "/api/NotificationStream/send-to-multiple", {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Notification"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Notification/stats"] });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Utilidades para SSE
export const sseUtils = {
    // Crear URL para SSE (sin token, usa cookies)
    createSSEUrl(): string {
        return API_ENDPOINTS.stream;
    },

    // Parsear mensaje SSE
    parseSSEMessage(event: MessageEvent): { event: string; data: unknown; timestamp: string } | null {
        try {
            const timestamp = new Date().toISOString();

            // Caso 1: EventSource del navegador ya parseó el evento
            // event.type contiene el tipo ("notification", "heartbeat", etc.)
            // event.data contiene directamente el JSON
            if (event.type && event.type !== "message") {
                // Evento nombrado (notification, heartbeat, connection)
                return {
                    event: event.type,
                    data: typeof event.data === "string" ? JSON.parse(event.data) : event.data,
                    timestamp,
                };
            }

            // Caso 2: Mensaje genérico o formato crudo
            // Intentar parsear el formato SSE manual
            const lines = event.data.split("\n");

            let eventType = "";
            let data = "";

            for (const line of lines) {
                if (line.startsWith("event: ")) {
                    eventType = line.substring(7);
                } else if (line.startsWith("data: ")) {
                    data = line.substring(6);
                }
            }

            if (eventType && data) {
                return {
                    event: eventType,
                    data: JSON.parse(data),
                    timestamp,
                };
            }
        } catch (error) {
            console.error("Error parsing SSE message:", error);
        }
        return null;
    },
};
