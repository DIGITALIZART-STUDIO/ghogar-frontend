import { backend } from "@/types/backend";

// Hook para obtener los datos del dashboard admin
export function useDashboardAdmin(year: number = new Date().getFullYear()) {
    return backend.useQuery(
        "get",
        "/api/Dashboard/admin",
        { year },
        {
            enabled: true, // Siempre ejecuta con el año por defecto
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

// Hook para obtener los datos del dashboard finance manager
export function useDashboardFinanceManager(year?: number, projectId?: string | null) {
    // Preparar los parámetros, excluyendo projectId si es null
    const params: { year?: number; projectId?: string } = { year };
    if (projectId !== null && projectId !== undefined) {
        params.projectId = projectId;
    }

    return backend.useQuery(
        "get",
        "/api/Dashboard/finance",
        params,
        {
            enabled: year !== undefined, // Solo ejecuta si year está definido
        }
    );
}

// Hook para obtener los datos del dashboard supervisor
export function useDashboardSupervisor(year?: number) {
    return backend.useQuery(
        "get",
        "/api/Dashboard/supervisor",
        { year },
        {
            enabled: year !== undefined, // Solo ejecuta si year está definido
        }
    );
}
