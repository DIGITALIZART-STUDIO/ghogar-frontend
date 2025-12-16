import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, Target, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ComposedChart,
    Line,
} from "recharts";
import type { SupervisorDashboard } from "@/app/(admin)/dashboard/_types/dashboard";

// Colores hex para Recharts (consistentes con LeadCaptureSourceLabels)
const CHART_COLORS = {
    slate400: "#94a3b8",
    slate600: "#475569",
    slate800: "#1e293b",
    primary: "#17949B",
    green600: "#16a34a",
    indigo600: "#4f46e5",    // Para Company
    blue600: "#2563eb",      // Para PersonalFacebook
    orange600: "#ea580c",    // Para RealEstateFair
    teal600: "#0d9488",      // Para Institutional
    pink600: "#db2777",      // Para Loyalty
};

interface TeamTabsContentProps {
    data: SupervisorDashboard;
    isLoading: boolean;
}

export function TeamTabsContent({ data, isLoading }: TeamTabsContentProps) {
    if (isLoading) {
        return (
            <TabsContent value="team" className="space-y-6">
                <div className="text-center py-12">
                    <p className="text-slate-600 dark:text-slate-400">Cargando datos del equipo...</p>
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
                        Rendimiento del Equipo
                    </CardTitle>
                    <CardDescription>Métricas individuales de cada asesor</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                        <ComposedChart data={data.advisors ?? []}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} className="text-slate-600 dark:text-slate-400" />
                            <YAxis yAxisId="left" className="text-slate-600 dark:text-slate-400" />
                            <YAxis yAxisId="right" orientation="right" className="text-slate-600 dark:text-slate-400" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--card))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "0.5rem",
                                }}
                            />
                            <Bar yAxisId="left" dataKey="leadsAssigned" fill={CHART_COLORS.slate400} name="Asignados" />
                            <Bar yAxisId="left" dataKey="leadsCompleted" fill={CHART_COLORS.green600} name="Completados" />
                            <Bar yAxisId="left" dataKey="quotationsIssued" fill={CHART_COLORS.primary} name="Cotizaciones" />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="efficiency"
                                stroke={CHART_COLORS.slate800}
                                strokeWidth={3}
                                name="Eficiencia %"
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Detalles individuales del equipo */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {(data.advisors ?? []).map((advisor) => (
                    <Card key={advisor.id} className="border-l-4 border-l-slate-600">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">
                                        {advisor.name}
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        Última actividad:{" "}
                                        {advisor.lastActivity
                                            ? new Date(advisor.lastActivity).toLocaleDateString()
                                            : "N/A"}
                                    </p>
                                </div>
                                <Badge
                                    className={`${
                                        (advisor.efficiency ?? 0) > 20
                                            ? "bg-green-600 hover:bg-green-700"
                                            : (advisor.efficiency ?? 0) > 15
                                                ? "bg-primary hover:bg-primary/90"
                                                : "bg-orange-500 hover:bg-orange-600"
                                    } text-white`}
                                >
                                    {(advisor.efficiency ?? 0).toFixed(1)}%
                                </Badge>
                            </div>

                            {/* Métricas del asesor */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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
                                <div className="text-center p-3 bg-slate-200 dark:bg-slate-700/30 rounded-lg">
                                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                                        {advisor.reservationsGenerated}
                                    </p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">Reservaciones</p>
                                </div>
                            </div>

                            {/* Barra de progreso */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600 dark:text-slate-400">
                                        Progreso de conversión
                                    </span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-100">
                                        {(advisor.efficiency ?? 0).toFixed(1)}%
                                    </span>
                                </div>
                                <Progress value={advisor.efficiency ?? 0} className="h-2" />
                            </div>

                            {/* Tareas */}
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                    <span className="text-sm text-slate-600 dark:text-slate-400">
                                        {advisor.tasksPending} pendientes
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Target className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    <span className="text-sm text-slate-600 dark:text-slate-400">
                                        {advisor.tasksCompleted} completadas
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Resumen del equipo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-primary">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Users className="w-6 h-6 text-primary" />
                            <span className="font-medium text-slate-800 dark:text-slate-100">Total Asesores</span>
                        </div>
                        <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                            {data.advisors?.length ?? 0}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Activos en el equipo</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-600">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                            <span className="font-medium text-slate-800 dark:text-slate-100">Mejor Rendimiento</span>
                        </div>
                        <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                            {(data.advisors?.length ?? 0) > 0
                                ? Math.max(...(data.advisors ?? []).map((a) => a.efficiency ?? 0)).toFixed(1)
                                : 0}
                            %
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Eficiencia máxima</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-slate-600">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Target className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                            <span className="font-medium text-slate-800 dark:text-slate-100">Promedio Equipo</span>
                        </div>
                        <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                            {(data.teamMetrics?.avgConversionRate ?? 0).toFixed(1)}%
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Tasa de conversión</p>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
    );
}
