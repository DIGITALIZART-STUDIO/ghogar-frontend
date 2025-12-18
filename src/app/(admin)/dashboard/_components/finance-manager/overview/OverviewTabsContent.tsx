"use client";

import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  PieChart,
  TrendingUp,
  Wallet,
  XCircle,
} from "lucide-react";
import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Progress } from "@/components/ui/progress";
import { TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { FinanceManagerDashboard } from "../../../_types/dashboard";
import { EmptyState } from "../../EmptyState";

interface OverviewTabsContentProps {
  data: FinanceManagerDashboard | undefined;
  isLoading: boolean;
}

export default function OverviewTabsContent({ data, isLoading }: OverviewTabsContentProps) {
  const hasAccountsReceivable = data?.accountsReceivable && data.accountsReceivable.length > 0;

  return (
    <TabsContent value="overview" className="space-y-6">
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {/* KPIs Financieros Principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-emerald-500">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                    <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Total Cobrado</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                      S/{" "}
                      {data?.financialSummary?.totalCollected !== undefined
                        ? (data.financialSummary.totalCollected / 1000000).toFixed(1)
                        : "--"}
                      M
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                        {(
                          ((data?.financialSummary?.totalCollected ?? 0) /
                            (data?.financialSummary?.totalInvoiced ?? 1)) *
                          100
                        ).toFixed(1)}
                        % del facturado
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-amber-500">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                    <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Pendiente Cobro</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                      S/{" "}
                      {data?.financialSummary?.pendingCollection !== undefined
                        ? (data.financialSummary.pendingCollection / 1000000).toFixed(1)
                        : "--"}
                      M
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <Calendar className="w-4 h-4 text-amber-600" />
                      <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                        {data?.financialSummary?.portfolioTurnover ?? "--"} días promedio
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Cuentas Vencidas</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                      S/{" "}
                      {data?.financialSummary?.overdue !== undefined
                        ? (data.financialSummary.overdue / 1000).toFixed(0)
                        : "--"}
                      K
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                        {(
                          ((data?.financialSummary?.overdue ?? 0) / (data?.financialSummary?.totalInvoiced ?? 1)) *
                          100
                        ).toFixed(1)}
                        % del total
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Proyección Mensual</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                      S/{" "}
                      {data?.financialSummary?.monthlyProjection !== undefined
                        ? (data.financialSummary.monthlyProjection / 1000000).toFixed(1)
                        : "--"}
                      M
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Próximo mes</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Indicadores Financieros Clave */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="relative pb-4">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-slate-500/8 to-stone-500/8">
                    <BarChart3 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <span className="text-xl font-semibold tracking-tight">Indicadores de Gestión</span>
                    <CardDescription className="mt-1">Métricas clave de rendimiento financiero</CardDescription>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        Eficiencia Cobranza
                      </span>
                      <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                      {data?.kpiIndicators?.collectionEfficiency}%
                    </p>
                    <Progress value={data?.kpiIndicators?.collectionEfficiency} className="h-2" />
                  </div>

                  <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Margen Bruto</span>
                      <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                      {data?.kpiIndicators?.operatingMargin}%
                    </p>
                    <Progress value={data?.kpiIndicators?.operatingMargin} className="h-2" />
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Rotación Cartera</span>
                      <Calendar className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                      {data?.kpiIndicators?.portfolioDays} días
                    </p>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Promedio de cobranza</div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Crecimiento</span>
                      <ArrowUpRight className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                      {data?.kpiIndicators?.monthlyGrowth}%
                    </p>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Mensual promedio</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="relative pb-4">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-slate-500/8 to-stone-500/8">
                    <PieChart className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <span className="text-xl font-semibold tracking-tight">Estado de Cartera</span>
                    <CardDescription className="mt-1">Distribución de cuentas por cobrar</CardDescription>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <RechartsPieChart>
                    <Pie
                      data={[
                        {
                          name: "Cobrado",
                          value: data?.financialSummary?.totalCollected ?? 0,
                          fill: "#10b981",
                        },
                        {
                          name: "Pendiente Vigente",
                          value: data?.financialSummary?.pendingCollection ?? 0,
                          fill: "#f59e0b",
                        },
                        {
                          name: "Vencido",
                          value: data?.financialSummary?.overdue ?? 0,
                          fill: "#ef4444",
                        },
                      ]}
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {[{ fill: "#10b981" }, { fill: "#f59e0b" }, { fill: "#ef4444" }].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload[0]) {
                          const dataItem = payload[0].payload;
                          const total = data?.financialSummary?.totalInvoiced ?? 1;
                          const percentage = ((dataItem.value / total) * 100).toFixed(1);
                          return (
                            <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                              <p className="font-medium mb-2">{dataItem.name}</p>
                              <p className="text-sm" style={{ color: dataItem.fill }}>
                                S/ {(dataItem.value / 1000000).toFixed(1)}M ({percentage}%)
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Resumen por Proyecto */}
          <Card>
            <CardHeader className="relative pb-4">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-slate-500/8 to-stone-500/8">
                  <FileText className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </div>
                <div>
                  <span className="text-xl font-semibold tracking-tight">Estado Financiero por Proyecto</span>
                  <CardDescription className="mt-1">Análisis detallado de cuentas por cobrar</CardDescription>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!hasAccountsReceivable ? (
                <EmptyState
                  icon={FileText}
                  title="Sin proyectos financieros"
                  description="No hay información disponible sobre el estado financiero de los proyectos"
                />
              ) : (
                <div className="space-y-4">
                  {(data?.accountsReceivable ?? []).map((proyecto, index) => {
                    const porcentajeCobrado = ((proyecto.collected ?? 0) / (proyecto.invoiced ?? 1)) * 100;
                    const tieneVencido = (proyecto.overdue ?? 0) > 0;

                    return (
                      <div
                        key={index}
                        className={cn(
                          "p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-md",
                          tieneVencido
                            ? "bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800/30"
                            : porcentajeCobrado > 85
                              ? "bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800/30"
                              : "bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800/30"
                        )}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "p-2 rounded-lg",
                                tieneVencido
                                  ? "bg-red-100 border border-red-200 dark:bg-red-900/30 dark:border-red-800"
                                  : porcentajeCobrado > 85
                                    ? "bg-green-100 border border-green-200 dark:bg-green-900/30 dark:border-green-800"
                                    : "bg-amber-100 border border-amber-200 dark:bg-amber-900/30 dark:border-amber-800"
                              )}
                            >
                              {tieneVencido ? (
                                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                              ) : porcentajeCobrado > 85 ? (
                                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                              ) : (
                                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                              )}
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                {proyecto.project}
                              </h3>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                Próximo pago: {proyecto.nextPaymentDate}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-sm font-semibold",
                              tieneVencido
                                ? "bg-red-100 text-red-700 border-red-300"
                                : porcentajeCobrado > 85
                                  ? "bg-green-100 text-green-700 border-green-300"
                                  : "bg-amber-100 text-amber-700 border-amber-300"
                            )}
                          >
                            {porcentajeCobrado.toFixed(1)}% cobrado
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center p-3 bg-white rounded-lg border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Facturado</p>
                            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                              S/ {proyecto.invoiced ? (proyecto.invoiced / 1000000).toFixed(1) : "0.0"}M
                            </p>
                          </div>
                          <div className="text-center p-3 bg-white rounded-lg border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Cobrado</p>
                            <p className="text-lg font-bold text-green-600">
                              S/ {proyecto.collected ? (proyecto.collected / 1000000).toFixed(1) : "0.0"}M
                            </p>
                          </div>
                          <div className="text-center p-3 bg-white rounded-lg border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Pendiente</p>
                            <p className="text-lg font-bold text-amber-600">
                              S/ {proyecto.pending ? (proyecto.pending / 1000).toFixed(0) : "0.0"}K
                            </p>
                          </div>
                          <div className="text-center p-3 bg-white rounded-lg border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Vencido</p>
                            <p
                              className={cn(
                                "text-lg font-bold",
                                proyecto.overdue !== undefined
                                  ? proyecto.overdue > 0
                                    ? "text-red-600"
                                    : "text-slate-400"
                                  : "text-slate-400"
                              )}
                            >
                              S/ {proyecto.overdue !== undefined ? (proyecto.overdue / 1000).toFixed(0) : "0"}K
                            </p>
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium text-slate-700 dark:text-slate-300">Progreso de Cobranza</span>
                            <span className="font-bold text-slate-900 dark:text-slate-100">
                              {porcentajeCobrado.toFixed(1)}%
                            </span>
                          </div>
                          <Progress value={porcentajeCobrado} className="h-3" />
                        </div>

                        {proyecto.nextDue !== undefined && proyecto.nextDue > 0 && (
                          <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Próximo vencimiento:</span>
                            <span className="font-bold text-blue-600">S/ {(proyecto.nextDue / 1000).toFixed(0)}K</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </TabsContent>
  );
}
