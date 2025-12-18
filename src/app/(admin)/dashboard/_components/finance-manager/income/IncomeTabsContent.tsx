"use client";

import { ArrowUpRight, BarChart3, TrendingUp, Wallet } from "lucide-react";
import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { TabsContent } from "@/components/ui/tabs";
import { FinanceManagerDashboard } from "../../../_types/dashboard";
import { EmptyState } from "../../EmptyState";

interface IncomeTabsContentProps {
  data: FinanceManagerDashboard | undefined;
  isLoading: boolean;
}

export default function IncomeTabsContent({ data, isLoading }: IncomeTabsContentProps) {
  const hasMonthlyIncome = data?.monthlyIncome && data.monthlyIncome.length > 0;

  return (
    <TabsContent value="income" className="space-y-6">
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {/* Evolución de ingresos cobrados */}
          <Card>
            <CardHeader className="relative pb-4">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-slate-500/8 to-stone-500/8">
                  <TrendingUp className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </div>
                <div>
                  <span className="text-xl font-semibold tracking-tight">Evolución de Ingresos Cobrados</span>
                  <CardDescription className="mt-1">Ingresos efectivamente cobrados por mes</CardDescription>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!hasMonthlyIncome ? (
                <EmptyState
                  icon={TrendingUp}
                  title="Sin datos de ingresos"
                  description="No hay información disponible sobre la evolución de ingresos mensuales"
                />
              ) : (
                <ResponsiveContainer width="100%" height={450}>
                  <ComposedChart
                    data={data?.monthlyIncome?.map((income) => ({
                      mes: income.month,
                      cobrado: income.collected,
                      acumulado: income.accumulated,
                      proyectos: income.projects,
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                    <XAxis dataKey="mes" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis
                      stroke="#64748b"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `S/ ${(value / 1000000).toFixed(1)}M`}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                              <p className="font-medium mb-2">{label}</p>
                              {payload.map((entry, index) => (
                                <p key={index} className="text-sm" style={{ color: entry.color }}>
                                  {entry.name}:{" "}
                                  {entry.name === "Ingresos Cobrados"
                                    ? `S/ ${((entry.value as number) / 1000000).toFixed(1)}M`
                                    : entry.name === "Acumulado"
                                      ? `S/ ${((entry.value as number) / 1000000).toFixed(1)}M`
                                      : entry.value}
                                </p>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar
                      dataKey="cobrado"
                      name="Ingresos Cobrados"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                      opacity={0.95}
                    />
                    <Line
                      type="monotone"
                      dataKey="acumulado"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      name="Acumulado"
                      dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Métricas de ingresos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                    <ArrowUpRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-100">Mejor Mes</span>
                </CardTitle>
                <CardDescription>Octubre 2024</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <p className="text-3xl font-bold text-green-600">S/ 1.89M</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Ingresos cobrados</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Proyectos activos</span>
                    <span className="font-semibold text-green-600">4</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Vs. promedio</span>
                    <span className="font-semibold text-green-600">+24.8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-100">Promedio Mensual</span>
                </CardTitle>
                <CardDescription>Últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <p className="text-3xl font-bold text-blue-600">S/ 1.48M</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Ingresos promedio</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tendencia</span>
                    <span className="font-semibold text-green-600">↗ Creciente</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Variabilidad</span>
                    <span className="font-semibold text-blue-600">±18.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700">
                    <Wallet className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  </div>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-100">Total Acumulado</span>
                </CardTitle>
                <CardDescription>6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <p className="text-3xl font-bold text-purple-600">S/ 8.85M</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Ingresos cobrados</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>% del facturado</span>
                    <span className="font-semibold text-purple-600">80.2%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Crecimiento</span>
                    <span className="font-semibold text-green-600">+12.8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </TabsContent>
  );
}
