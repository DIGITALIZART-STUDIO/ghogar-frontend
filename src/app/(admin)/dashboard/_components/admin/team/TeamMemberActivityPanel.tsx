"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CheckCircle2, Circle, ClipboardList, UserCheck } from "lucide-react";

import { LeadStatusLabels } from "@/app/(admin)/assignments/_utils/assignments.utils";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useDashboardAdminTeamMemberActivity, type DashboardDateParams } from "../../../_hooks/useDashboard";

interface TeamMemberActivityPanelProps {
  userId: string;
  dateFilter: DashboardDateParams;
}

export function TeamMemberActivityPanel({ userId, dateFilter }: TeamMemberActivityPanelProps) {
  const { data, isLoading, isError } = useDashboardAdminTeamMemberActivity(userId, dateFilter, true);

  if (isLoading) {
    return (
      <div className="mt-4 flex justify-center py-6">
        <LoadingSpinner size="sm" text="Cargando actividad..." />
      </div>
    );
  }

  if (isError) {
    return <p className="mt-4 text-sm text-red-600 dark:text-red-400">No se pudo cargar la actividad del asesor.</p>;
  }

  const leads = data?.leads ?? [];
  const tasks = data?.tasks ?? [];

  return (
    <div className="mt-4 space-y-4 border-t border-slate-200/80 pt-4 dark:border-slate-700/60">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <UserCheck className="h-3.5 w-3.5" />
          Últimos leads
        </div>
        {leads.length === 0 ? (
          <p className="text-xs text-muted-foreground">No hay leads en el periodo seleccionado</p>
        ) : (
          <ul className="space-y-2">
            {leads.map((lead) => {
              const statusKey = lead.status as keyof typeof LeadStatusLabels;
              const statusConfig = LeadStatusLabels[statusKey];

              return (
                <li
                  key={lead.id}
                  className="rounded-lg border border-slate-200/80 bg-white/70 px-3 py-2 dark:border-slate-700/60 dark:bg-slate-900/40"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{lead.clientName ?? "Sin cliente"}</p>
                      <p className="text-xs text-muted-foreground">
                        {lead.entryDate ? format(new Date(lead.entryDate), "dd MMM yyyy", { locale: es }) : "Sin fecha"}
                      </p>
                    </div>
                    {statusConfig && (
                      <Badge variant="outline" className={`${statusConfig.className} shrink-0 text-[10px]`}>
                        {statusConfig.label}
                      </Badge>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div>
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <ClipboardList className="h-3.5 w-3.5" />
          Últimas tareas
        </div>
        {tasks.length === 0 ? (
          <p className="text-xs text-muted-foreground">No hay tareas en el periodo seleccionado</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="rounded-lg border border-slate-200/80 bg-white/70 px-3 py-2 dark:border-slate-700/60 dark:bg-slate-900/40"
              >
                <div className="flex items-start gap-2">
                  {task.isCompleted ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                  ) : (
                    <Circle className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground line-clamp-2">
                      {task.description ?? "Sin descripción"}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      {task.type && <span>{task.type}</span>}
                      {task.createdAt && <span>{format(new Date(task.createdAt), "dd MMM yyyy", { locale: es })}</span>}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
