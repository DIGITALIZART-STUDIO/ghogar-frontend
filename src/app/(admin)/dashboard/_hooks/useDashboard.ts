import { backend } from "@/types/backend2";

// Hook para obtener los datos del dashboard admin
export function useDashboardAdmin(year?: number) {
    return backend.useQuery(
        "get",
        "/api/dashboard/admin",
        { year },
        {
            enabled: year !== undefined, // Solo ejecuta si year está definido
        }
    );
}
