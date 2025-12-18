"use client";

import { Activity, AlertTriangle, Target, TrendingDown, TrendingUp, Zap } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { LeadStatusLabels } from "@/app/(admin)/assignments/_utils/assignments.utils";
import { LeadCaptureSource } from "@/app/(admin)/leads/_types/lead";
import { LeadCaptureSourceLabels } from "@/app/(admin)/leads/_utils/leads.utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Progress } from "@/components/ui/progress";
import { TabsContent } from "@/components/ui/tabs";
import type { AdminDashboard } from "../../../_types/dashboard";
import { EmptyState } from "../../EmptyState";

interface LeadsTabsContentProps {
  data: AdminDashboard;
  isLoading: boolean;
}

const sourceColors: Record<LeadCaptureSource, string> = {
  [LeadCaptureSource.Company]: "#4f46e5",
  [LeadCaptureSource.PersonalFacebook]: "#2563eb",
  [LeadCaptureSource.RealEstateFair]: "#ea580c",
  [LeadCaptureSource.Institutional]: "#14b8a6",
  [LeadCaptureSource.Loyalty]: "#db2777",
};

export default function LeadsTabsContent({ data, isLoading }: LeadsTabsContentProps) {
  const hasLeadsByStatus = data?.leadsByStatus && data.leadsByStatus.length > 0;
  const hasLeadSources = data?.leadSources && data.leadSources.length > 0;

  // Calcular totales
  const totalLeadsByStatus = hasLeadsByStatus
    ? (data.leadsByStatus?.reduce((sum, item) => sum + (item.count ?? 0), 0) ?? 0)
    : 0;

  const conversionRate = data?.conversionRate ?? 0;

  return (
    <TabsContent value="leads" className="space-y-6">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <LoadingSpinner size="lg" text="Cargando datos de leads..." />
        </div>
      ) : (
        <>
          {/* Análisis principal sin gradientes */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
            {/* Estado de leads */}
            <Card className="xl:col-span-3">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-slate-500/8 to-stone-500/8">
                      <Activity className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-200">
                        Estado de las Leads
                      </CardTitle>
                      <CardDescription>Distribución actual de leads por estado</CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {totalLeadsByStatus} leads
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="max-h-[800px] h-full">
                {!hasLeadsByStatus ? (
                  <EmptyState
                    icon={Activity}
                    title="Sin datos de leads"
                    description="No hay información disponible sobre el estado de los leads"
                  />
                ) : (
                  <ResponsiveContainer height={"100%"}>
                    <BarChart data={data.leadsByStatus} margin={{ top: 20, right: 30, left: 20 }} barCategoryGap="20%">
                      <CartesianGrid strokeDasharray="2 4" stroke="#e2e8f0" opacity={0.4} vertical={false} />

                      <XAxis
                        dataKey="status"
                        fontSize={12}
                        fontWeight={600}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "#64748b" }}
                        height={80}
                        tickFormatter={(status: keyof typeof LeadStatusLabels) =>
                          LeadStatusLabels[status]?.label ?? status
                        }
                      />

                      <YAxis
                        fontSize={12}
                        fontWeight={600}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "#64748b" }}
                      />

                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload[0]) {
                            const data = payload[0].payload as { status: keyof typeof LeadStatusLabels; count: number };
                            return (
                              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg dark:bg-slate-800 dark:border-slate-700">
                                <p className="font-semibold text-slate-800 dark:text-slate-200">
                                  {LeadStatusLabels[data.status]?.label ?? data.status}
                                </p>
                                <p className="text-2xl font-bold text-slate-600 dark:text-slate-400">
                                  {data.count} leads
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{
                                      backgroundColor: (() => {
                                        switch (data.status) {
                                          case "Registered":
                                            return "#f59e42";
                                          case "Attended":
                                            return "#16a34a";
                                          case "InFollowUp":
                                            return "#2563eb";
                                          case "Completed":
                                            return "#059669";
                                          case "Canceled":
                                            return "#dc2626";
                                          case "Expired":
                                            return "#52525b";
                                          default:
                                            return "#64748b";
                                        }
                                      })(),
                                    }}
                                  />
                                  <span className="text-sm text-slate-600 dark:text-slate-400">
                                    {((data.count / totalLeadsByStatus) * 100).toFixed(1)}% del total
                                  </span>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />

                      <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={80}>
                        {(data.leadsByStatus ?? []).map((item, index) => {
                          let fill = "#64748b"; // default
                          switch (item.status) {
                            case "Registered":
                              fill = "#f59e42";
                              break;
                            case "Attended":
                              fill = "#16a34a";
                              break;
                            case "InFollowUp":
                              fill = "#2563eb";
                              break;
                            case "Completed":
                              fill = "#059669";
                              break;
                            case "Canceled":
                              fill = "#dc2626";
                              break;
                            case "Expired":
                              fill = "#52525b";
                              break;
                          }
                          return <Cell key={`bar-${index}`} fill={fill} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Fuentes de captación */}
            <Card className="xl:col-span-2">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-slate-500/8 to-stone-500/8">
                    <Target className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-200">
                      Fuentes de Captación
                    </CardTitle>
                    <CardDescription>Origen de los leads generados</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {!hasLeadSources ? (
                  <EmptyState
                    icon={Target}
                    title="Sin fuentes de leads"
                    description="No hay información sobre el origen de los leads"
                  />
                ) : (
                  <div className="space-y-4">
                    {/* Mini donut chart */}
                    <div className="relative">
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={data.leadSources}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="count"
                            stroke="none"
                          >
                            {(data.leadSources ?? []).map((item, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  item.source
                                    ? (sourceColors[item.source as LeadCaptureSource] ?? "#64748b")
                                    : "#64748b"
                                }
                                className="hover:opacity-80 transition-opacity"
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload[0]) {
                                const data = payload[0].payload;
                                return (
                                  <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-lg dark:bg-slate-800 dark:border-slate-700">
                                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                                      {LeadCaptureSourceLabels[data.source as LeadCaptureSource]?.label ?? data.source}
                                    </p>
                                    <p className="text-lg font-bold text-slate-600 dark:text-slate-400">
                                      {data.count} leads ({data.percentage}%)
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>

                      {/* Centro del donut */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                            {(data.leadSources ?? []).reduce((sum, item) => sum + (item.count ?? 0), 0)}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">Total leads</div>
                        </div>
                      </div>
                    </div>

                    {/* Lista detallada */}
                    {(data.leadSources ?? []).map((source, index) => {
                      let indicatorClassName = "";
                      switch (source.source) {
                        case "Company":
                          indicatorClassName = "bg-indigo-600";
                          break;
                        case "PersonalFacebook":
                          indicatorClassName = "bg-blue-600";
                          break;
                        case "RealEstateFair":
                          indicatorClassName = "bg-orange-600";
                          break;
                        case "Institutional":
                          indicatorClassName = "bg-teal-600";
                          break;
                        case "Loyalty":
                          indicatorClassName = "bg-pink-600";
                          break;
                        default:
                          indicatorClassName = "bg-slate-500";
                      }
                      return (
                        <div
                          key={index}
                          className="p-3 rounded-lg bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{
                                  backgroundColor: sourceColors[source.source as LeadCaptureSource] ?? "#64748b",
                                }}
                              />
                              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                {source.source
                                  ? (LeadCaptureSourceLabels[source.source as LeadCaptureSource]?.label ??
                                    source.source)
                                  : "Sin fuente"}
                              </span>
                            </div>
                            <Badge
                              variant="secondary"
                              className="bg-slate-200 text-slate-800 text-xs dark:bg-slate-700 dark:text-slate-300"
                            >
                              {source.percentage}%
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <Progress
                              value={source.percentage}
                              className="h-2 flex-1 mr-3"
                              indicatorClassName={indicatorClassName}
                            />
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{source.count}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Panel de alertas sin gradientes */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-orange-100 border border-orange-200 dark:bg-orange-900/30 dark:border-orange-800">
                  <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-200">
                    Centro de Alertas
                  </CardTitle>
                  <CardDescription>Acciones requeridas y oportunidades</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Alerta de leads expirados */}
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800/30">
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <span className="font-semibold text-red-800 dark:text-red-200">Leads Expirados</span>
                  </div>
                  <p className="text-2xl font-bold text-red-700 dark:text-red-300 mb-1">{data?.expiredLeads ?? 0}</p>
                  <p className="text-sm text-red-600 dark:text-red-400">Requieren seguimiento inmediato</p>
                </div>

                {/* Oportunidades activas */}
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/30">
                  <div className="flex items-center gap-3 mb-3">
                    <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-semibold text-blue-800 dark:text-blue-200">En Proceso</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-1">
                    {(data?.activeQuotations ?? 0) + (data?.pendingReservations ?? 0)}
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Cotizaciones + Reservaciones</p>
                </div>

                {/* Tasa de conversión */}
                <div className="p-4 rounded-xl bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800/30">
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="font-semibold text-green-800 dark:text-green-200">Conversión</span>
                  </div>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300 mb-1">{conversionRate}%</p>
                  <p className="text-sm text-green-600 dark:text-green-400">Tasa actual de cierre</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </TabsContent>
  );
}
