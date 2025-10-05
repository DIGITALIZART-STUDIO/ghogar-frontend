import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ComposedChart,
    Line,
} from "recharts";
import type { SupervisorDashboard } from "@/app/(admin)/dashboard/_types/dashboard";

interface PerformanceTabsContentProps {
    data: SupervisorDashboard;
    isLoading: boolean;
}

export function PerformanceTabsContent({ data, isLoading }: PerformanceTabsContentProps) {
    if (isLoading) {
        return (
            <TabsContent value="performance" className="space-y-6">
                <div className="text-center py-12">
                    <p className="text-slate-600 dark:text-slate-400">Cargando rendimiento...</p>
                </div>
            </TabsContent>
        );
    }

    return (
        <TabsContent value="performance" className="space-y-6">
            {/* Gráfico de rendimiento por proyecto */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
                        <MapPin className="w-5 h-5 text-primary" />
                        Rendimiento por Proyecto
                    </CardTitle>
                    <CardDescription>Análisis de leads por proyecto inmobiliario</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                        <ComposedChart data={data.projectLeads}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                            <XAxis dataKey="project" angle={-45} textAnchor="end" height={100} className="text-slate-600 dark:text-slate-400" />
                            <YAxis yAxisId="left" className="text-slate-600 dark:text-slate-400" />
                            <YAxis yAxisId="right" orientation="right" className="text-slate-600 dark:text-slate-400" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--card))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "0.5rem",
                                }}
                            />
                            <Bar yAxisId="left" dataKey="leadsReceived" fill="hsl(var(--slate-400))" name="Recibidos" />
                            <Bar yAxisId="left" dataKey="leadsAssigned" fill="hsl(var(--primary))" name="Asignados" />
                            <Bar yAxisId="left" dataKey="leadsCompleted" fill="hsl(var(--green-600))" name="Completados" />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="conversionRate"
                                stroke="hsl(var(--slate-800))"
                                strokeWidth={2}
                                name="Conversión %"
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Análisis de tareas */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
                        <Calendar className="w-5 h-5 text-primary" />
                        Análisis de Tareas por Tipo
                    </CardTitle>
                    <CardDescription>Distribución basada en TaskType del modelo</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                        <ComposedChart data={data.taskAnalysis}>
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
                            <Bar dataKey="completed" fill="hsl(var(--green-600))" name="Completadas" />
                            <Bar dataKey="pending" fill="hsl(var(--primary))" name="Pendientes" />
                            <Bar dataKey="overdue" fill="hsl(var(--red-600))" name="Vencidas" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Detalles por proyecto */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {(data.projectLeads ?? []).map((project, index) => (
                    <Card key={index} className="border-l-4 border-l-primary">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-slate-800 dark:text-slate-100">
                                {project.project}
                            </CardTitle>
                            <CardDescription>Proyecto inmobiliario</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="text-center p-2 bg-slate-50 dark:bg-slate-900/30 rounded">
                                    <p className="font-bold text-slate-800 dark:text-slate-100">
                                        {project.leadsReceived}
                                    </p>
                                    <p className="text-slate-600 dark:text-slate-400">Recibidos</p>
                                </div>
                                <div className="text-center p-2 bg-primary/10 dark:bg-primary/20 rounded">
                                    <p className="font-bold text-slate-800 dark:text-slate-100">
                                        {project.leadsAssigned}
                                    </p>
                                    <p className="text-slate-600 dark:text-slate-400">Asignados</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                                    <p className="font-bold text-slate-800 dark:text-slate-100">
                                        {project.leadsCompleted}
                                    </p>
                                    <p className="text-slate-600 dark:text-slate-400">Completados</p>
                                </div>
                                <div className="text-center p-2 bg-slate-100 dark:bg-slate-800/30 rounded">
                                    <p className="font-bold text-slate-800 dark:text-slate-100">
                                        {(project.avgDaysToComplete ?? 0).toFixed(1)}
                                    </p>
                                    <p className="text-slate-600 dark:text-slate-400">Días prom.</p>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-600 dark:text-slate-400">Tasa de Conversión</span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-100">
                                        {(project.conversionRate ?? 0).toFixed(1)}%
                                    </span>
                                </div>
                                <Progress value={project.conversionRate ?? 0} className="h-2" />
                            </div>
                            <div className="text-center">
                                <Badge
                                    className={`${
                                        (project.conversionRate ?? 0) > 25
                                            ? "bg-green-600 hover:bg-green-700"
                                            : (project.conversionRate ?? 0) > 20
                                                ? "bg-primary hover:bg-primary/90"
                                                : "bg-orange-500 hover:bg-orange-600"
                                    } text-white`}
                                >
                                    {(project.conversionRate ?? 0) > 25
                                        ? "Excelente"
                                        : (project.conversionRate ?? 0) > 20
                                            ? "Bueno"
                                            : "Regular"}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Detalles de tareas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(data.taskAnalysis ?? []).map((task, index) => (
                    <Card key={index} className="border-l-4 border-l-slate-600">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                <BarChart3 className="w-4 h-4" />
                                {task.type}
                            </CardTitle>
                            <CardDescription>Tareas de tipo {task.type}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="text-center p-2 bg-slate-50 dark:bg-slate-900/30 rounded">
                                    <p className="font-bold text-slate-800 dark:text-slate-100">{task.scheduled}</p>
                                    <p className="text-slate-600 dark:text-slate-400">Programadas</p>
                                </div>
                                <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                                    <p className="font-bold text-slate-800 dark:text-slate-100">{task.completed}</p>
                                    <p className="text-slate-600 dark:text-slate-400">Completadas</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="text-center p-2 bg-primary/10 dark:bg-primary/20 rounded">
                                    <p className="font-bold text-slate-800 dark:text-slate-100">{task.pending}</p>
                                    <p className="text-slate-600 dark:text-slate-400">Pendientes</p>
                                </div>
                                <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded">
                                    <p className="font-bold text-red-600 dark:text-red-400">{task.overdue}</p>
                                    <p className="text-red-600 dark:text-red-400">Vencidas</p>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-600 dark:text-slate-400">Completadas</span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-100">
                                        {Math.round(((task.completed ?? 0) / (task.scheduled ?? 1)) * 100)}%
                                    </span>
                                </div>
                                <Progress value={((task.completed ?? 0) / (task.scheduled ?? 1)) * 100} className="h-2" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </TabsContent>
    );
}
