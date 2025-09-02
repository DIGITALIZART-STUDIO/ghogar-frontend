"use client";

import { createContext, useContext, useEffect, useState } from "react";
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
    const refreshAccessToken = async (): Promise<boolean> => {
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

                    // Invalidar todo el cache de React Query para forzar nuevas peticiones
                    await queryClient.invalidateQueries();

                    // Esperar un poco más antes de permitir nuevas peticiones
                    await new Promise((resolve) => setTimeout(resolve, 500));

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
    };

    // Función para hacer logout
    const handleLogout = async () => {
        // Marcar que estamos haciendo logout para evitar handleAuthError
        setAuthState((prev) => ({
            ...prev,
            isLoggingOut: true,
        }));

        try {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Auth/logout`, {
                method: "POST",
                credentials: "include",
            });
        } catch (error) {
            console.error("Error during logout:", error);
        } finally {
            setAuthState({
                isAuthenticated: false,
                isLoading: false,
                user: null,
                isLoggingOut: false,
            });

            // Limpiar cache de React Query al hacer logout
            queryClient.clear();

            Cookies.remove(ACCESS_TOKEN_KEY);
            router.push("/login");
        }
    };

    // Función para interceptar errores 401 y intentar refresh
    const handleAuthError = async (error: unknown) => {
        // Si estamos haciendo logout, no procesar errores de autenticación
        if (authState.isLoggingOut) {
            return false;
        }

        if ((error as { statusCode?: number })?.statusCode === 401) {
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
    };

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
