"use client";

import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Receipt,
  Target,
  Timer,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PaymentMethodLabels } from "@/app/(admin)/reservations/_utils/reservations.utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Progress } from "@/components/ui/progress";
import { TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { AdminDashboard } from "../../../_types/dashboard";

interface PaymentsTabsContentProps {
  data: AdminDashboard;
  isLoading: boolean;
}

const PaymentPipelineStages = {
  Cotizaciones: {
    color: "bg-blue-500",
    icon: Target,
  },
  Separaciones: {
    color: "bg-green-500",
    icon: Receipt,
  },
  Cronogramas: {
    color: "bg-yellow-500",
    icon: Calendar,
  },
  "Pagos Realizados": {
    color: "bg-purple-500",
    icon: CreditCard,
  },
};

export default function PaymentsTabsContent({ data, isLoading }: PaymentsTabsContentProps) {
  const paymentMetrics = data?.paymentMetrics;

  return (
    <TabsContent value="payments" className="space-y-6">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <LoadingSpinner size="lg" text="Cargando datos de pagos..." />
        </div>
      ) : (
        <>
          {/* Pipeline de conversión */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                  <Target className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Pipeline de Conversión</CardTitle>
                  <CardDescription>Flujo completo desde cotizaciones hasta pagos realizados</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {data?.paymentPipeline?.map((stage, index) => {
                  const pipelineStage = PaymentPipelineStages[stage.stage as keyof typeof PaymentPipelineStages];
                  return (
                    <div key={index} className="relative">
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center text-white",
                              pipelineStage?.color
                            )}
                          >
                            {pipelineStage?.icon && <pipelineStage.icon className="w-5 h-5" />}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-slate-800 dark:text-slate-200">{stage.stage}</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{stage.count} registros</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Monto total</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              S/ {((stage.amount ?? 0) / 1000).toFixed(1)}K
                            </span>
                          </div>
                          {index > 0 && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-slate-600 dark:text-slate-400">Conversión</span>
                              <Badge variant="outline" className="text-xs">
                                {(
                                  ((stage.count ?? 0) / (data?.paymentPipeline?.[index - 1]?.count ?? 1)) *
                                  100
                                ).toFixed(1)}
                                %
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                      {index < (data?.paymentPipeline?.length ?? 0) - 1 && (
                        <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                          <div className="w-4 h-4 bg-white border-2 border-slate-300 rounded-full flex items-center justify-center dark:bg-slate-900 dark:border-slate-600">
                            <ArrowRight className="w-2 h-2 text-slate-500" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Análisis principal */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Estado de reservaciones */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                    <Receipt className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">Estado de Separaciones</CardTitle>
                    <CardDescription>Reservaciones por estado</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <ResponsiveContainer width="100%" height={160}>
                      <RechartsPieChart>
                        <Pie
                          data={data.reservationStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={65}
                          paddingAngle={2}
                          dataKey="count"
                          stroke="none"
                        >
                          {data.reservationStatusData?.map((entry, index) => {
                            // Asignar colores directamente en formato HEX
                            const color =
                              entry.status === "ISSUED"
                                ? "#3b82f6" // Azul para "Emitida"
                                : entry.status === "CANCELED"
                                  ? "#10b981" // Verde para "Cancelado"
                                  : entry.status === "ANULATED"
                                    ? "#ef4444" // Rojo para "Anulado"
                                    : "#64748b"; // Gris por defecto

                            return <Cell key={`cell-${index}`} fill={color} />;
                          })}
                        </Pie>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload[0]) {
                              const data = payload[0].payload;
                              const color =
                                data.status === "ISSUED"
                                  ? "#3b82f6"
                                  : data.status === "CANCELED"
                                    ? "#10b981"
                                    : data.status === "ANULATED"
                                      ? "#ef4444"
                                      : "#64748b";

                              return (
                                <div className="bg-white border border-slate-200 rounded-xl p-3 dark:bg-slate-800 dark:border-slate-700 flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                                  <div>
                                    <p className="font-semibold">
                                      {data.status === "ISSUED"
                                        ? "Emitida"
                                        : data.status === "CANCELED"
                                          ? "Cancelado"
                                          : data.status === "ANULATED"
                                            ? "Anulado"
                                            : "Desconocido"}
                                    </p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                      {data.count} reservas ({data.percentage}%)
                                    </p>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>

                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="text-center">
                        <div className="text-lg font-bold text-slate-800 dark:text-slate-200">
                          {data.reservationStatusData?.reduce((sum, item) => sum + (item.count ?? 0), 0) ?? 0}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Total</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {data.reservationStatusData?.map((status, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{
                                backgroundColor:
                                  status.status === "ISSUED"
                                    ? "#3b82f6" // Azul para "Emitida"
                                    : status.status === "CANCELED"
                                      ? "#10b981" // Verde para "Cancelado"
                                      : status.status === "ANULATED"
                                        ? "#ef4444" // Rojo para "Anulado"
                                        : "#64748b", // Gris por defecto
                              }}
                            />
                            <span className="font-medium text-sm">
                              {status.status === "ISSUED"
                                ? "Emitida"
                                : status.status === "CANCELED"
                                  ? "Cancelado"
                                  : status.status === "ANULATED"
                                    ? "Anulado"
                                    : "Desconocido"}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold">{status.count}</span>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {status.percentage}%
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Métodos de pago */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                    <CreditCard className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">Métodos de Pago</CardTitle>
                    <CardDescription>Preferencias de transacciones</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.paymentMethodsData?.map((method, index) => {
                  const methodLabel = PaymentMethodLabels[method.method as keyof typeof PaymentMethodLabels];
                  return (
                    <div
                      key={index}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${methodLabel?.bgClass}`}
                          >
                            {methodLabel?.icon && <methodLabel.icon className={`w-4 h-4 ${methodLabel?.iconClass}`} />}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{methodLabel?.label}</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">{method.count} transacciones</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">S/ {((method.amount ?? 0) / 1000).toFixed(0)}K</p>
                          <Badge variant="outline" className="text-xs">
                            {method.percentage}%
                          </Badge>
                        </div>
                      </div>
                      <Progress
                        value={method.percentage}
                        indicatorClassName={methodLabel?.bgClass.replace("bg-", "bg-gradient-to-r from-")} // Aplica el color dinámico
                        className="h-2"
                      />
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Alertas de vencimientos */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                    <Timer className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">Próximos Vencimientos</CardTitle>
                    <CardDescription>Pagos programados urgentes</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.upcomingPayments?.map((payment, index) => (
                  <div
                    key={index}
                    className={cn(
                      "p-3 rounded-xl border",
                      payment.status === "urgent"
                        ? "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800/30"
                        : payment.status === "warning"
                          ? "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/30"
                          : "bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold",
                            payment.status === "urgent"
                              ? "bg-red-500"
                              : payment.status === "warning"
                                ? "bg-amber-500"
                                : "bg-slate-500"
                          )}
                        >
                          {payment.daysLeft}
                        </div>
                        <span className="font-medium text-sm">{payment.clientName}</span>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          payment.status === "urgent"
                            ? "bg-red-100 text-red-700 border-red-200"
                            : payment.status === "warning"
                              ? "bg-amber-100 text-amber-700 border-amber-200"
                              : "bg-slate-100 text-slate-700 border-slate-200"
                        )}
                      >
                        {payment.status === "urgent" ? "Urgente" : payment.status === "warning" ? "Próximo" : "Normal"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span className="text-xs text-slate-600 dark:text-slate-400">{payment.dueDate}</span>
                      </div>
                      <span className="font-bold text-sm">S/ {(payment.amountDue ?? 0).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Flujo de caja */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                    <BarChart3 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">Flujo de Caja</CardTitle>
                    <CardDescription>Comparativo: Programado vs Realizado vs Separaciones</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-500" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Programado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Realizado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Separaciones</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data.cashFlowData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="2 4" stroke="#e2e8f0" opacity={0.4} vertical={false} />
                  <XAxis
                    dataKey="month"
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
                    tickFormatter={(value) => `S/ ${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white border border-slate-200 rounded-xl p-4 dark:bg-slate-800 dark:border-slate-700">
                            <p className="font-semibold mb-2">{label}</p>
                            {payload.map((entry, index) => (
                              <p key={index} className="text-sm" style={{ color: entry.color }}>
                                {entry.name}: S/ {entry.value?.toLocaleString()}
                              </p>
                            ))}
                            <div className="pt-2 border-t border-slate-200 dark:border-slate-600 mt-2">
                              <p className="text-sm font-medium">
                                Eficiencia:{" "}
                                {payload[1] && payload[0]
                                  ? (((payload[1].value as number) / (payload[0].value as number)) * 100).toFixed(1)
                                  : 0}
                                %
                              </p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="programado" name="Programado" fill="#64748b" radius={[4, 4, 0, 0]} maxBarSize={60} />
                  <Bar dataKey="realizado" name="Realizado" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={60} />
                  <Bar
                    dataKey="separaciones"
                    name="Separaciones"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={60}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Resumen financiero */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-100 border border-green-200 dark:bg-green-900/30 dark:border-green-800">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-green-600 text-sm font-medium dark:text-green-400">Total Cobrado</p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                      S/ {((paymentMetrics?.totalPaid ?? 0) / 1000000).toFixed(1)}M
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">Transacciones confirmadas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 border border-blue-200 dark:bg-blue-900/30 dark:border-blue-800">
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-blue-600 text-sm font-medium dark:text-blue-400">Programado</p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                      S/ {((paymentMetrics?.totalScheduled ?? 0) / 1000000).toFixed(1)}M
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">En cronogramas activos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 border border-amber-200 dark:bg-amber-900/30 dark:border-amber-800">
                    <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-amber-600 text-sm font-medium dark:text-amber-400">Pendiente</p>
                    <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                      S/ {((paymentMetrics?.pending ?? 0) / 1000).toFixed(0)}K
                    </p>
                    <p className="text-xs text-amber-600 dark:text-amber-400">Por cobrar este mes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-100 border border-red-200 dark:bg-red-900/30 dark:border-red-800">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-red-600 text-sm font-medium dark:text-red-400">Vencido</p>
                    <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                      S/ {((paymentMetrics?.overdue ?? 0) / 1000).toFixed(0)}K
                    </p>
                    <p className="text-xs text-red-600 dark:text-red-400">Requiere seguimiento</p>
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
