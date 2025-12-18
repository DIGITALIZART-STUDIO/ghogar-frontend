"use client";

import { BarChart3, Building2, Home, ShoppingCart, Target, TrendingUp } from "lucide-react";
import { Bar, CartesianGrid, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { ManagerDashboard } from "@/app/(admin)/dashboard/_types/dashboard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Progress } from "@/components/ui/progress";
import { TabsContent } from "@/components/ui/tabs";
import { EmptyState } from "../../EmptyState";

interface ProjectsTabsContentProps {
  data: ManagerDashboard;
  isLoading: boolean;
}

export function ProjectsTabsContent({ data, isLoading }: ProjectsTabsContentProps) {
  return (
    <TabsContent value="projects" className="space-y-8">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <LoadingSpinner size="lg" text="Cargando datos del dashboard..." />
        </div>
      ) : (
        <>
          {/* Análisis visual con diseño del admin */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <Card className="xl:col-span-2">
                <CardHeader className="relative pb-4">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-slate-500/8 to-stone-500/8">
                      <BarChart3 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <span className="text-xl font-semibold tracking-tight">Rendimiento por Proyecto</span>
                      <CardDescription className="mt-1">
                        Visualiza la distribución de leads, cotizaciones y reservaciones por proyecto.
                      </CardDescription>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="max-h-[800px] h-full">
                  {!data || !data.projectPerformance || data.projectPerformance.length === 0 ? (
                    <EmptyState
                      icon={BarChart3}
                      title="Sin datos de proyectos"
                      description="No hay información disponible sobre el rendimiento de proyectos"
                    />
                  ) : (
                    <ResponsiveContainer height={450}>
                      <ComposedChart
                        data={data.projectPerformance.filter((p) => (p.totalLeads ?? 0) > 0)}
                        barCategoryGap="12%"
                        margin={{ right: 20, left: -20 }}
                      >
                        <CartesianGrid strokeDasharray="2 4" stroke="#e2e8f0" vertical={false} strokeWidth={1} />
                        <XAxis
                          dataKey="projectName"
                          height={80}
                          fontSize={13}
                          fontWeight={700}
                          tickLine={false}
                          axisLine={false}
                          interval={0}
                          tick={{ fill: "#64748b", fontSize: 13 }}
                        />
                        <YAxis
                          fontSize={13}
                          fontWeight={700}
                          tickLine={false}
                          axisLine={false}
                          tick={{ fill: "#64748b" }}
                          domain={[0, "dataMax + 2"]}
                        />
                        <Tooltip
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              const total = payload.reduce((sum, entry) => sum + (entry.value as number), 0);
                              return (
                                <div className="bg-white/95 border border-slate-200 rounded-2xl p-6 min-w-[280px] backdrop-blur-md dark:bg-slate-800/95 dark:border-slate-700">
                                  <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700">
                                      <Building2 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                                    </div>
                                    <h4 className="font-bold text-lg text-foreground">{label}</h4>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 mb-4">
                                    {payload.map((entry, index) => (
                                      <div key={index} className="flex items-center gap-3">
                                        <div
                                          className="w-4 h-4 rounded-full border border-slate-200 dark:border-slate-600"
                                          style={{ backgroundColor: entry.color }}
                                        />
                                        <div>
                                          <p className="text-sm font-medium text-muted-foreground">{entry.name}</p>
                                          <p className="text-lg font-bold" style={{ color: entry.color }}>
                                            {entry.value}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                                    <div className="flex items-center justify-between">
                                      <span className="text-base font-bold text-foreground">Total:</span>
                                      <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-primary opacity-60" />
                                        <span className="text-xl font-black text-primary">{total}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar
                          dataKey="totalLeads"
                          name="Oportunidades"
                          radius={[8, 8, 0, 0]}
                          maxBarSize={70}
                          fill="#FFD966"
                          stroke="#FFD966"
                          strokeWidth={0.5}
                        />
                        <Bar
                          dataKey="quotations"
                          name="Cotizaciones"
                          radius={[8, 8, 0, 0]}
                          maxBarSize={70}
                          fill="#6FCF97"
                          stroke="#6FCF97"
                          strokeWidth={0.5}
                        />
                        <Bar
                          dataKey="reservations"
                          name="Reservaciones"
                          radius={[8, 8, 0, 0]}
                          maxBarSize={70}
                          fill="#56CCF2"
                          stroke="#56CCF2"
                          strokeWidth={0.5}
                        />
                        <Bar
                          dataKey="availableUnits"
                          name="Disponibles"
                          radius={[8, 8, 0, 0]}
                          maxBarSize={70}
                          fill="#A78BFA"
                          stroke="#A78BFA"
                          strokeWidth={0.5}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
              {/* Panel de resumen con cards mejorados */}
              <Card>
                <CardHeader className="relative">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-slate-500/8 to-stone-500/8">
                      <BarChart3 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <span className="text-xl font-semibold tracking-tight">Resumen General</span>
                      <CardDescription className="mt-1">
                        Visualiza el rendimiento general de los proyectos.
                      </CardDescription>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data && data.projectPerformance && data.projectPerformance.length > 0 && (
                    <>
                      <div className="p-4 rounded-lg bg-card border border-primary/20 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-primary" />
                          <span className="text-primary">Total Proyectos</span>
                        </div>
                        <p className="text-primary">{data.projectPerformance.length}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-card border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                          <span className="text-slate-700 dark:text-slate-300">Total Oportunidades</span>
                        </div>
                        <p className="text-primary">
                          {data.projectPerformance.reduce((sum, p) => sum + (p.totalLeads ?? 0), 0)}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-card border border-slate-300 dark:border-slate-600 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ShoppingCart className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                          <span className="text-slate-800 dark:text-slate-200">Reservaciones Totales</span>
                        </div>
                        <p className="text-primary">
                          {data.projectPerformance.reduce((sum, p) => sum + (p.reservations ?? 0), 0)}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-card border border-slate-300 dark:border-slate-600 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                          <span className="text-slate-800 dark:text-slate-200">Tasa Promedio</span>
                        </div>
                        <p className="text-primary">
                          {data.projectPerformance.length > 0
                            ? (
                                data.projectPerformance.reduce((sum, p) => sum + (p.conversionRate ?? 0), 0) /
                                data.projectPerformance.length
                              ).toFixed(1)
                            : 0}
                          %
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          {/* Cards detalladas por proyecto */}
          {!data.projectPerformance || data.projectPerformance.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <EmptyState
                  icon={Building2}
                  title="Sin proyectos"
                  description="No hay proyectos disponibles para mostrar"
                />
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {data.projectPerformance.map((project) => (
                <Card key={project.projectId} className="border-l-4 border-l-primary">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-primary/8 border border-primary/15">
                        <Building2 className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-bold text-foreground">{project.projectName}</span>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <Target className="w-3 h-3" />
                      <span>{(project.occupancyRate ?? 0).toFixed(1)}% ocupación</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Métricas principales */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center bg-primary/5 border border-primary/10 rounded-lg p-3 transition-all duration-200 hover:bg-primary/8">
                        <Target className="w-4 h-4 text-primary mx-auto mb-2" />
                        <p className="font-bold text-primary text-lg">{project.totalLeads}</p>
                        <p className="text-xs text-muted-foreground">Oportunidades</p>
                      </div>
                      <div className="text-center bg-slate-100 border border-slate-200 rounded-lg dark:bg-slate-800 dark:border-slate-700 p-3 transition-all duration-200 hover:bg-slate-200 dark:hover:bg-slate-700">
                        <ShoppingCart className="w-4 h-4 mx-auto mb-2 text-slate-600 dark:text-slate-400" />
                        <p className="font-bold text-slate-700 dark:text-slate-300 text-lg">{project.reservations}</p>
                        <p className="text-xs text-muted-foreground">Reservaciones</p>
                      </div>
                      <div className="text-center bg-slate-200 border border-slate-300 rounded-lg dark:bg-slate-700 dark:border-slate-600 p-3">
                        <Home className="w-4 h-4 mx-auto mb-2 text-slate-600 dark:text-slate-400" />
                        <p className="font-bold text-slate-700 dark:text-slate-300 text-lg">{project.quotations}</p>
                        <p className="text-xs text-muted-foreground">Cotizaciones</p>
                      </div>
                      <div className="text-center bg-slate-300 border border-slate-400 rounded-lg dark:bg-slate-600 dark:border-slate-500 p-3">
                        <TrendingUp className="w-4 h-4 mx-auto mb-2 text-slate-700 dark:text-slate-300" />
                        <p className="font-bold text-slate-800 dark:text-slate-200 text-lg">{project.availableUnits}</p>
                        <p className="text-xs text-muted-foreground">Disponibles</p>
                      </div>
                    </div>

                    {/* Progreso de conversión */}
                    <div className="space-y-2">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium flex items-center gap-1.5 text-sm">
                          <Target className="w-4 h-4 text-primary" />
                          Tasa de Conversión
                        </span>
                        <span className="font-bold text-primary text-sm">
                          {(project.conversionRate ?? 0).toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={project.conversionRate ?? 0} className="h-2.5" />
                    </div>

                    {/* Progreso de ocupación */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium flex items-center gap-1.5">
                          <TrendingUp className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                          Ocupación Total
                        </span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {(project.occupancyRate ?? 0).toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={project.occupancyRate ?? 0} className="h-2.5" />
                    </div>

                    {/* Información financiera */}
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground flex items-center gap-1.5 text-sm">
                          <ShoppingCart className="w-4 h-4" />
                          Ingresos Generados
                        </span>
                        <span className="font-bold text-primary text-base">
                          ${((project.reservationAmount ?? 0) / 1000).toFixed(1)}K
                        </span>
                      </div>
                    </div>

                    {/* Badge de rendimiento */}
                    <div className="pt-2 text-center">
                      <Badge
                        className={`${
                          (project.conversionRate ?? 0) > 20
                            ? "bg-green-600 hover:bg-green-700"
                            : (project.conversionRate ?? 0) > 15
                              ? "bg-primary hover:bg-primary/90"
                              : "bg-orange-500 hover:bg-orange-600"
                        } text-white`}
                      >
                        {(project.conversionRate ?? 0) > 20
                          ? "Alto Rendimiento"
                          : (project.conversionRate ?? 0) > 15
                            ? "Buen Rendimiento"
                            : "Mejorar"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </TabsContent>
  );
}
