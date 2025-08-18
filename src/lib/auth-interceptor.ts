import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/variables";
import Cookies from "js-cookie";

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve(token);
        }
    });

    failedQueue = [];
};

export const setupAuthInterceptor = () => {
    // Solo configurar el interceptor una vez
    if ((window as unknown as { __authInterceptorSetup?: boolean }).__authInterceptorSetup) {
        return;
    }

    // Interceptar respuestas para manejar errores 401
    const originalFetch = window.fetch;

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
        const response = await originalFetch(input, init);

        // Solo procesar si es una petición a nuestro backend y hay error 401
        if (response.status === 401 && init?.credentials === "include") {
            const originalRequest = () => originalFetch(input, init);

            if (isRefreshing) {
                // Si ya se está refrescando, agregar a la cola
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => originalRequest())
                    .catch((err) => Promise.reject(err));
            }

            isRefreshing = true;

            const refreshToken = Cookies.get(REFRESH_TOKEN_KEY);

            if (!refreshToken) {
                processQueue(new Error("No refresh token available"));
                isRefreshing = false;
                return Promise.reject(new Error("No refresh token available"));
            }

            try {
                const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Auth/refresh`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({ refreshToken }),
                });

                if (refreshResponse.ok) {
                    // El backend ya estableció las nuevas cookies
                    processQueue(null, "token_refreshed");
                    isRefreshing = false;

                    // Reintentar la petición original
                    return originalRequest();
                } else {
                    throw new Error("Failed to refresh token");
                }
            } catch (error) {
                processQueue(error);
                isRefreshing = false;

                // Limpiar cookies y redirigir al login
                Cookies.remove(ACCESS_TOKEN_KEY);
                Cookies.remove(REFRESH_TOKEN_KEY);

                // Redirigir al login si estamos en el cliente
                if (typeof window !== "undefined") {
                    window.location.href = "/login";
                }

                return Promise.reject(error);
            }
        }

        return response;
    };

    // Marcar como configurado
    (window as unknown as { __authInterceptorSetup?: boolean }).__authInterceptorSetup = true;
};
