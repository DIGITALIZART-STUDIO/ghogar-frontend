import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import type { paths } from "./api";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
if (!BACKEND_URL) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL environment variable is not set");
}

/**
 * Client for connecting with the backend
 */
const fetchClient = createFetchClient<paths>({ baseUrl: process.env.INTERNAL_BACKEND_URL ?? "http://localhost:5165", credentials: "include" });

export const backend = createClient(fetchClient);

