"use client";

import { Receipt, Calendar, Hash, ArrowRight, CheckCircle2, ChevronDown, ChevronUp, MoreHorizontal, Pencil, Trash, FileDown } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { PaymentTransaction } from "../../../_types/paymentTransaction";
import { PaymentMethodLabels } from "@/app/(admin)/reservations/_utils/reservations.utils";
import type { PaymentMethod } from "@/app/(admin)/reservations/_types/reservation";
import { useState } from "react";
import { DeletePaymentTransactionDialog } from "../../delete/DeletePaymentTransactionDialog";
import { UpdatePaymentTransactionSheet } from "../../update/UpdatePaymentsTransactionSheet";

interface PaymentTransactionsPanelProps {
	transactions: Array<PaymentTransaction>
	currency: string
}

export function PaymentTransactionsPanel({ transactions, currency }: PaymentTransactionsPanelProps) {
    const [expandedTransactions, setExpandedTransactions] = useState<Set<string>>(new Set());
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
    const [selectedReservationId, setSelectedReservationId] = useState<string | null>(null);
    const [updateSheetOpen, setUpdateSheetOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<PaymentTransaction | null>(null);

    const totalTransacted = transactions.reduce((sum, transaction) => sum + (transaction.amountPaid ?? 0), 0);
    const totalPaymentsCovered = transactions.reduce((sum, transaction) => sum + (transaction.payments?.length ?? 0), 0);
    const currencySymbol = currency === "DOLARES" ? "$" : "S/";

    const toggleTransaction = (transactionId: string) => {
        const newExpanded = new Set(expandedTransactions);
        if (newExpanded.has(transactionId)) {
            newExpanded.delete(transactionId);
        } else {
            newExpanded.add(transactionId);
        }
        setExpandedTransactions(newExpanded);
    };

    const toggleAllTransactions = () => {
        if (expandedTransactions.size === transactions.length) {
            setExpandedTransactions(new Set());
        } else {
            setExpandedTransactions(new Set(transactions.map((t) => t.id).filter((id): id is string => typeof id === "string")));
        }
    };

    // Funciones placeholder para las acciones
    const handleEdit = (transactionId: string) => {
        const transaction = transactions.find((t) => t.id === transactionId);
        if (transaction) {
            setSelectedTransaction(transaction);
            setUpdateSheetOpen(true);
        }
    };

    const handleDelete = (transactionId: string, reservationId?: string) => {
        setSelectedTransactionId(transactionId);
        setSelectedReservationId(reservationId ?? null);
        setDeleteDialogOpen(true);
    };

    return (
        <div className="h-full flex flex-col bg-white dark:bg-gray-900">
            {/* Header adaptable */}
            <div className="p-3 sm:p-4 lg:p-6 border-b bg-gradient-to-r from-slate-50 to-gray-50 dark:from-gray-900 dark:to-gray-800 dark:border-gray-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-1.5 sm:p-2 bg-primary/20 dark:bg-primary/30 rounded-lg">
                            <Receipt className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm sm:text-base lg:text-lg text-gray-900 dark:text-gray-100 truncate">
                                Transacciones
                            </h3>
                            <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 mt-0.5 hidden lg:block truncate">Historial de pagos</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge
                            variant="secondary"
                            className="px-2 sm:px-3 py-1 text-xs font-medium bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 border-blue-200 dark:border-blue-800"
                        >
                            {transactions.length} transacciones
                        </Badge>
                        {transactions.length > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={toggleAllTransactions}
                                className="text-xs px-2 py-1 h-auto bg-transparent"
                            >
                                {expandedTransactions.size === transactions.length ? (
                                    <>
                                        <ChevronUp className="h-3 w-3 mr-1" />
                                        <span className="hidden sm:inline">Contraer todo</span>
                                        <span className="sm:hidden">Contraer</span>
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown className="h-3 w-3 mr-1" />
                                        <span className="hidden sm:inline">Expandir todo</span>
                                        <span className="sm:hidden">Expandir</span>
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Estadísticas adaptables */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-white dark:bg-gray-950 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-green-100 dark:border-green-900 min-w-0">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg flex-shrink-0">
                                <Receipt className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-green-700 overflow-hidden text-ellipsis">
                                    {currencySymbol}
                                    {totalTransacted.toLocaleString()}
                                </div>
                                <div className="text-xs lg:text-sm text-green-600 font-medium overflow-hidden">
                                    <span className="hidden lg:inline">Total Transaccionado</span>
                                    <span className="lg:hidden hidden sm:inline">Total Trans.</span>
                                    <span className="sm:hidden">Total</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-950 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-blue-100 dark:border-blue-900 min-w-0">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
                                <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="text-lg sm:text-2xl font-bold text-blue-700">{totalPaymentsCovered}</div>
                                <div className="text-xs sm:text-sm text-blue-600 font-medium overflow-hidden">
                                    <span className="hidden sm:inline">Cuotas Cubiertas</span>
                                    <span className="sm:hidden">Cuotas</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lista de transacciones adaptable */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
                {transactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-8 sm:py-12">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                            <Receipt className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h4 className="font-semibold text-sm sm:text-base lg:text-lg text-gray-900 dark:text-gray-100 mb-2 truncate">
                            Sin transacciones
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed line-clamp-2">
                            No se han procesado transacciones de pago
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4 sm:space-y-6">
                        {transactions.map((transaction, transIndex) => {
                            const methodConfig = PaymentMethodLabels[transaction.paymentMethod as PaymentMethod];
                            const Icon = methodConfig.icon;
                            const isExpanded = expandedTransactions.has(transaction.id ?? "");
                            const hasPayments = transaction.payments && transaction.payments.length > 0;

                            return (
                                <div
                                    key={transaction.id}
                                    className="bg-white dark:bg-gray-950 rounded-lg sm:rounded-xl border-2 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 overflow-hidden transition-all duration-200"
                                >
                                    {/* Header de la transacción adaptable */}
                                    <div className={`p-3 sm:p-4 lg:p-5 ${methodConfig.className} border-b-2 dark:border-gray-800`}>
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-3 sm:mb-4">
                                            <div className="flex items-center gap-3 sm:gap-4">
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-100 dark:bg-gray-800 flex items-center justify-center">
                                                    <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${methodConfig.iconClass}`} />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-sm sm:text-base lg:text-lg text-gray-900 dark:text-gray-100 truncate">
                                                        Transacción #{transIndex + 1}
                                                    </h4>
                                                    <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 font-medium truncate">{methodConfig.label}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-left sm:text-right">
                                                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
                                                        {currencySymbol}
                                                        {(transaction.amountPaid ?? 0).toLocaleString()}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">Monto procesado</div>
                                                </div>
                                                {/* Dropdown para acciones de Editar/Eliminar */}
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                                                            <MoreHorizontal className="h-4 w-4 text-black dark:text-gray-200" />
                                                            <span className="sr-only">Acciones de transacción</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleEdit(transaction.id ?? "")}>
                                                            Editar
                                                            <DropdownMenuShortcut>
                                                                <Pencil className="size-4" aria-hidden="true" />
                                                            </DropdownMenuShortcut>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                // FIXME: implementar
                                                                alert("no implementado: recibo digital");
                                                            }}
                                                        >
                                                            Descargar Recibo Digital
                                                            <DropdownMenuShortcut>
                                                                <FileDown className="size-4" aria-hidden="true" />
                                                            </DropdownMenuShortcut>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleDelete(transaction.id ?? "", transaction.reservationId ?? "")}
                                                            className="text-red-700"
                                                        >
                                                            Eliminar
                                                            <DropdownMenuShortcut>
                                                                <Trash className="size-4 text-red-700" aria-hidden="true" />
                                                            </DropdownMenuShortcut>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                                {/* Botón de expandir/contraer */}
                                                {hasPayments && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => toggleTransaction(transaction.id ?? "")}
                                                        className="p-2 h-auto hover:bg-white/50 dark:hover:bg-gray-900/50 flex-shrink-0"
                                                    >
                                                        {isExpanded ? (
                                                            <ChevronUp className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                                                        ) : (
                                                            <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                                                        )}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Información de la transacción adaptable */}
                                        <div className="grid grid-cols-1 gap-3 sm:gap-4">
                                            <div className="flex items-center gap-3 p-2 sm:p-3 bg-slate-100 dark:bg-gray-800 rounded-lg">
                                                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-300" />
                                                <div>
                                                    <div className="text-xs lg:text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                                        {transaction.paymentDate
                                                            ? format(new Date(transaction.paymentDate), "dd MMM yyyy", { locale: es })
                                                            : "Fecha no disponible"}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                        {transaction.paymentDate
                                                            ? format(new Date(transaction.paymentDate), "HH:mm", { locale: es })
                                                            : "Hora no disponible"}{" "}
                                                        hrs
                                                    </div>
                                                </div>
                                            </div>
                                            {transaction.referenceNumber && (
                                                <div className="flex items-center gap-3 p-2 sm:p-3 bg-slate-100 dark:bg-gray-800 rounded-lg">
                                                    <Hash className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-300" />
                                                    <div>
                                                        <div className="text-xs lg:text-sm font-medium text-gray-900 dark:text-gray-100 font-mono truncate">
                                                            {transaction.referenceNumber}
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">Referencia</div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Indicador de cuotas cuando está contraído */}
                                        {hasPayments && !isExpanded && (
                                            <div className="mt-3 pt-3 border-t border-white/30 dark:border-gray-800/30">
                                                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                                                    <span>
                                                        {transaction.payments!.length} cuota{transaction.payments!.length !== 1 ? "s" : ""} asociada
                                                        {transaction.payments!.length !== 1 ? "s" : ""}
                                                    </span>
                                                    <span className="font-medium">
                                                        {currencySymbol}
                                                        {(transaction.payments ?? [])
                                                            .reduce((sum, p) => sum + (p.amountDue ?? 0), 0)
                                                            .toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Cuotas cubiertas adaptables - Solo se muestra cuando está expandido */}
                                    {hasPayments && isExpanded && (
                                        <div className="p-3 sm:p-4 lg:p-5 transition-all duration-200">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                                <div className="flex items-center gap-2 sm:gap-3">
                                                    <div className="p-1 sm:p-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                                        <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-300" />
                                                    </div>
                                                    <h5 className="text-xs lg:text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">Cuotas cubiertas</h5>
                                                </div>
                                                <Badge variant="outline" className="text-xs font-medium self-start sm:self-auto">
                                                    {transaction.payments!.length} cuotas
                                                </Badge>
                                            </div>

                                            <div className="space-y-2 sm:space-y-3">
                                                {transaction.payments!.map((payment) => (
                                                    <div
                                                        key={payment.id}
                                                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg sm:rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-100/50 dark:hover:bg-gray-900/50 transition-colors"
                                                    >
                                                        <div className="flex items-center gap-3 sm:gap-4">
                                                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                                                <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                                                            </div>
                                                            <div>
                                                                <div className="text-xs lg:text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                                                    Cuota del{" "}
                                                                    {payment.dueDate
                                                                        ? format(new Date(payment.dueDate), "dd MMM yyyy", { locale: es })
                                                                        : "Fecha no disponible"}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="text-left sm:text-right">
                                                            <div className="font-bold text-green-700">
                                                                {currencySymbol}
                                                                {(payment.amountDue ?? 0).toLocaleString()}
                                                            </div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{payment.paid ? "Pagado" : "Pendiente"}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Resumen adaptable */}
                                            <Separator className="my-3 sm:my-4" />
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 p-2 sm:p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                <span className="text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                                                    Total aplicado a cuotas:
                                                </span>
                                                <span className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
                                                    {currencySymbol}
                                                    {(transaction.payments ?? [])
                                                        .reduce((sum, p) => sum + (p.amountDue ?? 0), 0)
                                                        .toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Si no hay cuotas asociadas */}
                                    {!hasPayments && (
                                        <div className="p-3 sm:p-4 lg:p-5 text-center bg-gray-50/50 dark:bg-gray-900/50">
                                            <div className="p-3 sm:p-4 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800">
                                                <div className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 italic line-clamp-2">
                                                    Esta transacción no está asociada a cuotas específicas
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            {/* Sheet para actualizar transacción */}
            {updateSheetOpen && selectedTransaction && (
                <UpdatePaymentTransactionSheet
                    open={updateSheetOpen}
                    onOpenChange={setUpdateSheetOpen}
                    reservationId={selectedTransaction.reservationId ?? ""}
                    transaction={selectedTransaction}
                />
            )}
            {/* Diálogo de eliminación */}
            {deleteDialogOpen && (
                <DeletePaymentTransactionDialog
                    paymentTransactionId={selectedTransactionId ?? ""}
                    reservationId={selectedReservationId ?? ""}
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    onSuccess={() => {
                        setDeleteDialogOpen(false);
                        setSelectedTransactionId(null);
                        setSelectedReservationId(null);
                    }}
                />
            )}
        </div>
    );
}
