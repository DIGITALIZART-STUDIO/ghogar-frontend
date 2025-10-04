"use client";

import { AlertTriangle, ArrowUpRight, Banknote, CheckCircle, Clock, TrendingDown, TrendingUp, XCircle } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { TabsContent } from "@/components/ui/tabs";
import { EmptyState } from "../../EmptyState";
import { FinanceManagerDashboard } from "../../../_types/dashboard";

interface IncomeProjectionTabsContentProps {
    data: FinanceManagerDashboard | undefined;
    isLoading: boolean;
}

export default function IncomeProjectionTabsContent({ data, isLoading }: IncomeProjectionTabsContentProps) {
    const hasIncomeProjection = data?.incomeProjection && data.incomeProjection.length > 0;

    return (
        <TabsContent value="income-projection" className="space-y-6">
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <LoadingSpinner />
                </div>
            ) : (
                <>
                    {/* Proyección de ingresos */}
                    <Card className="shadow-lg border-slate-200 dark:border-slate-700">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300 shadow-sm dark:from-slate-800 dark:to-slate-700 dark:border-slate-600">
                                    <TrendingUp className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                        Proyección de Ingresos
                                    </CardTitle>
                                    <CardDescription className="text-slate-600 dark:text-slate-400">
                                        Escenarios para los próximos 3 meses
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {!hasIncomeProjection ? (
                                <EmptyState
                                    icon={TrendingUp}
                                    title="Sin proyecciones de ingresos"
                                    description="No hay información disponible sobre proyecciones de ingresos futuros"
                                />
                            ) : (
                                <ResponsiveContainer width="100%" height={400}>
                                    <AreaChart
                                        data={data?.incomeProjection?.map((income) => ({
                                            mes: income.month,
                                            optimista: income.optimistic,
                                            realista: income.realistic,
                                            conservador: income.conservative,
                                        }))}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <defs>
                                            <linearGradient id="optimista" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="realista" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="conservador" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="2 4" stroke="#e2e8f0" opacity={0.4} />
                                        <XAxis dataKey="mes" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `S/ ${(value / 1000000).toFixed(1)}M`}
                                        />
                                        <Tooltip
                                            content={({ active, payload, label }) => {
                                                if (active && payload && payload.length) {
                                                    const dataItem = payload[0].payload;
                                                    return (
                                                        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-lg dark:bg-slate-800 dark:border-slate-700">
                                                            <p className="font-semibold mb-3">{label}</p>
                                                            <div className="space-y-2">
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-sm text-green-600">Optimista:</span>
                                                                    <span className="font-bold text-green-600">
                                                                        S/ {(dataItem.optimista / 1000000).toFixed(1)}M
                                                                    </span>
                                                                </div>
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-sm text-blue-600">Realista:</span>
                                                                    <span className="font-bold text-blue-600">
                                                                        S/ {(dataItem.realista / 1000000).toFixed(1)}M
                                                                    </span>
                                                                </div>
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-sm text-amber-600">Conservador:</span>
                                                                    <span className="font-bold text-amber-600">
                                                                        S/ {(dataItem.conservador / 1000000).toFixed(1)}M
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="optimista"
                                            stroke="#10b981"
                                            fillOpacity={1}
                                            fill="url(#optimista)"
                                            strokeWidth={2}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="realista"
                                            stroke="#3b82f6"
                                            fillOpacity={1}
                                            fill="url(#realista)"
                                            strokeWidth={2}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="conservador"
                                            stroke="#f59e0b"
                                            fillOpacity={1}
                                            fill="url(#conservador)"
                                            strokeWidth={2}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>

                    {/* Análisis de escenarios */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="shadow-lg border-slate-200 dark:border-slate-700">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-green-100 border border-green-200 dark:bg-green-900/30 dark:border-green-800">
                                        <ArrowUpRight className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-bold">Escenario Optimista</CardTitle>
                                        <CardDescription>Mejor caso posible</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center mb-4">
                                    <p className="text-3xl font-bold text-green-600">S/ 6.35M</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Total 3 meses</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Promedio mensual</span>
                                        <span className="font-semibold text-green-600">S/ 2.12M</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Vs. actual</span>
                                        <span className="font-semibold text-green-600">+14.6%</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Probabilidad</span>
                                        <span className="font-semibold">25%</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg border-slate-200 dark:border-slate-700">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-blue-100 border border-blue-200 dark:bg-blue-900/30 dark:border-blue-800">
                                        <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-bold">Escenario Realista</CardTitle>
                                        <CardDescription>Más probable</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center mb-4">
                                    <p className="text-3xl font-bold text-blue-600">S/ 5.55M</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Total 3 meses</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Promedio mensual</span>
                                        <span className="font-semibold text-blue-600">S/ 1.85M</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Vs. actual</span>
                                        <span className="font-semibold text-blue-600">+0.0%</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Probabilidad</span>
                                        <span className="font-semibold">50%</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg border-slate-200 dark:border-slate-700">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-amber-100 border border-amber-200 dark:bg-amber-900/30 dark:border-amber-800">
                                        <TrendingDown className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-bold">Escenario Conservador</CardTitle>
                                        <CardDescription>Caso cauteloso</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center mb-4">
                                    <p className="text-3xl font-bold text-amber-600">S/ 4.95M</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Total 3 meses</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Promedio mensual</span>
                                        <span className="font-semibold text-amber-600">S/ 1.65M</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Vs. actual</span>
                                        <span className="font-semibold text-amber-600">-10.8%</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Probabilidad</span>
                                        <span className="font-semibold">25%</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Factores de riesgo y oportunidades */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="shadow-lg border-slate-200 dark:border-slate-700">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-red-100 border border-red-200 dark:bg-red-900/30 dark:border-red-800">
                                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-bold">Factores de Riesgo</CardTitle>
                                        <CardDescription>Elementos que podrían afectar las proyecciones</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 rounded-xl bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800/30">
                                    <div className="flex items-center gap-3 mb-2">
                                        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                        <span className="font-semibold text-red-800 dark:text-red-200">Cuentas Vencidas</span>
                                    </div>
                                    <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                                        S/ 450K en cuentas vencidas podrían impactar el flujo de ingresos
                                    </p>
                                    <p className="text-xs text-red-600 dark:text-red-400">Impacto: -5% en proyecciones</p>
                                </div>

                                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/30">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                        <span className="font-semibold text-amber-800 dark:text-amber-200">Estacionalidad</span>
                                    </div>
                                    <p className="text-sm text-amber-700 dark:text-amber-300 mb-2">
                                        Enero-Febrero tradicionalmente tienen menor actividad de cobranza
                                    </p>
                                    <p className="text-xs text-amber-600 dark:text-amber-400">Impacto: -8% en Q1</p>
                                </div>

                                <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 dark:bg-orange-900/20 dark:border-orange-800/30">
                                    <div className="flex items-center gap-3 mb-2">
                                        <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                        <span className="font-semibold text-orange-800 dark:text-orange-200">Morosidad</span>
                                    </div>
                                    <p className="text-sm text-orange-700 dark:text-orange-300 mb-2">
                                        Incremento en días de cartera podría retrasar ingresos
                                    </p>
                                    <p className="text-xs text-orange-600 dark:text-orange-400">Impacto: -3% en liquidez</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg border-slate-200 dark:border-slate-700">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-green-100 border border-green-200 dark:bg-green-900/30 dark:border-green-800">
                                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-bold">Oportunidades</CardTitle>
                                        <CardDescription>Factores que podrían mejorar las proyecciones</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 rounded-xl bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800/30">
                                    <div className="flex items-center gap-3 mb-2">
                                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                        <span className="font-semibold text-green-800 dark:text-green-200">El Bosque - Cierre Total</span>
                                    </div>
                                    <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                                        Solo quedan 3 lotes por cobrar, alta probabilidad de cierre completo
                                    </p>
                                    <p className="text-xs text-green-600 dark:text-green-400">Potencial: +S/ 200K</p>
                                </div>

                                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/30">
                                    <div className="flex items-center gap-3 mb-2">
                                        <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <span className="font-semibold text-blue-800 dark:text-blue-200">
                                            Torres del Sol - Recuperación
                                        </span>
                                    </div>
                                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                                        Cronograma de pagos activo con alta probabilidad de cumplimiento
                                    </p>
                                    <p className="text-xs text-blue-600 dark:text-blue-400">Potencial: +S/ 890K</p>
                                </div>

                                <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 dark:bg-purple-900/20 dark:border-purple-800/30">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Banknote className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        <span className="font-semibold text-purple-800 dark:text-purple-200">Mejora en Cobranza</span>
                                    </div>
                                    <p className="text-sm text-purple-700 dark:text-purple-300 mb-2">
                                        Implementación de estrategias de cobranza más efectivas
                                    </p>
                                    <p className="text-xs text-purple-600 dark:text-purple-400">Potencial: +2% eficiencia</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}
        </TabsContent>
    );
}
