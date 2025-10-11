import { useEffect, useRef, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@/context/auth-provider";

/**
 * Hook global que intercepta TODOS los errores de React Query
 * y maneja automáticamente los errores de autenticación.
 *
 * Este hook debe ser usado en el componente raíz (layout) para
 * interceptar errores de cualquier query en la aplicación.
 */
export function useGlobalErrorHandler() {
    const queryClient = useQueryClient();
    const { handleAuthError, isLoggingOut } = useAuthContext();
    const processingRef = useRef<Set<string>>(new Set());

    // Memoizar las funciones para evitar re-creaciones
    const memoizedHandleAuthError = useMemo(() => handleAuthError, [handleAuthError]);

    useEffect(() => {
        // Interceptar errores de queries
        const unsubscribeQueries = queryClient.getQueryCache().subscribe((event) => {
            // Solo procesar eventos de error, no todos los eventos
            if (event.type === "updated" && event.query.state.error && !isLoggingOut) {
                const error = event.query.state.error as { statusCode?: number; status?: number; response?: { status?: number }; error?: string | { rawText?: string }; name?: string; message?: string };
                const queryKey = JSON.stringify(event.query.queryKey);

                // Ignorar AbortError (cancelaciones de queries)
                if (error?.name === "AbortError" || error?.message?.includes("aborted")) {
                    return;
                }

                // Evitar procesar el mismo error múltiples veces
                if (processingRef.current.has(queryKey)) {
                    return;
                }

                // Detectar errores de autenticación
                const statusCode = error?.statusCode ?? error?.status ?? error?.response?.status;
                const errorMessage = error?.error;

                const isAuthError =
                    statusCode === 401 ||
                    statusCode === 403 ||
                    errorMessage === "Unauthorized" ||
                    (typeof error?.error === "object" && typeof error.error?.rawText === "string" && /unauthorized/i.test(error.error.rawText));

                if (isAuthError) {
                    processingRef.current.add(queryKey);

                    memoizedHandleAuthError(error).finally(() => {
                        // Remover de la lista de procesamiento después de un delay
                        setTimeout(() => {
                            processingRef.current.delete(queryKey);
                        }, 1000);
                    });
                }
            }
        });

        // Interceptar errores de mutations
        const unsubscribeMutations = queryClient.getMutationCache().subscribe((event) => {
            // Solo procesar eventos de error, no todos los eventos
            if (event.type === "updated" && event.mutation.state.error && !isLoggingOut) {
                const error = event.mutation.state.error as { statusCode?: number; status?: number; response?: { status?: number }; error?: string | { rawText?: string }; name?: string; message?: string };
                const mutationKey = JSON.stringify(event.mutation.options.mutationKey ?? "unknown");

                // Ignorar AbortError (cancelaciones de mutations)
                if (error?.name === "AbortError" || error?.message?.includes("aborted")) {
                    return;
                }

                // Evitar procesar el mismo error múltiples veces
                if (processingRef.current.has(mutationKey)) {
                    return;
                }

                // Detectar errores de autenticación
                const statusCode = error?.statusCode ?? error?.status ?? error?.response?.status;
                const errorMessage = error?.error;

                const isAuthError =
                    statusCode === 401 ||
                    statusCode === 403 ||
                    errorMessage === "Unauthorized" ||
                    (typeof error?.error === "object" && typeof error.error?.rawText === "string" && /unauthorized/i.test(error.error.rawText));

                if (isAuthError) {
                    processingRef.current.add(mutationKey);

                    memoizedHandleAuthError(error).finally(() => {
                        // Remover de la lista de procesamiento después de un delay
                        setTimeout(() => {
                            processingRef.current.delete(mutationKey);
                        }, 1000);
                    });
                }
            }
        });

        return () => {
            unsubscribeQueries();
            unsubscribeMutations();
        };
    }, [queryClient, memoizedHandleAuthError, isLoggingOut]);
}
