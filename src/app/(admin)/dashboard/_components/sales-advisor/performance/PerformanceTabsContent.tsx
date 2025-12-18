"use client";

import { Clock, DollarSign, FileText, MapPin, Target } from "lucide-react";
import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Progress } from "@/components/ui/progress";
import { TabsContent } from "@/components/ui/tabs";
import { SalesAdvisorDashboard } from "../../../_types/dashboard";
import { EmptyState } from "../../EmptyState";

interface PerformanceTabsContentProps {
  data: SalesAdvisorDashboard | undefined;
  isLoading: boolean;
}

export default function PerformanceTabsContent({ data, isLoading }: PerformanceTabsContentProps) {
  const hasProjects = data?.myProjects && data.myProjects.length > 0;

  if (isLoading) {
    return (
      <TabsContent value="performance" className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
        </div>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="performance" className="space-y-6">
      {/* Mi rendimiento por proyecto */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-slate-500/8 to-stone-500/8">
              <MapPin className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-200">
                Mi Rendimiento por Proyecto
              </CardTitle>
              <CardDescription>Análisis de mi gestión por proyecto inmobiliario</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!hasProjects ? (
            <EmptyState
              icon={MapPin}
              title="Sin datos de proyectos"
              description="No hay información disponible sobre tu rendimiento por proyecto"
            />
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={data?.myProjects} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                <XAxis
                  dataKey="project"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
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
                        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-lg p-4 shadow-lg z-50">
                          <p className="font-medium mb-3 text-slate-800 dark:text-slate-200">{label}</p>
                          <div className="space-y-2">
                            {payload.map((entry, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                                <p className="text-sm text-slate-700 dark:text-slate-300">
                                  <span className="font-semibold">{entry.name}:</span>{" "}
                                  <span style={{ color: entry.color }}>{entry.value}</span>
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                  cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                />
                <Bar
                  yAxisId="left"
                  dataKey="leadsAssigned"
                  fill="#3b82f6"
                  name="Asignados"
                  radius={[4, 4, 0, 0]}
                  opacity={0.95}
                  stackId="a"
                />
                <Bar
                  yAxisId="left"
                  dataKey="leadsCompleted"
                  fill="#10b981"
                  name="Completados"
                  radius={[4, 4, 0, 0]}
                  opacity={0.95}
                  stackId="a"
                />
                <Bar
                  yAxisId="left"
                  dataKey="quotationsIssued"
                  fill="#f59e0b"
                  name="Cotizaciones"
                  radius={[4, 4, 0, 0]}
                  opacity={0.95}
                  stackId="a"
                />
                <Bar
                  yAxisId="left"
                  dataKey="reservationsMade"
                  fill="#059669"
                  name="Reservaciones"
                  radius={[4, 4, 0, 0]}
                  opacity={0.95}
                  stackId="a"
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

      {/* Detalles por proyecto */}
      {!hasProjects ? (
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
          {data?.myProjects?.map((project, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-800 dark:text-slate-100">
                  {project.project}
                </CardTitle>
                <CardDescription>Mi gestión en este proyecto</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-center p-2 bg-slate-50 dark:bg-slate-900/30 rounded-lg border border-slate-200 dark:border-slate-800">
                    <p className="font-bold text-slate-800 dark:text-slate-100">{project.leadsAssigned}</p>
                    <p className="text-slate-600 dark:text-slate-400">Asignados</p>
                  </div>
                  <div className="text-center p-2 bg-slate-100 dark:bg-slate-800/30 rounded-lg border border-slate-300 dark:border-slate-700">
                    <p className="font-bold text-slate-800 dark:text-slate-100">{project.leadsCompleted}</p>
                    <p className="text-slate-600 dark:text-slate-400">Completados</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-center p-2 bg-slate-200 dark:bg-slate-700/30 rounded-lg border border-slate-300 dark:border-slate-600">
                    <p className="font-bold text-slate-800 dark:text-slate-100">{project.quotationsIssued}</p>
                    <p className="text-slate-600 dark:text-slate-400">Cotizaciones</p>
                  </div>
                  <div className="text-center p-2 bg-primary/10 dark:bg-primary/20 rounded-lg border border-primary/30 dark:border-primary/40">
                    <p className="font-bold text-slate-800 dark:text-slate-100">{project.reservationsMade}</p>
                    <p className="text-slate-600 dark:text-slate-400">Reservaciones</p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 dark:text-slate-400">Mi Conversión</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-100">{project.conversionRate}%</span>
                  </div>
                  <Progress value={project.conversionRate} className="h-2" />
                </div>
                <div className="text-center">
                  <Badge
                    className={`${
                      project.conversionRate && project.conversionRate > 18
                        ? "bg-green-600 hover:bg-green-700"
                        : project.conversionRate && project.conversionRate > 12
                          ? "bg-primary hover:bg-primary/90"
                          : "bg-orange-500 hover:bg-orange-600"
                    } text-white`}
                  >
                    {project.conversionRate && project.conversionRate > 18
                      ? "Excelente"
                      : project.conversionRate && project.conversionRate > 12
                        ? "Bueno"
                        : "Mejorar"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Métricas personales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-6 h-6 text-primary" />
              <span className="font-medium text-slate-800 dark:text-slate-100">Mi Conversión</span>
            </div>
            <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              {data?.performance?.conversionRate ?? 0}%
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Tasa personal</p>
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
            <p className="text-sm text-slate-600 dark:text-slate-400">Promedio personal</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-6 h-6 text-slate-700 dark:text-slate-300" />
              <span className="font-medium text-slate-800 dark:text-slate-100">Cotizaciones</span>
            </div>
            <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              {data?.performance?.quotationsIssued ?? 0}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Generadas este mes</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-600">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              <span className="font-medium text-slate-800 dark:text-slate-100">Reservaciones</span>
            </div>
            <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              {data?.performance?.reservationsGenerated ?? 0}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Logradas este mes</p>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
}
