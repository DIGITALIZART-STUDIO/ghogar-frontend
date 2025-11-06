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

export function useInfiniteNotifications(queryParams: Omit<NotificationQueryParams, "page"> = {}) {
    return api.useInfiniteQuery(
        "get",
        "/api/Notification",
        {
            params: {
                query: {
                    page: 1, // Este valor será reemplazado automáticamente por pageParam
                    pageSize: queryParams.pageSize ?? 10,
                    isRead: queryParams.isRead,
                    type: queryParams.type,
                    priority: queryParams.priority,
                }
            },
        },
        {
            getNextPageParam: (lastPage: { page?: number; totalPages?: number } | undefined) => {
                // Verificar que lastPage existe y tiene las propiedades necesarias
                if (!lastPage || typeof lastPage.page !== "number" || typeof lastPage.totalPages !== "number") {
                    return undefined;
                }

                // Si hay más páginas disponibles, devolver el siguiente número de página
                if (lastPage.page < lastPage.totalPages) {
                    return lastPage.page + 1;
                }
                return undefined; // No hay más páginas
            },
            getPreviousPageParam: (firstPage: { page?: number } | undefined) => {
                // Verificar que firstPage existe y tiene la propiedad page
                if (!firstPage || typeof firstPage.page !== "number") {
                    return undefined;
                }

                // Si no estamos en la primera página, devolver la página anterior
                if (firstPage.page > 1) {
                    return firstPage.page - 1;
                }
                return undefined; // No hay páginas anteriores
            },
            initialPageParam: 1,
            pageParamName: "page", // Esto le dice a openapi-react-query que use "page" como parámetro de paginación
            retry: 1,
            retryDelay: 1000,
            staleTime: 30000, // 30 segundos
            refetchOnWindowFocus: false,
            refetchOnMount: true,
            // Manejar errores de manera más robusta
            onError: () => {
            },
        }
    );
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
        const url = API_ENDPOINTS.stream;
        return url;
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
                let parsedData;
                try {
                    parsedData = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
                } catch {
                    return null;
                }

                return {
                    event: event.type,
                    data: parsedData,
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
                try {
                    const parsedData = JSON.parse(data);
                    return {
                        event: eventType,
                        data: parsedData,
                        timestamp,
                    };
                } catch {
                    return null;
                }
            }
            return null;
        } catch {
            return null;
        }
    },
};
