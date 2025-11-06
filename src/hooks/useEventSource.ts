import { useEffect, useRef, useState, useCallback } from "react";
import type { UseEventSourceOptions, UseEventSourceReturn } from "@/types/notification";

/**
 * Hook personalizado para manejar Server-Sent Events (SSE)
 * Incluye reconexión automática, manejo de errores y cleanup
 */
export const useEventSource = (options: UseEventSourceOptions): UseEventSourceReturn => {
    const {
        url,
        onMessage,
        onError,
        onOpen,
        onClose,
        reconnectInterval = 3000,
        maxReconnectAttempts = 5,
    } = options;

    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const eventSourceRef = useRef<EventSource | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const reconnectAttemptsRef = useRef(0);
    const isManualDisconnectRef = useRef(false);

    // Función para crear la conexión SSE
    const createConnection = useCallback(() => {

        if (eventSourceRef.current) {
            eventSourceRef.current.close();
        }

        try {
            // EventSource usa cookies para autenticación (como el resto de la app)
            const eventSource = new EventSource(url, {
                withCredentials: true, // Importante: enviar cookies de autenticación
            });

            eventSourceRef.current = eventSource;

            // Event listeners
            eventSource.onopen = (event) => {
                setIsConnected(true);
                setError(null);
                reconnectAttemptsRef.current = 0;
                isManualDisconnectRef.current = false;
                onOpen?.(event);
            };

            eventSource.onmessage = (event) => {
                onMessage?.(event);
            };

            eventSource.onerror = (event) => {
                setIsConnected(false);
                setError("Connection error");
                onError?.(event);

                // Intentar reconectar si no es una desconexión manual
                if (!isManualDisconnectRef.current && reconnectAttemptsRef.current < maxReconnectAttempts) {
                    reconnectAttemptsRef.current += 1;
                    const delay = reconnectInterval * Math.pow(2, reconnectAttemptsRef.current - 1); // Backoff exponencial
                    reconnectTimeoutRef.current = setTimeout(() => {
                        createConnection();
                    }, delay);
                }
            };

            // Escuchar eventos específicos
            eventSource.addEventListener("notification", (event) => {
                onMessage?.(event);
            });

            eventSource.addEventListener("connection", (event) => {
                onMessage?.(event);
            });

            eventSource.addEventListener("heartbeat", (event) => {
                onMessage?.(event);
            });

        } catch (err) {
            console.error("❌ [useEventSource] Error creating connection", {
                error: err instanceof Error ? err.message : "Unknown error",
                url
            });
            setError(err instanceof Error ? err.message : "Failed to create connection");
            setIsConnected(false);
        }
    }, [url, onMessage, onError, onOpen, reconnectInterval, maxReconnectAttempts]);

    // Función para reconectar manualmente
    const reconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }
        reconnectAttemptsRef.current = 0;
        createConnection();
    }, [createConnection]);

    // Función para desconectar
    const disconnect = useCallback(() => {
        isManualDisconnectRef.current = true;
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }
        setIsConnected(false);
        onClose?.(new Event("close"));
    }, [onClose]);

    // Efecto para crear la conexión inicial
    useEffect(() => {
        createConnection();

        // Cleanup al desmontar
        return () => {
            disconnect();
        };
    }, [createConnection, disconnect]);

    // Cleanup de timeouts
    useEffect(() => () => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }
    }, []);

    return {
        isConnected,
        error,
        reconnect,
        disconnect,
    };
};
