import { useState, useEffect, useCallback } from "react";
import type {
    NotificationDto,
    UseNotificationsReturn,
    UseNotificationsOptions
} from "@/types/notification";
import {
    useNotifications as useNotificationsQuery,
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
        queryParams = { page: 1, pageSize: 20 },
    } = options;

    const [notifications, setNotifications] = useState<Array<NotificationDto>>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Usar los hooks del notificationService
    const {
        data: notificationsData,
        isLoading: isLoadingNotifications,
        error: notificationsError,
        refetch: refetchNotifications,
    } = useNotificationsQuery(queryParams);

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

                setNotifications((prev) => [newNotification, ...prev]);
                setUnreadCount((prev) => prev + 1);

                // Refrescar datos
                refetchNotifications();
                break;
            }

            case "connection":
                // Conexión SSE establecida
                break;

            case "heartbeat":
                // Mantener conexión viva
                break;
            }
        }
    }, [refetchNotifications]);

    // Callback para manejar errores SSE
    const handleSSEError = useCallback(() => {
        setError("Connection error");
    }, []);

    // Callback para manejar apertura de conexión SSE
    const handleSSEOpen = useCallback(() => {
        setIsConnected(true);
        setError(null);
    }, []);

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
        if (notificationsData) {
            setNotifications(notificationsData.items);
        }
    }, [notificationsData]);

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
            await refetchNotifications();
        } catch (error) {
            console.error("Error refreshing notifications:", error);
            throw error;
        }
    }, [refetchNotifications]);

    // Determinar si está cargando
    const isLoading = isLoadingNotifications || isLoadingStats;

    // Determinar error
    const currentError = error ?? (notificationsError as unknown as Error)?.message ?? null;

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
    };
};
