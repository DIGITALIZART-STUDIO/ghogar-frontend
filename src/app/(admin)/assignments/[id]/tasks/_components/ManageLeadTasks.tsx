"use client";

import { startTransition, useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import { isBefore, isThisWeek, isToday, parseISO } from "date-fns";
import { CheckCircle2, Clock, Filter, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toastWrapper } from "@/types/toasts";
import { CompleteTask, DeleteTask } from "../_actions/LeadTaskActions";
import { LeadTaskDetail, LeadTasksByLeadId } from "../_types/leadTask";
import { CreateLeadTasksDialog } from "./create/CreateLeadTasksDialog";
import { TaskCard } from "./TaskCard";
import { TaskTimeline } from "./TaskTimeline";
import { UpdateLeadTasksSheet } from "./update/UpdateLeadTasksSheet";

export type ColumnId = "pending" | "completed";

interface ManageLeadTasksProps {
  data: LeadTasksByLeadId;
  leadId: string;
  assignedToId: string;
}

// Componente principal
export default function ManageLeadTasks({ data, leadId, assignedToId }: ManageLeadTasksProps) {
    const tasks = data.tasks ?? [];
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
    // 1. Actualización optimista de la UI
        const taskToToggle = filteredTasks.find((t) => t.id === taskId);
        if (!taskToToggle) {
            return;
        }

        const updatedTasks = filteredTasks.map((task) => {
            if (task.id === taskId) {
                return {
                    ...task,
                    isCompleted: !task.isCompleted,
                };
            }
            return task;
        });

        // Actualizamos el estado local inmediatamente
        setFilteredTasks(updatedTasks);

        // 2. Luego enviamos la actualización al servidor en segundo plano
        startTransition(async() => {
            const [, error] = await toastWrapper(CompleteTask(taskId), {
                loading: "Actualizando estado de la tarea...",
                success: "Tarea actualizada correctamente",
                error: (e) => `Error al actualizar la tarea: ${e.message}`,
            });

            // Si hay un error, revertimos el cambio en la UI
            if (error) {
                console.error("Error al cambiar el estado de la tarea:", error);
                // Restauramos el estado anterior
                setFilteredTasks(tasks);
            }
        });
    };

    // Función para eliminar una tarea
    const deleteTask = (taskId: string) => {
    // 1. Actualización optimista de la UI - eliminamos la tarea inmediatamente
        const updatedTasks = filteredTasks.filter((task) => task.id !== taskId);
        setFilteredTasks(updatedTasks);

        // 2. Luego enviamos la solicitud de eliminación al servidor en segundo plano
        startTransition(async() => {
            const [, error] = await toastWrapper(DeleteTask(taskId), {
                loading: "Eliminando tarea...",
                success: "Tarea eliminada correctamente",
                error: (e) => `Error al eliminar la tarea: ${e.message}`,
            });

            // Si hay un error, revertimos el cambio en la UI
            if (error) {
                console.error("Error al eliminar la tarea:", error);
                // Restauramos el estado anterior
                setFilteredTasks(tasks);
            }
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

        // Si no hay destino, no hacer nada
        if (!destination) {
            return;
        }

        // Si el destino es el mismo que el origen y el índice es el mismo, no hacer nada
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        // Encontrar la tarea que se está arrastrando
        const taskToUpdate = tasks.find((t) => t.id === draggableId);
        if (!taskToUpdate) {
            return;
        }

        // Si se mueve entre columnas diferentes (pendiente <-> completada)
        if (destination.droppableId !== source.droppableId) {
            // 1. Actualización optimista de la UI
            const updatedTasks = tasks.map((task) => {
                if (task.id === draggableId) {
                    // Cambiamos el estado de la tarea localmente de manera inmediata
                    return {
                        ...task,
                        isCompleted: destination.droppableId === "completed",
                    };
                }
                return task;
            });

            // Actualizamos el estado local inmediatamente
            setFilteredTasks(updatedTasks);

            // 2. Luego enviamos la actualización al servidor en segundo plano
            startTransition(async() => {
                const [, error] = await toastWrapper(CompleteTask(draggableId), {
                    loading: "Actualizando estado de la tarea...",
                    success: "Tarea actualizada correctamente",
                    error: (e) => `Error al actualizar la tarea: ${e.message}`,
                });

                // Si hay un error, revertimos el cambio en la UI
                if (error) {
                    console.error("Error al cambiar el estado de la tarea:", error);
                    // Restauramos el estado anterior
                    setFilteredTasks(tasks);
                }
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
                        <Plus className="mr-2 h-4 w-4" />
                        {" "}
                        Nueva Tarea
                    </Button>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <TabsList>
                            <TabsTrigger value="kanban">
                                Kanban
                            </TabsTrigger>
                            <TabsTrigger value="timeline">
                                Línea de Tiempo
                            </TabsTrigger>
                        </TabsList>

                        <div className="flex flex-wrap items-center gap-2">
                            <Select value={filters.timeframe} onValueChange={(value) => setFilters({ ...filters, timeframe: value })}>
                                <SelectTrigger className="w-[130px]">
                                    <Clock className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Periodo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Todas
                                    </SelectItem>
                                    <SelectItem value="today">
                                        Hoy
                                    </SelectItem>
                                    <SelectItem value="week">
                                        Esta semana
                                    </SelectItem>
                                    <SelectItem value="overdue">
                                        Vencidas
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <Filter className="mr-2 h-4 w-4" />
                                        {" "}
                                        Más filtros
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 p-4">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="type-filter">
                                                Tipo de tarea
                                            </Label>
                                            <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
                                                <SelectTrigger id="type-filter" className="w-full">
                                                    <SelectValue placeholder="Todos los tipos" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">
                                                        Todos los tipos
                                                    </SelectItem>
                                                    <SelectItem value="Call">
                                                        Llamada
                                                    </SelectItem>
                                                    <SelectItem value="Meeting">
                                                        Reunión
                                                    </SelectItem>
                                                    <SelectItem value="Email">
                                                        Email
                                                    </SelectItem>
                                                    <SelectItem value="Visit">
                                                        Visita
                                                    </SelectItem>
                                                    <SelectItem value="Other">
                                                        Otro
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <Button
                                            variant="outline"
                                            className="w-full"
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
                            <div className="flex flex-col items-center justify-center p-8 text-center">
                                <div className="rounded-full bg-muted p-3">
                                    <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <h3 className="mt-4 text-lg font-semibold">
                                    No hay tareas
                                </h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    No se encontraron tareas con los filtros seleccionados.
                                </p>
                                <Button
                                    variant="outline"
                                    className="mt-4"
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Columna de Pendientes */}
                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-lg flex justify-between items-center">
                                                <span>
                                                    Pendientes
                                                </span>
                                                <span className="text-sm font-normal bg-muted rounded-full px-2 py-0.5">
                                                    {pendingTasks.length}
                                                </span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <Droppable droppableId="pending">
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.droppableProps}
                                                        className={`min-h-[200px] rounded-md p-2 transition-colors ${
                                                            snapshot.isDraggingOver
                                                                ? "bg-primary/10 border-2 border-primary/50"
                                                                : "border border-muted-foreground/20"
                                                        }`}
                                                    >
                                                        {pendingTasks.map((task, index) => (
                                                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                                                {(provided, snapshot) => (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        style={{
                                                                            ...provided.draggableProps.style,
                                                                            marginBottom: "12px",
                                                                        }}
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
                                                        {provided.placeholder}
                                                        {pendingTasks.length === 0 && (
                                                            <div className="flex items-center justify-center h-[150px]">
                                                                <p className="text-sm text-muted-foreground">
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
                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-lg flex justify-between items-center">
                                                <span>
                                                    Completadas
                                                </span>
                                                <span className="text-sm font-normal bg-muted rounded-full px-2 py-0.5">
                                                    {completedTasks.length}
                                                </span>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <Droppable droppableId="completed">
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.droppableProps}
                                                        className={`min-h-[200px] rounded-md p-2 transition-colors ${
                                                            snapshot.isDraggingOver
                                                                ? "bg-primary/10 border-2 border-primary/50"
                                                                : "border border-muted-foreground/20"
                                                        }`}
                                                    >
                                                        {completedTasks.map((task, index) => (
                                                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                                                {(provided, snapshot) => (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        style={{
                                                                            ...provided.draggableProps.style,
                                                                            marginBottom: "12px",
                                                                        }}
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
                                                        {provided.placeholder}
                                                        {completedTasks.length === 0 && (
                                                            <div className="flex items-center justify-center h-[150px]">
                                                                <p className="text-sm text-muted-foreground">
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
