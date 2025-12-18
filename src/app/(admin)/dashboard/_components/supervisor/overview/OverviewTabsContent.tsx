import { Activity, BarChart3, TrendingUp } from "lucide-react";
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { SupervisorDashboard } from "@/app/(admin)/dashboard/_types/dashboard";
import { LeadCaptureSource } from "@/app/(admin)/leads/_types/lead";
import { LeadCaptureSourceLabels, LeadStatusLabels } from "@/app/(admin)/leads/_utils/leads.utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Progress } from "@/components/ui/progress";
import { TabsContent } from "@/components/ui/tabs";
import { EmptyState } from "../../EmptyState";

interface OverviewTabsContentProps {
  data: SupervisorDashboard;
  isLoading: boolean;
}

const sourceColors: Record<LeadCaptureSource, string> = {
  [LeadCaptureSource.Company]: "#4f46e5",
  [LeadCaptureSource.PersonalFacebook]: "#2563eb",
  [LeadCaptureSource.RealEstateFair]: "#ea580c",
  [LeadCaptureSource.Institutional]: "#14b8a6",
  [LeadCaptureSource.Loyalty]: "#db2777",
};

export function OverviewTabsContent({ data, isLoading }: OverviewTabsContentProps) {
  const hasLeadSources = data?.leadSources && data.leadSources.length > 0;

  if (isLoading) {
    return (
      <TabsContent value="overview" className="space-y-6">
        <div className="flex flex-col items-center justify-center py-16">
          <LoadingSpinner size="lg" text="Cargando datos..." />
        </div>
      </TabsContent>
    );
  }

  // Función para obtener el color correcto del estado de lead
  const getStatusColor = (status: string) => {
    const statusKey = status as keyof typeof LeadStatusLabels;
    const statusConfig = LeadStatusLabels[statusKey];
    if (!statusConfig) {
      return "#64748b";
    }

    // Mapear colores de Tailwind a hex usando className
    const className = statusConfig.className;
    if (className.includes("amber-600")) {
      return "#f59e42";
    }
    if (className.includes("green-600")) {
      return "#16a34a";
    }
    if (className.includes("blue-600")) {
      return "#2563eb";
    }
    if (className.includes("emerald-600")) {
      return "#059669";
    }
    if (className.includes("red-600")) {
      return "#dc2626";
    }
    if (className.includes("gray-600")) {
      return "#52525b";
    }
    return "#64748b";
  };

  // Función para obtener el label correcto del estado de lead
  const getStatusLabel = (status: string) => {
    const statusKey = status as keyof typeof LeadStatusLabels;
    return LeadStatusLabels[statusKey]?.label || status;
  };

  // Función para obtener el label correcto de la fuente de captación
  const getSourceLabel = (source: string) => {
    const sourceKey = source as keyof typeof LeadCaptureSourceLabels;
    return LeadCaptureSourceLabels[sourceKey]?.label || source;
  };

  return (
    <TabsContent value="overview" className="space-y-6">
      {/* Distribución por fuente de captación y actividad semanal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
              <Activity className="w-5 h-5 text-primary" />
              Fuentes de Captación
            </CardTitle>
            <CardDescription>Distribución de leads por canal de origen</CardDescription>
          </CardHeader>
          <CardContent>
            {!hasLeadSources ? (
              <EmptyState
                icon={Activity}
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
                            fill={sourceColors[item.source as LeadCaptureSource] ?? "#64748b"}
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
                                  {getSourceLabel(data.source)}
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
                            {getSourceLabel(source.source as LeadCaptureSource)}
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
              <TrendingUp className="w-5 h-5 text-primary" />
              Embudo de Conversión
            </CardTitle>
            <CardDescription>Progresión de leads por etapa del proceso</CardDescription>
          </CardHeader>
          <CardContent>
            {!data.conversionFunnel || data.conversionFunnel.length === 0 ? (
              <EmptyState
                icon={TrendingUp}
                title="Sin datos de conversión"
                description="No hay información disponible sobre el embudo de conversión"
              />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={data.conversionFunnel ?? []} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                  <XAxis type="number" className="text-slate-600 dark:text-slate-400" />
                  <YAxis
                    dataKey="stage"
                    type="category"
                    className="text-slate-600 dark:text-slate-400"
                    tickFormatter={(value) => getStatusLabel(value)}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload[0]) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-lg dark:bg-slate-800 dark:border-slate-700">
                            <p className="font-semibold text-slate-800 dark:text-slate-200">
                              {getStatusLabel(data.stage)}
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
                  <Bar dataKey="count" name="Leads">
                    {(data.conversionFunnel ?? []).map((item, index) => (
                      <Cell key={`bar-${index}`} fill={getStatusColor(item.stage ?? "")} />
                    ))}
                  </Bar>
                  <Line dataKey="percentage" stroke="#16a34a" strokeWidth={2} name="%" />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actividad semanal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
            <BarChart3 className="w-5 h-5 text-primary" />
            Actividad Semanal
          </CardTitle>
          <CardDescription>Leads procesados en los últimos 7 días</CardDescription>
        </CardHeader>
        <CardContent>
          {!data.weeklyActivity || data.weeklyActivity.length === 0 ? (
            <EmptyState
              icon={BarChart3}
              title="Sin actividad semanal"
              description="No hay información disponible sobre la actividad de los últimos 7 días"
            />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={data.weeklyActivity ?? []}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                <XAxis dataKey="day" className="text-slate-600 dark:text-slate-400" />
                <YAxis className="text-slate-600 dark:text-slate-400" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Bar dataKey="newLeads" fill="#17949B" name="Nuevos" />
                <Bar dataKey="assigned" fill="#475569" name="Asignados" />
                <Bar dataKey="attended" fill="#334155" name="Atendidos" />
                <Bar dataKey="completed" fill="#16a34a" name="Completados" />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Métricas del equipo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-slate-500/8 to-stone-500/8">
                <Activity className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <h3 className="font-medium text-slate-800 dark:text-slate-100">Cotizaciones</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Generadas por el equipo</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              {data.teamMetrics?.quotationsGenerated ?? 0}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-600">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/8 to-emerald-500/8">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-medium text-slate-800 dark:text-slate-100">Reservaciones</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Activas actualmente</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              {data.teamMetrics?.reservationsActive ?? 0}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-slate-600">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-slate-500/8 to-stone-500/8">
                <BarChart3 className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <h3 className="font-medium text-slate-800 dark:text-slate-100">Tareas Hoy</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Programadas para hoy</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              {data.teamMetrics?.tasksToday ?? 0}
            </div>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
}
