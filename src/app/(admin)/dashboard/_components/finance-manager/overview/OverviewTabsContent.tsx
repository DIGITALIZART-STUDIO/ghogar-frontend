"use client";

import {
    AlertTriangle,
    ArrowUpRight,
    BarChart3,
    Calendar,
    CheckCircle,
    Clock,
    DollarSign,
    FileText,
    PieChart,
    TrendingUp,
    Wallet,
    XCircle,
} from "lucide-react";
import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Progress } from "@/components/ui/progress";
import { TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { EmptyState } from "../../EmptyState";
import { FinanceManagerDashboard } from "../../../_types/dashboard";

interface OverviewTabsContentProps {
    data: FinanceManagerDashboard | undefined;
    isLoading: boolean;
}

export default function OverviewTabsContent({ data, isLoading }: OverviewTabsContentProps) {
    const hasAccountsReceivable = data?.accountsReceivable && data.accountsReceivable.length > 0;

    return (
        <TabsContent value="overview" className="space-y-6">
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <LoadingSpinner />
                </div>
            ) : (
                <>
                    {/* KPIs Financieros Principales */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 border-emerald-200 shadow-lg dark:from-emerald-900/20 dark:to-green-900/20 dark:border-emerald-800">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full -translate-y-10 translate-x-10" />
                            <CardContent className="p-6 relative">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-200 shadow-sm dark:bg-emerald-900/30 dark:border-emerald-800">
                                        <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-emerald-700 text-sm font-semibold dark:text-emerald-400">Total Cobrado</p>
                                        <p className="text-3xl font-bold text-emerald-800 dark:text-emerald-300">
                                            S/ {data?.financialSummary?.totalCollected !== undefined
                                                ? (data.financialSummary.totalCollected / 1000000).toFixed(1)
                                                : "--"
                                            }M
                                        </p>
                                        <div className="flex items-center gap-1 mt-2">
                                            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                                            <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                                                {(
                                                    ((data?.financialSummary?.totalCollected ?? 0) /
                                                    (data?.financialSummary?.totalInvoiced ?? 1)) * 100
                                                ).toFixed(1)}
                                                % del facturado
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 border-amber-200 shadow-lg dark:from-amber-900/20 dark:to-orange-900/20 dark:border-amber-800">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full -translate-y-10 translate-x-10" />
                            <CardContent className="p-6 relative">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-amber-100 border border-amber-200 shadow-sm dark:bg-amber-900/30 dark:border-amber-800">
                                        <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-amber-700 text-sm font-semibold dark:text-amber-400">Pendiente Cobro</p>
                                        <p className="text-3xl font-bold text-amber-800 dark:text-amber-300">
                                            S/ {data?.financialSummary?.pendingCollection !== undefined
                                                ? (data.financialSummary.pendingCollection / 1000000).toFixed(1)
                                                : "--"
                                            }M
                                        </p>
                                        <div className="flex items-center gap-1 mt-2">
                                            <Calendar className="w-4 h-4 text-amber-600" />
                                            <span className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                                                {(data?.financialSummary?.portfolioTurnover ?? "--")} días promedio
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="relative overflow-hidden bg-gradient-to-br from-red-50 via-rose-50 to-red-100 border-red-200 shadow-lg dark:from-red-900/20 dark:to-rose-900/20 dark:border-red-800">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-full -translate-y-10 translate-x-10" />
                            <CardContent className="p-6 relative">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-red-100 border border-red-200 shadow-sm dark:bg-red-900/30 dark:border-red-800">
                                        <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-red-700 text-sm font-semibold dark:text-red-400">Cuentas Vencidas</p>
                                        <p className="text-3xl font-bold text-red-800 dark:text-red-300">
                                            S/ {data?.financialSummary?.overdue !== undefined
                                                ? (data.financialSummary.overdue / 1000).toFixed(0)
                                                : "--"
                                            }K
                                        </p>
                                        <div className="flex items-center gap-1 mt-2">
                                            <XCircle className="w-4 h-4 text-red-600" />
                                            <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                                                {(
                                                    ((data?.financialSummary?.overdue ?? 0) /
                                                    (data?.financialSummary?.totalInvoiced ?? 1)) * 100
                                                ).toFixed(1)}
                                                % del total
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 border-blue-200 shadow-lg dark:from-blue-900/20 dark:to-cyan-900/20 dark:border-blue-800">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -translate-y-10 translate-x-10" />
                            <CardContent className="p-6 relative">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-blue-100 border border-blue-200 shadow-sm dark:bg-blue-900/30 dark:border-blue-800">
                                        <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-blue-700 text-sm font-semibold dark:text-blue-400">Proyección Mensual</p>
                                        <p className="text-3xl font-bold text-blue-800 dark:text-blue-300">
                                            S/ {data?.financialSummary?.monthlyProjection !== undefined
                                                ? (data.financialSummary.monthlyProjection / 1000000).toFixed(1)
                                                : "--"
                                            }M
                                        </p>
                                        <div className="flex items-center gap-1 mt-2">
                                            <TrendingUp className="w-4 h-4 text-blue-600" />
                                            <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">Próximo mes</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Indicadores Financieros Clave */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="shadow-lg border-slate-200 dark:border-slate-700">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300 shadow-sm dark:from-slate-800 dark:to-slate-700 dark:border-slate-600">
                                        <BarChart3 className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                            Indicadores de Gestión
                                        </CardTitle>
                                        <CardDescription className="text-slate-600 dark:text-slate-400">
                                            Métricas clave de rendimiento financiero
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 dark:from-emerald-900/20 dark:to-green-900/20 dark:border-emerald-800">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                                                Eficiencia Cobranza
                                            </span>
                                            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mb-2">
                                            {data?.kpiIndicators?.collectionEfficiency}%
                                        </p>
                                        <Progress value={data?.kpiIndicators?.collectionEfficiency} className="h-2" />
                                    </div>

                                    <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 dark:from-blue-900/20 dark:to-cyan-900/20 dark:border-blue-800">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">Margen Bruto</span>
                                            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <p className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-2">
                                            {data?.kpiIndicators?.operatingMargin}%
                                        </p>
                                        <Progress value={data?.kpiIndicators?.operatingMargin} className="h-2" />
                                    </div>

                                    <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 dark:from-purple-900/20 dark:to-violet-900/20 dark:border-purple-800">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-semibold text-purple-800 dark:text-purple-200">
                                                Rotación Cartera
                                            </span>
                                            <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <p className="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-2">
                                            {data?.kpiIndicators?.portfolioDays} días
                                        </p>
                                        <div className="text-xs text-purple-600 dark:text-purple-400">Promedio de cobranza</div>
                                    </div>

                                    <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 dark:from-amber-900/20 dark:to-orange-900/20 dark:border-amber-800">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-semibold text-amber-800 dark:text-amber-200">Crecimiento</span>
                                            <ArrowUpRight className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <p className="text-2xl font-bold text-amber-700 dark:text-amber-300 mb-2">
                                            {data?.kpiIndicators?.monthlyGrowth}%
                                        </p>
                                        <div className="text-xs text-amber-600 dark:text-amber-400">Mensual promedio</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg border-slate-200 dark:border-slate-700">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300 shadow-sm dark:from-slate-800 dark:to-slate-700 dark:border-slate-600">
                                        <PieChart className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                            Estado de Cartera
                                        </CardTitle>
                                        <CardDescription className="text-slate-600 dark:text-slate-400">
                                            Distribución de cuentas por cobrar
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={280}>
                                    <RechartsPieChart>
                                        <Pie
                                            data={[
                                                {
                                                    name: "Cobrado",
                                                    value: data?.financialSummary?.totalCollected ?? 0,
                                                    fill: "#10b981",
                                                },
                                                {
                                                    name: "Pendiente Vigente",
                                                    value: data?.financialSummary?.pendingCollection ?? 0,
                                                    fill: "#f59e0b",
                                                },
                                                {
                                                    name: "Vencido",
                                                    value: data?.financialSummary?.overdue ?? 0,
                                                    fill: "#ef4444",
                                                },
                                            ]}
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={120}
                                            paddingAngle={2}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {[{ fill: "#10b981" }, { fill: "#f59e0b" }, { fill: "#ef4444" }].map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            content={({ active, payload }) => {
                                                if (active && payload && payload[0]) {
                                                    const dataItem = payload[0].payload;
                                                    const total = data?.financialSummary?.totalInvoiced ?? 1;
                                                    const percentage = ((dataItem.value / total) * 100).toFixed(1);
                                                    return (
                                                        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg dark:bg-slate-800 dark:border-slate-700">
                                                            <p className="font-semibold text-lg">{dataItem.name}</p>
                                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                                S/ {(dataItem.value / 1000000).toFixed(1)}M ({percentage}%)
                                                            </p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                    </RechartsPieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Resumen por Proyecto */}
                    <Card className="shadow-lg border-slate-200 dark:border-slate-700">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300 shadow-sm dark:from-slate-800 dark:to-slate-700 dark:border-slate-600">
                                    <FileText className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                        Estado Financiero por Proyecto
                                    </CardTitle>
                                    <CardDescription className="text-slate-600 dark:text-slate-400">
                                        Análisis detallado de cuentas por cobrar
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {!hasAccountsReceivable ? (
                                <EmptyState
                                    icon={FileText}
                                    title="Sin proyectos financieros"
                                    description="No hay información disponible sobre el estado financiero de los proyectos"
                                />
                            ) : (
                                <div className="space-y-4">
                                    {(data?.accountsReceivable ?? []).map((proyecto, index) => {
                                        const porcentajeCobrado = ((proyecto.collected ?? 0) / (proyecto.invoiced ?? 1)) * 100;
                                        const tieneVencido = (proyecto.overdue ?? 0) > 0;

                                        return (
                                            <div
                                                key={index}
                                                className={cn(
                                                    "p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-md",
                                                    tieneVencido
                                                        ? "bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800/30"
                                                        : porcentajeCobrado > 85
                                                            ? "bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800/30"
                                                            : "bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800/30",
                                                )}
                                            >
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className={cn(
                                                                "p-2 rounded-lg",
                                                                tieneVencido
                                                                    ? "bg-red-100 border border-red-200 dark:bg-red-900/30 dark:border-red-800"
                                                                    : porcentajeCobrado > 85
                                                                        ? "bg-green-100 border border-green-200 dark:bg-green-900/30 dark:border-green-800"
                                                                        : "bg-amber-100 border border-amber-200 dark:bg-amber-900/30 dark:border-amber-800",
                                                            )}
                                                        >
                                                            {tieneVencido ? (
                                                                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                                            ) : porcentajeCobrado > 85 ? (
                                                                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                                            ) : (
                                                                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                                                {proyecto.project}
                                                            </h3>
                                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                                Próximo pago: {proyecto.nextPaymentDate}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Badge
                                                        variant="outline"
                                                        className={cn(
                                                            "text-sm font-semibold",
                                                            tieneVencido
                                                                ? "bg-red-100 text-red-700 border-red-300"
                                                                : porcentajeCobrado > 85
                                                                    ? "bg-green-100 text-green-700 border-green-300"
                                                                    : "bg-amber-100 text-amber-700 border-amber-300",
                                                        )}
                                                    >
                                                        {porcentajeCobrado.toFixed(1)}% cobrado
                                                    </Badge>
                                                </div>

                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                                    <div className="text-center p-3 bg-white rounded-lg border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Facturado</p>
                                                        <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                                            S/ {proyecto.invoiced ? (proyecto.invoiced / 1000000).toFixed(1) : "0.0"}M
                                                        </p>
                                                    </div>
                                                    <div className="text-center p-3 bg-white rounded-lg border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Cobrado</p>
                                                        <p className="text-lg font-bold text-green-600">
                                                            S/ {proyecto.collected ? (proyecto.collected / 1000000).toFixed(1) : "0.0"}M
                                                        </p>
                                                    </div>
                                                    <div className="text-center p-3 bg-white rounded-lg border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Pendiente</p>
                                                        <p className="text-lg font-bold text-amber-600">
                                                            S/ {proyecto.pending ? (proyecto.pending / 1000).toFixed(0) : "0.0"}K
                                                        </p>
                                                    </div>
                                                    <div className="text-center p-3 bg-white rounded-lg border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Vencido</p>
                                                        <p
                                                            className={cn(
                                                                "text-lg font-bold",
                                                                proyecto.overdue !== undefined
                                                                    ? proyecto.overdue > 0
                                                                        ? "text-red-600"
                                                                        : "text-slate-400"
                                                                    : "text-slate-400",
                                                            )}
                                                        >
                                                            S/ {(proyecto.overdue !== undefined ? (proyecto.overdue / 1000).toFixed(0) : "0")}K
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mb-3">
                                                    <div className="flex justify-between text-sm mb-2">
                                                        <span className="font-medium text-slate-700 dark:text-slate-300">Progreso de Cobranza</span>
                                                        <span className="font-bold text-slate-900 dark:text-slate-100">
                                                            {porcentajeCobrado.toFixed(1)}%
                                                        </span>
                                                    </div>
                                                    <Progress value={porcentajeCobrado} className="h-3" />
                                                </div>

                                                {proyecto.nextDue !== undefined && proyecto.nextDue > 0 && (
                                                    <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
                                                        <span className="text-sm text-slate-600 dark:text-slate-400">Próximo vencimiento:</span>
                                                        <span className="font-bold text-blue-600">
                                                            S/ {(proyecto.nextDue / 1000).toFixed(0)}K
                                                        </span>
                                                    </div>
                                                )}
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
