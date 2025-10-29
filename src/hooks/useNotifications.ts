import { useState, useEffect, useCallback, useRef } from "react";
import type {
    NotificationDto,
    UseNotificationsReturn,
    UseNotificationsOptions
} from "@/types/notification";
import {
    useNotifications as useNotificationsQuery,
    useInfiniteNotifications,
    useNotificationStats,
    useMarkAsRead,
    useMarkAllAsRead,
    useMarkMultipleAsRead,
    useDeleteNotification,
    sseUtils
} from "@/services/notificationService";
import { useEventSource } from "./useEventSource";

/**
 * Hook principal para manejar notificaciones
 * Combina React Query para cache y SSE para tiempo real
 */
export const useNotifications = (options: UseNotificationsOptions = {}): UseNotificationsReturn => {
    const {
        queryParams = { pageSize: 4 },
        useInfinite = true,
    } = options;

    const [notifications, setNotifications] = useState<Array<NotificationDto>>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Usar infinite query o query normal según la opción
    const infiniteQuery = useInfiniteNotifications({
        pageSize: queryParams.pageSize ?? 10,
        isRead: queryParams.isRead,
        type: queryParams.type,
        priority: queryParams.priority,
    });

    const regularQuery = useNotificationsQuery({
        page: 1,
        pageSize: queryParams.pageSize ?? 20,
        isRead: queryParams.isRead,
        type: queryParams.type,
        priority: queryParams.priority,
    });

    // Usar infinite query por defecto, fallback a regular query
    // const query = useInfinite ? infiniteQuery : regularQuery; // No se usa directamente

    // Refs para evitar reconexiones SSE constantes
    const infiniteQueryRef = useRef(infiniteQuery);
    const regularQueryRef = useRef(regularQuery);

    // Actualizar refs cuando cambien las queries
    useEffect(() => {
        infiniteQueryRef.current = infiniteQuery;
    }, [infiniteQuery]);

    useEffect(() => {
        regularQueryRef.current = regularQuery;
    }, [regularQuery]);

    const {
        data: statsData,
        isLoading: isLoadingStats,
    } = useNotificationStats();

    // Mutaciones usando los hooks del notificationService
    const markAsReadMutation = useMarkAsRead();
    const markAllAsReadMutation = useMarkAllAsRead();
    const markMultipleAsReadMutation = useMarkMultipleAsRead();
    const deleteNotificationMutation = useDeleteNotification();

    // Callback para manejar mensajes SSE
    const handleSSEMessage = useCallback((event: MessageEvent) => {

        const parsedMessage = sseUtils.parseSSEMessage(event);

        if (parsedMessage) {
            switch (parsedMessage.event) {
            case "notification": {

                // Agregar nueva notificación al estado
                const rawNotification = parsedMessage.data as Record<string, unknown>;

                // Normalizar a camelCase (el backend puede enviar PascalCase)
                const newNotification: NotificationDto = {
                    id: (rawNotification.Id as string) ?? (rawNotification.id as string),
                    userId: (rawNotification.UserId as string) ?? (rawNotification.userId as string),
                    userName: (rawNotification.UserName as string) ?? (rawNotification.userName as string) ?? "",
                    type: (rawNotification.Type as NotificationDto["type"]) ?? (rawNotification.type as NotificationDto["type"]),
                    priority: (rawNotification.Priority as NotificationDto["priority"]) ?? (rawNotification.priority as NotificationDto["priority"]),
                    channel: (rawNotification.Channel as NotificationDto["channel"]) ?? (rawNotification.channel as NotificationDto["channel"]),
                    title: (rawNotification.Title as string) ?? (rawNotification.title as string) ?? "",
                    message: (rawNotification.Message as string) ?? (rawNotification.message as string) ?? "",
                    data: (rawNotification.Data as string) ?? (rawNotification.data as string),
                    isRead: (rawNotification.IsRead as boolean) ?? (rawNotification.isRead as boolean) ?? false,
                    readAt: (rawNotification.ReadAt as string) ?? (rawNotification.readAt as string),
                    sentAt: (rawNotification.SentAt as string) ?? (rawNotification.sentAt as string),
                    expiresAt: (rawNotification.ExpiresAt as string) ?? (rawNotification.expiresAt as string),
                    relatedEntityId: (rawNotification.RelatedEntityId as string) ?? (rawNotification.relatedEntityId as string),
                    relatedEntityType: (rawNotification.RelatedEntityType as string) ?? (rawNotification.relatedEntityType as string),
                    createdAt: (rawNotification.CreatedAt as string) ?? (rawNotification.createdAt as string) ?? new Date().toISOString(),
                    modifiedAt: (rawNotification.ModifiedAt as string) ?? (rawNotification.modifiedAt as string) ?? new Date().toISOString(),
                };

                setNotifications((prev) => {
                    const newState = [newNotification, ...prev];
                    return newState;
                });
                setUnreadCount((prev) => {
                    const newCount = prev + 1;
                    return newCount;
                });

                // Refrescar datos
                if (useInfinite) {
                    infiniteQueryRef.current.refetch();
                } else {
                    regularQueryRef.current.refetch();
                }
                break;
            }

            case "connection":
                break;

            case "heartbeat":
                break;
            }
        }
    }, [useInfinite]);

    // Callback para manejar errores SSE
    const handleSSEError = useCallback(() => {
        setError("Connection error");
    }, []);

    // Callback para manejar apertura de conexión SSE
    const handleSSEOpen = useCallback(() => {
        setIsConnected(true);
        setError(null);
        try {
            if (useInfinite) {
                infiniteQueryRef.current.refetch();
            } else {
                regularQueryRef.current.refetch();
            }
        } catch (e) {
            console.warn("⚠️ [useNotifications] Error en refetch tras open:", e);
        }
    }, [useInfinite]);

    // Callback para manejar cierre de conexión SSE
    const handleSSEClose = useCallback(() => {
        setIsConnected(false);
    }, []);

    // Configurar SSE
    useEventSource({
        url: sseUtils.createSSEUrl(),
        onMessage: handleSSEMessage,
        onError: handleSSEError,
        onOpen: handleSSEOpen,
        onClose: handleSSEClose,
        reconnectInterval: 3000,
        maxReconnectAttempts: 5,
    });

    // Actualizar estado local cuando cambian los datos
    useEffect(() => {

        if (useInfinite && infiniteQuery.data?.pages) {
            // Para infinite query, usar allNotifications con protecciones adicionales
            const newNotifications = infiniteQuery.data.pages
                .filter((page: { items?: Array<NotificationDto> }) => page && page.items && Array.isArray(page.items)) // Filtrar páginas válidas
                .flatMap((page: { items?: Array<NotificationDto> }) => page.items ?? []);

            // Solo actualizar si no tenemos notificaciones locales o si las del servidor son más recientes
            if (notifications.length === 0 || newNotifications.length > notifications.length) {
                setNotifications(newNotifications);
            } else {
            }
        } else if (!useInfinite && regularQuery.data?.items && Array.isArray(regularQuery.data.items)) {
            // Para query regular, usar los datos directamente con protecciones

            // Solo actualizar si no tenemos notificaciones locales o si las del servidor son más recientes
            if (notifications.length === 0 || regularQuery.data.items.length > notifications.length) {
                setNotifications(regularQuery.data.items);
            } else {
            }
        }
    }, [useInfinite, infiniteQuery.data, regularQuery.data, notifications.length]);

    useEffect(() => {
        if (statsData) {
            setUnreadCount(statsData.unread ?? 0);
        }
    }, [statsData]);

    // Funciones de acción
    const markAsRead = useCallback(async (id: string) => {
        try {
            await markAsReadMutation.mutateAsync({
                params: { path: { id } }
            });
            // Actualizar estado local inmediatamente
            setNotifications((prev) => prev.map((notification) => (notification.id === id
                ? { ...notification, isRead: true, readAt: new Date().toISOString() }
                : notification)
            )
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Error marking notification as read:", error);
            throw error;
        }
    }, [markAsReadMutation]);

    const markAllAsRead = useCallback(async () => {
        try {
            await markAllAsReadMutation.mutateAsync({});
            // Actualizar estado local inmediatamente
            setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true, readAt: new Date().toISOString() }))
            );
            setUnreadCount(0);
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
            throw error;
        }
    }, [markAllAsReadMutation]);

    const markMultipleAsRead = useCallback(async (ids: Array<string>) => {
        try {
            await markMultipleAsReadMutation.mutateAsync({
                body: { notificationIds: ids }
            });
            // Actualizar estado local inmediatamente
            setNotifications((prev) => prev.map((notification) => (ids.includes(notification.id ?? "")
                ? { ...notification, isRead: true, readAt: new Date().toISOString() }
                : notification)
            )
            );
            setUnreadCount((prev) => Math.max(0, prev - (ids.length ?? 0)));
        } catch (error) {
            console.error("Error marking multiple notifications as read:", error);
            throw error;
        }
    }, [markMultipleAsReadMutation]);

    const deleteNotification = useCallback(async (id: string) => {
        try {
            await deleteNotificationMutation.mutateAsync({
                params: { path: { id } }
            });
            // Actualizar estado local inmediatamente
            setNotifications((prev) => prev.filter((notification) => notification.id !== id));
            setUnreadCount((prev) => {
                const deletedNotification = notifications.find((n) => n.id === id);
                return deletedNotification && !deletedNotification.isRead
                    ? Math.max(0, prev - 1)
                    : prev;
            });
        } catch (error) {
            console.error("Error deleting notification:", error);
            throw error;
        }
    }, [deleteNotificationMutation, notifications]);

    const refreshNotifications = useCallback(async () => {
        try {
            if (useInfinite) {
                await infiniteQuery.refetch();
            } else {
                await regularQuery.refetch();
            }
        } catch (error) {
            console.error("Error refreshing notifications:", error);
            throw error;
        }
    }, [useInfinite, infiniteQuery, regularQuery]);

    // Funciones para scroll infinito
    const handleScrollEnd = useCallback(() => {
        if (useInfinite && infiniteQuery.hasNextPage && !infiniteQuery.isFetchingNextPage) {
            infiniteQuery.fetchNextPage();
        }
    }, [useInfinite, infiniteQuery]);

    // Determinar si está cargando
    const isLoading = useInfinite
        ? (infiniteQuery.isLoading ?? isLoadingStats)
        : (regularQuery.isLoading ?? isLoadingStats);

    // Determinar error
    const currentError = error ?? ((useInfinite ? infiniteQuery.error : regularQuery.error) as unknown as Error)?.message ?? null;

    return {
        notifications,
        unreadCount,
        isLoading,
        error: currentError,
        isConnected,
        markAsRead,
        markAllAsRead,
        markMultipleAsRead,
        deleteNotification,
        refreshNotifications,
        // Funciones para scroll infinito (solo disponibles si useInfinite es true)
        ...(useInfinite && {
            fetchNextPage: infiniteQuery.fetchNextPage,
            hasNextPage: infiniteQuery.hasNextPage,
            isFetchingNextPage: infiniteQuery.isFetchingNextPage,
            handleScrollEnd,
        }),
    };
};
