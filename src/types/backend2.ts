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

// Create a custom fetch implementation that better handles errors
const enhancedFetch = async (input: RequestInfo | URL, init?: RequestInit) => {

    if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 500));
    }

    let response: Response;
    try {
        response = await fetch(input, {
            ...init,
            credentials: "include",
        });
    } catch (e) {
        throw {
            statusCode: 503,
            message: "Servidor no disponible",
            error: e,
        };
    }

    if (!response.ok) {
        const text = await response.text();

        let parsedError;

        // Try to parse as JSON, but fall back to plain text if it fails
        try {
            parsedError = JSON.parse(text);
        } catch {
            // Not JSON, use the raw text
            parsedError = { rawText: text };
        }

        throw {
            statusCode: response.status,
            message: response.statusText,
            error: parsedError,
        };
    }

    return response;
};

/**
 * Client for connecting with the backend
 */
const fetchClient = createFetchClient<paths>({
    baseUrl: BACKEND_URL,
    fetch: enhancedFetch,
});

export const backend = createClient(fetchClient);
