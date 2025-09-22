import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";

import type { paths } from "./api";

export type FetchError = {
    statusCode: number;
    message: string;
    error: unknown;
};

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
if (!BACKEND_URL) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL environment variable is not set");
}

export const backendUrl = (baseUrl: string, version?: string) => (version ? `${baseUrl}/${version}` : baseUrl);

/**
 * Custom fetch implementation that includes credentials and handles errors
 * Automatically handles FormData for file uploads
 */
export const enhancedFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    let response: Response;
    try {
        // Preparar la configuración de fetch
        const fetchInit: RequestInit = {
            ...init,
            credentials: "include",
        };

        // Detectar si el body contiene archivos y crear FormData si es necesario
        if (init?.body && typeof init.body === "object" && !(init.body instanceof FormData)) {
            const bodyObj = init.body as unknown as Record<string, unknown>;

            // Verificar si hay archivos en el body
            const hasFiles = Object.values(bodyObj).some((value) => value instanceof File ||
                (Array.isArray(value) && value.some((item) => item instanceof File)));

            if (hasFiles) {
                // Crear FormData para archivos
                const formData = new FormData();

                Object.entries(bodyObj).forEach(([key, value]) => {
                    if (value instanceof File) {
                        formData.append(key, value);
                    } else if (Array.isArray(value)) {
                        value.forEach((item, index) => {
                            if (item instanceof File) {
                                formData.append(`${key}[${index}]`, item);
                            } else {
                                formData.append(`${key}[${index}]`, String(item));
                            }
                        });
                    } else if (value !== null && value !== undefined) {
                        formData.append(key, String(value));
                    }
                });

                fetchInit.body = formData;
                // No establecer Content-Type para FormData, el navegador lo hará automáticamente
            } else {
                // Para objetos JSON sin archivos, establecer Content-Type
                fetchInit.headers = {
                    "Content-Type": "application/json",
                    ...init.headers,
                };
                fetchInit.body = JSON.stringify(bodyObj);
            }
        }

        response = await fetch(input, fetchInit);
    } catch (e) {
        throw e;
    }

    // Si la respuesta no es exitosa, lanzar un error para que React Query lo maneje
    if (!response.ok) {
        const error = {
            statusCode: response.status,
            message: response.statusText,
            error: response.statusText,
        };
        console.log("🚨 [BACKEND2] Error HTTP:", response.status, response.statusText);
        throw error;
    }

    return response;
};

/**
 * Client for connecting with the backend
 */
export const fetchClient = createFetchClient<paths>({
    baseUrl: backendUrl(BACKEND_URL),
    fetch: enhancedFetch,
});

export const backend = createClient(fetchClient);

/**
 * Helper function to create FormData for file uploads
 */
export const createFormDataForFile = (file: File, fieldName: string = "file"): FormData => {
    const formData = new FormData();
    formData.append(fieldName, file);
    return formData;
};

/**
 * Helper function to upload files using enhanced fetch
 */
export const uploadFile = async (url: string, file: File, fieldName: string = "file"): Promise<Response> => {
    const formData = createFormDataForFile(file, fieldName);

    return enhancedFetch(url, {
        method: "POST",
        body: formData,
    });
};

/**
 * Helper function to download files as Blob using enhanced fetch
 * This is specifically for binary responses like PDFs, DOCX, etc.
 * Uses the same base URL and authentication as the openapi-fetch client
 */
export const downloadFileWithClient = async (
    path: string,
    params: { path: Record<string, string> }
): Promise<Blob> => {
    // Construir la URL completa usando la misma base URL que el cliente
    const baseUrl = backendUrl(BACKEND_URL);
    const url = `${baseUrl}${path}`.replace(/\{(\w+)\}/g, (match, key) => params.path[key] || match);

    const response = await enhancedFetch(url, {
        method: "GET",
    });

    if (!response.ok) {
        const error = {
            statusCode: response.status,
            message: response.statusText,
            error: response.statusText,
        };
        throw error;
    }

    return response.blob();
};
