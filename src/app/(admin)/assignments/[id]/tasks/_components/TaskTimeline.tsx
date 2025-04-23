"use client";

import { useState } from "react";
import { addDays, format, isAfter, isBefore, isToday, isTomorrow, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { CheckCircle2, CheckSquare, ChevronLeft, ChevronRight, Circle, MoreHorizontal, Pen, Square, Trash } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LeadTaskDetail, TaskTypes } from "../_types/leadTask";
import { getTaskClasses, getTaskIcon, getTaskLabel } from "../_utils/tasks.utils";

interface TaskTimelineProps {
  tasks: Array<LeadTaskDetail>;
  onToggleCompletion: (taskId: string) => void;
  onEdit: (task: LeadTaskDetail) => void;
  onDelete: (taskId: string) => void;
}

export function TaskTimeline({ tasks, onToggleCompletion, onEdit, onDelete }: TaskTimelineProps) {
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(today);
    const [viewRange, setViewRange] = useState<"day" | "week">("day");

    // Función para formatear la fecha en el encabezado
    const formatDateHeader = (date: Date) => {
        if (isToday(date)) {
            return `Hoy, ${format(date, "d 'de' MMMM", { locale: es })}`;
        } else if (isTomorrow(date)) {
            return `Mañana, ${format(date, "d 'de' MMMM", { locale: es })}`;
        } else {
            return format(date, "EEEE, d 'de' MMMM", { locale: es });
        }
    };

    // Navegar a la fecha anterior
    const goToPrevious = () => {
        if (viewRange === "day") {
            setCurrentDate((prev) => addDays(prev, -1));
        } else {
            setCurrentDate((prev) => addDays(prev, -7));
        }
    };

    // Navegar a la fecha siguiente
    const goToNext = () => {
        if (viewRange === "day") {
            setCurrentDate((prev) => addDays(prev, 1));
        } else {
            setCurrentDate((prev) => addDays(prev, 7));
        }
    };

    // Volver a hoy
    const goToToday = () => {
        setCurrentDate(today);
    };

    // Filtrar tareas según la vista actual
    const getFilteredTasks = () => {
        if (viewRange === "day") {
            return tasks.filter((task) => {
                const taskDate = parseISO(task.scheduledDate);
                return (
                    taskDate.getDate() === currentDate.getDate() &&
          taskDate.getMonth() === currentDate.getMonth() &&
          taskDate.getFullYear() === currentDate.getFullYear()
                );
            });
        } else {
            // Vista semanal: obtener el primer día de la semana (lunes)
            const firstDayOfWeek = new Date(currentDate);
            const day = currentDate.getDay();
            const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1);
            firstDayOfWeek.setDate(diff);

            // Último día de la semana (domingo)
            const lastDayOfWeek = new Date(firstDayOfWeek);
            lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);

            return tasks.filter((task) => {
                const taskDate = parseISO(task.scheduledDate);
                return isAfter(taskDate, addDays(firstDayOfWeek, -1)) && isBefore(taskDate, addDays(lastDayOfWeek, 1));
            });
        }
    };

    // Agrupar tareas por hora
    const groupTasksByHour = (tasks: Array<LeadTaskDetail>) => {
        const grouped: Record<string, Array<LeadTaskDetail>> = {};

        tasks
            .sort((a, b) => parseISO(a.scheduledDate).getTime() - parseISO(b.scheduledDate).getTime())
            .forEach((task) => {
                const hour = format(parseISO(task.scheduledDate), "HH:mm");
                if (!grouped[hour]) {
                    grouped[hour] = [];
                }
                grouped[hour].push(task);
            });

        return grouped;
    };

    // Agrupar tareas por día
    const groupTasksByDay = (tasks: Array<LeadTaskDetail>) => {
        const grouped: Record<string, Array<LeadTaskDetail>> = {};

        tasks
            .sort((a, b) => parseISO(a.scheduledDate).getTime() - parseISO(b.scheduledDate).getTime())
            .forEach((task) => {
                const day = format(parseISO(task.scheduledDate), "yyyy-MM-dd");
                if (!grouped[day]) {
                    grouped[day] = [];
                }
                grouped[day].push(task);
            });

        return grouped;
    };

    const filteredTasks = getFilteredTasks();
    const groupedTasks = viewRange === "day" ? groupTasksByHour(filteredTasks) : groupTasksByDay(filteredTasks);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={goToPrevious}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={goToToday}>
                        Hoy
                    </Button>
                    <Button variant="outline" size="sm" onClick={goToNext}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                <h2 className="text-lg font-semibold">
                    {viewRange === "day"
                        ? formatDateHeader(currentDate)
                        : `Semana del ${format(currentDate, "d 'de' MMMM", { locale: es })}`}
                </h2>

                <div className="flex items-center space-x-2">
                    <Button variant={viewRange === "day" ? "default" : "outline"} size="sm" onClick={() => setViewRange("day")}>
                        Día
                    </Button>
                    <Button variant={viewRange === "week" ? "default" : "outline"} size="sm" onClick={() => setViewRange("week")}>
                        Semana
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent className="p-4">
                    {Object.keys(groupedTasks).length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center">
                            <div className="rounded-full bg-muted p-3">
                                <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold">
                                No hay tareas programadas
                            </h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                {viewRange === "day"
                                    ? "No hay tareas programadas para este día."
                                    : "No hay tareas programadas para esta semana."}
                            </p>
                        </div>
                    ) : (
                        <ScrollArea className="h-[500px] pr-4">
                            <div className="space-y-6">
                                {Object.entries(groupedTasks).map(([timeKey, tasksForTime]) => (
                                    <div key={timeKey} className="relative">
                                        <div className="sticky top-0 z-10 bg-background py-1">
                                            <h3 className="font-medium text-sm text-muted-foreground">
                                                {viewRange === "day" ? timeKey : format(parseISO(timeKey), "EEEE, d 'de' MMMM", { locale: es })}
                                            </h3>
                                        </div>

                                        <div className="mt-2 space-y-3">
                                            {tasksForTime.map((task) => (
                                                <div
                                                    key={task.id}
                                                    className={`flex items-start gap-3 p-3 rounded-lg border ${
                                                        task.completed ? "bg-muted/30" : "bg-background"
                                                    }`}
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="p-0 h-8 w-8 mt-0.5"
                                                        onClick={() => onToggleCompletion(task.id)}
                                                    >
                                                        {task.isCompleted ? (
                                                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                                                        ) : (
                                                            <Circle className="h-5 w-5 text-gray-400" />
                                                        )}
                                                    </Button>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Badge className={getTaskClasses(task.type as TaskTypes)}>
                                                                <span className="flex items-center">
                                                                    <span className="mr-1">
                                                                        {getTaskIcon(task.type as TaskTypes)}
                                                                    </span>
                                                                    <span>
                                                                        {getTaskLabel(task.type as TaskTypes)}
                                                                    </span>
                                                                </span>
                                                            </Badge>

                                                            {viewRange === "week" && (
                                                                <span className="text-sm text-muted-foreground">
                                                                    {format(parseISO(task.scheduledDate), "HH:mm")}
                                                                </span>
                                                            )}
                                                        </div>

                                                        <p
                                                            className={`font-medium ${task.isCompleted ? "line-through text-muted-foreground" : ""}`}
                                                        >
                                                            {task.description}
                                                        </p>

                                                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                                                            <span className="flex items-center gap-1">
                                                                Cliente:
                                                                {" "}
                                                                {task.lead?.client?.name ?? "No asignado"}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => onEdit(task)}>
                                                                Editar
                                                                <DropdownMenuShortcut>
                                                                    <Pen className="size-4" aria-hidden="true" />
                                                                </DropdownMenuShortcut>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => onToggleCompletion(task.id ?? "")}>
                                                                {task.isCompleted ? "Marcar como pendiente" : "Marcar como completada"}
                                                                <DropdownMenuShortcut>
                                                                    {task.isCompleted ? (
                                                                        <Square className="size-4" aria-hidden="true" />
                                                                    ) : (
                                                                        <CheckSquare className="size-4" aria-hidden="true" />
                                                                    )}
                                                                </DropdownMenuShortcut>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="text-destructive focus:text-destructive"
                                                                onClick={() => onDelete(task.id ?? "")}
                                                            >
                                                                Eliminar
                                                                <DropdownMenuShortcut>
                                                                    <Trash className="size-4 text-red-700" aria-hidden="true" />
                                                                </DropdownMenuShortcut>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
