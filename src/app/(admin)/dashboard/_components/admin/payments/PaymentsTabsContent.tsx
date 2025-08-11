import {
    Banknote,
    BarChart3,
    Building2,
    CreditCard,
} from "lucide-react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TabsContent } from "@/components/ui/tabs";
import { AdminDashboard } from "../../../_types/dashboard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface PaymentsTabsContentProps {
    data: AdminDashboard;
    isLoading: boolean;
}

export default function PaymentsTabsContent({ data, isLoading }: PaymentsTabsContentProps) {
    return (
        <TabsContent value="payments" className="space-y-6">
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16">
                    <LoadingSpinner size="lg" text="Cargando datos del equipo..." />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Estado financiero */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-slate-800">
                                    <CreditCard className="w-5 h-5" />
                                    Estado Financiero
                                </CardTitle>
                                <CardDescription>Cronogramas de pago y transacciones</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="p-4 bg-green-50 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-green-800">Total Programado</span>
                                            <span className="text-xl font-bold text-green-600">
                                                S/ {((data?.paymentMetrics?.totalScheduled ?? 0) / 1000000).toFixed(1)}M
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-blue-50 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-blue-800">Total Pagado</span>
                                            <span className="text-xl font-bold text-blue-600">
                                                S/ {(data?.paymentMetrics?.totalPaid ?? 0 / 1000000).toFixed(1)}M
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-amber-50 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-amber-800">Pendiente</span>
                                            <span className="text-xl font-bold text-amber-600">
                                                S/ {(data?.paymentMetrics?.pending ?? 0 / 1000).toFixed(0)}K
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-red-50 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-red-800">Vencido</span>
                                            <span className="text-xl font-bold text-red-600">
                                                S/ {(data?.paymentMetrics?.overdue ?? 0 / 1000).toFixed(0)}K
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span>Progreso de Cobranza</span>
                                        <span>
                                            {Math.round(
                                                ((data?.paymentMetrics?.totalPaid ?? 0) / (data?.paymentMetrics?.totalScheduled ?? 1)) * 100
                                            )}
                                            %
                                        </span>
                                    </div>
                                    <Progress
                                        value={
                                            (data?.paymentMetrics?.totalPaid ?? 0 / (data?.paymentMetrics?.totalScheduled ?? 1)) * 100
                                        }
                                        className="h-4"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Métodos de pago */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-slate-800">
                                    <Banknote className="w-5 h-5" />
                                    Métodos de Pago
                                </CardTitle>
                                <CardDescription>Distribución por tipo de transacción</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Banknote className="w-6 h-6 text-green-600" />
                                            <div>
                                                <p className="font-medium text-green-800">Efectivo</p>
                                                <p className="text-sm text-green-600">
                                                    S/ {(data?.paymentMetrics?.cashPayments ?? 0 / 1000).toFixed(0)}K
                                                </p>
                                            </div>
                                        </div>
                                        <Badge className="bg-green-600 text-white">
                                            {Math.round(
                                                (data?.paymentMetrics?.cashPayments ?? 0 / (data?.paymentMetrics?.totalPaid ?? 1)) * 100
                                            )}
                                            %
                                        </Badge>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <CreditCard className="w-6 h-6 text-blue-600" />
                                            <div>
                                                <p className="font-medium text-blue-800">Transferencias</p>
                                                <p className="text-sm text-blue-600">
                                                    S/ {(data?.paymentMetrics?.bankTransfers ?? 0 / 1000).toFixed(0)}K
                                                </p>
                                            </div>
                                        </div>
                                        <Badge className="bg-blue-600 text-white">
                                            {Math.round(
                                                (data?.paymentMetrics?.bankTransfers ?? 0 / (data?.paymentMetrics?.totalPaid ?? 1)) * 100
                                            )}
                                            %
                                        </Badge>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Building2 className="w-6 h-6 text-purple-600" />
                                            <div>
                                                <p className="font-medium text-purple-800">Depósitos</p>
                                                <p className="text-sm text-purple-600">
                                                    S/ {(data?.paymentMetrics?.deposits ?? 0 / 1000).toFixed(0)}K
                                                </p>
                                            </div>
                                        </div>
                                        <Badge className="bg-purple-600 text-white">
                                            {Math.round(
                                                (data?.paymentMetrics?.deposits ?? 0 / (data?.paymentMetrics?.totalPaid ?? 1)) * 100
                                            )}
                                            %
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Gráfico de ingresos mensuales */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-slate-800">
                                <BarChart3 className="w-5 h-5" />
                                Evolución de Ingresos
                            </CardTitle>
                            <CardDescription>Ingresos mensuales por ventas</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={data?.monthlyPerformance}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => [`S/ ${value.toLocaleString()}`, "Ingresos"]} />
                                    <Area type="monotone" dataKey="revenue" stroke="#105D88" fill="#73BFB7" fillOpacity={0.6} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </>
            )}
        </TabsContent>
    );
}
