"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { backend } from "@/types/backend2";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/variables";
import Cookies from "js-cookie";
import { setupAuthInterceptor } from "@/lib/auth-interceptor";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: unknown | null;
}

interface AuthContextType extends AuthState {
  handleLogout: () => Promise<void>;
  handleAuthError: (error: unknown) => Promise<boolean>;
  refreshAccessToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        isLoading: true,
        user: null,
    });

    // Usar hooks de React Query de manera lazy para evitar problemas de inicialización
    const refreshTokenMutation = backend.useMutation("post", "/api/Auth/refresh");
    const logoutMutation = backend.useMutation("post", "/api/Auth/logout");

    // Función para obtener el refresh token de las cookies
    const getRefreshToken = (): string | null => Cookies.get(REFRESH_TOKEN_KEY) ?? null;

    // Función para refrescar el token
    const refreshAccessToken = async (): Promise<boolean> => {
        const refreshTokenValue = getRefreshToken();
        if (!refreshTokenValue) {
            return false;
        }

        try {
            const response = await refreshTokenMutation.mutateAsync({
                body: { refreshToken: refreshTokenValue },
            });

            if (response) {
                setAuthState((prev) => ({
                    ...prev,
                    isAuthenticated: true,
                    isLoading: false,
                }));
                return true;
            }
        } catch (error) {
            console.error("Error refreshing token:", error);
            return false;
        }

        return false;
    };

    // Función para hacer logout
    const handleLogout = async () => {
        try {
            await logoutMutation.mutateAsync({});
        } catch (error) {
            console.error("Error during logout:", error);
        } finally {
            setAuthState({
                isAuthenticated: false,
                isLoading: false,
                user: null,
            });

            Cookies.remove(ACCESS_TOKEN_KEY);
            Cookies.remove(REFRESH_TOKEN_KEY);

            router.push("/login");
        }
    };

    // Función para interceptar errores 401 y intentar refresh
    const handleAuthError = async (error: unknown) => {
        if ((error as { statusCode?: number })?.statusCode === 401) {
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
            const refreshTokenValue = getRefreshToken();

            if (!accessToken && !refreshTokenValue) {
                setAuthState({
                    isAuthenticated: false,
                    isLoading: false,
                    user: null,
                });
                return;
            }

            // Si tenemos access token, asumimos que está autenticado
            // El refresh automático se encargará de renovarlo cuando sea necesario
            setAuthState({
                isAuthenticated: true,
                isLoading: false,
                user: null,
            });
        };

        checkAuth();
    }, []);

    // Configurar interceptor
    useEffect(() => {
        setupAuthInterceptor();
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
