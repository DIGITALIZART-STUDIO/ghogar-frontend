import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, Target, Clock, DollarSign } from "lucide-react";
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

interface TeamTabsContentProps {
    data: ManagerDashboard;
    isLoading: boolean;
}

export function TeamTabsContent({ data, isLoading }: TeamTabsContentProps) {
    if (isLoading) {
        return (
            <TabsContent value="team" className="space-y-6">
                <div className="text-center py-12">
                    <p className="text-slate-600 dark:text-slate-400">Cargando equipo...</p>
                </div>
            </TabsContent>
        );
    }

    return (
        <TabsContent value="team" className="space-y-6">
            {/* Gráfico de rendimiento del equipo */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
                        <Users className="w-5 h-5 text-primary" />
                        Rendimiento del Equipo de Ventas
                    </CardTitle>
                    <CardDescription>Métricas de conversión y revenue por asesor</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                        <ComposedChart data={data.salesTeamPerformance ?? []}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                            <XAxis
                                dataKey="advisorName"
                                angle={-45}
                                textAnchor="end"
                                height={100}
                                className="text-slate-600 dark:text-slate-400"
                            />
                            <YAxis yAxisId="left" className="text-slate-600 dark:text-slate-400" />
                            <YAxis yAxisId="right" orientation="right" className="text-slate-600 dark:text-slate-400" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--card))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "0.5rem",
                                }}
                            />
                            <Bar yAxisId="left" dataKey="leadsAssigned" fill="hsl(var(--slate-400))" name="Asignados" />
                            <Bar yAxisId="left" dataKey="leadsCompleted" fill="hsl(var(--green-600))" name="Completados" />
                            <Bar yAxisId="left" dataKey="quotationsIssued" fill="hsl(var(--primary))" name="Cotizaciones" />
                            <Bar
                                yAxisId="left"
                                dataKey="reservationsGenerated"
                                fill="hsl(var(--slate-700))"
                                name="Reservaciones"
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="conversionRate"
                                stroke="hsl(var(--slate-800))"
                                strokeWidth={3}
                                name="Conversión %"
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Detalles individuales del equipo */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {(data.salesTeamPerformance ?? []).map((advisor) => (
                    <Card key={advisor.advisorId} className="border-l-4 border-l-slate-600">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">
                                        {advisor.advisorName}
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Asesor de Ventas</p>
                                </div>
                                <Badge
                                    className={`${
                                        (advisor.conversionRate ?? 0) > 20
                                            ? "bg-green-600 hover:bg-green-700"
                                            : (advisor.conversionRate ?? 0) > 15
                                                ? "bg-primary hover:bg-primary/90"
                                                : "bg-orange-500 hover:bg-orange-600"
                                    } text-white`}
                                >
                                    {(advisor.conversionRate ?? 0).toFixed(1)}%
                                </Badge>
                            </div>

                            {/* Métricas del asesor */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="text-center p-3 bg-slate-50 dark:bg-slate-900/30 rounded-lg">
                                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                                        {advisor.leadsAssigned}
                                    </p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">Asignados</p>
                                </div>
                                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                                        {advisor.leadsCompleted}
                                    </p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">Completados</p>
                                </div>
                                <div className="text-center p-3 bg-primary/10 dark:bg-primary/20 rounded-lg">
                                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                                        {advisor.quotationsIssued}
                                    </p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">Cotizaciones</p>
                                </div>
                                <div className="text-center p-3 bg-slate-100 dark:bg-slate-800/30 rounded-lg">
                                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                                        {advisor.reservationsGenerated}
                                    </p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">Reservaciones</p>
                                </div>
                            </div>

                            {/* Revenue generado */}
                            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Revenue Generado</span>
                                    <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                                </div>
                                <p className="text-xl font-bold text-slate-800 dark:text-slate-100">
                                    ${((advisor.reservationAmount ?? 0) / 1000).toFixed(0)}K
                                </p>
                            </div>

                            {/* Barra de progreso */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600 dark:text-slate-400">Tasa de Conversión</span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-100">
                                        {(advisor.conversionRate ?? 0).toFixed(1)}%
                                    </span>
                                </div>
                                <Progress value={advisor.conversionRate ?? 0} className="h-2" />
                            </div>

                            {/* Tiempo de respuesta */}
                            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                <Clock className="w-4 h-4" />
                                <span>Respuesta: {(advisor.avgResponseTime ?? 0).toFixed(1)}h</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Resumen del equipo */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-l-4 border-l-primary">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Users className="w-6 h-6 text-primary" />
                            <span className="font-medium text-slate-800 dark:text-slate-100">Total Asesores</span>
                        </div>
                        <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                            {data.kpis?.activeAdvisors ?? 0}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Activos en el equipo</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-600">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                            <span className="font-medium text-slate-800 dark:text-slate-100">Mejor Conversión</span>
                        </div>
                        <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                            {(data.salesTeamPerformance?.length ?? 0) > 0
                                ? Math.max(...(data.salesTeamPerformance ?? []).map((a) => a.conversionRate ?? 0)).toFixed(
                                    1
                                )
                                : 0}
                            %
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Mejor asesor</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-slate-600">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Target className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                            <span className="font-medium text-slate-800 dark:text-slate-100">Promedio Equipo</span>
                        </div>
                        <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                            {(data.kpis?.conversionRate ?? 0).toFixed(1)}%
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Conversión promedio</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-600">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                            <span className="font-medium text-slate-800 dark:text-slate-100">Revenue Total</span>
                        </div>
                        <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                            ${((data.kpis?.totalReservationAmount ?? 0) / 1000).toFixed(0)}K
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Generado por el equipo</p>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
    );
}
