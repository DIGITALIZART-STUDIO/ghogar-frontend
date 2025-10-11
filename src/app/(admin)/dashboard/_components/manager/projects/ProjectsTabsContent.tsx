import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, DollarSign } from "lucide-react";
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

interface ProjectsTabsContentProps {
    data: ManagerDashboard;
    isLoading: boolean;
}

export function ProjectsTabsContent({ data, isLoading }: ProjectsTabsContentProps) {
    if (isLoading) {
        return (
            <TabsContent value="projects" className="space-y-6">
                <div className="text-center py-12">
                    <p className="text-slate-600 dark:text-slate-400">Cargando proyectos...</p>
                </div>
            </TabsContent>
        );
    }

    return (
        <TabsContent value="projects" className="space-y-6">
            {/* Gráfico de rendimiento por proyecto */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
                        <Building2 className="w-5 h-5 text-primary" />
                        Rendimiento por Proyecto
                    </CardTitle>
                    <CardDescription>Análisis de leads, cotizaciones y reservaciones</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                        <ComposedChart data={data.projectPerformance ?? []}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                            <XAxis
                                dataKey="projectName"
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
                            <Bar yAxisId="left" dataKey="totalLeads" fill="hsl(var(--slate-400))" name="Leads" />
                            <Bar yAxisId="left" dataKey="quotations" fill="hsl(var(--primary))" name="Cotizaciones" />
                            <Bar yAxisId="left" dataKey="reservations" fill="hsl(var(--green-600))" name="Reservaciones" />
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

            {/* Detalles por proyecto */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {(data.projectPerformance ?? []).map((project) => (
                    <Card key={project.projectId} className="border-l-4 border-l-primary">
                        <CardContent className="p-6">
                            <div className="mb-4">
                                <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">
                                    {project.projectName}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    {project.occupancyRate?.toFixed(1)}% ocupación
                                </p>
                            </div>

                            {/* Métricas del proyecto */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="text-center p-3 bg-slate-50 dark:bg-slate-900/30 rounded-lg">
                                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                                        {project.totalLeads}
                                    </p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">Leads</p>
                                </div>
                                <div className="text-center p-3 bg-primary/10 dark:bg-primary/20 rounded-lg">
                                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                                        {project.quotations}
                                    </p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">Cotizaciones</p>
                                </div>
                                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                                        {project.reservations}
                                    </p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">Reservaciones</p>
                                </div>
                                <div className="text-center p-3 bg-slate-100 dark:bg-slate-800/30 rounded-lg">
                                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                                        {project.availableUnits}
                                    </p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">Disponibles</p>
                                </div>
                            </div>

                            {/* Revenue */}
                            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Revenue</span>
                                    <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                                </div>
                                <p className="text-xl font-bold text-slate-800 dark:text-slate-100">
                                    ${((project.reservationAmount ?? 0) / 1000).toFixed(0)}K
                                </p>
                            </div>

                            {/* Barra de conversión */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600 dark:text-slate-400">Tasa de Conversión</span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-100">
                                        {(project.conversionRate ?? 0).toFixed(1)}%
                                    </span>
                                </div>
                                <Progress value={project.conversionRate ?? 0} className="h-2" />
                            </div>

                            {/* Badge de rendimiento */}
                            <div className="mt-4 text-center">
                                <Badge
                                    className={`${
                                        (project.conversionRate ?? 0) > 20
                                            ? "bg-green-600 hover:bg-green-700"
                                            : (project.conversionRate ?? 0) > 15
                                                ? "bg-primary hover:bg-primary/90"
                                                : "bg-orange-500 hover:bg-orange-600"
                                    } text-white`}
                                >
                                    {(project.conversionRate ?? 0) > 20
                                        ? "Alto Rendimiento"
                                        : (project.conversionRate ?? 0) > 15
                                            ? "Buen Rendimiento"
                                            : "Mejorar"}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </TabsContent>
    );
}
