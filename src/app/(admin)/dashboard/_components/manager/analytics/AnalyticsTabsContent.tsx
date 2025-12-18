import { Activity, Clock, TrendingUp } from "lucide-react";
import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { ManagerDashboard } from "@/app/(admin)/dashboard/_types/dashboard";
import { LeadCaptureSource } from "@/app/(admin)/leads/_types/lead";
import { LeadCaptureSourceLabels } from "@/app/(admin)/leads/_utils/leads.utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TabsContent } from "@/components/ui/tabs";
import { EmptyState } from "../../EmptyState";

interface AnalyticsTabsContentProps {
  data: ManagerDashboard;
  isLoading: boolean;
}

export function AnalyticsTabsContent({ data, isLoading }: AnalyticsTabsContentProps) {
  if (isLoading) {
    return (
      <TabsContent value="analytics" className="space-y-6">
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-400">Cargando análisis...</p>
        </div>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="analytics" className="space-y-6">
      {/* Análisis de fuentes de captación */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-slate-500/8 to-stone-500/8">
              <Activity className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-200">
                Análisis por Fuente de Captación
              </CardTitle>
              <CardDescription>Rendimiento y ROI por canal de captación</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!data.leadSourceAnalysis || data.leadSourceAnalysis.length === 0 ? (
            <EmptyState
              icon={Activity}
              title="Sin datos de fuentes"
              description="No hay información disponible sobre las fuentes de captación"
            />
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <ComposedChart data={data.leadSourceAnalysis ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                <XAxis
                  dataKey="source"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => {
                    // Intentar obtener el label en español de la fuente
                    if (Object.values(LeadCaptureSource).includes(value as LeadCaptureSource)) {
                      return LeadCaptureSourceLabels[value as LeadCaptureSource]?.label ?? value;
                    }
                    return value;
                  }}
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
                      // Intentar obtener el label en español de la fuente
                      const sourceLabel = Object.values(LeadCaptureSource).includes(label as LeadCaptureSource)
                        ? (LeadCaptureSourceLabels[label as LeadCaptureSource]?.label ?? label)
                        : label;
                      return (
                        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                          <p className="font-medium mb-2">{sourceLabel}</p>
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
                <Bar
                  yAxisId="left"
                  dataKey="totalLeads"
                  fill="#facc15"
                  name="Total Oportunidades"
                  radius={[4, 4, 0, 0]}
                  opacity={0.95}
                />
                <Bar
                  yAxisId="left"
                  dataKey="convertedLeads"
                  fill="#10b981"
                  name="Convertidos"
                  radius={[4, 4, 0, 0]}
                  opacity={0.95}
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

      {/* Detalles por fuente */}
      {!data.leadSourceAnalysis || data.leadSourceAnalysis.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <EmptyState
              icon={Activity}
              title="Sin fuentes de captación"
              description="No hay información disponible sobre las fuentes de captación"
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(data.leadSourceAnalysis ?? []).map((source, index) => (
            <Card key={index} className="border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-800 dark:text-slate-100">
                  {Object.values(LeadCaptureSource).includes(source.source as LeadCaptureSource)
                    ? (LeadCaptureSourceLabels[source.source as LeadCaptureSource]?.label ?? source.source)
                    : source.source}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-center p-2 bg-slate-50 dark:bg-slate-900/30 rounded">
                    <p className="font-bold text-slate-800 dark:text-slate-100">{source.totalLeads}</p>
                    <p className="text-slate-600 dark:text-slate-400">Oportunidades</p>
                  </div>
                  <div className="text-center p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded">
                    <p className="font-bold text-slate-800 dark:text-slate-100">{source.convertedLeads}</p>
                    <p className="text-slate-600 dark:text-slate-400">Convertidos</p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 dark:text-slate-400">Tasa de Conversión</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-100">
                      {(source.conversionRate ?? 0).toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={source.conversionRate ?? 0} className="h-2" />
                </div>
                <div className="text-center">
                  <Badge
                    className={`${
                      (source.conversionRate ?? 0) > 15
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : (source.conversionRate ?? 0) > 10
                          ? "bg-amber-500 hover:bg-amber-600"
                          : "bg-orange-500 hover:bg-orange-600"
                    } text-white`}
                  >
                    {(source.conversionRate ?? 0) > 15
                      ? "Excelente"
                      : (source.conversionRate ?? 0) > 10
                        ? "Bueno"
                        : "Regular"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Métricas de tiempo */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-slate-500/8 to-stone-500/8">
              <Clock className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-200">Métricas de Tiempo</CardTitle>
              <CardDescription>Tiempos promedio de gestión del proceso</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-slate-50 dark:bg-slate-900/30 rounded-lg">
              <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                {(data.timeMetrics?.avgLeadToQuotation ?? 0).toFixed(1)}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Días Oportunidad → Cotización</p>
            </div>
            <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                {(data.timeMetrics?.avgQuotationToReservation ?? 0).toFixed(1)}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Días Cotización → Reservación</p>
            </div>
            <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                {(data.timeMetrics?.avgLeadToReservation ?? 0).toFixed(1)}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Días Oportunidad → Reservación</p>
            </div>
            <div className="text-center p-4 bg-slate-100 dark:bg-slate-800/30 rounded-lg">
              <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                {(data.timeMetrics?.avgResponseTime ?? 0).toFixed(1)}h
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Tiempo de Respuesta</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mejores Resultados */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-slate-500/8 to-stone-500/8">
              <TrendingUp className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-200">Mejores Resultados</CardTitle>
              <CardDescription>Mejores resultados del período</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!data.topPerformers || data.topPerformers.length === 0 ? (
            <EmptyState
              icon={TrendingUp}
              title="Sin datos de resultados"
              description="No hay información disponible sobre los mejores resultados"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(data.topPerformers ?? []).map((performer, index) => (
                <Card key={index} className="border-l-4 border-l-emerald-500">
                  <CardContent className="p-6">
                    <div className="mb-3">
                      <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white mb-2">
                        {performer.category}
                      </Badge>
                      <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">{performer.name}</h3>
                    </div>
                    <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                      <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                        {performer.metric === "revenue"
                          ? `$${((performer.value ?? 0) / 1000).toFixed(0)}K`
                          : (performer.value ?? 0).toFixed(1)}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {performer.metric === "revenue"
                          ? "Ingresos"
                          : performer.metric === "conversion"
                            ? "Conversión"
                            : performer.metric === "leads"
                              ? "Oportunidades"
                              : performer.metric}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
