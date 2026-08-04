"use client";

import { CalendarCheck, CalendarClock, ClipboardList, Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAdvisorActivityTasks } from "../_hooks/useAdvisorActivityTasks";
import { AdvisorActivityReportItem } from "../_types/advisorActivity";
import { formatReportDate, TaskTypeLabels } from "../_utils/advisorActivity.utils";

interface AdvisorActivityTaskDetailProps {
  row: AdvisorActivityReportItem;
}

export function AdvisorActivityTaskDetail({ row }: AdvisorActivityTaskDetailProps) {
  const { data: tasks, isLoading, isError } = useAdvisorActivityTasks(row.leadId, true);

  return (
    <div className="flex flex-col gap-3 p-2">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <ClipboardList className="size-4 text-primary" />
        Tareas del lead {row.leadCode}
      </div>
      <Separator />

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
          <Loader2 className="size-4 animate-spin" />
          Cargando tareas...
        </div>
      )}

      {isError && <p className="text-sm text-destructive py-4">No se pudo cargar el detalle de tareas.</p>}

      {!isLoading && !isError && (tasks?.length ?? 0) === 0 && (
        <p className="text-sm text-muted-foreground py-4">Este lead no tiene tareas registradas.</p>
      )}

      {!isLoading && !isError && (tasks?.length ?? 0) > 0 && (
        <div className="flex flex-col divide-y">
          {tasks!.map((task) => (
            <div key={task.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">{TaskTypeLabels[task.type] ?? task.type}</span>
                <span className="text-xs text-muted-foreground">{task.description}</span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <CalendarClock className="size-3.5" />
                  Programada: {formatReportDate(task.scheduledDate)}
                </span>

                {task.isCompleted ? (
                  <span className="inline-flex items-center gap-1 text-emerald-600">
                    <CalendarCheck className="size-3.5" />
                    Completada: {formatReportDate(task.completedDate)}
                  </span>
                ) : (
                  <Badge variant="outline" className={cn("text-amber-600 border-amber-300")}>
                    Pendiente
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
