"use client";

import { BarChart3, DollarSign, PieChartIcon, Target, TrendingUp, Zap } from "lucide-react";
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ManagerDashboard } from "@/app/(admin)/dashboard/_types/dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Progress } from "@/components/ui/progress";
import { TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { EmptyState } from "../../EmptyState";

interface OverviewTabsContentProps {
  data: ManagerDashboard;
  isLoading: boolean;
}

export function OverviewTabsContent({ data, isLoading }: OverviewTabsContentProps) {
  if (isLoading) {
    return (
      <TabsContent value="overview" className="flex flex-col items-center justify-center py-16">
        <LoadingSpinner size="lg" text="Cargando datos del dashboard..." />
      </TabsContent>
    );
  }

  const hasPipelineData =
    data.salesPipeline &&
    ((data.salesPipeline?.newLeads ?? 0) > 0 ||
      (data.salesPipeline?.inContact ?? 0) > 0 ||
      (data.salesPipeline?.quotationStage ?? 0) > 0 ||
      (data.salesPipeline?.negotiationStage ?? 0) > 0 ||
      (data.salesPipeline?.reservationStage ?? 0) > 0);

  const hasQuotationData =
    data.quotationAnalysis &&
    ((data.quotationAnalysis?.pending ?? 0) > 0 ||
      (data.quotationAnalysis?.accepted ?? 0) > 0 ||
      (data.quotationAnalysis?.rejected ?? 0) > 0);

  const hasTrendData = data.monthlyTrends && data.monthlyTrends.length > 0;

  // Preparar datos del pipeline para el gráfico - usando los mismos colores del admin
  const pipelineData = [
    {
      name: "Nuevos",
      value: data.salesPipeline?.newLeads ?? 0,
      fill: "#6b7280", // gray-500
    },
    {
      name: "En Contacto",
      value: data.salesPipeline?.inContact ?? 0,
      fill: "#3b82f6", // blue-500
    },
    {
      name: "Cotización",
      value: data.salesPipeline?.quotationStage ?? 0,
      fill: "#f59e42", // amber-500
    },
    {
      name: "Negociación",
      value: data.salesPipeline?.negotiationStage ?? 0,
      fill: "#3b82f6", // blue-500
    },
    {
      name: "Reservación",
      value: data.salesPipeline?.reservationStage ?? 0,
      fill: "#10b981", // emerald-500
    },
  ].filter((item) => item.value > 0);

  // Preparar datos de cotizaciones - usando los mismos colores del admin
  const quotationData = [
    {
      name: "Pendientes",
      value: data.quotationAnalysis?.pending ?? 0,
      fill: "#f59e42", // amber-500
    },
    {
      name: "Aceptadas",
      value: data.quotationAnalysis?.accepted ?? 0,
      fill: "#10b981", // emerald-500
    },
    {
      name: "Rechazadas",
      value: data.quotationAnalysis?.rejected ?? 0,
      fill: "#ef4444", // red-500
    },
  ].filter((item) => item.value > 0);

  const totalPipeline = pipelineData.reduce((sum, item) => sum + item.value, 0);
  const totalQuotations = quotationData.reduce((sum, item) => sum + item.value, 0);

  return (
    <TabsContent value="overview" className="space-y-8">
      {/* Secciรณn principal de grรกficos */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Pipeline de Ventas - Ocupa 2 columnas */}
        <Card className={cn("xl:col-span-2 relative overflow-hidden")}>
          <CardHeader className="relative pb-4">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-slate-500/8 to-stone-500/8">
                <PieChartIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <span className="text-xl font-semibold tracking-tight">Pipeline de Ventas</span>
                <CardDescription className="mt-1">Distribuciรณn actual del embudo comercial</CardDescription>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative max-h-[800px] h-full">
            {!hasPipelineData ? (
              <EmptyState
                icon={PieChartIcon}
                title="Sin datos del pipeline"
                description="No hay informaciรณn disponible sobre el embudo de ventas"
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <div className="relative min-h-[300px]">
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={pipelineData}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={110}
                        paddingAngle={pipelineData.length > 1 ? 2 : 0}
                        dataKey="value"
                        stroke="none"
                      >
                        {pipelineData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.fill}
                            className="hover:opacity-80 transition-opacity"
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload[0]) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                                <div className="flex items-center gap-2 mb-1">
                                  <span
                                    className="w-3 h-3 rounded-full inline-block"
                                    style={{ backgroundColor: data.fill }}
                                  />
                                  <p className="font-medium m-0">{data.name}</p>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {data.value} oportunidades ({((data.value / totalPipeline) * 100).toFixed(1)}%)
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>

                  {/* Centro del donut */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{totalPipeline}</div>
                      <div className="text-sm text-muted-foreground">Total oportunidades</div>
                    </div>
                  </div>
                </div>

                {/* Leyenda mejorada */}
                <div className="space-y-4">
                  <h4 className="font-medium text-slate-900 dark:text-slate-100">Desglose por etapa</h4>
                  <div className="space-y-3">
                    {pipelineData.map((item, index) => {
                      const percentage = totalPipeline > 0 ? ((item.value / totalPipeline) * 100).toFixed(1) : "0";
                      return (
                        <div
                          key={`legend-${index}`}
                          className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50 dark:bg-slate-800/50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.fill }} />
                            <span className="font-medium text-sm">{item.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-sm">{item.value}</div>
                            <div className="text-xs text-muted-foreground">{percentage}%</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mรฉtricas rรกpidas */}
        <div className="space-y-4">
          <Card className={cn("relative overflow-hidden")}>
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <Target className="w-5 h-5" />
                Conversión
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-xl font-bold mb-2">
                {data.kpis?.conversionRate ? data.kpis.conversionRate.toFixed(1) : "0.0"}%
              </div>
              <Progress value={data.kpis?.conversionRate ?? 0} className="h-2 mb-2" />
            </CardContent>
          </Card>

          <Card className={cn("relative overflow-hidden")}>
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2 text-teal-700 dark:text-teal-400">
                <DollarSign className="w-5 h-5" />
                Valor Promedio
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-xl font-bold mb-2">
                ${((data.quotationAnalysis?.avgQuotationAmount ?? 0) / 1000).toFixed(0)}K
              </div>
              <p className="text-xs text-muted-foreground">Por cotizaciรณn emitida</p>
            </CardContent>
          </Card>

          <Card className={cn("relative overflow-hidden")}>
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
                <Zap className="w-5 h-5" />
                Eficiencia
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-xl font-bold mb-2">
                {data.quotationAnalysis && data.quotationAnalysis.accepted && data.quotationAnalysis.accepted > 0
                  ? Math.round(
                      ((data.quotationAnalysis.accepted ?? 0) /
                        Math.max(1, (data.quotationAnalysis.pending ?? 0) + (data.quotationAnalysis.accepted ?? 0))) *
                        100
                    )
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">Tasa de aceptaciรณn</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Anรกlisis de Cotizaciones */}
      <Card className={cn("relative overflow-hidden")}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-stone-500/3" />
        <CardHeader className="relative pb-4">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-stone-500/8 to-slate-500/8">
              <BarChart3 className="w-5 h-5 text-stone-600 dark:text-stone-400" />
            </div>
            <div>
              <span className="text-xl font-semibold tracking-tight">Anรกlisis de Cotizaciones</span>
              <CardDescription className="mt-1">Estado y distribuciรณn de cotizaciones</CardDescription>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative max-h-[800px] h-full">
          {!hasQuotationData ? (
            <EmptyState icon={BarChart3} title="Sin cotizaciones" description="No hay cotizaciones para analizar" />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div className="relative min-h-[300px]">
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={quotationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={110}
                      paddingAngle={quotationData.length > 1 ? 2 : 0}
                      dataKey="value"
                      stroke="none"
                    >
                      {quotationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} className="hover:opacity-80 transition-opacity" />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload[0]) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <span
                                  className="w-3 h-3 rounded-full inline-block"
                                  style={{ backgroundColor: data.fill }}
                                />
                                <p className="font-medium m-0">{data.name}</p>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {data.value} cotizaciones ({((data.value / totalQuotations) * 100).toFixed(1)}%)
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>

                {/* Centro del donut */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{totalQuotations}</div>
                    <div className="text-sm text-muted-foreground">Total cotizaciones</div>
                  </div>
                </div>
              </div>

              {/* Leyenda mejorada */}
              <div className="space-y-4">
                <h4 className="font-medium text-slate-900 dark:text-slate-100">Desglose por estado</h4>
                <div className="space-y-3">
                  {quotationData.map((item, index) => {
                    const percentage = totalQuotations > 0 ? ((item.value / totalQuotations) * 100).toFixed(1) : "0";
                    return (
                      <div
                        key={`legend-${index}`}
                        className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50 dark:bg-slate-800/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.fill }} />
                          <span className="font-medium text-sm">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-sm">{item.value}</div>
                          <div className="text-xs text-muted-foreground">{percentage}%</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tendencia mensual */}
      <Card className={cn("relative overflow-hidden")}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-stone-500/3" />
        <CardHeader className="relative pb-4">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-stone-500/8 to-slate-500/8">
              <TrendingUp className="w-5 h-5 text-stone-600 dark:text-stone-400" />
            </div>
            <div>
              <span className="text-xl font-semibold tracking-tight">Tendencia de Conversiรณn</span>
              <CardDescription className="mt-1">Evoluciรณn mensual de oportunidades a reservaciones</CardDescription>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative max-h-[800px] h-full">
          {!hasTrendData ? (
            <EmptyState
              icon={BarChart3}
              title="Sin datos de rendimiento"
              description="No hay informaciรณn disponible sobre el rendimiento mensual"
            />
          ) : (
            <ResponsiveContainer height={450}>
              <ComposedChart data={data.monthlyTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
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
                <Bar dataKey="leadsReceived" fill="#facc15" name="Oportunidades" radius={[4, 4, 0, 0]} opacity={0.95} />
                <Bar
                  dataKey="quotationsIssued"
                  fill="#fb923c"
                  name="Cotizaciones"
                  radius={[4, 4, 0, 0]}
                  opacity={0.95}
                />
                <Line
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

      {/* Mรฉtricas financieras */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <span className="font-medium text-slate-800 dark:text-slate-100">Valor Total Reservado</span>
            </div>
            <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              ${((data.kpis?.totalReservationAmount ?? 0) / 1000).toFixed(0)}K
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">En reservaciones activas</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-6 h-6 text-primary" />
              <span className="font-medium text-slate-800 dark:text-slate-100">Valor Promedio Cotizaciรณn</span>
            </div>
            <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              ${((data.quotationAnalysis?.avgQuotationAmount ?? 0) / 1000).toFixed(0)}K
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Por cotizaciรณn emitida</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-slate-600">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              <span className="font-medium text-slate-800 dark:text-slate-100">Valor Promedio Reservaciรณn</span>
            </div>
            <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              ${((data.reservationAnalysis?.avgReservationAmount ?? 0) / 1000).toFixed(0)}K
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Por reservaciรณn</p>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
}
