"use client";

import { PieChartIcon, TrendingUp, BarChart3, Target, DollarSign, Zap } from "lucide-react";
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

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { type AdminDashboard } from "../../../_types/dashboard";
import { getLotStatusConfig, LotStatusConfig } from "@/app/(admin)/admin/projects/lots/_utils/lots.filter.utils";
import { LotStatus } from "@/app/(admin)/admin/projects/lots/_types/lot";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "../../EmptyState";

interface OverviewTabsContentProps {
  data: AdminDashboard
  isLoading: boolean
}

export default function OverviewTabsContent({ data, isLoading }: OverviewTabsContentProps) {
    if (isLoading) {
        return (
            <TabsContent value="overview" className="flex flex-col items-center justify-center py-16">
                <LoadingSpinner size="lg" text="Cargando datos del dashboard..." />
            </TabsContent>
        );
    }

    const hasLotData = data.lotsByStatus && data.lotsByStatus.length > 0;
    const hasPerformanceData = data.monthlyPerformance && data.monthlyPerformance.length > 0;

    return (
        <TabsContent value="overview" className="space-y-8">
            {/* Sección principal de gráficos */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Estado de lotes - Ocupa 2 columnas */}
                <Card className={cn(
                    "xl:col-span-2 relative overflow-hidden",
                )}
                >
                    <CardHeader className="relative pb-4">
                        <CardTitle className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-slate-500/8 to-stone-500/8">
                                <PieChartIcon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                            </div>
                            <div>
                                <span className="text-xl font-semibold tracking-tight">Estado del Inventario</span>
                                <CardDescription className="mt-1">Distribución actual de lotes por estado</CardDescription>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                        {!hasLotData ? (
                            <EmptyState
                                icon={PieChartIcon}
                                title="Sin datos de inventario"
                                description="No hay información disponible sobre el estado de los lotes"
                            />
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="relative">
                                    <ResponsiveContainer width="100%" height={280}>
                                        <RechartsPieChart>
                                            <Pie
                                                data={data.lotsByStatus}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={65}
                                                outerRadius={110}
                                                paddingAngle={2}
                                                dataKey="count"
                                                stroke="none"
                                            >
                                                {(data.lotsByStatus ?? []).map((item, index) => {
                                                    const config = getLotStatusConfig(item.status as LotStatus ?? "defaultStatus" as LotStatus);
                                                    // Extrae el color del dotClassName (ejemplo: "bg-emerald-500")
                                                    const colorMatch = config.dotClassName.match(/bg-([a-z]+)-(\d+)/);
                                                    // Puedes definir un mapa para traducir a hex si lo necesitas, pero tailwindcss ya usa esos colores
                                                    // Aquí un ejemplo simple para algunos colores
                                                    const tailwindToHex: Record<string, string> = {
                                                        "emerald-500": "#10b981",
                                                        "amber-500": "#f59e42",
                                                        "blue-500": "#3b82f6",
                                                        "gray-500": "#6b7280",
                                                    };
                                                    const colorKey = colorMatch ? `${colorMatch[1]}-${colorMatch[2]}` : "#64748b";
                                                    const fillColor = tailwindToHex[colorKey] || "#64748b";
                                                    return (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={fillColor}
                                                            className="hover:opacity-80 transition-opacity"
                                                        />
                                                    );
                                                })}
                                            </Pie>
                                            <Tooltip
                                                content={({ active, payload }) => {
                                                    if (active && payload && payload[0]) {
                                                        const data = payload[0].payload;
                                                        const config = LotStatusConfig[data.status as keyof typeof LotStatusConfig];
                                                        const colorMatch = config.dotClassName.match(/bg-([a-z]+)-(\d+)/);
                                                        const tailwindToHex: Record<string, string> = {
                                                            "emerald-500": "#10b981",
                                                            "amber-500": "#f59e42",
                                                            "blue-500": "#3b82f6",
                                                            "gray-500": "#6b7280",
                                                        };
                                                        const colorKey = colorMatch ? `${colorMatch[1]}-${colorMatch[2]}` : "#64748b";
                                                        const fillColor = tailwindToHex[colorKey] || "#64748b";
                                                        return (
                                                            <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span
                                                                        className="w-3 h-3 rounded-full inline-block"
                                                                        style={{ backgroundColor: fillColor }}
                                                                    />
                                                                    <p className="font-medium m-0">{config?.label ?? data.status}</p>
                                                                </div>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {data.count} lotes ({data.percentage.toFixed(1)}%)
                                                                </p>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />
                                        </RechartsPieChart>
                                    </ResponsiveContainer>

                                    {/* Centro del donut */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                                                {(data.lotsByStatus ?? []).reduce((sum, item) => sum + (typeof item.count === "number" ? item.count : 0), 0)}
                                            </div>
                                            <div className="text-sm text-muted-foreground">Total lotes</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Leyenda mejorada */}
                                <div className="space-y-4">
                                    <h4 className="font-medium text-slate-900 dark:text-slate-100">Desglose por estado</h4>
                                    <div className="space-y-3">
                                        {(data.lotsByStatus ?? []).map((item) => {
                                            const config = getLotStatusConfig((item.status ?? "defaultStatus") as LotStatus);
                                            const colorMatch = config.dotClassName.match(/bg-([a-z]+)-(\d+)/);
                                            const tailwindToHex: Record<string, string> = {
                                                "emerald-500": "#10b981",
                                                "amber-500": "#f59e42",
                                                "blue-500": "#3b82f6",
                                                "gray-500": "#6b7280",
                                            };
                                            const colorKey = colorMatch ? `${colorMatch[1]}-${colorMatch[2]}` : "#64748b";
                                            const fillColor = tailwindToHex[colorKey] || "#64748b";
                                            return (
                                                <div key={item.status} className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50 dark:bg-slate-800/50">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="w-4 h-4 rounded-full"
                                                            style={{ backgroundColor: fillColor }}
                                                        />
                                                        <span className="font-medium text-sm">
                                                            {LotStatusConfig[item.status as keyof typeof LotStatusConfig]?.label ?? item.status}
                                                        </span>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-semibold text-sm">{item.count}</div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {typeof item.percentage === "number" ? `${item.percentage.toFixed(1)}%` : "N/A"}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Métricas rápidas */}
                <div className="space-y-4">
                    <Card className={cn(
                        "relative overflow-hidden",
                    )}
                    >
                        <CardHeader className="relative">
                            <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                                <Target className="w-5 h-5" />
                                Conversión
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative">
                            <div className="text-xl font-bold mb-2">{(data.conversionRate ?? 0).toFixed(1)}%</div>
                            <Progress value={data.conversionRate ?? 0} className="h-2 mb-2" />
                        </CardContent>
                    </Card>

                    <Card className={cn(
                        "relative overflow-hidden",
                    )}
                    >
                        <CardHeader className="relative">
                            <CardTitle className="flex items-center gap-2 text-teal-700 dark:text-teal-400">
                                <DollarSign className="w-5 h-5" />
                                Ticket Promedio
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative">
                            <div className="text-xl font-bold mb-2">
                                S/ {(((data.averageTicket ?? 0) as number) / 1000).toFixed(0)}K
                            </div>
                            <p className="text-xs text-muted-foreground">Por lote vendido</p>
                        </CardContent>
                    </Card>

                    <Card className={cn(
                        "relative overflow-hidden",
                    )}
                    >
                        <CardHeader className="relative">
                            <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
                                <Zap className="w-5 h-5" />
                                Eficiencia
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative">
                            <div className="text-xl font-bold mb-2">
                                {Math.round(((data.completedSales ?? 0) / Math.max(1, data.pendingReservations ?? 0)) * 100)}%
                            </div>
                            <p className="text-xs text-muted-foreground">Cierre efectivo</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Tendencia mensual */}
            <Card className={cn(
                "relative overflow-hidden",
            )}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-stone-500/3" />
                <CardHeader className="relative pb-4">
                    <CardTitle className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-stone-500/8 to-slate-500/8">
                            <TrendingUp className="w-5 h-5 text-stone-600 dark:text-stone-400" />
                        </div>
                        <div>
                            <span className="text-xl font-semibold tracking-tight">Tendencia de Conversión</span>
                            <CardDescription className="mt-1">Evolución mensual de leads a ventas</CardDescription>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                    {!hasPerformanceData ? (
                        <EmptyState
                            icon={BarChart3}
                            title="Sin datos de rendimiento"
                            description="No hay información disponible sobre el rendimiento mensual"
                        />
                    ) : (
                        <ResponsiveContainer width="100%" height={350}>
                            <ComposedChart data={data.monthlyPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                                <XAxis
                                    dataKey="month"
                                    stroke="#64748b"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#64748b"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
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
                                    dataKey="leads"
                                    fill="#facc15"
                                    name="Leads"
                                    radius={[4, 4, 0, 0]}
                                    opacity={0.95}
                                />
                                <Bar
                                    dataKey="quotations"
                                    fill="#fb923c"
                                    name="Cotizaciones"
                                    radius={[4, 4, 0, 0]}
                                    opacity={0.95}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    name="Ventas"
                                    dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                                    activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2 }}
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    )}
                </CardContent>
            </Card>
        </TabsContent>
    );
}
