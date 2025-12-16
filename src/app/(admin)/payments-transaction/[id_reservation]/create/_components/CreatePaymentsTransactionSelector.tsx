import { format} from "date-fns";
import { es } from "date-fns/locale";
import {
    DollarSign,
    CheckCircle2,
    Calculator,
    User,
    FileText,
    Clock,
    Target
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {  FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import { getCurrencySymbol } from "../../../_utils/payment-transaction.utils";
import { PaymentQuotaStatus } from "../../../_types/paymentTransaction";
import { UseFormReturn } from "react-hook-form";
import { PaymentTransactionCreateFormData } from "../../../_schemas/createPaymentTransactionSchema";
import { PaymentMethodLabels } from "@/app/(admin)/reservations/_utils/reservations.utils";
import { PaymentMethod } from "@/app/(admin)/reservations/_types/reservation";

interface CreatePaymentsTransactionFormProps {
   availablePayments: PaymentQuotaStatus;
    selectedPayments: Array<string>;
    setSelectedPayments: React.Dispatch<React.SetStateAction<Array<string>>>;
    totalSelectedAmount: number;
    totalAvailableAmount: number;
     form: UseFormReturn<PaymentTransactionCreateFormData>;
}

export default function CreatePaymentsTransactionSelector({ availablePayments, selectedPayments, setSelectedPayments,  totalSelectedAmount, totalAvailableAmount, form }: CreatePaymentsTransactionFormProps) {
    const handlePaymentToggle = (paymentId: string) => {
        setSelectedPayments((prev: Array<string>) => (prev.includes(paymentId)
            ? prev.filter((id) => id !== paymentId)
            : [...prev, paymentId])
        );
    };
    return (
        <div>
            <Card className="border overflow-hidden pt-0">
                <CardHeader className="pb-4 bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-gray-100 pt-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-slate-200 dark:bg-zinc-900 rounded-lg flex items-center justify-center">
                                <Calculator className="h-5 w-5 text-gray-500 dark:text-gray-300" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Gestión de Cuotas</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Selecciona las cuotas a procesar</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700">
                                {availablePayments.pendingQuotas?.length ?? 0} disponibles
                            </Badge>
                            {selectedPayments.length > 0 && (
                                <Badge className="bg-gray-700 dark:bg-emerald-700 text-white border-gray-700 dark:border-emerald-700">
                                    {selectedPayments.length} seleccionadas
                                </Badge>
                            )}
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="px-1">
                    {/* Filtros y controles */}
                    <div className="flex items-center justify-between mb-6 px-6">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-gray-400">
                                <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                                <span>Seleccionadas</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-gray-400">
                                <div className="w-3 h-3 bg-slate-200 dark:bg-gray-700 rounded-full" />
                                <span>Disponibles</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-gray-400">
                                <div className="w-3 h-3 bg-red-200 dark:bg-red-700 rounded-full" />
                                <span>Vencidas</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {availablePayments.minQuotasToPay && selectedPayments.length < availablePayments.minQuotasToPay && (
                                <Badge className="bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700">
                                    Mínimo: {availablePayments.minQuotasToPay} cuotas
                                </Badge>
                            )}
                            {availablePayments.maxQuotasToPay && selectedPayments.length > availablePayments.maxQuotasToPay && (
                                <Badge className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700">
                                    Máximo: {availablePayments.maxQuotasToPay} cuotas
                                </Badge>
                            )}
                            {selectedPayments.length > 0 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedPayments([])}
                                    className="text-slate-600 dark:text-gray-300 hover:text-slate-800 dark:hover:text-gray-100"
                                >
                                    Limpiar selección
                                </Button>
                            )}
                        </div>
                    </div>

                    <ScrollArea className="h-[385px]">
                        <div className="grid gap-4 px-6">
                            {!availablePayments.pendingQuotas || availablePayments.pendingQuotas.length === 0 ? (
                                <div className="text-center py-8 text-slate-500 dark:text-gray-400">
                                    No hay cuotas pendientes disponibles
                                </div>
                            ) : (
                                availablePayments.pendingQuotas.map((payment) => {
                                    const isSelected = selectedPayments.includes(payment.id ?? "");
                                    const isOverdue = payment.dueDate ? new Date(payment.dueDate) < new Date() : false;

                                    return (
                                        <div
                                            key={payment.id}
                                            onClick={() => handlePaymentToggle(payment.id ?? "")}
                                            className={`relative p-4 rounded-2xl border-2 cursor-pointer overflow-hidden ${
                                                isSelected
                                                    ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/40 dark:border-emerald-700"
                                                    : isOverdue
                                                        ? "border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/40 hover:border-red-300 dark:hover:border-red-500"
                                                        : "border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-slate-300 dark:hover:zinc-600 hover:bg-slate-50 dark:hover:bg-zinc-800"
                                            }`}
                                        >
                                            {/* Checkbox flotante */}
                                            <div className="absolute top-4 right-4 z-10">
                                                <div
                                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                                        isSelected
                                                            ? "border-emerald-500 bg-emerald-500"
                                                            : "border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-slate-400 dark:hover:border-zinc-500"
                                                    }`}
                                                >
                                                    {isSelected && <CheckCircle2 className="h-4 w-4 text-white" />}
                                                </div>
                                            </div>

                                            <div className="pr-10">
                                                {/* Header de la cuota */}
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-4">
                                                        <div
                                                            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${
                                                                isSelected ? "bg-emerald-100 dark:bg-emerald-900/60" : isOverdue ? "bg-red-100 dark:bg-red-900/60" : "bg-slate-100 dark:bg-zinc-800"
                                                            }`}
                                                        >
                                                            <User
                                                                className={`h-4 w-4 ${
                                                                    isSelected ? "text-emerald-600" : isOverdue ? "text-red-600" : "text-slate-500 dark:text-gray-300"
                                                                }`}
                                                            />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-slate-900 dark:text-gray-100 mb-1">{payment.clientName}</h4>
                                                            <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-gray-400">
                                                                <div className="flex items-center gap-1">
                                                                    <FileText className="h-3 w-3" />
                                                                    <span className="font-mono">{payment.quotationCode}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Información de la cuota */}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    {/* Monto */}
                                                    <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-slate-100 dark:border-zinc-700">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <DollarSign className="h-4 w-4 text-green-600" />
                                                            <span className="text-xs font-medium text-slate-600 dark:text-gray-400 uppercase tracking-wide">
                                                                Monto
                                                            </span>
                                                        </div>
                                                        <div className="text-lg font-semibold text-slate-900 dark:text-gray-100">
                                                            {getCurrencySymbol(payment.currency ?? "")}
                                                            {(payment.amountDue ?? 0).toLocaleString()}
                                                        </div>
                                                        <Badge
                                                            variant="outline"
                                                        >
                                                            {payment.currency}
                                                        </Badge>
                                                    </div>

                                                    {/* Fecha de vencimiento */}
                                                    <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-slate-100 dark:border-zinc-700">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Clock className="h-4 w-4 text-blue-600" />
                                                            <span className="text-xs font-medium text-slate-600 dark:text-gray-400 uppercase tracking-wide">
                                                                Vencimiento
                                                            </span>
                                                        </div>
                                                        <div className="text-lg font-semibold text-slate-900 dark:text-gray-100">
                                                            {payment.dueDate ? format(new Date(payment.dueDate), "dd MMM", { locale: es }) : "--"}
                                                        </div>
                                                        <div className="text-sm text-slate-500 dark:text-gray-400">
                                                            {payment.dueDate ? format(new Date(payment.dueDate), "yyyy", { locale: es }) : "--"}
                                                        </div>
                                                        {isOverdue && (
                                                            <Badge className="text-xs mt-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700">Vencida</Badge>
                                                        )}
                                                    </div>

                                                    {/* Estado */}
                                                    <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-slate-100 dark:border-zinc-700">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Target className="h-4 w-4 text-purple-600" />
                                                            <span className="text-xs font-medium text-slate-600 dark:text-gray-400 uppercase tracking-wide">
                                                                Estado
                                                            </span>
                                                        </div>
                                                        <div className="space-y-2">
                                                            {isSelected ? (
                                                                <Badge className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-200 border-emerald-200 dark:border-emerald-700">
                                                                    Seleccionada
                                                                </Badge>
                                                            ) : (
                                                                <Badge variant="outline" className="bg-slate-50 dark:bg-gray-800 text-slate-600 dark:text-gray-400 border-slate-200 dark:border-gray-700">
                                                                    Disponible
                                                                </Badge>
                                                            )}
                                                            <div className="text-xs text-slate-500 dark:text-gray-400">
                                                                {isOverdue ? "Pago atrasado" : "En tiempo"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Barra de progreso individual */}
                                                {isSelected && (
                                                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-emerald-900">
                                                        <div className="flex items-center justify-between text-sm text-slate-600 dark:text-gray-400 mb-2">
                                                            <span>Incluida en el pago</span>
                                                            <span className="font-medium">100%</span>
                                                        </div>
                                                        <div className="w-full bg-slate-200 dark:bg-emerald-900 rounded-full h-2">
                                                            <div className="bg-emerald-500 h-2 rounded-full w-full transition-all duration-500" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Efecto de selección */}
                                            {isSelected && (
                                                <div className="absolute inset-0 rounded-2xl bg-emerald-500/5 dark:bg-emerald-900/10 pointer-events-none" />
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </ScrollArea>

                    {/* Resumen inferior */}
                    {selectedPayments.length > 0 && (
                        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-zinc-700 px-6">
                            <div className="bg-slate-50 dark:bg-zinc-800 rounded-xl p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
                                            <Calculator className="h-5 w-5 text-emerald-600 dark:text-white" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-900 dark:text-gray-100">
                                                {selectedPayments.length} cuotas seleccionadas
                                            </div>
                                            <div className="text-sm text-slate-600 dark:text-gray-400">Total a procesar</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-slate-900 dark:text-gray-100">
                                            {availablePayments.currency === "SOLES" ? "S/" : "$"}{totalSelectedAmount.toLocaleString()}
                                        </div>
                                        <div className="text-sm text-slate-600 dark:text-gray-400">
                                            {((totalSelectedAmount / totalAvailableAmount) * 100).toFixed(1)}% del total
                                        </div>
                                        {availablePayments.totalAmountRemaining && (
                                            <div className="text-xs text-slate-500 dark:text-gray-400">
                                                Restante: {availablePayments.currency === "SOLES" ? "S/" : "$"}{(availablePayments.totalAmountRemaining - totalSelectedAmount).toLocaleString()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <FormField
                        control={form.control}
                        name="paymentIds"
                        render={() => (
                            <FormItem className="mt-4 px-6">
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>

            {/* Resumen y botones de acción */}
            {selectedPayments.length > 0 && (
                <Card className="border bg-slate-50 dark:bg-gray-800 mt-4">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                    <Calculator className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900 dark:text-gray-100">Resumen de Transacción</h4>
                                    <p className="text-sm text-slate-600 dark:text-gray-400">
                                        {selectedPayments.length} cuotas seleccionadas • Total: {availablePayments.currency === "SOLES" ? "S/" : "$"}
                                        {totalSelectedAmount.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {(() => {
                                    const method = form.watch("paymentMethod") as PaymentMethod;
                                    const info = PaymentMethodLabels[method];
                                    if (!info) {
                                        return null;
                                    }
                                    const Icon = info.icon;
                                    return (
                                        <Badge className={`${info.className} border dark:border-gray-700`}  variant="outline">
                                            <Icon className={info.iconClass} />
                                            <span className="ml-1">{info.label}</span>
                                        </Badge>
                                    );
                                })()}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
