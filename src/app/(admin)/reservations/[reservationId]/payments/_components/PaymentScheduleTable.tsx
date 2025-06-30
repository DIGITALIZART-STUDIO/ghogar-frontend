"use client";

import { Badge } from "@/components/ui/badge";
import { components } from "@/types/api";

interface PaymentScheduleTableProps {
    data: Array<components["schemas"]["PaymentDto"]>;
}

export function PaymentScheduleTable({ data }: PaymentScheduleTableProps) {
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const formatCurrency = (amount: number) => `$ ${amount.toFixed(2)}`;

    const getStatusBadge = (paid: boolean) => (paid ? (
        <Badge variant="default" className="bg-green-100 text-green-800">
            Pagado
        </Badge>
    ) : (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Pendiente
        </Badge>
    ));

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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 mb-4">
                    Cronograma de Pagos
                </h3>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Cuota #
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Fecha de Vencimiento
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Monto
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Días para vencimiento
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                            {data.map((payment, index) => {
                                const dueDate = payment.dueDate ? new Date(payment.dueDate) : new Date();
                                const today = new Date();
                                const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                                return (
                                    <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                            Cuota {index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                            {payment.dueDate ? formatDate(payment.dueDate) : "No disponible"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                            {formatCurrency(payment.amountDue ?? 0)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(payment.paid ?? false)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                            {(payment.paid ?? false) ? (
                                                <span className="text-green-600 dark:text-green-400">Completado</span>
                                            ) : daysUntilDue < 0 ? (
                                                <span className="text-red-600 dark:text-red-400">
                                                    Vencido ({Math.abs(daysUntilDue)} días)
                                                </span>
                                            ) : daysUntilDue === 0 ? (
                                                <span className="text-orange-600 dark:text-orange-400">Vence hoy</span>
                                            ) : (
                                                <span className="text-gray-600 dark:text-gray-400">
                                                    {daysUntilDue} días
                                                </span>
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <p className="font-medium text-gray-500 dark:text-gray-400">Total de Cuotas</p>
                            <p className="text-gray-900 dark:text-gray-100">{data.length}</p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-500 dark:text-gray-400">Cuotas Pagadas</p>
                            <p className="text-green-600 dark:text-green-400">{data.filter((p) => p.paid).length}</p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-500 dark:text-gray-400">Cuotas Pendientes</p>
                            <p className="text-yellow-600 dark:text-yellow-400">{data.filter((p) => !p.paid).length}</p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-500 dark:text-gray-400">Monto Total</p>
                            <p className="text-gray-900 dark:text-gray-100">
                                {formatCurrency(data.reduce((sum, payment) => sum + (payment.amountDue ?? 0), 0))}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
