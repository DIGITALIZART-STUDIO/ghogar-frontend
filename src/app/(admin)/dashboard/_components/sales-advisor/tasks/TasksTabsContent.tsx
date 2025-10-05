"use client";

import { Activity, Calendar, CheckCircle, Clock, Edit, Mail, MapPin, Phone, Target, User } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { TabsContent } from "@/components/ui/tabs";
import { EmptyState } from "../../EmptyState";
import { SalesAdvisorDashboard } from "../../../_types/dashboard";

interface TasksTabsContentProps {
    data: SalesAdvisorDashboard | undefined;
    isLoading: boolean;
}

export default function TasksTabsContent({ data, isLoading }: TasksTabsContentProps) {
    const hasTasks = data?.myTasks && data.myTasks.length > 0;
    const hasTasksByType = data?.tasksByType && data.tasksByType.length > 0;

    if (isLoading) {
        return (
            <TabsContent value="tasks" className="space-y-6">
                <div className="flex items-center justify-center py-12">
                    <LoadingSpinner />
                </div>
            </TabsContent>
        );
    }

    return (
        <TabsContent value="tasks" className="space-y-6">
            {/* Mis tareas de hoy */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
                        <Calendar className="w-5 h-5 text-primary" />
                        Mis Tareas de Hoy
                    </CardTitle>
                    <CardDescription>Tareas programadas basadas en LeadTask</CardDescription>
                </CardHeader>
                <CardContent>
                    {!hasTasks ? (
                        <EmptyState
                            icon={Calendar}
                            title="Sin tareas programadas"
                            description="No tienes tareas asignadas para hoy"
                        />
                    ) : (
                        <div className="space-y-3">
                            {data?.myTasks?.map((task) => (
                                <div
                                    key={task.id}
                                    className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                                                task.type === "Call"
                                                    ? "bg-slate-600"
                                                    : task.type === "Meeting"
                                                        ? "bg-slate-700"
                                                        : task.type === "Email"
                                                            ? "bg-slate-500"
                                                            : task.type === "Visit"
                                                                ? "bg-primary"
                                                                : "bg-slate-400"
                                            }`}
                                        >
                                            {task.type === "Call" && <Phone className="w-5 h-5" />}
                                            {task.type === "Meeting" && <User className="w-5 h-5" />}
                                            {task.type === "Email" && <Mail className="w-5 h-5" />}
                                            {task.type === "Visit" && <MapPin className="w-5 h-5" />}
                                            {task.type === "Other" && <Activity className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-slate-800 dark:text-slate-100">
                                                {task.clientName}
                                            </h4>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{task.description}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="outline" className="text-xs">
                                                    {task.type}
                                                </Badge>
                                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                                    {new Date(task.scheduledDate ?? "").toLocaleTimeString("es-ES", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            className={`${
                                                task.priority === "high"
                                                    ? "bg-red-500 hover:bg-red-600"
                                                    : task.priority === "medium"
                                                        ? "bg-amber-500 hover:bg-amber-600"
                                                        : "bg-emerald-500 hover:bg-emerald-600"
                                            } text-white`}
                                        >
                                            {task.priority}
                                        </Badge>
                                        <Button variant="outline" size="sm">
                                            <CheckCircle className="w-4 h-4" />
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Análisis de mis tareas */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
                        <Activity className="w-5 h-5 text-primary" />
                        Análisis de Mis Tareas
                    </CardTitle>
                    <CardDescription>Distribución por TaskType</CardDescription>
                </CardHeader>
                <CardContent>
                    {!hasTasksByType ? (
                        <EmptyState
                            icon={Activity}
                            title="Sin datos de tareas"
                            description="No hay información disponible sobre la distribución de tareas"
                        />
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data?.tasksByType}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                                <XAxis dataKey="type" className="text-slate-600 dark:text-slate-400" />
                                <YAxis className="text-slate-600 dark:text-slate-400" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "hsl(var(--card))",
                                        border: "1px solid hsl(var(--border))",
                                        borderRadius: "0.5rem",
                                    }}
                                />
                                <Bar dataKey="completed" fill="hsl(var(--primary))" name="Completadas" />
                                <Bar dataKey="pending" fill="hsl(var(--slate-400))" name="Pendientes" />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>

            {/* Resumen de productividad */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-primary">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <CheckCircle className="w-6 h-6 text-primary" />
                            <span className="font-medium text-slate-800 dark:text-slate-100">Tareas Completadas</span>
                        </div>
                        <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                            {data?.performance?.tasksCompleted ?? 0}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Este mes</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-slate-600">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Clock className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                            <span className="font-medium text-slate-800 dark:text-slate-100">Tiempo Respuesta</span>
                        </div>
                        <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                            {data?.performance?.avgResponseTime ?? 0}h
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Promedio</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-slate-700">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Target className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                            <span className="font-medium text-slate-800 dark:text-slate-100">Eficiencia</span>
                        </div>
                        <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                            {Math.round(
                                ((data?.performance?.tasksCompleted ?? 0) /
                                    ((data?.performance?.tasksCompleted ?? 0) + (data?.performance?.tasksPending ?? 0))) *
                                    100,
                            ) || 0}
                            %
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Tareas completadas</p>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
    );
}
