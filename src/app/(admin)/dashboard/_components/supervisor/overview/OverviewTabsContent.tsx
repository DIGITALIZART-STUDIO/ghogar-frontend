import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, Activity } from "lucide-react";
import {
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    ComposedChart,
    Line,
} from "recharts";
import type { SupervisorDashboard } from "@/app/(admin)/dashboard/_types/dashboard";

interface OverviewTabsContentProps {
    data: SupervisorDashboard;
    isLoading: boolean;
}

export function OverviewTabsContent({ data, isLoading }: OverviewTabsContentProps) {
    if (isLoading) {
        return (
            <TabsContent value="overview" className="space-y-6">
                <div className="text-center py-12">
                    <p className="text-slate-600 dark:text-slate-400">Cargando datos...</p>
                </div>
            </TabsContent>
        );
    }

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
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={data.leadSources ?? []}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ source, percentage }) => `${source}: ${percentage}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="count"
                                >
                                    {(data.leadSources ?? []).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "hsl(var(--card))",
                                        border: "1px solid hsl(var(--border))",
                                        borderRadius: "0.5rem",
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
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
                        <ResponsiveContainer width="100%" height={300}>
                            <ComposedChart data={data.conversionFunnel ?? []} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                                <XAxis type="number" className="text-slate-600 dark:text-slate-400" />
                                <YAxis dataKey="stage" type="category" className="text-slate-600 dark:text-slate-400" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "hsl(var(--card))",
                                        border: "1px solid hsl(var(--border))",
                                        borderRadius: "0.5rem",
                                    }}
                                />
                                <Bar dataKey="count" fill="hsl(var(--primary))" name="Leads" />
                                <Line dataKey="percentage" stroke="hsl(var(--green-600))" strokeWidth={2} name="%" />
                            </ComposedChart>
                        </ResponsiveContainer>
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
                            <Bar dataKey="newLeads" fill="hsl(var(--primary))" name="Nuevos" />
                            <Bar dataKey="assigned" fill="hsl(var(--slate-600))" name="Asignados" />
                            <Bar dataKey="attended" fill="hsl(var(--slate-700))" name="Atendidos" />
                            <Bar dataKey="completed" fill="hsl(var(--green-600))" name="Completados" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Métricas del equipo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-primary">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Users className="w-6 h-6 text-primary" />
                            <span className="font-medium text-slate-800 dark:text-slate-100">Cotizaciones</span>
                        </div>
                        <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                            {data.teamMetrics?.quotationsGenerated ?? 0}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Generadas por el equipo</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-600">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
                            <span className="font-medium text-slate-800 dark:text-slate-100">Reservaciones</span>
                        </div>
                        <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                            {data.teamMetrics?.reservationsActive ?? 0}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Activas actualmente</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-slate-600">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <BarChart3 className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                            <span className="font-medium text-slate-800 dark:text-slate-100">Tareas Hoy</span>
                        </div>
                        <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                            {data.teamMetrics?.tasksToday ?? 0}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Programadas para hoy</p>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
    );
}
