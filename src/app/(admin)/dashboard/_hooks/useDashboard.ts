import { backend } from "@/types/backend2";

// Hook para obtener los datos del dashboard admin
export function useDashboardAdmin(year?: number) {
    return backend.useQuery(
        "get",
        "/api/Dashboard/admin",
        { year },
        {
            enabled: year !== undefined, // Solo ejecuta si year está definido
        }
    );
}

// Hook para obtener los datos del dashboard sales advisor
export function useDashboardSalesAdvisor(year?: number) {
    return backend.useQuery(
        "get",
        "/api/Dashboard/advisor",
        { year },
        {
            enabled: year !== undefined, // Solo ejecuta si year está definido
        }
    );
}
