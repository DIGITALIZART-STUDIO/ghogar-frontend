"use client";

import { BarChart3, Building2, Home, ShoppingCart } from "lucide-react";
import { Bar, CartesianGrid, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { TabsContent } from "@/components/ui/tabs";
import type { AdminDashboard } from "../../../_types/dashboard";
import { EmptyState } from "../../EmptyState";
import ExpandableCardsProjects from "./ExpandableCardsProjects";

interface ProjectsTabsContentProps {
  data: AdminDashboard;
  isLoading?: boolean;
}

export default function ProjectsTabsContent({ data, isLoading }: ProjectsTabsContentProps) {
  return (
    <TabsContent value="projects" className="space-y-8">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <LoadingSpinner size="lg" text="Cargando datos del dashboard..." />
        </div>
      ) : (
        <>
          {/* Análisis visual con menos amarillo y cards mejorados */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <Card className="xl:col-span-2">
                <CardHeader className="relative pb-4">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-slate-500/8 to-stone-500/8">
                      <BarChart3 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <span className="text-xl font-semibold tracking-tight">
                        Distribución por proyecto inmobiliario
                      </span>
                      <CardDescription className="mt-1">
                        Visualiza la distribución de lotes por proyecto inmobiliario.
                      </CardDescription>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="max-h-[800px] h-full">
                  {!data || !data.projectMetrics || data.projectMetrics.length === 0 ? (
                    <EmptyState
                      icon={BarChart3}
                      title="Sin datos de proyectos"
                      description="No hay información disponible sobre el rendimiento de proyectos"
                    />
                  ) : (
                    <ResponsiveContainer height={450}>
                      <ComposedChart
                        data={data.projectMetrics.filter((p) => (p.totalLots ?? 0) > 0)}
                        barCategoryGap="12%"
                        margin={{ right: 20, left: -20 }}
                      >
                        <CartesianGrid strokeDasharray="2 4" stroke="#e2e8f0" vertical={false} strokeWidth={1} />
                        <XAxis
                          dataKey="name"
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
                                      <span className="text-base font-bold text-foreground">Total de lotes:</span>
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
                          dataKey="available"
                          name="Disponibles"
                          radius={[8, 8, 0, 0]}
                          maxBarSize={70}
                          fill="#FFD966"
                          stroke="#FFD966"
                          strokeWidth={0.5}
                        />
                        <Bar
                          dataKey="quoted"
                          name="Cotizados"
                          radius={[8, 8, 0, 0]}
                          maxBarSize={70}
                          fill="#6FCF97"
                          stroke="#6FCF97"
                          strokeWidth={0.5}
                        />
                        <Bar
                          dataKey="reserved"
                          name="Reservados"
                          radius={[8, 8, 0, 0]}
                          maxBarSize={70}
                          fill="#56CCF2"
                          stroke="#56CCF2"
                          strokeWidth={0.5}
                        />
                        <Bar
                          dataKey="sold"
                          name="Vendidos"
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
                      <span className="text-xl font-semibold tracking-tight"> Resumen General</span>
                      <CardDescription className="mt-1">
                        Visualiza el rendimiento general de los proyectos.
                      </CardDescription>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data && data.projectMetrics && data.projectMetrics.length > 0 && (
                    <>
                      <div className="p-4 rounded-lg bg-card border border-primary/20 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-primary" />
                          <span className="text-primary">Total Proyectos</span>
                        </div>
                        <p className="text-primary">{data.projectMetrics.length}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-card border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Home className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                          <span className="text-slate-700 dark:text-slate-300">Total Lotes</span>
                        </div>
                        <p className="text-primary">
                          {data.projectMetrics.reduce((sum, p) => sum + (p.totalLots ?? 0), 0)}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-card border border-slate-300 dark:border-slate-600 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ShoppingCart className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                          <span className="text-slate-800 dark:text-slate-200">Lotes Vendidos</span>
                        </div>
                        <p className="text-primary">{data.projectMetrics.reduce((sum, p) => sum + (p.sold ?? 0), 0)}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          {/* Cards expandibles hasta 2 por fila */}
          <ExpandableCardsProjects data={data as AdminDashboard} />
        </>
      )}
    </TabsContent>
  );
}
