"use client";

import { ArrowUpRight, BarChart3, TrendingUp, Wallet } from "lucide-react";
import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { TabsContent } from "@/components/ui/tabs";
import { EmptyState } from "../../EmptyState";
import { FinanceManagerDashboard } from "../../../_types/dashboard";

interface IncomeTabsContentProps {
    data: FinanceManagerDashboard | undefined;
    isLoading: boolean;
}

export default function IncomeTabsContent({ data, isLoading }: IncomeTabsContentProps) {
    const hasMonthlyIncome = data?.monthlyIncome && data.monthlyIncome.length > 0;

    return (
        <TabsContent value="income" className="space-y-6">
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <LoadingSpinner />
                </div>
            ) : (
                <>
                    {/* Evolución de ingresos cobrados */}
                    <Card className="shadow-lg border-slate-200 dark:border-slate-700">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300 shadow-sm dark:from-slate-800 dark:to-slate-700 dark:border-slate-600">
                                    <TrendingUp className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                        Evolución de Ingresos Cobrados
                                    </CardTitle>
                                    <CardDescription className="text-slate-600 dark:text-slate-400">
                                        Ingresos efectivamente cobrados por mes
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {!hasMonthlyIncome ? (
                                <EmptyState
                                    icon={TrendingUp}
                                    title="Sin datos de ingresos"
                                    description="No hay información disponible sobre la evolución de ingresos mensuales"
                                />
                            ) : (
                                <ResponsiveContainer width="100%" height={400}>
                                    <ComposedChart
                                        data={data?.monthlyIncome?.map((income) => ({
                                            mes: income.month,
                                            cobrado: income.collected,
                                            acumulado: income.accumulated,
                                            proyectos: income.projects,
                                        }))}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.4} />
                                        <XAxis
                                            dataKey="mes"
                                            fontSize={12}
                                            fontWeight={600}
                                            tickLine={false}
                                            axisLine={false}
                                            tick={{ fill: "#64748b" }}
                                        />
                                        <YAxis
                                            fontSize={12}
                                            fontWeight={600}
                                            tickLine={false}
                                            axisLine={false}
                                            tick={{ fill: "#64748b" }}
                                            tickFormatter={(value) => `S/ ${(value / 1000000).toFixed(1)}M`}
                                        />
                                        <Tooltip
                                            content={({ active, payload, label }) => {
                                                if (active && payload && payload.length) {
                                                    const dataItem = payload[0].payload;
                                                    return (
                                                        <div className="bg-white border border-slate-200 rounded-xl p-4 min-w-[300px] shadow-lg dark:bg-slate-800 dark:border-slate-700">
                                                            <h4 className="font-bold text-lg mb-3">{label}</h4>
                                                            <div className="space-y-2">
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-sm text-green-600">Cobrado:</span>
                                                                    <span className="font-bold text-green-600">
                                                                        S/ {(dataItem.cobrado / 1000000).toFixed(1)}M
                                                                    </span>
                                                                </div>
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-sm text-blue-600">Acumulado:</span>
                                                                    <span className="font-bold text-blue-600">
                                                                        S/ {(dataItem.acumulado / 1000000).toFixed(1)}M
                                                                    </span>
                                                                </div>
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-sm text-purple-600">Proyectos activos:</span>
                                                                    <span className="font-bold text-purple-600">{dataItem.proyectos}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Bar dataKey="cobrado" name="Ingresos Cobrados" fill="#10b981" radius={[4, 4, 0, 0]} />
                                        <Line
                                            type="monotone"
                                            dataKey="acumulado"
                                            stroke="#3b82f6"
                                            strokeWidth={3}
                                            name="Acumulado"
                                            dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
                                        />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            )}
                        </CardContent>
                    </Card>

                    {/* Métricas de ingresos */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="shadow-lg border-slate-200 dark:border-slate-700">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-green-100 border border-green-200 dark:bg-green-900/30 dark:border-green-800">
                                        <ArrowUpRight className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-bold">Mejor Mes</CardTitle>
                                        <CardDescription>Octubre 2024</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center mb-4">
                                    <p className="text-3xl font-bold text-green-600">S/ 1.89M</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Ingresos cobrados</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Proyectos activos</span>
                                        <span className="font-semibold text-green-600">4</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Vs. promedio</span>
                                        <span className="font-semibold text-green-600">+24.8%</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg border-slate-200 dark:border-slate-700">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-blue-100 border border-blue-200 dark:bg-blue-900/30 dark:border-blue-800">
                                        <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-bold">Promedio Mensual</CardTitle>
                                        <CardDescription>Últimos 6 meses</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center mb-4">
                                    <p className="text-3xl font-bold text-blue-600">S/ 1.48M</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Ingresos promedio</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Tendencia</span>
                                        <span className="font-semibold text-green-600">↗ Creciente</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Variabilidad</span>
                                        <span className="font-semibold text-blue-600">±18.2%</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg border-slate-200 dark:border-slate-700">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-purple-100 border border-purple-200 dark:bg-purple-900/30 dark:border-purple-800">
                                        <Wallet className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg font-bold">Total Acumulado</CardTitle>
                                        <CardDescription>6 meses</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center mb-4">
                                    <p className="text-3xl font-bold text-purple-600">S/ 8.85M</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Ingresos cobrados</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>% del facturado</span>
                                        <span className="font-semibold text-purple-600">80.2%</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Crecimiento</span>
                                        <span className="font-semibold text-green-600">+12.8%</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}
        </TabsContent>
    );
}
