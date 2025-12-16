"use client";

import { Calendar, Clock, CheckCircle, AlertTriangle, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { PaymentDto } from "@/app/(admin)/reservations/[reservationId]/payments/_types/payments";
import { PaymentStatus } from "../../../_types/paymentTransaction";

interface PaymentSchedulePanelProps {
  payments: Array<PaymentDto>
  currency: string
}

const getPaymentStatus = (payment: PaymentDto): PaymentStatus => {
    if (payment.paid) {
        return PaymentStatus.PAID;
    }

    const dueDate = payment.dueDate ? new Date(payment.dueDate) : new Date(0);
    const today = new Date();

    if (dueDate < today) {
        return PaymentStatus.OVERDUE;
    }

    // Si hay pagos parciales, mostrar como pendiente pero con indicador visual
    return PaymentStatus.PENDING;
};

export function PaymentSchedulePanel({ payments, currency }: PaymentSchedulePanelProps) {
    // Usar los nuevos campos para cálculos más precisos
    const totalAmount = payments.reduce((sum, payment) => sum + (payment.amountDue ?? 0), 0);
    const totalPaidAmount = payments.reduce((sum, payment) => sum + (payment.amountPaid ?? 0), 0);
    const totalRemainingAmount = payments.reduce((sum, payment) => sum + (payment.remainingAmount ?? 0), 0);

    // Calcular progreso basado en el monto realmente pagado
    const progressPercentage = totalAmount > 0 ? (totalPaidAmount / totalAmount) * 100 : 0;

    // Contadores más precisos
    const fullyPaidCount = payments.filter((p) => p.paid).length;
    const partiallyPaidCount = payments.filter((p) => (p.amountPaid ?? 0) > 0 && !p.paid).length;
    const pendingCount = payments.filter((p) => (p.amountPaid ?? 0) === 0 && p.dueDate && new Date(p.dueDate) >= new Date()).length;
    const overdueCount = payments.filter((p) => (p.amountPaid ?? 0) === 0 && p.dueDate && new Date(p.dueDate) < new Date()).length;

    const currencySymbol = currency === "DOLARES" ? "$" : "S/";

    return (
        <div className="h-full flex flex-col bg-white dark:bg-gray-900">
            {/* Header adaptable */}
            <div className="p-3 sm:p-4 lg:p-6 border-b bg-gradient-to-r from-slate-50 to-gray-50 dark:from-gray-900 dark:to-gray-800 dark:border-gray-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-1.5 sm:p-2 bg-primary/20 dark:bg-primary/30 rounded-lg">
                            <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm sm:text-base lg:text-lg text-gray-900 dark:text-gray-100 truncate">
                                Cronograma
                            </h3>
                            <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 mt-0.5 hidden lg:block truncate">Seguimiento de cuotas</p>
                        </div>
                    </div>
                    <Badge
                        variant="secondary"
                        className="px-2 sm:px-3 py-1 text-xs font-medium bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 border-blue-200 dark:border-blue-800 self-start sm:self-auto"
                    >
                        {payments.length} cuotas
                    </Badge>
                </div>

                {/* Estadísticas adaptables */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-5">
                    <div className="bg-white dark:bg-gray-950 p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl border border-green-100 dark:border-green-900 min-w-0">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            <div className="p-1 sm:p-2 bg-green-100 rounded-lg flex-shrink-0">
                                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-green-700">{fullyPaidCount}</div>
                                <div className="text-xs lg:text-sm text-green-600 font-medium overflow-hidden">
                                    <span className="hidden sm:inline">Completamente Pagadas</span>
                                    <span className="sm:hidden">Pag.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-950 p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl border border-blue-100 dark:border-blue-900 min-w-0">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            <div className="p-1 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
                                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-blue-700">
                                    {partiallyPaidCount}
                                </div>
                                <div className="text-xs lg:text-sm text-blue-600 font-medium overflow-hidden">
                                    <span className="hidden sm:inline">Parcialmente Pagadas</span>
                                    <span className="sm:hidden">Parc.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-950 p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl border border-yellow-100 dark:border-yellow-900 min-w-0">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            <div className="p-1 sm:p-2 bg-yellow-100 rounded-lg flex-shrink-0">
                                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-yellow-700">
                                    {pendingCount}
                                </div>
                                <div className="text-xs lg:text-sm text-yellow-600 font-medium overflow-hidden">
                                    <span className="hidden sm:inline">Pendientes</span>
                                    <span className="sm:hidden">Pend.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-950 p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl border border-red-100 dark:border-red-900 min-w-0">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            <div className="p-1 sm:p-2 bg-red-100 rounded-lg flex-shrink-0">
                                <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-red-700">{overdueCount}</div>
                                <div className="text-xs lg:text-sm text-red-600 font-medium overflow-hidden">
                                    <span className="hidden sm:inline">Vencidas</span>
                                    <span className="sm:hidden">Venc.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progreso financiero adaptable */}
                <div className="bg-white dark:bg-gray-950 p-3 sm:p-4 rounded-lg sm:rounded-xl border dark:border-gray-800">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-3">
                        <div className="flex items-center gap-2">
                            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-300" />
                            <span className="text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-200 truncate">Progreso Financiero</span>
                        </div>
                        <div className="text-left sm:text-right">
                            <div className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
                                {currencySymbol}
                                {totalPaidAmount.toLocaleString()}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                de {currencySymbol}
                                {totalAmount.toLocaleString()}
                            </div>
                        </div>
                    </div>
                    <Progress value={progressPercentage} className="h-2 sm:h-3 mb-2" />
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-0">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{progressPercentage.toFixed(1)}% completado</span>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
                            {currencySymbol}
                            {totalRemainingAmount.toLocaleString()} restante
                        </span>
                    </div>
                </div>
            </div>

            {/* Lista de pagos adaptable */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
                <div className="space-y-3 sm:space-y-4">
                    {payments.map((payment, index) => {
                        const status = getPaymentStatus(payment);
                        const isOverdue = status === PaymentStatus.OVERDUE;
                        const isPaid = status === PaymentStatus.PAID;

                        return (
                            <div
                                key={payment.id}
                                className={`relative group p-3 sm:p-4 lg:p-5 rounded-lg sm:rounded-xl border-2 overflow-hidden ${
                                    isPaid
                                        ? "bg-green-50/50 dark:bg-green-900/50 border-green-200 dark:border-green-800 hover:border-green-300 hover:bg-green-50 dark:hover:bg-green-900"
                                        : isOverdue
                                            ? "bg-red-50/50 dark:bg-red-900/50 border-red-200 dark:border-red-800 hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-900"
                                            : "bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 hover:border-gray-300 hover:bg-gray-50/50 dark:hover:bg-gray-900/50"
                                }`}
                            >
                                {/* Indicador lateral */}
                                <div
                                    className={`absolute left-0 top-0 w-1 h-full rounded-l-xl ${
                                        isPaid ? "bg-green-500" : isOverdue ? "bg-red-500" : "bg-yellow-500 dark:bg-yellow-700"
                                    }`}
                                />

                                {/* Header de la cuota adaptable */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-3 sm:mb-4">
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div
                                            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                                                isPaid
                                                    ? "bg-green-600 text-white"
                                                    : isOverdue
                                                        ? "bg-red-600 text-white"
                                                        : "bg-yellow-600 dark:bg-yellow-700 text-white"
                                            }`}
                                        >
                                            {index + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-xs sm:text-sm lg:text-base text-gray-900 dark:text-gray-100 truncate">
                                                Cuota #{index + 1}
                                            </h4>
                                            <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 truncate">
                                                {isPaid ? "Pagada" : isOverdue ? "Vencida" : "Pendiente"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 self-start sm:self-auto">
                                        {isPaid && (
                                            <div className="p-1.5 sm:p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                                            </div>
                                        )}
                                        {isOverdue && (
                                            <div className="p-1.5 sm:p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                                                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                                            </div>
                                        )}
                                        {!isPaid && !isOverdue && (
                                            <div className="p-1.5 sm:p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                                                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Información de la cuota adaptable */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide truncate">
                                            Fecha de Vencimiento
                                        </label>
                                        <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-300" />
                                            <span className="text-xs lg:text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                                {format(new Date(payment.dueDate ?? 0), "dd MMM yyyy", { locale: es })}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide truncate">
                                            Monto Total
                                        </label>
                                        <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-300" />
                                            <span className="text-xs lg:text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
                                                {currencySymbol}
                                                {(payment.amountDue ?? 0).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide truncate">
                                            {payment.paid ? "Pagado" : (payment.amountPaid ?? 0) > 0 ? "Parcialmente Pagado" : "Pendiente"}
                                        </label>
                                        <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <div className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-300">
                                                {currencySymbol}
                                            </div>
                                            <div className="flex flex-col">
                                                {(payment.amountPaid ?? 0) > 0 && (
                                                    <span className="text-xs lg:text-sm font-bold text-green-600 dark:text-green-400">
                                                        {(payment.amountPaid ?? 0).toLocaleString()}
                                                    </span>
                                                )}
                                                {(payment.remainingAmount ?? 0) > 0 && (
                                                    <span className="text-xs lg:text-sm font-medium text-amber-600 dark:text-amber-400">
                                                        {(payment.remainingAmount ?? 0).toLocaleString()}
                                                    </span>
                                                )}
                                                {(payment.amountPaid ?? 0) === 0 && (payment.remainingAmount ?? 0) === 0 && (
                                                    <span className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400">
                                                        Sin pagos
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
