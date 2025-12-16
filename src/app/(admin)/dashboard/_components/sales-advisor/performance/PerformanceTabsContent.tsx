"use client";

import { Clock, DollarSign, FileText, MapPin, Target } from "lucide-react";
import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Progress } from "@/components/ui/progress";
import { TabsContent } from "@/components/ui/tabs";
import { EmptyState } from "../../EmptyState";
import { SalesAdvisorDashboard } from "../../../_types/dashboard";

interface PerformanceTabsContentProps {
    data: SalesAdvisorDashboard | undefined;
    isLoading: boolean;
}

export default function PerformanceTabsContent({ data, isLoading }: PerformanceTabsContentProps) {
    const hasProjects = data?.myProjects && data.myProjects.length > 0;

    if (isLoading) {
        return (
            <TabsContent value="performance" className="space-y-6">
                <div className="flex items-center justify-center py-12">
                    <LoadingSpinner />
                </div>
            </TabsContent>
        );
    }

    return (
        <TabsContent value="performance" className="space-y-6">
            {/* Mi rendimiento por proyecto */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
                        <MapPin className="w-5 h-5 text-primary" />
                        Mi Rendimiento por Proyecto
                    </CardTitle>
                    <CardDescription>Análisis de mi gestión por proyecto inmobiliario</CardDescription>
                </CardHeader>
                <CardContent>
                    {!hasProjects ? (
                        <EmptyState
                            icon={MapPin}
                            title="Sin datos de proyectos"
                            description="No hay información disponible sobre tu rendimiento por proyecto"
                        />
                    ) : (
                        <ResponsiveContainer width="100%" height={400}>
                            <ComposedChart data={data?.myProjects}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                                <XAxis
                                    dataKey="project"
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
                                <Bar yAxisId="left" dataKey="leadsAssigned" fill="hsl(var(--slate-300))" name="Asignados" />
                                <Bar yAxisId="left" dataKey="leadsCompleted" fill="hsl(var(--slate-500))" name="Completados" />
                                <Bar yAxisId="left" dataKey="quotationsIssued" fill="hsl(var(--slate-700))" name="Cotizaciones" />
                                <Bar yAxisId="left" dataKey="reservationsMade" fill="hsl(var(--primary))" name="Reservaciones" />
                                <Line
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="conversionRate"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={3}
                                    name="Conversión %"
                                    dot={{ fill: "hsl(var(--primary))", r: 4 }}
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>

            {/* Detalles por proyecto */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {data?.myProjects?.map((project, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-slate-800 dark:text-slate-100">
                                {project.project}
                            </CardTitle>
                            <CardDescription>Mi gestión en este proyecto</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="text-center p-2 bg-slate-50 dark:bg-slate-900/30 rounded-lg border border-slate-200 dark:border-slate-800">
                                    <p className="font-bold text-slate-800 dark:text-slate-100">{project.leadsAssigned}</p>
                                    <p className="text-slate-600 dark:text-slate-400">Asignados</p>
                                </div>
                                <div className="text-center p-2 bg-slate-100 dark:bg-slate-800/30 rounded-lg border border-slate-300 dark:border-slate-700">
                                    <p className="font-bold text-slate-800 dark:text-slate-100">{project.leadsCompleted}</p>
                                    <p className="text-slate-600 dark:text-slate-400">Completados</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="text-center p-2 bg-slate-200 dark:bg-slate-700/30 rounded-lg border border-slate-300 dark:border-slate-600">
                                    <p className="font-bold text-slate-800 dark:text-slate-100">{project.quotationsIssued}</p>
                                    <p className="text-slate-600 dark:text-slate-400">Cotizaciones</p>
                                </div>
                                <div className="text-center p-2 bg-primary/10 dark:bg-primary/20 rounded-lg border border-primary/30 dark:border-primary/40">
                                    <p className="font-bold text-slate-800 dark:text-slate-100">{project.reservationsMade}</p>
                                    <p className="text-slate-600 dark:text-slate-400">Reservaciones</p>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-600 dark:text-slate-400">Mi Conversión</span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-100">
                                        {project.conversionRate}%
                                    </span>
                                </div>
                                <Progress value={project.conversionRate} className="h-2" />
                            </div>
                            <div className="text-center">
                                <Badge
                                    className={`${
                                        project.conversionRate && project.conversionRate > 18
                                            ? "bg-green-600 hover:bg-green-700"
                                            : project.conversionRate && project.conversionRate > 12
                                                ? "bg-primary hover:bg-primary/90"
                                                : "bg-orange-500 hover:bg-orange-600"
                                    } text-white`}
                                >
                                    {project.conversionRate && project.conversionRate > 18
                                        ? "Excelente"
                                        : project.conversionRate && project.conversionRate > 12
                                            ? "Bueno"
                                            : "Mejorar"}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Métricas personales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-l-4 border-l-primary">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Target className="w-6 h-6 text-primary" />
                            <span className="font-medium text-slate-800 dark:text-slate-100">Mi Conversión</span>
                        </div>
                        <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                            {data?.performance?.conversionRate ?? 0}%
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Tasa personal</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-slate-600">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Clock className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                            <span className="font-medium text-slate-800 dark:text-slate-100">Tiempo Respuesta</span>
                        </div>
                        <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                            {data?.performance?.avgResponseTime ?? 0}h
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Promedio personal</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-slate-700">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                            <span className="font-medium text-slate-800 dark:text-slate-100">Cotizaciones</span>
                        </div>
                        <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                            {data?.performance?.quotationsIssued ?? 0}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Generadas este mes</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-600">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                            <span className="font-medium text-slate-800 dark:text-slate-100">Reservaciones</span>
                        </div>
                        <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                            {data?.performance?.reservationsGenerated ?? 0}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Logradas este mes</p>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
    );
}
