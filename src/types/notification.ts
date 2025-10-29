// Tipos específicos para el sistema de notificaciones
// Basados en los tipos generados automáticamente desde el backend

import { components } from "./api";

// Definir tipos basados en el esquema de la API generada automáticamente
export type NotificationDto = components["schemas"]["NotificationDto"];
export type NotificationCreateDto = components["schemas"]["NotificationCreateDto"];
// NotificationUpdateDto no existe en el esquema, usamos una interfaz personalizada
export interface NotificationUpdateDto {
    isRead?: boolean;
    title?: string;
    message?: string;
    type?: components["schemas"]["NotificationType"];
    priority?: components["schemas"]["NotificationPriority"];
    channel?: components["schemas"]["NotificationChannel"];
    expiresAt?: string;
    relatedEntityId?: string;
    relatedEntityType?: string;
}
export type NotificationStatsDto = components["schemas"]["NotificationStatsDto"];
export type NotificationResponse = components["schemas"]["PaginatedResponseOfNotificationDto"];
export type NotificationQueryParams = {
    page?: number;
    pageSize?: number;
    isRead?: boolean;
    type?: components["schemas"]["NotificationType"];
    priority?: components["schemas"]["NotificationPriority"];
};
export type NotificationType = components["schemas"]["NotificationType"];
export type NotificationPriority = components["schemas"]["NotificationPriority"];
export type NotificationChannel = components["schemas"]["NotificationChannel"];
export type NotificationBulkUpdateDto = components["schemas"]["NotificationBulkUpdateDto"];
export type SendToMultipleRequest = NotificationCreateDto & {
    userIds: Array<string>;
};

// Tipos adicionales para el contexto
export interface NotificationContextType {
  notifications: Array<NotificationDto>;
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  markMultipleAsRead: (ids: Array<string>) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

// Tipos para hooks
export interface UseNotificationsReturn {
  notifications: Array<NotificationDto>;
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  markMultipleAsRead: (ids: Array<string>) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
  // Funciones para scroll infinito
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  handleScrollEnd?: () => void;
}

export interface UseNotificationsOptions {
  autoConnect?: boolean;
  queryParams?: NotificationQueryParams;
  enableSSE?: boolean;
  useInfinite?: boolean;
}

export interface UseEventSourceOptions {
    url: string;
    onMessage?: (event: MessageEvent) => void;
    onError?: (event: Event) => void;
    onOpen?: (event: Event) => void;
    onClose?: (event: Event) => void;
    reconnectInterval?: number;
    maxReconnectAttempts?: number;
}

export interface UseEventSourceReturn {
  isConnected: boolean;
  error: string | null;
  reconnect: () => void;
  disconnect: () => void;
}
