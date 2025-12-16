"use client";

import { Badge } from "@/components/ui/badge";
import { PaymentDto } from "../_types/payments";
import { Calendar, DollarSign, Clock, CheckCircle, AlertTriangle, TrendingUp, AlertCircle } from "lucide-react";

interface PaymentScheduleTableProps {
    data: Array<PaymentDto>;
}

export function PaymentScheduleTable({ data }: PaymentScheduleTableProps) {
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const formatCurrency = (amount: number) => `$ ${amount.toFixed(2)}`;

    const getStatusBadge = (payment: PaymentDto) => {
        if (payment.paid) {
            return (
                <Badge className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 border-green-200 dark:border-green-700 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Pagado
                </Badge>
            );
        }

        if ((payment.amountPaid ?? 0) > 0) {
            return (
                <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 border-blue-200 dark:border-blue-700 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Parcialmente
                </Badge>
            );
        }

        return (
            <Badge className="bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Pendiente
            </Badge>
        );
    };

    if (data.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="p-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400">No hay cronograma de pagos disponible para esta reserva.</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                        El cronograma se genera automáticamente cuando la reserva cambia a estado &quot;Pagado&quot;.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-lg bg-card overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
                        <TrendingUp className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
                    </div>
                    <div>
                        <h3 className="text-xl leading-6 font-semibold text-gray-900 dark:text-gray-100">
                            Cronograma de Pagos
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Seguimiento detallado del estado de cada cuota
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                        <thead className="bg-zinc-100 dark:bg-zinc-900">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Cuota #
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Fecha de Vencimiento
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Monto Total
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Monto Pagado
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Monto Pendiente
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Días para vencimiento
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-card divide-y divide-gray-200 dark:divide-gray-600">
                            {data.map((payment, index) => {
                                const dueDate = payment.dueDate ? new Date(payment.dueDate) : new Date();
                                const today = new Date();
                                const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                                return (
                                    <tr key={payment.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-600 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                                    payment.paid
                                                        ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                                                        : (payment.amountPaid ?? 0) > 0
                                                            ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                                                            : "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
                                                }`}
                                                >
                                                    {index + 1}
                                                </div>
                                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    Cuota {index + 1}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                                <span className="text-sm text-gray-900 dark:text-gray-100">
                                                    {payment.dueDate ? formatDate(payment.dueDate) : "No disponible"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {formatCurrency(payment.amountDue ?? 0)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />
                                                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                                    {formatCurrency(payment.amountPaid ?? 0)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <AlertCircle className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                                                <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                                                    {formatCurrency(payment.remainingAmount ?? 0)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(payment)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {(payment.paid ?? false) ? (
                                                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                                    <CheckCircle className="h-4 w-4" />
                                                    <span className="text-sm">Completado</span>
                                                </div>
                                            ) : daysUntilDue < 0 ? (
                                                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                                    <AlertTriangle className="h-4 w-4" />
                                                    <span className="text-sm">Vencido ({Math.abs(daysUntilDue)} días)</span>
                                                </div>
                                            ) : daysUntilDue === 0 ? (
                                                <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                                                    <AlertCircle className="h-4 w-4" />
                                                    <span className="text-sm">Vence hoy</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                    <Clock className="h-4 w-4" />
                                                    <span className="text-sm">{daysUntilDue} días</span>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Resumen */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                            <div className="flex items-center gap-2 mb-1">
                                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-500" />
                                <p className="font-medium text-green-600 dark:text-green-500">Completamente Pagadas</p>
                            </div>
                            <p className="text-lg font-bold text-green-700 dark:text-green-400">{data.filter((p) => p.paid).length}</p>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center gap-2 mb-1">
                                <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-500" />
                                <p className="font-medium text-blue-600 dark:text-blue-500">Parcialmente Pagadas</p>
                            </div>
                            <p className="text-lg font-bold text-blue-700 dark:text-blue-400">{data.filter((p) => (p.amountPaid ?? 0) > 0 && !p.paid).length}</p>
                        </div>
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                            <div className="flex items-center gap-2 mb-1">
                                <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
                                <p className="font-medium text-yellow-600 dark:text-yellow-500">Pendientes</p>
                            </div>
                            <p className="text-lg font-bold text-yellow-700 dark:text-yellow-400">{data.filter((p) => (p.amountPaid ?? 0) === 0 && !p.paid).length}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2 mb-1">
                                <DollarSign className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                <p className="font-medium text-gray-500 dark:text-gray-400">Monto Total</p>
                            </div>
                            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                {formatCurrency(data.reduce((sum, payment) => sum + (payment.amountDue ?? 0), 0))}
                            </p>
                        </div>
                        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                            <div className="flex items-center gap-2 mb-1">
                                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-500" />
                                <p className="font-medium text-green-600 dark:text-green-500">Total Pagado</p>
                            </div>
                            <p className="text-lg font-bold text-green-700 dark:text-green-400">
                                {formatCurrency(data.reduce((sum, payment) => sum + (payment.amountPaid ?? 0), 0))}
                            </p>
                        </div>
                        <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                            <div className="flex items-center gap-2 mb-1">
                                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                                <p className="font-medium text-amber-600 dark:text-amber-500">Total Pendiente</p>
                            </div>
                            <p className="text-lg font-bold text-amber-700 dark:text-amber-400">
                                {formatCurrency(data.reduce((sum, payment) => sum + (payment.remainingAmount ?? 0), 0))}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
