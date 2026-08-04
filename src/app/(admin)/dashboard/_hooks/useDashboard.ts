import { backend } from "@/types/backend";

export type DashboardDateParams = {
  year: number;
  from?: string;
  to?: string;
};

function buildDashboardQuery(params: DashboardDateParams) {
  const query: DashboardDateParams = { year: params.year };
  if (params.from && params.to) {
    query.from = params.from;
    query.to = params.to;
  }
  return query;
}

/** Hook para obtener los datos del dashboard admin */
export function useDashboardAdmin(params: DashboardDateParams) {
  return backend.useQuery(
    "get",
    "/api/Dashboard/admin",
    {
      params: {
        query: buildDashboardQuery(params),
      },
    },
    {
      enabled: true,
    }
  );
}

/** Actividad (leads + tareas) de un SalesAdvisor en el dashboard admin */
export function useDashboardAdminTeamMemberActivity(
  userId: string | null | undefined,
  params: DashboardDateParams,
  enabled = true
) {
  return backend.useQuery(
    "get",
    "/api/Dashboard/admin/team-member/{userId}/activity",
    {
      params: {
        path: { userId: userId ?? "" },
        query: buildDashboardQuery(params),
      },
    },
    {
      enabled: enabled && !!userId,
    }
  );
}

/** Hook para obtener los datos del dashboard sales advisor */
export function useDashboardSalesAdvisor(year?: number) {
  return backend.useQuery(
    "get",
    "/api/Dashboard/advisor",
    {
      params: {
        query: { year },
      },
    },
    {
      enabled: year !== undefined,
    }
  );
}

/** Hook para obtener los datos del dashboard finance manager */
export function useDashboardFinanceManager(year?: number, projectId?: string | null) {
  const query: { year?: number; projectId?: string } = { year };
  if (projectId !== null && projectId !== undefined) {
    query.projectId = projectId;
  }

  return backend.useQuery(
    "get",
    "/api/Dashboard/finance",
    {
      params: { query },
    },
    {
      enabled: year !== undefined,
    }
  );
}

/** Hook para obtener los datos del dashboard supervisor */
export function useDashboardSupervisor(year?: number) {
  return backend.useQuery(
    "get",
    "/api/Dashboard/supervisor",
    {
      params: {
        query: { year },
      },
    },
    {
      enabled: year !== undefined,
    }
  );
}

/** Hook para obtener los datos del dashboard manager */
export function useDashboardManager(year?: number) {
  return backend.useQuery(
    "get",
    "/api/Dashboard/manager",
    {
      params: {
        query: { year },
      },
    },
    {
      enabled: year !== undefined,
    }
  );
}

/** Hook para obtener los datos del dashboard commercial manager */
export function useDashboardCommercialManager(year?: number) {
  return backend.useQuery(
    "get",
    "/api/Dashboard/commercial-manager",
    {
      params: {
        query: { year },
      },
    },
    {
      enabled: year !== undefined,
    }
  );
}
