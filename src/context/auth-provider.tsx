"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ACCESS_TOKEN_KEY } from "@/variables";
import Cookies from "js-cookie";
import { useQueryClient } from "@tanstack/react-query";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: unknown | null;
  isLoggingOut: boolean;
}

interface AuthContextType extends AuthState {
  handleLogout: () => Promise<void>;
  handleAuthError: (error: unknown) => Promise<boolean>;
  refreshAccessToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        isLoading: true,
        user: null,
        isLoggingOut: false,
    });

    // Variable para evitar múltiples refreshes simultáneos
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Función para refrescar el token
    const refreshAccessToken = useCallback(async (): Promise<boolean> => {
        // Evitar múltiples refreshes simultáneos
        if (isRefreshing) {
            return false;
        }

        setIsRefreshing(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Auth/refresh`, {
                method: "POST",
                credentials: "include",
            });

            // Verificar si la respuesta es exitosa (200-299)
            if (response.status >= 200 && response.status < 300) {
                // Esperar un poco para que las cookies se establezcan
                await new Promise((resolve) => setTimeout(resolve, 100));

                // Verificar si se establecieron nuevas cookies
                const newAccessToken = Cookies.get(ACCESS_TOKEN_KEY);

                if (newAccessToken) {
                    setAuthState((prev) => ({
                        ...prev,
                        isAuthenticated: true,
                        isLoading: false,
                        isLoggingOut: false,
                    }));

                    // Invalidar solo queries específicas para evitar bucles infinitos
                    await queryClient.invalidateQueries({
                        predicate: (query) => {
                            // Solo invalidar queries que no sean de autenticación
                            const queryKey = query.queryKey;
                            return !queryKey.includes("Auth") && !queryKey.includes("refresh");
                        }
                    });

                    // Esperar un poco más antes de permitir nuevas peticiones
                    await new Promise((resolve) => setTimeout(resolve, 200));

                    setIsRefreshing(false);
                    return true;
                } else {
                    setIsRefreshing(false);
                    return false;
                }
            } else {
                setIsRefreshing(false);
                return false;
            }
        } catch {
            setIsRefreshing(false);
            return false;
        }
    }, [isRefreshing, queryClient]);

    // Función para hacer logout
    const handleLogout = useCallback(async () => {
        // Marcar que estamos haciendo logout para evitar handleAuthError
        setAuthState((prev) => ({
            ...prev,
            isLoggingOut: true,
        }));

        // Cancelar todas las queries activas INMEDIATAMENTE (sin await)
        queryClient.cancelQueries();

        try {
            // Llamar al endpoint de logout del backend
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Auth/logout`, {
                method: "POST",
                credentials: "include",
            });
        } catch (error) {
            console.error("Error during logout:", error);
        } finally {
            // Limpiar cache de React Query al hacer logout ANTES de cambiar el estado
            queryClient.clear();

            // Limpiar estado local PERO mantener isLoggingOut: true para evitar nuevas queries
            setAuthState({
                isAuthenticated: false,
                isLoading: false,
                user: null,
                isLoggingOut: true, // Mantener true para evitar nuevas queries
            });

            // Redirigir inmediatamente sin delay
            router.push("/login");
        }
    }, [queryClient, router]);

    // Función para interceptar errores 401 y intentar refresh
    const handleAuthError = useCallback(async (error: unknown) => {
        // Si estamos haciendo logout, no procesar errores de autenticación
        if (authState.isLoggingOut) {
            return false;
        }

        const statusCode = (error as { statusCode?: number })?.statusCode;
        const errorMessage = (error as { error?: string })?.error;

        if (statusCode === 401 || errorMessage === "Unauthorized") {
            // Si ya se está refrescando, no hacer nada
            if (isRefreshing) {
                return false;
            }

            const success = await refreshAccessToken();

            if (!success) {
                toast.error("Sesión expirada. Por favor, inicie sesión nuevamente.");
                await handleLogout();
            }
            return success;
        }

        return false;
    }, [authState.isLoggingOut, isRefreshing, refreshAccessToken, handleLogout]);

    // Verificar autenticación al montar
    useEffect(() => {
        const checkAuth = () => {
            const accessToken = Cookies.get(ACCESS_TOKEN_KEY);

            if (!accessToken) {
                setAuthState({
                    isAuthenticated: false,
                    isLoading: false,
                    user: null,
                    isLoggingOut: false,
                });
                return;
            }

            // Si tenemos access token, asumimos que está autenticado
            setAuthState({
                isAuthenticated: true,
                isLoading: false,
                user: null,
                isLoggingOut: false,
            });
        };

        checkAuth();
    }, []);

    // Resetear estado de logout cuando se llega a la página de login o select-project
    useEffect(() => {
        const resetLogoutState = () => {
            if (typeof window !== "undefined") {
                const currentPath = window.location.pathname;
                if (currentPath === "/login" || currentPath === "/select-project") {
                    setAuthState((prev) => ({
                        ...prev,
                        isLoggingOut: false,
                    }));
                }
            }
        };

        // Ejecutar inmediatamente
        resetLogoutState();

        // Escuchar cambios de ruta
        const handleRouteChange = () => {
            resetLogoutState();
        };

        // Agregar listener para cambios de ruta
        window.addEventListener("popstate", handleRouteChange);

        // También escuchar el evento personalizado de Next.js router
        const originalPush = window.history.pushState;
        const originalReplace = window.history.replaceState;

        window.history.pushState = function(...args) {
            originalPush.apply(this, args);
            setTimeout(resetLogoutState, 0);
        };

        window.history.replaceState = function(...args) {
            originalReplace.apply(this, args);
            setTimeout(resetLogoutState, 0);
        };

        return () => {
            window.removeEventListener("popstate", handleRouteChange);
            window.history.pushState = originalPush;
            window.history.replaceState = originalReplace;
        };
    }, []);

    return (
        <AuthContext.Provider value={{
            ...authState,
            handleLogout,
            handleAuthError,
            refreshAccessToken,
        }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within an AuthProvider");
    }
    return context;
}
