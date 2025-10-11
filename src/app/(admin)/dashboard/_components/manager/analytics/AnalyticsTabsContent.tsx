import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import type { ManagerDashboard } from "@/app/(admin)/dashboard/_types/dashboard";

interface AnalyticsTabsContentProps {
    data: ManagerDashboard;
    isLoading: boolean;
}

export function AnalyticsTabsContent({ data, isLoading }: AnalyticsTabsContentProps) {
    if (isLoading) {
        return (
            <TabsContent value="analytics" className="space-y-6">
                <div className="text-center py-12">
                    <p className="text-slate-600 dark:text-slate-400">Cargando analytics...</p>
                </div>
            </TabsContent>
        );
    }

    return (
        <TabsContent value="analytics" className="space-y-6">
            {/* Análisis de fuentes de captación */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
                        <Activity className="w-5 h-5 text-primary" />
                        Análisis por Fuente de Captación
                    </CardTitle>
                    <CardDescription>Rendimiento y ROI por canal</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                        <ComposedChart data={data.leadSourceAnalysis ?? []}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                            <XAxis dataKey="source" className="text-slate-600 dark:text-slate-400" />
                            <YAxis yAxisId="left" className="text-slate-600 dark:text-slate-400" />
                            <YAxis yAxisId="right" orientation="right" className="text-slate-600 dark:text-slate-400" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--card))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "0.5rem",
                                }}
                            />
                            <Bar yAxisId="left" dataKey="totalLeads" fill="hsl(var(--slate-400))" name="Total Leads" />
                            <Bar yAxisId="left" dataKey="convertedLeads" fill="hsl(var(--green-600))" name="Convertidos" />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="conversionRate"
                                stroke="hsl(var(--primary))"
                                strokeWidth={3}
                                name="Conversión %"
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Detalles por fuente */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(data.leadSourceAnalysis ?? []).map((source, index) => (
                    <Card key={index} className="border-l-4 border-l-primary">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-slate-800 dark:text-slate-100">
                                {source.source}
                            </CardTitle>
                            <CardDescription>Fuente de captación</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="text-center p-2 bg-slate-50 dark:bg-slate-900/30 rounded">
                                    <p className="font-bold text-slate-800 dark:text-slate-100">{source.totalLeads}</p>
                                    <p className="text-slate-600 dark:text-slate-400">Leads</p>
                                </div>
                                <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                                    <p className="font-bold text-slate-800 dark:text-slate-100">
                                        {source.convertedLeads}
                                    </p>
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
                                            ? "bg-green-600 hover:bg-green-700"
                                            : (source.conversionRate ?? 0) > 10
                                                ? "bg-primary hover:bg-primary/90"
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

            {/* Métricas de tiempo */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
                        <Clock className="w-5 h-5 text-primary" />
                        Métricas de Tiempo
                    </CardTitle>
                    <CardDescription>Tiempos promedio de gestión</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="text-center p-4 bg-slate-50 dark:bg-slate-900/30 rounded-lg">
                            <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                                {(data.timeMetrics?.avgLeadToQuotation ?? 0).toFixed(1)}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Días Lead → Cotización</p>
                        </div>
                        <div className="text-center p-4 bg-primary/10 dark:bg-primary/20 rounded-lg">
                            <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                                {(data.timeMetrics?.avgQuotationToReservation ?? 0).toFixed(1)}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Días Cotización → Reservación</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                                {(data.timeMetrics?.avgLeadToReservation ?? 0).toFixed(1)}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Días Lead → Reservación</p>
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

            {/* Top Performers */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Top Performers
                    </CardTitle>
                    <CardDescription>Mejores resultados del período</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {(data.topPerformers ?? []).map((performer, index) => (
                            <Card key={index} className="border-l-4 border-l-green-600">
                                <CardContent className="p-6">
                                    <div className="mb-3">
                                        <Badge className="bg-green-600 hover:bg-green-700 text-white mb-2">
                                            {performer.category}
                                        </Badge>
                                        <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">
                                            {performer.name}
                                        </h3>
                                    </div>
                                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                        <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                                            {performer.metric === "revenue"
                                                ? `$${((performer.value ?? 0) / 1000).toFixed(0)}K`
                                                : (performer.value ?? 0).toFixed(1)}
                                        </p>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">{performer.metric}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    );
}
