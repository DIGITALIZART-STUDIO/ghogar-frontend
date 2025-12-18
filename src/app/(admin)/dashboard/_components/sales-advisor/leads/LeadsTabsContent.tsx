import { AlertCircle, BarChart3, Clock, Eye, Mail, MapPin, Phone, TrendingUp, UserPlus, Users } from "lucide-react";
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

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { SalesAdvisorDashboard } from "../../../_types/dashboard";
import { LeadCaptureSourceLabels, LeadStatusLabels } from "../../../../leads/_utils/leads.utils";
import { EmptyState } from "../../EmptyState";

interface LeadsTabsContentProps {
  data: SalesAdvisorDashboard;
  isLoading: boolean;
}

export default function LeadsTabsContent({ data, isLoading }: LeadsTabsContentProps) {
  // Función para mapear los datos de fuentes de leads con las utilidades
  const getEnhancedLeadSources = () => {
    if (!data?.myLeadSources?.length) {
      return [];
    }

    // Mapeo de colores hex para el gráfico
    const colorMap: Record<string, string> = {
      "text-indigo-600": "#6366f1",
      "text-blue-600": "#3b82f6",
      "text-orange-600": "#f97316",
      "text-teal-600": "#14b8a6",
      "text-pink-600": "#ec4899",
    };

    return data.myLeadSources.map((source) => {
      const sourceKey = source.source as keyof typeof LeadCaptureSourceLabels;
      const sourceInfo = LeadCaptureSourceLabels[sourceKey];

      return {
        ...source,
        label: sourceInfo?.label || source.source,
        icon: sourceInfo?.icon,
        color: sourceInfo?.textColor ? colorMap[sourceInfo.textColor] || "#64748b" : source.color,
        bgColor: sourceInfo?.bgColor || "bg-slate-50",
        borderColor: sourceInfo?.borderColor || "border-slate-200",
        textColor: sourceInfo?.textColor || "text-slate-600",
      };
    });
  };

  const getPriorityBadge = (days: number | null) => {
    if (typeof days !== "number") {
      return "bg-gray-100 text-gray-500 border-gray-200";
    }
    if (days <= 2) {
      return "bg-red-100 text-red-500 border-red-200";
    }
    if (days <= 4) {
      return "bg-amber-100 text-amber-500 border-amber-200";
    }
    return "bg-emerald-100 text-emerald-500 border-emerald-200";
  };

  return (
    <TabsContent value="leads" className="space-y-6">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <LoadingSpinner size="lg" text="Cargando datos de leads..." />
        </div>
      ) : (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-slate-500/8 to-stone-500/8">
                  <Users className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-200">
                    Pipeline de Leads
                  </CardTitle>
                  <CardDescription>{data?.assignedLeads?.length ?? 0} leads bajo tu gestión activa</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {!data?.assignedLeads?.length ? (
                <EmptyState
                  icon={UserPlus}
                  title="No hay leads asignados"
                  description="Cuando tengas leads asignados, aparecerán aquí para su gestión"
                />
              ) : (
                <div className="space-y-4">
                  {data.assignedLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/50 dark:bg-slate-800/80 dark:border-slate-700/50 transition-colors duration-200"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 rounded-lg flex items-center justify-center text-primary font-medium text-sm">
                            {(lead.clientName ?? "")
                              .split(" ")
                              .filter((n) => n.length > 0)
                              .map((n) => n[0])
                              .join("")}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-4">
                              <h4 className="font-semibold text-base text-slate-800 dark:text-slate-200">
                                {lead.clientName}
                              </h4>
                              <Badge
                                className={`text-sm font-medium px-3 py-1 ${LeadStatusLabels[lead.status as keyof typeof LeadStatusLabels]?.className ?? "bg-slate-500 text-white"}`}
                              >
                                {LeadStatusLabels[lead.status as keyof typeof LeadStatusLabels]?.label ?? lead.status}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                              <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                                <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center dark:bg-blue-900/40">
                                  <Phone className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                  <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                                    Teléfono
                                  </p>
                                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    {lead.clientPhone}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                                <div className="w-6 h-6 rounded-md bg-green-100 flex items-center justify-center dark:bg-green-900/40">
                                  <Mail className="w-3 h-3 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                  <p className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wide">
                                    Email
                                  </p>
                                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    {lead.clientEmail ?? "No disponible"}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                                <div className="w-6 h-6 rounded-md bg-amber-100 flex items-center justify-center dark:bg-amber-900/40">
                                  <MapPin className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div>
                                  <p className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                                    Proyecto
                                  </p>
                                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    {lead.projectName}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm">
                              <Badge
                                variant="outline"
                                className={`text-sm font-medium px-3 py-1 ${LeadCaptureSourceLabels[lead.captureSource as keyof typeof LeadCaptureSourceLabels]?.className ?? "bg-slate-500 text-white"}`}
                              >
                                {LeadCaptureSourceLabels[lead.captureSource as keyof typeof LeadCaptureSourceLabels]
                                  ?.label ?? lead.captureSource}
                              </Badge>
                              {lead.lastContact && (
                                <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-lg">
                                  <Clock className="w-4 h-4" />
                                  Último: {new Date(lead.lastContact).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="flex items-center gap-2 mb-3">
                              {typeof lead.daysUntilExpiration === "number" && lead.daysUntilExpiration <= 2 && (
                                <AlertCircle className="w-5 h-5 text-red-500" />
                              )}
                              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                {lead.nextTask}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-sm font-medium px-3 py-1",
                                getPriorityBadge(lead.daysUntilExpiration ?? null)
                              )}
                            >
                              {typeof lead.daysUntilExpiration === "number"
                                ? `${lead.daysUntilExpiration} días restantes`
                                : "Sin fecha definida"}
                            </Badge>
                          </div>

                          <div className="flex gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-10 w-10 p-0 bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-600 hover:text-blue-700 dark:bg-blue-900/20 dark:border-blue-700 dark:hover:bg-blue-900/40"
                              onClick={() => window.open(`tel:${lead.clientPhone}`, "_blank")}
                            >
                              <Phone className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-10 w-10 p-0 bg-green-50 border-green-200 hover:bg-green-100 text-green-600 hover:text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:hover:bg-green-900/40"
                              onClick={() => window.open(`mailto:${lead.clientEmail}`, "_blank")}
                            >
                              <Mail className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-10 w-10 p-0 bg-amber-50 border-amber-200 hover:bg-amber-100 text-amber-600 hover:text-amber-700 dark:bg-amber-900/20 dark:border-amber-700 dark:hover:bg-amber-900/40"
                              onClick={() => (window.location.href = "/assignments")}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-slate-500/8 to-stone-500/8">
                    <BarChart3 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-200">
                      Distribución de Fuentes
                    </CardTitle>
                    <CardDescription>Origen de tus leads asignados</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {!data?.myLeadSources?.length ? (
                  <EmptyState
                    icon={BarChart3}
                    title="Sin datos de fuentes"
                    description="Los datos de distribución aparecerán cuando tengas leads asignados"
                  />
                ) : (
                  <div className="space-y-4">
                    <ResponsiveContainer width="100%" height={250}>
                      <RechartsPieChart>
                        <Pie
                          data={getEnhancedLeadSources()}
                          cx="50%"
                          cy="50%"
                          outerRadius={70}
                          innerRadius={30}
                          fill="#8884d8"
                          dataKey="count"
                          label={({ label, count }) => `${label}: ${count}`}
                          labelLine={false}
                        >
                          {getEnhancedLeadSources().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                          ))}
                        </Pie>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    {data.icon && (
                                      <div className={`p-1 rounded-md ${data.bgColor}`}>
                                        <data.icon className={`w-4 h-4 ${data.textColor}`} />
                                      </div>
                                    )}
                                    <p className="font-medium text-sm">{data.label}</p>
                                  </div>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Cantidad: <span className="font-semibold">{data.count}</span>
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>

                    {/* Leyenda mejorada */}
                    <div className="grid grid-cols-2 gap-2">
                      {getEnhancedLeadSources().map((source, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                        >
                          <div
                            className="w-3 h-3 rounded-full border-2 border-white"
                            style={{ backgroundColor: source.color }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{source.label}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{source.count} leads</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-slate-500/8 to-stone-500/8">
                    <TrendingUp className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-200">
                      Evolución Mensual
                    </CardTitle>
                    <CardDescription>Tu rendimiento en los últimos meses</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {!data?.monthlyPerformance?.length ? (
                  <EmptyState
                    icon={TrendingUp}
                    title="Sin datos de rendimiento"
                    description="Tu evolución mensual se mostrará aquí conforme generes actividad"
                  />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={data.monthlyPerformance}>
                      <CartesianGrid strokeDasharray="2 4" stroke="#e2e8f0" opacity={0.3} vertical={false} />
                      <XAxis
                        dataKey="month"
                        fontSize={12}
                        fontWeight={600}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "#64748b" }}
                      />
                      <YAxis
                        fontSize={12}
                        fontWeight={600}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "#64748b" }}
                      />
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
                      <Bar
                        dataKey="leadsAssigned"
                        fill="#3b82f6"
                        name="Asignados"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={60}
                      />
                      <Bar
                        dataKey="leadsCompleted"
                        fill="#10b981"
                        name="Completados"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={60}
                      />
                      <Bar
                        dataKey="quotations"
                        fill="#f59e0b"
                        name="Cotizaciones"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={60}
                      />
                      <Line
                        type="monotone"
                        dataKey="reservations"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        name="Reservaciones"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </TabsContent>
  );
}
