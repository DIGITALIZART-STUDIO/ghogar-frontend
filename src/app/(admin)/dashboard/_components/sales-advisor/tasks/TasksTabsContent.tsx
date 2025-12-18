"use client";

import { Activity, Calendar, CheckCircle, Clock, Edit, Target } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { TaskTypes } from "@/app/(admin)/assignments/[id]/tasks/_types/leadTask";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { TabsContent } from "@/components/ui/tabs";
import { SalesAdvisorDashboard } from "../../../_types/dashboard";
import { getTaskLabel, TaskTypesConfig } from "../../../../assignments/[id]/tasks/_utils/tasks.utils";
import { EmptyState } from "../../EmptyState";

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
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-slate-500/8 to-stone-500/8">
              <Calendar className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-200">Mis Tareas de Hoy</CardTitle>
              <CardDescription>Tareas programadas para hoy</CardDescription>
            </div>
          </div>
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
                    {(() => {
                      const taskConfig = TaskTypesConfig[task.type as keyof typeof TaskTypesConfig];
                      const TaskIcon = taskConfig?.icon || Activity;
                      return (
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${taskConfig?.bgColor || "bg-gray-50"}`}
                        >
                          <TaskIcon className={`w-5 h-5 ${taskConfig?.textColor || "text-gray-700"}`} />
                        </div>
                      );
                    })()}
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-slate-100">{task.clientName}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{task.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {getTaskLabel(task.type as TaskTypes)}
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
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-slate-500/8 to-stone-500/8">
              <Activity className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-200">
                Análisis de Mis Tareas
              </CardTitle>
              <CardDescription>Distribución de tareas por tipo</CardDescription>
            </div>
          </div>
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
              <BarChart data={data?.tasksByType} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                <XAxis
                  dataKey="type"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => getTaskLabel(value as TaskTypes)}
                />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
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
                <Bar dataKey="completed" fill="#10b981" name="Completadas" radius={[4, 4, 0, 0]} opacity={0.95} />
                <Bar dataKey="pending" fill="#facc15" name="Pendientes" radius={[4, 4, 0, 0]} opacity={0.95} />
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
                  100
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
