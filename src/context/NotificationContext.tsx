"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import type { UseNotificationsOptions, NotificationContextType } from "@/types/notification";

// Crear el contexto
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Props para el provider
interface NotificationProviderProps {
  children: ReactNode;
  options?: UseNotificationsOptions;
}

/**
 * Provider del contexto de notificaciones
 * Proporciona estado global y funciones para manejar notificaciones
 */
export const NotificationProvider: React.FC<NotificationProviderProps> = ({
    children,
    options = {}
}) => {
    const notificationsData = useNotifications(options);

    return (
        <NotificationContext.Provider value={notificationsData}>
            {children}
        </NotificationContext.Provider>
    );
};

/**
 * Hook para usar el contexto de notificaciones
 * Debe ser usado dentro de NotificationProvider
 */
export const useNotificationContext = (): NotificationContextType => {
    const context = useContext(NotificationContext);

    if (context === undefined) {
        throw new Error("useNotificationContext must be used within a NotificationProvider");
    }

    return context;
};

// Hook de conveniencia para obtener solo las notificaciones
export const useNotificationsList = () => {
    const { notifications, isLoading, error } = useNotificationContext();
    return { notifications, isLoading, error };
};

// Hook de conveniencia para obtener solo el contador
export const useNotificationCount = () => {
    const { unreadCount, isConnected } = useNotificationContext();
    return { unreadCount, isConnected };
};

// Hook de conveniencia para obtener solo las acciones
export const useNotificationActions = () => {
    const {
        markAsRead,
        markAllAsRead,
        markMultipleAsRead,
        deleteNotification,
        refreshNotifications
    } = useNotificationContext();

    return {
        markAsRead,
        markAllAsRead,
        markMultipleAsRead,
        deleteNotification,
        refreshNotifications
    };
};
