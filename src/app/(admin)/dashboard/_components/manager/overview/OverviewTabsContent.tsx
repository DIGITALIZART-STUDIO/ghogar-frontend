import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Activity, DollarSign } from "lucide-react";
import {
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import type { ManagerDashboard } from "@/app/(admin)/dashboard/_types/dashboard";

interface OverviewTabsContentProps {
    data: ManagerDashboard;
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
            {/* Pipeline de ventas y análisis de cotizaciones */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
                            <Activity className="w-5 h-5 text-primary" />
                            Pipeline de Ventas
                        </CardTitle>
                        <CardDescription>Estado actual del embudo comercial</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={[
                                        {
                                            name: "Nuevos",
                                            value: data.salesPipeline?.newLeads ?? 0,
                                            fill: "hsl(var(--slate-400))",
                                        },
                                        {
                                            name: "En Contacto",
                                            value: data.salesPipeline?.inContact ?? 0,
                                            fill: "hsl(var(--primary))",
                                        },
                                        {
                                            name: "Cotización",
                                            value: data.salesPipeline?.quotationStage ?? 0,
                                            fill: "hsl(var(--slate-600))",
                                        },
                                        {
                                            name: "Negociación",
                                            value: data.salesPipeline?.negotiationStage ?? 0,
                                            fill: "hsl(var(--slate-700))",
                                        },
                                        {
                                            name: "Reservación",
                                            value: data.salesPipeline?.reservationStage ?? 0,
                                            fill: "hsl(var(--green-600))",
                                        },
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, value }) => `${name}: ${value}`}
                                    outerRadius={100}
                                    dataKey="value"
                                >
                                    {[0, 1, 2, 3, 4].map((index) => (
                                        <Cell key={`cell-${index}`} />
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
                            <BarChart3 className="w-5 h-5 text-primary" />
                            Análisis de Cotizaciones
                        </CardTitle>
                        <CardDescription>Estado de cotizaciones emitidas</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={[
                                        {
                                            name: "Pendientes",
                                            value: data.quotationAnalysis?.pending ?? 0,
                                            fill: "hsl(var(--primary))",
                                        },
                                        {
                                            name: "Aceptadas",
                                            value: data.quotationAnalysis?.accepted ?? 0,
                                            fill: "hsl(var(--green-600))",
                                        },
                                        {
                                            name: "Rechazadas",
                                            value: data.quotationAnalysis?.rejected ?? 0,
                                            fill: "hsl(var(--red-600))",
                                        },
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, value }) => `${name}: ${value}`}
                                    outerRadius={100}
                                    dataKey="value"
                                >
                                    {[0, 1, 2].map((index) => (
                                        <Cell key={`cell-${index}`} />
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
            </div>

            {/* Tendencias mensuales */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Tendencias Mensuales
                    </CardTitle>
                    <CardDescription>Evolución del negocio en los últimos 6 meses</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                        <ComposedChart data={data.monthlyTrends ?? []}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                            <XAxis dataKey="month" className="text-slate-600 dark:text-slate-400" />
                            <YAxis yAxisId="left" className="text-slate-600 dark:text-slate-400" />
                            <YAxis yAxisId="right" orientation="right" className="text-slate-600 dark:text-slate-400" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--card))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "0.5rem",
                                }}
                            />
                            <Bar yAxisId="left" dataKey="leadsReceived" fill="hsl(var(--slate-400))" name="Leads" />
                            <Bar yAxisId="left" dataKey="quotationsIssued" fill="hsl(var(--primary))" name="Cotizaciones" />
                            <Bar yAxisId="left" dataKey="reservationsMade" fill="hsl(var(--green-600))" name="Reservaciones" />
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

            {/* Métricas financieras */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-green-600">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                            <span className="font-medium text-slate-800 dark:text-slate-100">
                                Valor Total Reservado
                            </span>
                        </div>
                        <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                            ${((data.kpis?.totalReservationAmount ?? 0) / 1000).toFixed(0)}K
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">En reservaciones activas</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-primary">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <BarChart3 className="w-6 h-6 text-primary" />
                            <span className="font-medium text-slate-800 dark:text-slate-100">
                                Valor Promedio Cotización
                            </span>
                        </div>
                        <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                            ${((data.quotationAnalysis?.avgQuotationAmount ?? 0) / 1000).toFixed(0)}K
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Por cotización emitida</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-slate-600">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <DollarSign className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                            <span className="font-medium text-slate-800 dark:text-slate-100">
                                Valor Promedio Reservación
                            </span>
                        </div>
                        <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                            ${((data.reservationAnalysis?.avgReservationAmount ?? 0) / 1000).toFixed(0)}K
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Por reservación</p>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
    );
}
