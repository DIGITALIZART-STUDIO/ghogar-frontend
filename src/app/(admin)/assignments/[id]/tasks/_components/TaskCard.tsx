"use client";

import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { CheckSquare, GripVertical, MoreHorizontal, Pen, Square, Trash, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { LeadTaskDetail, TaskTypes } from "../_types/leadTask";
import { getTaskClasses, getTaskIcon, getTaskLabel } from "../_utils/tasks.utils";

interface TaskCardProps {
  task: LeadTaskDetail;
  onEdit: (task: LeadTaskDetail) => void;
  onDelete: (taskId: string) => void;
  onToggleCompletion: (taskId: string) => void;
  isDragging?: boolean;
}

export function TaskCard({ task, onEdit, onDelete, onToggleCompletion, isDragging = false }: TaskCardProps) {
    return (
        <Card
            className={`overflow-hidden transition-all py-0 ${
                isDragging ? "ring-2 ring-primary/40 scale-[1.02]" : "hover:shadow-md"
            } ${task.isCompleted ? "opacity-80" : ""}`}
        >
            <CardContent className="p-0">
                <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab active:cursor-grabbing" />
                            <Badge className={getTaskClasses(task.type as TaskTypes)}>
                                <span className="flex items-center">
                                    {getTaskIcon(task.type as TaskTypes)}
                                    <span className="ml-1">
                                        {getTaskLabel(task.type as TaskTypes)}
                                    </span>
                                </span>
                            </Badge>
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
                                <DropdownMenuItem onClick={() => onToggleCompletion(task.id)}>
                                    {task.isCompleted ? "Marcar como pendiente" : "Marcar como completada"}
                                    <DropdownMenuShortcut>
                                        {task.isCompleted ? (
                                            <Square className="size-4" aria-hidden="true" />
                                        ) : (
                                            <CheckSquare className="size-4" aria-hidden="true" />
                                        )}
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(task.id)}>
                                    Eliminar
                                    <DropdownMenuShortcut>
                                        <Trash className="size-4 text-red-700" aria-hidden="true" />
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="mb-3">
                        <p className={`font-medium ${task.isCompleted ? "text-muted-foreground" : ""}`}>
                            {task.description}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            {format(parseISO(task.scheduledDate), "PPp", { locale: es })}
                        </p>
                    </div>

                    <Separator className="my-3" />

                    <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>
                                {task.lead?.client?.name}
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
