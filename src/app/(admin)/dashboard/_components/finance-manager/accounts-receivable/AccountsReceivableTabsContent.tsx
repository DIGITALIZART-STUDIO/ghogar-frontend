"use client";

import { AlertTriangle, CheckCircle } from "lucide-react";
import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { EmptyState } from "../../EmptyState";
import { FinanceManagerDashboard } from "../../../_types/dashboard";

interface AccountsReceivableTabsContentProps {
    data: FinanceManagerDashboard | undefined;
    isLoading: boolean;
}

export default function AccountsReceivableTabsContent({ data, isLoading }: AccountsReceivableTabsContentProps) {
    const hasDelinquencyAnalysis = data?.delinquencyAnalysis && data.delinquencyAnalysis.length > 0;
    const hasAccountsReceivable = data?.accountsReceivable && data.accountsReceivable.length > 0;

    return (
        <TabsContent value="accounts-receivable" className="space-y-6">
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <LoadingSpinner />
                </div>
            ) : (
                <>
                    {/* Análisis de morosidad */}
                    <Card className="shadow-lg border-slate-200 dark:border-slate-700">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300 shadow-sm dark:from-slate-800 dark:to-slate-700 dark:border-slate-600">
                                    <AlertTriangle className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                        Análisis de Morosidad
                                    </CardTitle>
                                    <CardDescription className="text-slate-600 dark:text-slate-400">
                                        Distribución de cuentas vencidas por antigüedad
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {!hasDelinquencyAnalysis ? (
                                <EmptyState
                                    icon={AlertTriangle}
                                    title="Sin análisis de morosidad"
                                    description="No hay información disponible sobre cuentas vencidas por antigüedad"
                                />
                            ) : (
                                <ResponsiveContainer width="100%" height={300}>
                                    <ComposedChart
                                        data={data?.delinquencyAnalysis ?? []}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.4} />
                                        <XAxis
                                            dataKey="rango"
                                            fontSize={12}
                                            fontWeight={600}
                                            tickLine={false}
                                            axisLine={false}
                                            tick={{ fill: "#64748b" }}
                                        />
                                        <YAxis
                                            yAxisId="monto"
                                            fontSize={12}
                                            fontWeight={600}
                                            tickLine={false}
                                            axisLine={false}
                                            tick={{ fill: "#64748b" }}
                                            tickFormatter={(value) => `S/ ${(value / 1000).toFixed(0)}K`}
                                        />
                                        <YAxis
                                            yAxisId="cantidad"
                                            orientation="right"
                                            fontSize={12}
                                            fontWeight={600}
                                            tickLine={false}
                                            axisLine={false}
                                            tick={{ fill: "#64748b" }}
                                        />
                                        <Tooltip
                                            content={({ active, payload, label }) => {
                                                if (active && payload && payload.length) {
                                                    const dataItem = payload[0].payload;
                                                    return (
                                                        <div className="bg-white border border-slate-200 rounded-xl p-4 min-w-[280px] shadow-lg dark:bg-slate-800 dark:border-slate-700">
                                                            <h4 className="font-bold text-lg mb-3">{label}</h4>
                                                            <div className="space-y-2">
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-sm text-red-600">Monto vencido:</span>
                                                                    <span className="font-bold text-red-600">S/ {(dataItem.monto / 1000).toFixed(0)}K</span>
                                                                </div>
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-sm text-blue-600">Cantidad cuentas:</span>
                                                                    <span className="font-bold text-blue-600">{dataItem.cantidad}</span>
                                                                </div>
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-sm text-purple-600">% del total:</span>
                                                                    <span className="font-bold text-purple-600">{dataItem.porcentaje}%</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Bar yAxisId="monto" dataKey="monto" name="Monto" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                        <Line
                                            yAxisId="cantidad"
                                            type="monotone"
                                            dataKey="cantidad"
                                            stroke="#3b82f6"
                                            strokeWidth={3}
                                            name="Cantidad"
                                            dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
                                        />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>

                    {/* Detalle por proyecto */}
                    {!hasAccountsReceivable ? (
                        <Card className="shadow-lg border-slate-200 dark:border-slate-700">
                            <CardContent className="py-12">
                                <EmptyState
                                    icon={AlertTriangle}
                                    title="Sin cuentas por cobrar"
                                    description="No hay información disponible sobre cuentas por cobrar por proyecto"
                                />
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {data?.accountsReceivable?.map((proyecto, index) => (
                                <Card key={index} className="shadow-lg border-slate-200 dark:border-slate-700">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={cn(
                                                        "p-2 rounded-xl border",
                                                        (proyecto.overdue ?? 0) > 0
                                                            ? "bg-red-100 border-red-200 dark:bg-red-900/30 dark:border-red-800"
                                                            : "bg-green-100 border-green-200 dark:bg-green-900/30 dark:border-green-800",
                                                    )}
                                                >
                                                    {(proyecto.overdue ?? 0) > 0 ? (
                                                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                                    ) : (
                                                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <CardTitle className="text-lg font-bold">{proyecto.project}</CardTitle>
                                                    <CardDescription>Estado de cobranza</CardDescription>
                                                </div>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "text-xs",
                                                    (proyecto.overdue ?? 0) > 0
                                                        ? "bg-red-100 text-red-700 border-red-200"
                                                        : "bg-green-100 text-green-700 border-green-200",
                                                )}
                                            >
                                                {(proyecto.overdue ?? 0) > 0 ? "Con Vencidos" : "Al Día"}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200 dark:bg-green-900/20 dark:border-green-800">
                                                <p className="text-sm text-green-600 dark:text-green-400 mb-1">Cobrado</p>
                                                <p className="text-lg font-bold text-green-700 dark:text-green-300">
                                                    S/ {(proyecto.collected !== undefined ? (proyecto.collected / 1000000).toFixed(1) : "0.0")}M
                                                </p>
                                            </div>
                                            <div className="text-center p-3 bg-amber-50 rounded-lg border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
                                                <p className="text-sm text-amber-600 dark:text-amber-400 mb-1">Pendiente</p>
                                                <p className="text-lg font-bold text-amber-700 dark:text-amber-300">
                                                    S/ {(proyecto.pending !== undefined ? (proyecto.pending / 1000).toFixed(0) : "0.0")}K
                                                </p>
                                            </div>
                                        </div>

                                        {(proyecto.overdue ?? 0) > 0 && (
                                            <div className="p-3 bg-red-50 rounded-lg border border-red-200 dark:bg-red-900/20 dark:border-red-800">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-red-800 dark:text-red-200">Monto Vencido</span>
                                                    <span className="text-lg font-bold text-red-700 dark:text-red-300">
                                                        S/ {(proyecto.overdue !== undefined ? (proyecto.overdue / 1000).toFixed(0) : "0.0")}K
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-medium">Próximo vencimiento</span>
                                                <span className="text-sm text-slate-600 dark:text-slate-400">{proyecto.nextPaymentDate}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-slate-600 dark:text-slate-400">Monto</span>
                                                <span className="font-bold text-blue-600">
                                                    S/ {(proyecto.nextDue !== undefined ? (proyecto.nextDue / 1000).toFixed(0) : "0.0")}K
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </>
            )}
        </TabsContent>
    );
}
