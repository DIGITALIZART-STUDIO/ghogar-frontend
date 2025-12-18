"use client";

import { BarChart3, Calendar, MapPin } from "lucide-react";
import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { TaskTypesConfig } from "@/app/(admin)/assignments/[id]/tasks/_utils/tasks.utils";
import type { SupervisorDashboard } from "@/app/(admin)/dashboard/_types/dashboard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Progress } from "@/components/ui/progress";
import { TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { EmptyState } from "../../EmptyState";

interface PerformanceTabsContentProps {
  data: SupervisorDashboard;
  isLoading: boolean;
}

export function PerformanceTabsContent({ data, isLoading }: PerformanceTabsContentProps) {
  if (isLoading) {
    return (
      <TabsContent value="performance" className="flex flex-col items-center justify-center py-16">
        <LoadingSpinner size="lg" text="Cargando datos del dashboard..." />
      </TabsContent>
    );
  }

  // Función para obtener el label correcto del tipo de tarea
  const getTaskLabel = (type: string) => {
    const taskConfig = TaskTypesConfig[type as keyof typeof TaskTypesConfig];
    return taskConfig?.label || type;
  };

  return (
    <TabsContent value="performance" className="space-y-8">
      {/* Gráfico de rendimiento por proyecto */}
      <Card className={cn("relative overflow-hidden")}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-stone-500/3" />
        <CardHeader className="relative pb-4">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-slate-500/8 to-stone-500/8">
              <MapPin className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <span className="text-xl font-semibold tracking-tight">Rendimiento por Proyecto</span>
              <CardDescription className="mt-1">Análisis de oportunidades por proyecto inmobiliario</CardDescription>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative max-h-[800px] h-full">
          {!data.projectLeads || data.projectLeads.length === 0 ? (
            <EmptyState
              icon={MapPin}
              title="Sin datos de proyectos"
              description="No hay información disponible sobre el rendimiento por proyecto"
            />
          ) : (
            <ResponsiveContainer height={450}>
              <ComposedChart data={data.projectLeads} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                <XAxis dataKey="project" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                          <p className="font-medium mb-2">{label}</p>
                          {payload.map((entry, index) => (
                            <p key={index} className="text-sm" style={{ color: entry.color }}>
                              {entry.name}: {entry.value}
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  yAxisId="left"
                  dataKey="leadsReceived"
                  fill="#facc15"
                  name="Recibidas"
                  radius={[4, 4, 0, 0]}
                  opacity={0.95}
                />
                <Bar
                  yAxisId="left"
                  dataKey="leadsAssigned"
                  fill="#fb923c"
                  name="Asignadas"
                  radius={[4, 4, 0, 0]}
                  opacity={0.95}
                />
                <Bar
                  yAxisId="left"
                  dataKey="leadsCompleted"
                  fill="#10b981"
                  name="Completadas"
                  radius={[4, 4, 0, 0]}
                  opacity={0.95}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="conversionRate"
                  stroke="#10b981"
                  strokeWidth={3}
                  name="Conversión %"
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Análisis de tareas */}
      <Card className={cn("relative overflow-hidden")}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-stone-500/3" />
        <CardHeader className="relative pb-4">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-stone-500/8 to-slate-500/8">
              <Calendar className="w-5 h-5 text-stone-600 dark:text-stone-400" />
            </div>
            <div>
              <span className="text-xl font-semibold tracking-tight">Análisis de Tareas por Tipo</span>
              <CardDescription className="mt-1">Distribución y estado de tareas por tipo</CardDescription>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative max-h-[800px] h-full">
          {!data.taskAnalysis || data.taskAnalysis.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="Sin datos de tareas"
              description="No hay información disponible sobre el análisis de tareas"
            />
          ) : (
            <ResponsiveContainer height={450}>
              <ComposedChart data={data.taskAnalysis} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                <XAxis
                  dataKey="type"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => getTaskLabel(value)}
                />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                          <p className="font-medium mb-2">{getTaskLabel(label)}</p>
                          {payload.map((entry, index) => (
                            <p key={index} className="text-sm" style={{ color: entry.color }}>
                              {entry.name}: {entry.value}
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="completed" fill="#10b981" name="Completadas" radius={[4, 4, 0, 0]} opacity={0.95} />
                <Bar dataKey="pending" fill="#facc15" name="Pendientes" radius={[4, 4, 0, 0]} opacity={0.95} />
                <Bar dataKey="overdue" fill="#ef4444" name="Vencidas" radius={[4, 4, 0, 0]} opacity={0.95} />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Detalles por proyecto */}
      {!data.projectLeads || data.projectLeads.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <EmptyState
              icon={MapPin}
              title="Sin proyectos"
              description="No hay proyectos disponibles para mostrar detalles"
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {(data.projectLeads ?? []).map((project, index) => (
            <Card key={index} className="border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary/8 border border-primary/15">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-100">{project.project}</span>
                </CardTitle>
                <CardDescription>Proyecto inmobiliario</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-center p-2 bg-slate-50 dark:bg-slate-900/30 rounded">
                    <p className="font-bold text-slate-800 dark:text-slate-100">{project.leadsReceived}</p>
                    <p className="text-slate-600 dark:text-slate-400">Recibidas</p>
                  </div>
                  <div className="text-center p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                    <p className="font-bold text-slate-800 dark:text-slate-100">{project.leadsAssigned}</p>
                    <p className="text-slate-600 dark:text-slate-400">Asignadas</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-center p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded">
                    <p className="font-bold text-slate-800 dark:text-slate-100">{project.leadsCompleted}</p>
                    <p className="text-slate-600 dark:text-slate-400">Completadas</p>
                  </div>
                  <div className="text-center p-2 bg-slate-100 dark:bg-slate-800/30 rounded">
                    <p className="font-bold text-slate-800 dark:text-slate-100">
                      {(project.avgDaysToComplete ?? 0).toFixed(1)}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">Días promedio</p>
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
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : (project.conversionRate ?? 0) > 20
                          ? "bg-amber-500 hover:bg-amber-600"
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
      )}

      {/* Detalles de tareas */}
      {!data.taskAnalysis || data.taskAnalysis.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <EmptyState
              icon={Calendar}
              title="Sin tareas"
              description="No hay tareas disponibles para mostrar detalles"
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(data.taskAnalysis ?? []).map((task, index) => {
            const taskConfig = TaskTypesConfig[task.type as keyof typeof TaskTypesConfig];
            const TaskIcon = taskConfig?.icon || BarChart3;

            return (
              <Card key={index} className={`border-l-4 ${taskConfig?.borderColor || "border-l-slate-600"}`}>
                <CardHeader className="pb-3">
                  <CardTitle
                    className={`text-sm font-medium flex items-center gap-2 ${taskConfig?.textColor || "text-slate-800 dark:text-slate-100"}`}
                  >
                    <div className="p-1.5 rounded-lg bg-primary/8 border border-primary/15">
                      <TaskIcon className="w-4 h-4" />
                    </div>
                    {taskConfig?.label || "Desconocido"}
                  </CardTitle>
                  <CardDescription>Tareas de tipo {taskConfig?.label || "Desconocido"}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-center p-2 bg-slate-50 dark:bg-slate-900/30 rounded">
                      <p className="font-bold text-slate-800 dark:text-slate-100">{task.scheduled}</p>
                      <p className="text-slate-600 dark:text-slate-400">Programadas</p>
                    </div>
                    <div className="text-center p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded">
                      <p className="font-bold text-slate-800 dark:text-slate-100">{task.completed}</p>
                      <p className="text-slate-600 dark:text-slate-400">Completadas</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="text-center p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
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
                      <span className="text-slate-600 dark:text-slate-400">Tasa de Completación</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-100">
                        {Math.round(((task.completed ?? 0) / (task.scheduled ?? 1)) * 100)}%
                      </span>
                    </div>
                    <Progress value={((task.completed ?? 0) / (task.scheduled ?? 1)) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </TabsContent>
  );
}
