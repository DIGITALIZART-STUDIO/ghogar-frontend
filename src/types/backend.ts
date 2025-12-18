import { useMutation, useQueryClient, type UseMutationOptions, type UseMutationResult } from "@tanstack/react-query";
import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";

import type { paths } from "./api";

export type FetchError = {
  statusCode: number;
  message: string;
  error: unknown;
};

/**
 * Standard API error type for consistent error handling
 */
export type ApiError = {
  statusCode: number;
  message: string;
  error: string;
};

// Type helpers for OpenAPI paths
type PathKey = keyof paths;
type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

// Helper type to extract response type for successful status codes
type ExtractSuccessResponse<P extends PathKey, M extends HttpMethod> = paths[P] extends {
  [K in M]: {
    responses: {
      200?: { content: { "application/json": infer T200 } };
      201?: { content: { "application/json": infer T201 } };
    };
  };
}
  ? T200 extends undefined
    ? T201 extends undefined
      ? never
      : T201
    : T201 extends undefined
      ? T200
      : T200 | T201
  : never;

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

      // Obtener la URL del request
      const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : "";

      // Verificar si hay archivos en el body o campos que sugieren que podría haber archivos
      const hasFiles = Object.values(bodyObj).some(
        (value) => value instanceof File || (Array.isArray(value) && value.some((item) => item instanceof File))
      );

      // Detectar campos comunes de archivos (para endpoints que siempre requieren FormData)
      const hasFileLikeFields = Object.keys(bodyObj).some(
        (key) =>
          key.toLowerCase().includes("image") ||
          key.toLowerCase().includes("file") ||
          key.toLowerCase().includes("photo")
      );

      // Detectar endpoints que siempre requieren FormData (por ejemplo, /api/Projects para POST/PUT)
      const requiresFormData = url.includes("/api/Projects") && (init.method === "POST" || init.method === "PUT");

      if (hasFiles || hasFileLikeFields || requiresFormData) {
        // Si hay archivos reales, usar multipart/form-data (FormData)
        // Si no hay archivos pero requiere form data, usar application/x-www-form-urlencoded (URLSearchParams)
        if (hasFiles) {
          // Crear FormData para archivos (multipart/form-data)
          const formData = new FormData();

          Object.entries(bodyObj).forEach(([key, value]) => {
            // Si es un File real, agregarlo directamente
            if (value instanceof File) {
              formData.append(key, value);
            } else if (Array.isArray(value)) {
              // Si es un array, procesar cada elemento
              value.forEach((item, index) => {
                if (item instanceof File) {
                  formData.append(`${key}[${index}]`, item);
                } else if (item !== null && item !== undefined) {
                  formData.append(`${key}[${index}]`, String(item));
                }
              });
            } else if (value !== null && value !== undefined && typeof value === "object") {
              // Si es un objeto que no es File, omitirlo (no agregar objetos complejos)
              // Omitir objetos que no son Files (como {path: "...", relativePath: "..."})
              // Solo agregar si es un File real
              if (value instanceof File) {
                formData.append(key, value);
              }
              // Si no es File, no agregarlo al FormData
            } else {
              // Para valores primitivos, agregarlos al FormData
              // Incluir todos los valores primitivos (incluyendo 0 y strings vacíos)
              if (value !== null && value !== undefined) {
                if (typeof value === "number" || typeof value === "boolean") {
                  formData.append(key, String(value));
                } else if (typeof value === "string") {
                  formData.append(key, value);
                }
              }
            }
          });

          fetchInit.body = formData;
          // No establecer Content-Type para FormData, el navegador lo hará automáticamente
        } else {
          // No hay archivos, usar application/x-www-form-urlencoded (URLSearchParams)
          const params = new URLSearchParams();

          Object.entries(bodyObj).forEach(([key, value]) => {
            // Omitir objetos complejos y archivos
            if (value !== null && value !== undefined && typeof value !== "object") {
              if (typeof value === "number" || typeof value === "boolean") {
                params.append(key, String(value));
              } else if (typeof value === "string") {
                params.append(key, value);
              }
            }
          });

          fetchInit.body = params.toString();
          fetchInit.headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            ...init.headers,
          };
        }
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
    // No loggear AbortError (cancelaciones normales de React Query)
    throw e;
  }

  // Si la respuesta no es exitosa, lanzar un error para que React Query lo maneje
  if (!response.ok) {
    // Intentar obtener el mensaje de error del servidor
    let errorMessage = response.statusText;
    try {
      const contentType = response.headers.get("content-type");

      // Clonar la respuesta para poder leer el body sin consumirlo
      const clonedResponse = response.clone();

      if (contentType && contentType.includes("application/json")) {
        // Si es JSON, parsearlo
        const errorData = await clonedResponse.json();
        errorMessage = errorData.message ?? errorData.title ?? errorData.error ?? response.statusText;
      } else if (contentType && contentType.includes("text/")) {
        // Si es texto plano, leerlo directamente
        const errorData = await clonedResponse.text();
        if (errorData) {
          errorMessage = errorData;
        }
      }
    } catch {
      // Si falla al leer el error, usar el statusText
    }

    const error: ApiError = {
      statusCode: response.status,
      message: errorMessage,
      error: errorMessage,
    };

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
 * Upload files using enhanced fetch with autocomplete for endpoints
 * This provides autocomplete for paths based on OpenAPI schema
 * Also accepts string paths for dynamic endpoints
 *
 * @example
 * ```ts
 * // TypeScript will autocomplete the path when you type "/api/"
 * const response = await uploadFile("post", "/api/Projects/upload", fileObject, "projectImage");
 *
 * // For dynamic paths, use string
 * const response = await uploadFile("post", `/api/Projects/${id}/upload`, fileObject);
 * ```
 */
export function uploadFile<P extends PathKey | string>(
  method: "post",
  path: P,
  file: File,
  fieldName: string = "file"
): Promise<Response> {
  const baseUrl = backendUrl(BACKEND_URL ?? "");
  const url = `${baseUrl}${String(path)}`;
  const formData = createFormDataForFile(file, fieldName);

  return enhancedFetch(url, {
    method: "POST",
    body: formData,
  });
}

/**
 * Upload data with optional file using FormData - Low-level function
 * This is the internal implementation used by the mutation hooks
 *
 * @internal
 */
async function uploadWithFormDataInternal<P extends PathKey | string, M extends "post" | "put">(
  method: M,
  path: P,
  options: {
    params?: {
      path?: Record<string, string>;
    };
    body: Record<string, unknown>;
  }
): Promise<P extends PathKey ? ExtractSuccessResponse<P, M> : unknown> {
  // Construir la URL completa usando la misma base URL que el cliente
  const baseUrl = backendUrl(BACKEND_URL ?? "");
  // Reemplazar placeholders en el path (ej: {id} -> valor real)
  const pathString = String(path).replace(/\{(\w+)\}/g, (match, key) => options.params?.path?.[key] ?? match);
  const url = `${baseUrl}${pathString}`;

  // Usar body para los datos del formulario
  const data = options.body;

  // Verificar si hay archivos reales en los datos
  const hasFiles = Object.values(data).some((value) => value instanceof File);

  let body: FormData | URLSearchParams;
  let headers: Record<string, string> | undefined;

  if (hasFiles) {
    // Si hay archivos, usar multipart/form-data
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== null && value !== undefined && typeof value !== "object") {
        formData.append(key, String(value));
      }
    });
    body = formData;
    // No establecer Content-Type, el navegador lo hará con el boundary correcto
    headers = undefined;
  } else {
    // Si no hay archivos, usar application/x-www-form-urlencoded
    const params = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined && typeof value !== "object") {
        params.append(key, String(value));
      }
    });
    body = params;
    headers = { "Content-Type": "application/x-www-form-urlencoded" };
  }

  const response = await fetch(url, {
    method: method.toUpperCase(),
    body,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    // Intentar obtener el mensaje de error del servidor
    let errorMessage = response.statusText;
    try {
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        // Si es JSON, parsearlo
        const errorData = await response.json();
        errorMessage = errorData.message ?? errorData.title ?? errorData.error ?? response.statusText;
      } else {
        // Si es texto plano, leerlo directamente
        const errorData = await response.text();
        if (errorData) {
          errorMessage = errorData;
        }
      }
    } catch {
      // Si falla al leer el error, usar el statusText
    }

    const error: ApiError = {
      statusCode: response.status,
      message: errorMessage,
      error: errorMessage,
    };
    throw error;
  }

  return response.json() as P extends PathKey ? ExtractSuccessResponse<P, M> : unknown;
}

/**
 * Download files as Blob using enhanced fetch with autocomplete for endpoints
 * This is specifically for binary responses like PDFs, DOCX, etc.
 * Uses the same base URL and authentication as the openapi-fetch client
 * This provides autocomplete for paths based on OpenAPI schema
 * Also accepts string paths for dynamic endpoints
 *
 * @param method - HTTP method ("get")
 * @param path - API endpoint path with placeholders (e.g., "/api/Projects/{id}/download") - TypeScript will autocomplete when typing "/api/"
 * @param params - Path parameters to replace placeholders in the path
 * @returns Promise that resolves to a Blob
 * @throws ApiError if the request fails
 *
 * @example
 * ```ts
 * // TypeScript will autocomplete the path when you type "/api/Projects"
 * const blob = await downloadFileWithClient("get", "/api/Projects/{id}/download", {
 *   path: { id: "project-id" }
 * });
 *
 * // For dynamic paths, use string
 * const blob = await downloadFileWithClient("get", `/api/Projects/${id}/download`, {
 *   path: {}
 * });
 * ```
 */
export async function downloadFileWithClient<P extends PathKey | string>(
  method: "get",
  path: P,
  params: { path: Record<string, string> }
): Promise<Blob> {
  // Construir la URL completa usando la misma base URL que el cliente
  const baseUrl = backendUrl(BACKEND_URL ?? "");
  const url = `${baseUrl}${String(path)}`.replace(/\{(\w+)\}/g, (match, key) => params.path[key] || match);

  const response = await enhancedFetch(url, {
    method: "GET",
  });

  if (!response.ok) {
    const error: ApiError = {
      statusCode: response.status,
      message: response.statusText,
      error: response.statusText,
    };
    throw error;
  }

  return response.blob();
}

/**
 * Configuration for form data mutation hook
 */
export interface UploadWithFormDataConfig<
  P extends PathKey | string,
  M extends "post" | "put",
  TVariables extends
    | { body: Record<string, unknown> }
    | { params: { path: { [key: string]: string } }; body: Record<string, unknown> },
  TContext = unknown,
> {
  invalidateQueries?: (queryClient: ReturnType<typeof useQueryClient>, variables?: TVariables) => void;
  useAuthContext: () => { handleAuthError: (error: unknown) => Promise<unknown> };
  options?: Omit<
    UseMutationOptions<P extends PathKey ? ExtractSuccessResponse<P, M> : unknown, ApiError, TVariables, TContext>,
    "mutationFn"
  >;
}

/**
 * Upload data with optional file using FormData with React Query mutation hook included
 * This function combines the upload functionality with mutation hook creation
 * Eliminates repetitive patterns by handling both the fetch and mutation logic
 *
 * @param method - HTTP method ("post" | "put")
 * @param path - API endpoint path with placeholders (e.g., "/api/Projects" or "/api/Projects/{id}") - TypeScript will autocomplete when typing "/api/"
 * @param config - Configuration for the mutation hook (invalidation, auth context, etc.)
 * @returns A React Query mutation hook ready to use
 *
 * @example
 * ```ts
 * // Simple POST mutation
 * export const useCreateProject = uploadWithFormData("post", "/api/Projects", {
 *   useAuthContext,
 *   invalidateQueries: (queryClient) => {
 *     queryClient.invalidateQueries({ queryKey: ["get", "/api/Projects"] });
 *   },
 * });
 *
 * // PUT mutation with path parameters
 * export const useUpdateProject = uploadWithFormData("put", "/api/Projects/{id}", {
 *   useAuthContext,
 *   invalidateQueries: (queryClient, variables) => {
 *     queryClient.invalidateQueries({ queryKey: ["get", "/api/Projects"] });
 *     if (variables && "params" in variables) {
 *       queryClient.invalidateQueries({ queryKey: ["get", "/api/Projects/{id}", { path: { id: variables.params.path.id } }] });
 *     }
 *   },
 * });
 * ```
 */
export function uploadWithFormData<
  P extends PathKey | string,
  M extends "post" | "put",
  TVariables extends
    | { body: Record<string, unknown> }
    | { params: { path: { [key: string]: string } }; body: Record<string, unknown> } = M extends "post"
    ? { body: Record<string, unknown> }
    : { params: { path: { [key: string]: string } }; body: Record<string, unknown> },
  TContext = unknown,
>(
  method: M,
  path: P,
  config: UploadWithFormDataConfig<P, M, TVariables, TContext>
): () => UseMutationResult<P extends PathKey ? ExtractSuccessResponse<P, M> : unknown, ApiError, TVariables, TContext> {
  const { invalidateQueries, useAuthContext, options } = config;

  return () => {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return useMutation<P extends PathKey ? ExtractSuccessResponse<P, M> : unknown, ApiError, TVariables, TContext>({
      mutationFn: async (
        variables: TVariables
      ): Promise<P extends PathKey ? ExtractSuccessResponse<P, M> : unknown> => {
        // Type-safe extraction of params and body based on method
        if (method === "post") {
          const vars = variables as { body: Record<string, unknown> };
          return uploadWithFormDataInternal<P, M>(method, path, { body: vars.body });
        } else {
          // PUT method with path parameters
          const vars = variables as { params: { path: { [key: string]: string } }; body: Record<string, unknown> };
          return uploadWithFormDataInternal<P, M>(method, path, {
            params: { path: vars.params.path },
            body: vars.body,
          });
        }
      },
      onSuccess: (data, variables, context) => {
        if (invalidateQueries) {
          invalidateQueries(queryClient, variables);
        }
        options?.onSuccess?.(data, variables, context);
      },
      onError: async (error, variables, context) => {
        // Handle auth errors (401, 403) automatically
        const err = error as ApiError;
        if (err?.statusCode === 401 || err?.statusCode === 403) {
          await handleAuthError(error);
        }
        // Call custom error handler if provided
        options?.onError?.(error, variables, context);
      },
      ...options,
    });
  };
}
