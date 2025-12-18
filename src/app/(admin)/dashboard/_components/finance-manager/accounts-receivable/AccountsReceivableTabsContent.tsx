"use client";

import { AlertTriangle, CheckCircle } from "lucide-react";
import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { FinanceManagerDashboard } from "../../../_types/dashboard";
import { EmptyState } from "../../EmptyState";

interface AccountsReceivableTabsContentProps {
  data: FinanceManagerDashboard | undefined;
  isLoading: boolean;
}

export default function AccountsReceivableTabsContent({ data, isLoading }: AccountsReceivableTabsContentProps) {
  const hasDelinquencyAnalysis = data?.delinquencyAnalysis && data.delinquencyAnalysis.length > 0;
  const hasAccountsReceivable = data?.accountsReceivable && data.accountsReceivable.length > 0;

  return (
    <TabsContent value="accounts-receivable" className="space-y-6">
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {/* Análisis de morosidad */}
          <Card>
            <CardHeader className="relative pb-4">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-slate-500/8 to-stone-500/8">
                  <AlertTriangle className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </div>
                <div>
                  <span className="text-xl font-semibold tracking-tight">Análisis de Morosidad</span>
                  <CardDescription className="mt-1">Distribución de cuentas vencidas por antigüedad</CardDescription>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!hasDelinquencyAnalysis ? (
                <EmptyState
                  icon={AlertTriangle}
                  title="Sin análisis de morosidad"
                  description="No hay información disponible sobre cuentas vencidas por antigüedad"
                />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart
                    data={data?.delinquencyAnalysis ?? []}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                    <XAxis dataKey="rango" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis
                      yAxisId="monto"
                      stroke="#64748b"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `S/ ${(value / 1000).toFixed(0)}K`}
                    />
                    <YAxis
                      yAxisId="cantidad"
                      orientation="right"
                      stroke="#64748b"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const dataItem = payload[0].payload;
                          return (
                            <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                              <p className="font-medium mb-2">{label}</p>
                              <p className="text-sm" style={{ color: "#ef4444" }}>
                                Monto: S/ {(dataItem.monto / 1000).toFixed(0)}K
                              </p>
                              <p className="text-sm" style={{ color: "#3b82f6" }}>
                                Cantidad: {dataItem.cantidad}
                              </p>
                              <p className="text-sm" style={{ color: "#6b7280" }}>
                                % del total: {dataItem.porcentaje}%
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar
                      yAxisId="monto"
                      dataKey="monto"
                      name="Monto"
                      fill="#ef4444"
                      radius={[4, 4, 0, 0]}
                      opacity={0.95}
                    />
                    <Line
                      yAxisId="cantidad"
                      type="monotone"
                      dataKey="cantidad"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      name="Cantidad"
                      dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Detalle por proyecto */}
          {!hasAccountsReceivable ? (
            <Card>
              <CardContent className="py-12">
                <EmptyState
                  icon={AlertTriangle}
                  title="Sin cuentas por cobrar"
                  description="No hay información disponible sobre cuentas por cobrar por proyecto"
                />
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data?.accountsReceivable?.map((proyecto, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <div
                          className={cn(
                            "p-1.5 rounded-lg border",
                            (proyecto.overdue ?? 0) > 0
                              ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                              : "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800"
                          )}
                        >
                          {(proyecto.overdue ?? 0) > 0 ? (
                            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                          ) : (
                            <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          )}
                        </div>
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                          {proyecto.project}
                        </span>
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          (proyecto.overdue ?? 0) > 0
                            ? "bg-red-100 text-red-700 border-red-200"
                            : "bg-emerald-100 text-emerald-700 border-emerald-200"
                        )}
                      >
                        {(proyecto.overdue ?? 0) > 0 ? "Con Vencidos" : "Al Día"}
                      </Badge>
                    </div>
                    <CardDescription>Estado de cobranza</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200 dark:bg-green-900/20 dark:border-green-800">
                        <p className="text-sm text-green-600 dark:text-green-400 mb-1">Cobrado</p>
                        <p className="text-lg font-bold text-green-700 dark:text-green-300">
                          S/ {proyecto.collected !== undefined ? (proyecto.collected / 1000000).toFixed(1) : "0.0"}M
                        </p>
                      </div>
                      <div className="text-center p-3 bg-amber-50 rounded-lg border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
                        <p className="text-sm text-amber-600 dark:text-amber-400 mb-1">Pendiente</p>
                        <p className="text-lg font-bold text-amber-700 dark:text-amber-300">
                          S/ {proyecto.pending !== undefined ? (proyecto.pending / 1000).toFixed(0) : "0.0"}K
                        </p>
                      </div>
                    </div>

                    {(proyecto.overdue ?? 0) > 0 && (
                      <div className="p-3 bg-red-50 rounded-lg border border-red-200 dark:bg-red-900/20 dark:border-red-800">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-red-800 dark:text-red-200">Monto Vencido</span>
                          <span className="text-lg font-bold text-red-700 dark:text-red-300">
                            S/ {proyecto.overdue !== undefined ? (proyecto.overdue / 1000).toFixed(0) : "0.0"}K
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Próximo vencimiento</span>
                        <span className="text-sm text-slate-600 dark:text-slate-400">{proyecto.nextPaymentDate}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Monto</span>
                        <span className="font-bold text-blue-600">
                          S/ {proyecto.nextDue !== undefined ? (proyecto.nextDue / 1000).toFixed(0) : "0.0"}K
                        </span>
                      </div>
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
