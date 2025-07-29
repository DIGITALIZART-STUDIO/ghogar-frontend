"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd";
import { isBefore, isThisWeek, isToday, parseISO } from "date-fns";
import { CheckCircle2, Clock, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useCompleteTask, useDeleteTask } from "../_hooks/useLeadTasks";
import type { LeadTaskDetail, LeadTasksByLeadId } from "../_types/leadTask";
import { CreateLeadTasksDialog } from "./create/CreateLeadTasksDialog";
import { TaskCard } from "./TaskCard";
import { TaskTimeline } from "./TaskTimeline";
import { UpdateLeadTasksSheet } from "./update/UpdateLeadTasksSheet";

export type ColumnId = "pending" | "completed"

interface ManageLeadTasksProps {
  data: LeadTasksByLeadId
  leadId: string
  assignedToId: string
}

export default function ManageLeadTasks({ data, leadId, assignedToId }: ManageLeadTasksProps) {
    const tasks = useMemo(() => data.tasks ?? [], [data.tasks]);
    const [filteredTasks, setFilteredTasks] = useState<Array<LeadTaskDetail>>(tasks);
    const [createTaskDialog, setCreateTaskDialog] = useState(false);
    const [updateTaskSheet, setUpdateTaskSheet] = useState(false);
    const [editingTask, setEditingTask] = useState<LeadTaskDetail | null>(null);
    const [activeTab, setActiveTab] = useState("kanban");

    // Estados para filtros
    const [filters, setFilters] = useState({
        leadId: "",
        advisorId: "",
        type: "",
        timeframe: "all",
    });

    // Hooks para completar y eliminar tarea
    const completeTask = useCompleteTask();
    const deleteTaskMutation = useDeleteTask();

    // Aplicar filtros
    useEffect(() => {
        let result = [...tasks];

        if (filters.leadId && filters.leadId !== "all") {
            result = result.filter((task) => task.leadId === filters.leadId);
        }

        if (filters.advisorId && filters.advisorId !== "all") {
            result = result.filter((task) => task.assignedToId === filters.advisorId);
        }

        if (filters.type && filters.type !== "all") {
            result = result.filter((task) => task.type === filters.type);
        }

        if (filters.timeframe === "today") {
            result = result.filter((task) => isToday(parseISO(task.scheduledDate)));
        } else if (filters.timeframe === "week") {
            result = result.filter((task) => isThisWeek(parseISO(task.scheduledDate)));
        } else if (filters.timeframe === "overdue") {
            result = result.filter((task) => !task.isCompleted && isBefore(parseISO(task.scheduledDate), new Date()));
        }

        setFilteredTasks(result);
    }, [tasks, filters]);

    // Función para marcar una tarea como completada
    const toggleTaskCompletion = (taskId: string) => {
        const taskToToggle = filteredTasks.find((t) => t.id === taskId);
        if (!taskToToggle) {
            return;
        }

        const updatedTasks = filteredTasks.map((task) => (task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task),
        );

        setFilteredTasks(updatedTasks);

        startTransition(async () => {
            const promise = completeTask.mutateAsync(taskId);
            toast.promise(promise, {
                loading: "Actualizando estado de la tarea...",
                success: "Tarea actualizada correctamente",
                error: (e) => `Error al actualizar la tarea: ${e.message}`,
            });

            promise.catch(() => setFilteredTasks(tasks));
        });
    };

    // Función para eliminar una tarea
    const deleteTask = (taskId: string) => {
        const updatedTasks = filteredTasks.filter((task) => task.id !== taskId);
        setFilteredTasks(updatedTasks);

        startTransition(async () => {
            const promise = deleteTaskMutation.mutateAsync(taskId);
            toast.promise(promise, {
                loading: "Eliminando tarea...",
                success: "Tarea eliminada correctamente",
                error: (e) => `Error al eliminar la tarea: ${e.message}`,
            });

            promise.catch(() => setFilteredTasks(tasks));
        });
    };

    // Función para abrir el formulario de edición
    const openEditForm = (task: LeadTaskDetail) => {
        setEditingTask(task);
        setUpdateTaskSheet(true);
    };

    // Separar tareas en pendientes y completadas
    const pendingTasks = filteredTasks.filter((task) => !task.isCompleted);
    const completedTasks = filteredTasks.filter((task) => task.isCompleted);

    // Manejar el final del arrastre (cuando se suelta un elemento)
    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        const taskToUpdate = tasks.find((t) => t.id === draggableId);
        if (!taskToUpdate) {
            return;
        }

        if (destination.droppableId !== source.droppableId) {
            const updatedTasks = tasks.map((task) => (task.id === draggableId ? { ...task, isCompleted: destination.droppableId === "completed" } : task),
            );

            setFilteredTasks(updatedTasks);

            startTransition(async () => {
                const promise = completeTask.mutateAsync(draggableId);
                toast.promise(promise, {
                    loading: "Actualizando estado de la tarea...",
                    success: "Tarea actualizada correctamente",
                    error: (e) => `Error al actualizar la tarea: ${e.message}`,
                });

                promise.catch(() => setFilteredTasks(tasks));
            });
        }
    };

    return (
        <div>
            <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-end">
                    <Button
                        onClick={() => {
                            setEditingTask(null);
                            setCreateTaskDialog(true);
                        }}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Nueva Tarea
                    </Button>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <TabsList>
                            <TabsTrigger value="kanban">Kanban</TabsTrigger>
                            <TabsTrigger value="timeline">Línea de Tiempo</TabsTrigger>
                        </TabsList>

                        <div className="flex flex-wrap items-center gap-2">
                            <Select value={filters.timeframe} onValueChange={(value) => setFilters({ ...filters, timeframe: value })}>
                                <SelectTrigger className="w-[130px]">
                                    <Clock className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Periodo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas</SelectItem>
                                    <SelectItem value="today">Hoy</SelectItem>
                                    <SelectItem value="week">Esta semana</SelectItem>
                                    <SelectItem value="overdue">Vencidas</SelectItem>
                                </SelectContent>
                            </Select>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <Filter className="mr-2 h-4 w-4" /> Más filtros
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 p-4">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="type-filter">Tipo de tarea</Label>
                                            <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
                                                <SelectTrigger id="type-filter" className="w-full">
                                                    <SelectValue placeholder="Todos los tipos" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Todos los tipos</SelectItem>
                                                    <SelectItem value="Call">Llamada</SelectItem>
                                                    <SelectItem value="Meeting">Reunión</SelectItem>
                                                    <SelectItem value="Email">Email</SelectItem>
                                                    <SelectItem value="Visit">Visita</SelectItem>
                                                    <SelectItem value="Other">Otro</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <Button
                                            variant="outline"
                                            className="w-full bg-transparent"
                                            onClick={() => setFilters({
                                                leadId: "",
                                                advisorId: "",
                                                type: "",
                                                timeframe: "all",
                                            })
                                            }
                                        >
                                            Limpiar filtros
                                        </Button>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <TabsContent value="kanban" className="mt-0">
                        {filteredTasks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12 text-center bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-dashed border-slate-200">
                                <div className="rounded-full bg-gradient-to-br from-slate-100 to-slate-200 p-4 ">
                                    <CheckCircle2 className="h-8 w-8 text-slate-400" />
                                </div>
                                <h3 className="mt-6 text-xl font-semibold text-slate-700">No hay tareas</h3>
                                <p className="mt-2 text-sm text-slate-500 max-w-sm">
                                    No se encontraron tareas con los filtros seleccionados. Prueba ajustando los criterios de búsqueda.
                                </p>
                                <Button
                                    variant="outline"
                                    className="mt-6  hover:shadow-md transition-shadow bg-transparent"
                                    onClick={() => setFilters({
                                        type: "",
                                        timeframe: "all",
                                        leadId: "",
                                        advisorId: "",
                                    })
                                    }
                                >
                                    Limpiar filtros
                                </Button>
                            </div>
                        ) : (
                            <DragDropContext onDragEnd={onDragEnd}>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Columna de Pendientes */}
                                    <Card className="pt-0 overflow-hidden">
                                        <CardHeader className="pb-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-700 dark:to-orange-800 border-b border-amber-100 dark:border-amber-900 py-6 overflow-hidden">
                                            <CardTitle className="text-lg flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 dark:from-amber-600 dark:to-orange-600" />
                                                    <span className="text-slate-700 dark:text-slate-100">Pendientes</span>
                                                </div>
                                                <span className="text-sm font-medium bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900 dark:to-orange-900 text-amber-700 dark:text-amber-200 rounded-full px-3 py-1 ">
                                                    {pendingTasks.length}
                                                </span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4">
                                            <Droppable droppableId="pending">
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.droppableProps}
                                                        className={`min-h-[300px] rounded-lg p-3 transition-all duration-200 ${
                                                            snapshot.isDraggingOver
                                                                ? "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-800 dark:to-orange-800 border-2 border-dashed border-amber-300 dark:border-amber-700 shadow-inner"
                                                                : "border-2 border-dashed border-slate-200 dark:border-gray-500"
                                                        }`}
                                                    >
                                                        <div className="space-y-3">
                                                            {pendingTasks.map((task, index) => (
                                                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                                                    {(provided, snapshot) => (
                                                                        <div
                                                                            ref={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                            style={{
                                                                                ...provided.draggableProps.style,
                                                                            }}
                                                                            className={"transition-all duration-200"}
                                                                        >
                                                                            <TaskCard
                                                                                task={task}
                                                                                onEdit={openEditForm}
                                                                                onDelete={deleteTask}
                                                                                onToggleCompletion={toggleTaskCompletion}
                                                                                isDragging={snapshot.isDragging}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </Draggable>
                                                            ))}
                                                        </div>
                                                        {provided.placeholder}
                                                        {pendingTasks.length === 0 && (
                                                            <div className="flex flex-col items-center justify-center h-[250px] text-center">
                                                                <div
                                                                    className={`rounded-full p-3 transition-all duration-200 ${
                                                                        snapshot.isDraggingOver
                                                                            ? "bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-700 dark:to-orange-700 scale-110"
                                                                            : "bg-slate-100 dark:bg-gray-800"
                                                                    }`}
                                                                >
                                                                    <Clock
                                                                        className={`h-6 w-6 transition-colors duration-200 ${
                                                                            snapshot.isDraggingOver ? "text-amber-600 dark:text-amber-300" : "text-slate-400 dark:text-gray-400"
                                                                        }`}
                                                                    />
                                                                </div>
                                                                <p
                                                                    className={`text-sm mt-3 transition-colors duration-200 ${
                                                                        snapshot.isDraggingOver ? "text-amber-700 dark:text-amber-200 font-medium" : "text-slate-500 dark:text-gray-400"
                                                                    }`}
                                                                >
                                                                    {snapshot.isDraggingOver
                                                                        ? "Soltar aquí para marcar como pendiente"
                                                                        : "No hay tareas pendientes"}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </CardContent>
                                    </Card>

                                    {/* Columna de Completadas */}
                                    <Card className="pt-0 overflow-hidden">
                                        <CardHeader className="pb-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900 dark:to-green-900 border-b border-emerald-100 dark:border-emerald-900 py-6">
                                            <CardTitle className="text-lg flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-green-400 dark:from-emerald-600 dark:to-green-600" />
                                                    <span className="text-slate-700 dark:text-slate-100">Completadas</span>
                                                </div>
                                                <span className="text-sm font-medium bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900 dark:to-green-900 text-emerald-700 dark:text-emerald-200 rounded-full px-3 py-1 ">
                                                    {completedTasks.length}
                                                </span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4">
                                            <Droppable droppableId="completed">
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.droppableProps}
                                                        className={`min-h-[300px] rounded-lg p-3 transition-all duration-200 ${
                                                            snapshot.isDraggingOver
                                                                ? "bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900 dark:to-green-900 border-2 border-dashed border-emerald-300 dark:border-emerald-700 shadow-inner"
                                                                : "border-2 border-dashed border-slate-200 dark:border-gray-500"
                                                        }`}
                                                    >
                                                        <div className="space-y-3">
                                                            {completedTasks.map((task, index) => (
                                                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                                                    {(provided, snapshot) => (
                                                                        <div
                                                                            ref={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                            style={{
                                                                                ...provided.draggableProps.style,
                                                                            }}
                                                                            className={"transition-all duration-200 "}
                                                                        >
                                                                            <TaskCard
                                                                                task={task}
                                                                                onEdit={openEditForm}
                                                                                onDelete={deleteTask}
                                                                                onToggleCompletion={toggleTaskCompletion}
                                                                                isDragging={snapshot.isDragging}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </Draggable>
                                                            ))}
                                                        </div>
                                                        {provided.placeholder}
                                                        {completedTasks.length === 0 && (
                                                            <div className="flex flex-col items-center justify-center h-[250px] text-center">
                                                                <div
                                                                    className={`rounded-full p-3 transition-all duration-200 ${
                                                                        snapshot.isDraggingOver
                                                                            ? "bg-gradient-to-br from-emerald-100 to-green-100 scale-110 dark:from-emerald-800 dark:to-green-800"
                                                                            : "bg-slate-100 dark:bg-gray-800"
                                                                    }`}
                                                                >
                                                                    <CheckCircle2
                                                                        className={`h-6 w-6 transition-colors duration-200 ${
                                                                            snapshot.isDraggingOver ? "text-emerald-600 dark:text-emerald-300" : "text-slate-400 dark:text-gray-400"
                                                                        }`}
                                                                    />
                                                                </div>
                                                                <p
                                                                    className={`text-sm mt-3 transition-colors duration-200 ${
                                                                        snapshot.isDraggingOver ? "text-emerald-700 dark:text-emerald-200 font-medium" : "text-slate-500 dark:text-gray-400"
                                                                    }`}
                                                                >
                                                                    {snapshot.isDraggingOver
                                                                        ? "Soltar aquí para marcar como completada"
                                                                        : "No hay tareas completadas"}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </CardContent>
                                    </Card>
                                </div>
                            </DragDropContext>
                        )}
                    </TabsContent>

                    <TabsContent value="timeline" className="mt-0">
                        <TaskTimeline
                            tasks={filteredTasks}
                            onToggleCompletion={toggleTaskCompletion}
                            onEdit={openEditForm}
                            onDelete={deleteTask}
                        />
                    </TabsContent>
                </Tabs>
            </div>

            {createTaskDialog && (
                <CreateLeadTasksDialog
                    open={createTaskDialog}
                    setOpen={setCreateTaskDialog}
                    assignedToId={assignedToId}
                    leadId={leadId}
                />
            )}

            {updateTaskSheet && editingTask && (
                <UpdateLeadTasksSheet open={updateTaskSheet} onOpenChange={setUpdateTaskSheet} task={editingTask} />
            )}
        </div>
    );
}
