"use client";

import { useState } from "react";
import { endOfDay, format, isBefore, isWithinInterval, parseISO, startOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeadTaskDetail, TaskFilters } from "../../assignments/[id]/tasks/_types/leadTask";
import { getTaskClasses, getTaskIcon, getTaskLabel } from "../../assignments/[id]/tasks/_utils/tasks.utils";
import { ClientSummaryDto } from "../../clients/_types/client";
import { UserSummaryDto } from "../../leads/_types/lead";
import FilterAdminTaskViewer from "./FilterAdminTaskViewer";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface AdminTasksViewerProps {
  data: Array<LeadTaskDetail>;
  dateRange: {
    from: Date;
    to: Date;
  };
  setDateRange: (range: { from: Date; to: Date }) => void;
  usersSummary: Array<UserSummaryDto>;
  clientsSummary: Array<ClientSummaryDto>;
  filters: TaskFilters;
  setFilters: (filters: TaskFilters) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  isLoading: boolean;
}

export function AdminTasksViewer({
    data,
    dateRange,
    setDateRange,
    usersSummary,
    clientsSummary,
    filters,
    setFilters,
    showFilters,
    setShowFilters,
    isLoading,
}: AdminTasksViewerProps) {
    // Estado para la búsqueda
    const [searchQuery, setSearchQuery] = useState("");

    // Fecha actual (real)
    const currentDate = new Date();

    // Filtrar tareas según los filtros seleccionados y el rango de fechas
    const filteredTasks = data.filter((task) => {
        const taskDate = parseISO(task.scheduledDate);

        // Verificar si la tarea está dentro del rango de fechas
        const isInDateRange = isWithinInterval(taskDate, {
            start: startOfDay(dateRange.from),
            end: endOfDay(dateRange.to),
        });

        if (!isInDateRange) {
            return false;
        }

        // Aplicar filtros adicionales
        if (filters.assignedToId && task.assignedToId !== filters.assignedToId) {
            return false;
        }
        if (filters.leadId && task.lead?.clientId !== filters.leadId) {
            return false;
        }
        if (filters.type && task.type !== filters.type) {
            return false;
        }
        // Cambiar esto para usar isCompleted booleano en lugar de status string
        if (filters.isCompleted === true && !task.isCompleted) {
            return false;
        }
        if (filters.isCompleted === false && task.isCompleted) {
            return false;
        }

        // Aplicar búsqueda
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const taskDetail = data.find((t) => t.id === task.id);
            const advisor = usersSummary.find((a) => a.id === task.assignedToId);

            const matchesDescription = task.description.toLowerCase().includes(query);
            const matchesLead =
        taskDetail?.lead?.client?.name.toLowerCase().includes(query) ??
        taskDetail?.lead?.client?.companyName?.toLowerCase().includes(query);
            const matchesAdvisor = advisor?.userName?.toLowerCase().includes(query) ?? false;
            const matchesType = getTaskLabel(task.type).toLowerCase()
                .includes(query);

            if (!(matchesDescription || matchesLead || matchesAdvisor || matchesType)) {
                return false;
            }
        }

        return true;
    });

    // Identificar tareas retrasadas (fecha programada anterior a la fecha actual y no completadas)
    const overdueTasks = filteredTasks.filter((task) => !task.isCompleted && isBefore(parseISO(task.scheduledDate), currentDate));

    // Ordenar tareas por fecha (más recientes primero)
    const sortedTasks = [...filteredTasks].sort((a, b) => parseISO(b.scheduledDate).getTime() - parseISO(a.scheduledDate).getTime());

    // Obtener nombre del lead
    const getLeadName = (leadId: string) => {
        const task = data.find((task) => task.lead?.clientId === leadId);
        return task?.lead?.client?.name ?? "Lead sin tarea";
    };

    // Obtener nombre del asesor
    const getAdvisorName = (advisorId: string) => {
        const task = data.find((task) => task.assignedToId === advisorId);
        return task?.assignedTo?.name ?? "Asesor sin tarea";
    };

    // Limpiar todos los filtros
    const clearFilters = () => {
        setFilters({
            assignedToId: "",
            leadId: "",
            type: "",
            isCompleted: undefined,
        });
        setSearchQuery("");
    };

    return (
        <div>
            <div className="flex flex-col space-y-6">
                {/* Selector de rango de fechas */}
                <FilterAdminTaskViewer
                    clearFilters={clearFilters}
                    dateRange={dateRange}
                    clientsSummary={clientsSummary}
                    filters={filters}
                    getAdvisorName={getAdvisorName}
                    getLeadName={getLeadName}
                    setDateRange={setDateRange}
                    searchQuery={searchQuery}
                    setFilters={setFilters}
                    setSearchQuery={setSearchQuery}
                    showFilters={showFilters}
                    setShowFilters={setShowFilters}
                    usersSummary={usersSummary}
                />

                {/* Resumen de tareas */}
                <div className="flex flex-col md:flex-row gap-4 text-center">
                    <Card className="flex-1">
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold">
                                {sortedTasks.length}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Total de tareas
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="flex-1">
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-green-600">
                                {sortedTasks.filter((task) => task.isCompleted).length}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Completadas
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="flex-1">
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-amber-600">
                                {sortedTasks.filter((task) => !task.isCompleted).length}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Pendientes
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="flex-1">
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-red-600">
                                {overdueTasks.length}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Retrasadas
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Lista de tareas en el rango seleccionado */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Clock className="h-5 w-5 text-primary" />
                            Tareas en el rango seleccionado
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <LoadingSpinner text="Cargando tareas..." />
                        ) : sortedTasks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-8 text-center">
                                <p className="text-muted-foreground">
                                    No se encontraron tareas con los filtros seleccionados.
                                </p>
                                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                                    Limpiar filtros
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Agrupar tareas por día */}
                                {(() => {
                                    // Agrupar tareas por día
                                    const tasksByDay: Record<string, Array<LeadTaskDetail>> = {};

                                    sortedTasks.forEach((task) => {
                                        // Parsear la fecha
                                        const date = parseISO(task.scheduledDate);
                                        // Usar formato yyyy-MM-dd sin convertir a zona horaria local
                                        const dateKey = format(date, "yyyy-MM-dd");

                                        if (!tasksByDay[dateKey]) {
                                            tasksByDay[dateKey] = [];
                                        }

                                        tasksByDay[dateKey].push(task);
                                    });

                                    // Ordenar días (más recientes primero)
                                    const sortedDays = Object.keys(tasksByDay).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

                                    return sortedDays.map((day) => {
                                        const dayTasks = tasksByDay[day];
                                        return (
                                            <div key={day} className="space-y-3">
                                                <div className="bg-primary text-primary-foreground rounded-md px-4 py-2">
                                                    <h3 className="font-medium">
                                                        {format(parseISO(`${day}T12:00:00Z`), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                                                    </h3>
                                                </div>

                                                <div className="space-y-2 pl-4 border-l-2 border-primary/30">
                                                    {dayTasks.map((task) => {
                                                        const isOverdue = !task.isCompleted && isBefore(parseISO(task.scheduledDate), currentDate);

                                                        return (
                                                            <div
                                                                key={task.id}
                                                                className={`flex gap-4 p-3 rounded-lg border ${
                                                                    isOverdue
                                                                        ? "bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-800"
                                                                        : task.isCompleted
                                                                            ? "bg-green-50 border-green-200 dark:bg-green-900 dark:border-green-800"
                                                                            : "bg-white"
                                                                } hover:shadow-sm transition-shadow`}
                                                            >
                                                                <div className="flex flex-col items-center justify-center min-w-[60px] justify-items-center text-center">
                                                                    <div className="text-lg">
                                                                        {getTaskIcon(task.type)}
                                                                    </div>
                                                                    <div className="text-xs font-medium mt-1">
                                                                        {/* Extraer directamente las horas y minutos del string de fecha */}
                                                                        {task.scheduledDate.substring(11, 16)}
                                                                    </div>
                                                                </div>

                                                                <div className="flex-1">
                                                                    <div className="flex items-center justify-between mb-1">
                                                                        <Badge className={getTaskClasses(task.type)}>
                                                                            {getTaskLabel(task.type)}
                                                                        </Badge>
                                                                        {isOverdue && <Badge variant="destructive">
                                                                            Retrasada
                                                                        </Badge>}
                                                                        {task.isCompleted && (
                                                                            <Badge
                                                                                variant="outline"
                                                                                className="border-green-500 text-green-700 dark:text-green-200"
                                                                            >
                                                                                Completada
                                                                            </Badge>
                                                                        )}
                                                                    </div>

                                                                    <p
                                                                        className={`font-medium ${task.isCompleted ? "text-muted-foreground dark:text-white" : ""}`}
                                                                    >
                                                                        {task.description}
                                                                    </p>
                                                                    {task.isCompleted && (
                                                                        <p className="text-xs font-mono italic text-muted-foreground dark:text-white">
                                                                            Completada el
                                                                            {" "}
                                                                            {task.completedDate &&
                                        format(new Date(task.completedDate), "EEEE, d 'de' MMMM 'de' yyyy", {
                                            locale: es,
                                        })}
                                                                            {task.completedDate &&
                                        ` a las ${format(parseISO(task.completedDate), "HH:mm", { locale: es })}`}
                                                                        </p>
                                                                    )}

                                                                    <div className="flex flex-wrap justify-between items-center mt-2 text-sm text-muted-foreground dark:text-white">
                                                                        <div>
                                                                            Lead:
                                                                            {" "}
                                                                            <span>
                                                                                {getLeadName(task.lead?.clientId ?? "")}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex items-center gap-1">
                                                                            Asesor:
                                                                            {" "}
                                                                            <span>
                                                                                {getAdvisorName(task.assignedToId)}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    });
                                })()}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
