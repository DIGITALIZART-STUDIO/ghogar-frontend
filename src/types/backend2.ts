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
 */
export const enhancedFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    let response: Response;
    try {
        response = await fetch(input, {
            ...init,
            credentials: "include",
        });
    } catch (e) {
        throw e;
    }

    return response;
};

/**
 * Client for connecting with the backend
 */
const fetchClient = createFetchClient<paths>({
    baseUrl: backendUrl(BACKEND_URL),
    fetch: enhancedFetch,
});

export const backend = createClient(fetchClient);
