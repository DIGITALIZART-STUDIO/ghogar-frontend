"use client";

import { Award, BarChart3, DollarSign, Star, Trophy, Users } from "lucide-react";
import {
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ManagerDashboard } from "@/app/(admin)/dashboard/_types/dashboard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Progress } from "@/components/ui/progress";
import { TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { EmptyState } from "../../EmptyState";

interface TeamTabsContentProps {
  data: ManagerDashboard;
  isLoading: boolean;
}

export function TeamTabsContent({ data, isLoading }: TeamTabsContentProps) {
  // Procesar y ordenar datos del equipo por conversión
  const processedTeamData = data.salesTeamPerformance
    ? [...data.salesTeamPerformance]
        .sort((a, b) => (b.conversionRate ?? 0) - (a.conversionRate ?? 0))
        .slice(0, 10)
        .map((advisor, index) => ({
          ...advisor,
          rank: index + 1,
          totalActions:
            (advisor.leadsAssigned ?? 0) + (advisor.quotationsIssued ?? 0) + (advisor.reservationsGenerated ?? 0),
        }))
    : [];

  const hasTeamData = processedTeamData.length > 0;

  return (
    <TabsContent value="team" className="space-y-8">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <LoadingSpinner size="lg" text="Cargando datos del equipo..." />
        </div>
      ) : (
        <>
          {/* Gráfico principal con diseño único */}
          <Card>
            <CardHeader className="relative">
              <CardTitle>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-slate-500/8 to-stone-500/8">
                      <BarChart3 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <span className="text-xl font-semibold tracking-tight">Análisis Comparativo</span>
                      <CardDescription className="mt-1">
                        Rendimiento y conversión por asesor del equipo de ventas.
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-300">
                    Mejores {processedTeamData.length}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="overflow-visible max-h-[800px] h-full">
              {!hasTeamData ? (
                <EmptyState
                  icon={Users}
                  title="Sin registros de asesores"
                  description="No hay datos disponibles del equipo para mostrar en el análisis comparativo"
                />
              ) : (
                <ResponsiveContainer height={450}>
                  <ComposedChart
                    data={processedTeamData}
                    layout="vertical"
                    margin={{ right: 40, left: 0, top: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="2 4" stroke="#e2e8f0" opacity={0.3} vertical={false} />

                    <XAxis
                      type="number"
                      fontSize={12}
                      fontWeight={500}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#64748b" }}
                      domain={[0, 100]}
                    />

                    <YAxis
                      type="category"
                      dataKey="advisorName"
                      width={130}
                      fontSize={13}
                      fontWeight={700}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#475569" }}
                    />

                    {/* Línea de referencia en 100% */}
                    <ReferenceLine
                      x={100}
                      stroke="#059669"
                      strokeDasharray="4 2"
                      label={{
                        value: "Meta 100%",
                        position: "top",
                        fill: "#059669",
                        fontWeight: 700,
                        fontSize: 13,
                      }}
                    />

                    <Tooltip
                      content={({ active, label }) => {
                        if (active && label) {
                          const advisor = processedTeamData.find((a) => a.advisorName === label);
                          return (
                            <div className="bg-white/96 border border-slate-300 rounded-xl p-5 min-w-[280px] shadow-lg dark:bg-slate-800/96 dark:border-slate-600">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                                  {advisor?.rank}
                                </div>
                                <div>
                                  <h4 className="font-bold text-base text-foreground">{label}</h4>
                                  <p className="text-xs text-muted-foreground">Asesor de Ventas</p>
                                  {(advisor?.conversionRate ?? 0) === 100 && (
                                    <span className="inline-block mt-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-xs font-semibold border border-emerald-300">
                                      ¡Meta alcanzada!
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-3 mb-3">
                                <div className="text-center p-2 bg-slate-50 rounded-lg dark:bg-slate-700">
                                  <p className="text-xs font-medium text-muted-foreground">Oportunidades Asignadas</p>
                                  <p className="text-lg font-bold text-slate-700 dark:text-slate-200">
                                    {advisor?.leadsAssigned ?? 0}
                                  </p>
                                </div>
                                <div className="text-center p-2 bg-slate-50 rounded-lg dark:bg-slate-700">
                                  <p className="text-xs font-medium text-muted-foreground">Oportunidades Completadas</p>
                                  <p className="text-lg font-bold text-slate-700 dark:text-slate-200">
                                    {advisor?.leadsCompleted ?? 0}
                                  </p>
                                </div>
                                <div className="text-center p-2 bg-slate-50 rounded-lg dark:bg-slate-700">
                                  <p className="text-xs font-medium text-muted-foreground">Cotizaciones</p>
                                  <p className="text-lg font-bold text-slate-700 dark:text-slate-200">
                                    {advisor?.quotationsIssued ?? 0}
                                  </p>
                                </div>
                                <div className="text-center p-2 bg-slate-50 rounded-lg dark:bg-slate-700">
                                  <p className="text-xs font-medium text-muted-foreground">Reservaciones</p>
                                  <p className="text-lg font-bold text-slate-700 dark:text-slate-200">
                                    {advisor?.reservationsGenerated ?? 0}
                                  </p>
                                </div>
                              </div>
                              <div className="pt-3 border-t border-slate-200 dark:border-slate-600">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium text-muted-foreground">Tasa de Conversión</span>
                                  <span className="text-lg font-bold text-slate-700 dark:text-slate-300">
                                    {(advisor?.conversionRate ?? 0).toFixed(1)}%
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-muted-foreground">Ingresos</span>
                                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                                    ${((advisor?.reservationAmount ?? 0) / 1000).toFixed(0)}K
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="conversionRate"
                      name="Eficiencia"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={({ cx, cy, value, index }) => (
                        <circle
                          key={`dot-${cx}-${cy}-${value}-${index}`}
                          cx={cx}
                          cy={cy}
                          r={value === 100 ? 7 : 3}
                          fill={value === 100 ? "#059669" : "#10b981"}
                          stroke="#059669"
                          strokeWidth={value === 100 ? 2 : 1}
                        />
                      )}
                      activeDot={{ r: 7, stroke: "#059669", strokeWidth: 2 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Lista detallada con diseño único */}
          <Card>
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-slate-500/8 to-stone-500/8">
                  <Award className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </div>
                <div>
                  <span className="text-xl font-semibold tracking-tight">Detalles del Ranking</span>
                  <CardDescription className="mt-1">
                    <CardDescription>Métricas completas de cada asesor del equipo</CardDescription>
                  </CardDescription>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent>
              {!hasTeamData ? (
                <EmptyState
                  icon={Award}
                  title="Sin registros de asesores"
                  description="No hay datos disponibles del equipo para mostrar en el ranking"
                />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {processedTeamData.map((advisor, index) => {
                    const isTopThree = index < 3;

                    return (
                      <div
                        key={advisor.advisorId}
                        className={cn(
                          "p-4 rounded-xl border transition-all duration-200 hover:shadow-sm",
                          isTopThree
                            ? index === 0
                              ? "bg-gradient-to-br from-amber-50/80 to-yellow-50/60 border-amber-200/60 dark:from-amber-900/20 dark:to-yellow-900/10 dark:border-amber-700/30"
                              : index === 1
                                ? "bg-gradient-to-br from-slate-100/80 to-gray-100/60 border-slate-300/60 dark:from-slate-800/40 dark:to-gray-800/20 dark:border-slate-600/40"
                                : "bg-gradient-to-br from-orange-50/80 to-amber-50/60 border-orange-200/60 dark:from-orange-900/20 dark:to-amber-900/10 dark:border-orange-700/30"
                            : "bg-slate-50/60 border-slate-200/80 hover:border-slate-300 dark:bg-slate-800/40 dark:border-slate-700/60"
                        )}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            {/* Ranking badge más sutil */}
                            <div
                              className={cn(
                                "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold border",
                                advisor.rank === 1
                                  ? "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400"
                                  : advisor.rank === 2
                                    ? "bg-slate-200 text-slate-800 border-slate-400 dark:bg-slate-700 dark:text-slate-300"
                                    : advisor.rank === 3
                                      ? "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-400"
                                      : "bg-stone-100 text-stone-700 border-stone-300 dark:bg-stone-800 dark:text-stone-300"
                              )}
                            >
                              {advisor.rank <= 3 ? <Trophy className="w-3 h-3" /> : <span>{advisor.rank}</span>}
                            </div>

                            {/* Avatar más pequeño */}
                            <div className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                              {(advisor.advisorName ?? "")
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2)}
                            </div>
                          </div>

                          {/* Badge de conversión más sutil */}
                          <Badge
                            className={cn(
                              "text-xs font-medium px-2 py-1",
                              (advisor.conversionRate ?? 0) >= 80
                                ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400"
                                : (advisor.conversionRate ?? 0) >= 60
                                  ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400"
                                  : (advisor.conversionRate ?? 0) >= 40
                                    ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400"
                                    : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400"
                            )}
                            variant="outline"
                          >
                            {(advisor.conversionRate ?? 0).toFixed(1)}%
                          </Badge>
                        </div>

                        {/* Info del asesor */}
                        <div className="mb-3">
                          <p className="font-semibold text-sm text-foreground truncate">{advisor.advisorName}</p>
                          <p className="text-xs text-muted-foreground">Asesor de Ventas</p>
                        </div>

                        {/* Métricas compactas */}
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="text-center p-2 bg-white/60 rounded-lg border border-slate-200/60 dark:bg-slate-900/40 dark:border-slate-700/60">
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                              {advisor.leadsAssigned ?? 0}
                            </p>
                            <p className="text-xs text-muted-foreground">Asignadas</p>
                          </div>
                          <div className="text-center p-2 bg-white/60 rounded-lg border border-slate-200/60 dark:bg-slate-900/40 dark:border-slate-700/60">
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                              {advisor.leadsCompleted ?? 0}
                            </p>
                            <p className="text-xs text-muted-foreground">Completadas</p>
                          </div>
                          <div className="text-center p-2 bg-white/60 rounded-lg border border-slate-200/60 dark:bg-slate-900/40 dark:border-slate-700/60">
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                              {advisor.quotationsIssued ?? 0}
                            </p>
                            <p className="text-xs text-muted-foreground">Cotizaciones</p>
                          </div>
                          <div className="text-center p-2 bg-slate-100/80 rounded-lg border border-slate-300/60 dark:bg-slate-800/60 dark:border-slate-600/60">
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                              {advisor.reservationsGenerated ?? 0}
                            </p>
                            <p className="text-xs text-muted-foreground">Reservaciones</p>
                          </div>
                        </div>

                        {/* Ingresos */}
                        <div className="mb-3 p-2 bg-emerald-50/60 rounded-lg border border-emerald-200/60 dark:bg-emerald-900/20 dark:border-emerald-700/30">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              Ingresos
                            </span>
                            <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                              ${((advisor.reservationAmount ?? 0) / 1000).toFixed(0)}K
                            </span>
                          </div>
                        </div>

                        {/* Barra de progreso más sutil */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="font-medium text-muted-foreground flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              Conversión
                            </span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              {(advisor.conversionRate ?? 0).toFixed(1)}%
                            </span>
                          </div>
                          <Progress value={advisor.conversionRate ?? 0} className="h-1.5" />
                        </div>

                        {/* Tiempo de respuesta */}
                        <div className="mt-2 text-center text-xs text-muted-foreground">
                          Respuesta: {(advisor.avgResponseTime ?? 0).toFixed(1)}h
                        </div>
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
