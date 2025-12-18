"use client";

import { AlertTriangle, Calendar, CheckCircle, Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { FinanceManagerDashboard } from "../../../_types/dashboard";
import { EmptyState } from "../../EmptyState";

interface PaymentScheduleTabsContentProps {
  data: FinanceManagerDashboard | undefined;
  isLoading: boolean;
}

export default function PaymentScheduleTabsContent({ data, isLoading }: PaymentScheduleTabsContentProps) {
  const hasPaymentSchedule = data?.paymentSchedule && data.paymentSchedule.length > 0;

  return (
    <TabsContent value="payment-schedule" className="space-y-6">
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {/* Lista de pagos próximos */}
          <Card>
            <CardHeader className="relative pb-4">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-slate-500/8 to-stone-500/8">
                  <Calendar className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </div>
                <div>
                  <span className="text-xl font-semibold tracking-tight">Cronograma de Pagos - Próximos 30 Días</span>
                  <CardDescription className="mt-1">Pagos programados y fechas de vencimiento</CardDescription>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!hasPaymentSchedule ? (
                <EmptyState
                  icon={Calendar}
                  title="Sin pagos programados"
                  description="No hay pagos programados para los próximos 30 días"
                />
              ) : (
                <div className="space-y-4">
                  {data?.paymentSchedule?.map((pago, index) => {
                    const esPorVencer = pago.daysOverdue ?? 0 <= 7;
                    const esUrgente = pago.daysOverdue ?? 0 <= 3;

                    return (
                      <div
                        key={index}
                        className={cn(
                          "p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-md",
                          esUrgente
                            ? "bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800/30"
                            : esPorVencer
                              ? "bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800/30"
                              : "bg-blue-50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800/30"
                        )}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div
                              className={cn(
                                "p-3 rounded-xl",
                                esUrgente
                                  ? "bg-red-100 border border-red-200 dark:bg-red-900/30 dark:border-red-800"
                                  : esPorVencer
                                    ? "bg-amber-100 border border-amber-200 dark:bg-amber-900/30 dark:border-amber-800"
                                    : "bg-blue-100 border border-blue-200 dark:bg-blue-900/30 dark:border-blue-800"
                              )}
                            >
                              {esUrgente ? (
                                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                              ) : esPorVencer ? (
                                <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                              ) : (
                                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                              )}
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{pago.client}</h3>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {pago.project} - {pago.lot}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                              S/ {pago.amount !== undefined ? (pago.amount / 1000).toFixed(0) : "0.0"}K
                            </p>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs mt-1",
                                esUrgente
                                  ? "bg-red-100 text-red-700 border-red-300"
                                  : esPorVencer
                                    ? "bg-amber-100 text-amber-700 border-amber-300"
                                    : "bg-blue-100 text-blue-700 border-blue-300"
                              )}
                            >
                              {esUrgente ? "URGENTE" : esPorVencer ? "Por Vencer" : "Vigente"}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-3 bg-white rounded-lg border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Fecha Vencimiento</p>
                            <p className="font-bold text-slate-900 dark:text-slate-100">{pago.dueDate}</p>
                          </div>
                          <div className="text-center p-3 bg-white rounded-lg border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Días Restantes</p>
                            <p
                              className={cn(
                                "font-bold",
                                esUrgente ? "text-red-600" : esPorVencer ? "text-amber-600" : "text-blue-600"
                              )}
                            >
                              {pago.daysOverdue ?? 0} días
                            </p>
                          </div>
                          <div className="text-center p-3 bg-white rounded-lg border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Cuota</p>
                            <p className="font-bold text-slate-900 dark:text-slate-100">{pago.installment}</p>
                          </div>
                          <div className="text-center p-3 bg-white rounded-lg border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Estado</p>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs",
                                pago.status === "por_vencer"
                                  ? "bg-amber-100 text-amber-700 border-amber-200"
                                  : "bg-green-100 text-green-700 border-green-200"
                              )}
                            >
                              {pago.status === "por_vencer" ? "Por Vencer" : "Vigente"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resumen de cronograma */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-100">Pagos Urgentes</span>
                </CardTitle>
                <CardDescription>Próximos 7 días</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <p className="text-3xl font-bold text-red-600">
                    {data?.paymentSchedule?.filter((p) => p.daysOverdue ?? 0 <= 7).length ?? 0}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">pagos por vencer</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Monto total</span>
                    <span className="font-semibold text-red-600">
                      S/{" "}
                      {(
                        (data?.paymentSchedule
                          ?.filter((p) => (p.daysOverdue ?? 0) <= 7)
                          .reduce((sum, p) => sum + (p.amount ?? 0), 0) ?? 0) / 1000
                      ).toFixed(0)}
                      K
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Más urgente</span>
                    <span className="font-semibold text-red-600">
                      {(() => {
                        const days = data?.paymentSchedule?.map((p) => p.daysOverdue ?? 0);
                        if (Array.isArray(days) && days.length > 0) {
                          return `${Math.min(...days)} días`;
                        }
                        return "N/A";
                      })()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-100">Total Programado</span>
                </CardTitle>
                <CardDescription>Próximos 30 días</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <p className="text-3xl font-bold text-blue-600">
                    S/ {((data?.paymentSchedule?.reduce((sum, p) => sum + (p.amount ?? 0), 0) ?? 0) / 1000).toFixed(0)}K
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">ingresos esperados</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Cantidad pagos</span>
                    <span className="font-semibold">{data?.paymentSchedule?.length ?? 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Promedio por pago</span>
                    <span className="font-semibold text-blue-600">
                      {(() => {
                        const total = data?.paymentSchedule?.reduce((sum, p) => sum + (p.amount ?? 0), 0) ?? 0;
                        const count = data?.paymentSchedule?.length ?? 0;
                        if (count === 0) {
                          return "N/A";
                        }
                        return `S/ ${(total / count / 1000).toFixed(0)}K`;
                      })()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-100">Proyección Mensual</span>
                </CardTitle>
                <CardDescription>Basado en cronograma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <p className="text-3xl font-bold text-green-600">
                    S/{" "}
                    {data?.financialSummary?.monthlyProjection !== undefined
                      ? (data?.financialSummary?.monthlyProjection / 1000000).toFixed(1)
                      : "0.0"}
                    M
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">ingresos proyectados</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Vs. mes anterior</span>
                    <span className="font-semibold text-green-600">+12.8%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Confiabilidad</span>
                    <span className="font-semibold text-green-600">91.2%</span>
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
