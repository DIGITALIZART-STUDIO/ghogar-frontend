import { backend as api } from "@/types/backend2";

export function useUsers() {
    return api.useQuery("get", "/api/Users", undefined, {
        retry: false,
    });
}
