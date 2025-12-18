"use client";

import { useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  Calendar,
  Check,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Loader2,
  MessageSquare,
  UserCheck,
  Zap,
} from "lucide-react";

import { useNotifications } from "@/hooks/useNotifications";
import type { NotificationPriority, NotificationType } from "@/types/notification";
import { Badge } from "./badge";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { ScrollArea } from "./scroll-area";
import { Separator } from "./separator";

// Función para obtener el color según el tipo de notificación
const getTypeColor = (type: NotificationType) => {
  switch (type) {
    case "LeadAssigned":
      return "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800";
    case "LeadExpired":
      return "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800";
    case "LeadCompleted":
      return "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800";
    case "PaymentReceived":
      return "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800";
    case "QuotationCreated":
      return "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800";
    case "ReservationCreated":
      return "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800";
    case "SystemAlert":
      return "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800";
    case "Custom":
      return "bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700";
    default:
      return "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800";
  }
};

// Función para obtener el icono según el tipo de notificación
const getTypeIcon = (type: NotificationType) => {
  switch (type) {
    case "LeadAssigned":
      return <UserCheck className="h-4 w-4" />;
    case "LeadExpired":
      return <AlertCircle className="h-4 w-4" />;
    case "LeadCompleted":
      return <CheckCircle className="h-4 w-4" />;
    case "PaymentReceived":
      return <DollarSign className="h-4 w-4" />;
    case "QuotationCreated":
      return <FileText className="h-4 w-4" />;
    case "ReservationCreated":
      return <Calendar className="h-4 w-4" />;
    case "SystemAlert":
      return <AlertTriangle className="h-4 w-4" />;
    case "Custom":
      return <Bell className="h-4 w-4" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

// Función para obtener el color de prioridad
const getPriorityColor = (priority: NotificationPriority) => {
  switch (priority) {
    case "Urgent":
      return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800";
    case "High":
      return "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800";
    case "Normal":
      return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800";
    case "Low":
      return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800";
    default:
      return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700";
  }
};

// Función para obtener el texto de prioridad en español
const getPriorityText = (priority: NotificationPriority) => {
  switch (priority) {
    case "Urgent":
      return "Urgente";
    case "High":
      return "Alta";
    case "Normal":
      return "Normal";
    case "Low":
      return "Baja";
    default:
      return priority;
  }
};

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);

  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    isConnected,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
    // Funciones para scroll infinito
    hasNextPage,
    isFetchingNextPage,
    handleScrollEnd,
  } = useNotifications({ useInfinite: true, queryParams: { pageSize: 10 } });

  const notificationsToDisplay = useMemo(
    () =>
      notifications.map((n) => {
        // Manejar tanto createdAt como CreatedAt (case insensitive)
        const createdAtValue = n.createdAt ?? (n as Record<string, unknown>).CreatedAt;
        let timeAgo = "hace un momento";

        try {
          if (createdAtValue) {
            const date = new Date(createdAtValue as string);
            if (!isNaN(date.getTime())) {
              timeAgo = formatDistanceToNow(date, { addSuffix: true, locale: es });
            }
          }
        } catch {}

        return {
          ...n,
          timeAgo,
        };
      }),
    [notifications]
  );

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  if (isLoading) {
    return (
      <Button variant="ghost" size="icon" className="scale-95 rounded-full" disabled>
        <Bell className="h-4 w-4 text-muted-foreground/50" />
      </Button>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" type="button" size="icon" className="scale-95 rounded-full group relative">
          <Bell className="h-4 w-4 group-hover:animate-shake transition-transform" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
          {/* Indicador de conexión SSE */}
          {!isConnected && (
            <div
              className="absolute -bottom-1 -right-1 w-2 h-2 bg-yellow-500 dark:bg-yellow-400 rounded-full"
              title="Desconectado"
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-sm dark:text-gray-100">Notificaciones</h3>
            {!isConnected && (
              <Badge variant="outline" className="text-xs dark:border-gray-700 dark:text-gray-300">
                <Zap className="h-3 w-3 mr-1" />
                Desconectado
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={handleMarkAllAsRead}
              className="text-xs dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Marcar todas como leídas
            </Button>
          )}
        </div>

        <ScrollArea className="h-96 space-y-4" onScrollEnd={handleScrollEnd}>
          {error ? (
            <div className="p-6 text-center">
              <AlertCircle className="h-8 w-8 mx-auto mb-3 text-muted-foreground dark:text-gray-400" />
              <p className="text-sm text-muted-foreground dark:text-gray-400 mb-4">Error al cargar notificaciones</p>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshNotifications}
                className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Reintentar
              </Button>
            </div>
          ) : notificationsToDisplay.length === 0 ? (
            <div className="p-6 text-center">
              <MessageSquare className="h-8 w-8 mx-auto mb-3 text-muted-foreground dark:text-gray-400" />
              <p className="text-sm text-muted-foreground dark:text-gray-400">No tienes notificaciones</p>
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {notificationsToDisplay.map((notification, index) => {
                const isUnread = !notification.isRead;

                return (
                  <div key={notification.id}>
                    <div
                      className={`w-full text-left p-3 rounded-lg transition-colors group relative ${
                        isUnread
                          ? `cursor-pointer hover:bg-muted/50 dark:hover:bg-gray-800/50 focus:bg-muted/50 dark:focus:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${getTypeColor(notification.type ?? "Custom")}`
                          : "bg-muted/20 dark:bg-gray-800/30"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="mt-0.5 text-muted-foreground">
                            {getTypeIcon(notification.type ?? "Custom")}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h4
                                className={`text-sm font-medium ${
                                  isUnread
                                    ? "text-foreground dark:text-gray-100"
                                    : "text-muted-foreground dark:text-gray-400"
                                }`}
                              >
                                {notification.title}
                              </h4>
                              {isUnread && (
                                <div className="w-2 h-2 bg-primary dark:bg-primary rounded-full flex-shrink-0" />
                              )}
                              <Badge
                                variant="outline"
                                className={`text-xs px-1.5 py-0.5 capitalize flex-shrink-0 ${getPriorityColor(notification.priority ?? "Normal")}`}
                              >
                                {getPriorityText(notification.priority ?? "Normal")}
                              </Badge>
                            </div>
                            <p
                              className={`text-xs mb-2 ${isUnread ? "text-foreground/80 dark:text-gray-200" : "text-muted-foreground dark:text-gray-400"}`}
                            >
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Clock className="h-3 w-3 text-muted-foreground dark:text-gray-500" />
                              <p className="text-xs text-muted-foreground dark:text-gray-500">
                                {notification.timeAgo ?? "hace un momento"}
                              </p>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 z-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isUnread) {
                              handleMarkAsRead(notification.id ?? "");
                            }
                          }}
                          title="Marcar como leída"
                          disabled={!isUnread}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    {/* Separador solo entre notificaciones, no después de la última */}
                    {index < notificationsToDisplay.length - 1 && <Separator className="my-1 dark:bg-gray-800" />}
                  </div>
                );
              })}

              {/* Indicador de carga para más notificaciones */}
              {isFetchingNextPage && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin mr-2 dark:text-gray-400" />
                  <span className="text-sm text-muted-foreground dark:text-gray-400">
                    Cargando más notificaciones...
                  </span>
                </div>
              )}

              {/* Indicador de que no hay más notificaciones */}
              {!hasNextPage && notificationsToDisplay.length > 0 && (
                <div className="flex items-center justify-center p-4">
                  <span className="text-xs text-muted-foreground dark:text-gray-500">No hay más notificaciones</span>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {notificationsToDisplay.length > 0 && (
          <div className="p-4 border-t dark:border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground dark:text-gray-400">
                Mostrando {notificationsToDisplay.length} notificaciones
                {unreadCount > 0 && ` (${unreadCount} no leídas)`}
              </span>
            </div>
            <Button
              variant="outline"
              className="w-full text-xs dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Ver todas las notificaciones
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
