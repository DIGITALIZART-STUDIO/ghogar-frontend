"use client";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { PaymentSchedulePanel } from "./resizable-panels/PaymentSchedulePanel";
import { PaymentTransactionsPanel } from "./resizable-panels/PaymentTransactionsPanel";
import type { ReservationWithPaymentsDto } from "@/app/(admin)/reservations/_types/reservation";
import { usePaymentSchedule } from "../../_hooks/usePaymentSchedule";
import { LoaderCircle, AlertCircle } from "lucide-react";
import { usePaymentTransactionsByReservation } from "../../_hooks/usePaymentTransactions";

interface PaymentsExpandedContentProps {
  reservation: ReservationWithPaymentsDto
}

export function PaymentsExpandedContent({ reservation }: PaymentsExpandedContentProps) {
    const { data: payments = [], isLoading, error } = usePaymentSchedule(reservation.id ?? "");
    const {
        data: transactions = [],
        isLoading: isLoadingTx,
        error: errorTx,
    } = usePaymentTransactionsByReservation(reservation.id ?? "");

    return (
        <div className="p-6">

            {/* Resizable Panel Group mejorado */}
            <ResizablePanelGroup
                direction="horizontal"
                className="min-h-[500px] rounded-xl border-2 border-gray-200/60 dark:border-gray-800 overflow-hidden"
            >
                <ResizablePanel defaultSize={50} minSize={25} className="relative">
                    {/* Panel de Cronograma */}
                    <div className="h-full relative">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center h-full bg-blue-50/30 dark:bg-blue-900/30">
                                <div className="p-4 bg-white dark:bg-gray-950 rounded-full mb-4">
                                    <LoaderCircle className="animate-spin text-blue-600 dark:text-blue-400 w-8 h-8" />
                                </div>
                                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Cargando cronograma</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Obteniendo información de pagos...</p>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center h-full bg-red-50/30 dark:bg-red-900/30">
                                <div className="p-4 bg-white dark:bg-gray-950 rounded-full mb-4">
                                    <AlertCircle className="text-red-600 dark:text-red-400 w-8 h-8" />
                                </div>
                                <h3 className="font-medium text-red-900 dark:text-red-400 mb-1">Error al cargar</h3>
                                <p className="text-sm text-red-600 dark:text-red-400 text-center max-w-sm">
                                    No se pudo cargar el cronograma de pagos. Intenta nuevamente.
                                </p>
                            </div>
                        ) : (
                            <PaymentSchedulePanel payments={payments} currency={reservation.currency ?? "USD"} />
                        )}
                    </div>
                </ResizablePanel>

                {/* Handle mejorado */}
                <ResizableHandle
                    withHandle
                    className="bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-900 dark:hover:to-blue-950 transition-all duration-200 border-x border-gray-300/50 dark:border-gray-800/50 relative group"
                >
                    <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-transparent via-gray-400 dark:via-gray-600 to-transparent group-hover:via-blue-500 dark:group-hover:via-blue-400 transition-colors duration-200" />
                </ResizableHandle>

                <ResizablePanel defaultSize={50} minSize={25} className="relative">
                    {/* Panel de Transacciones */}
                    <div className="h-full relative">

                        {isLoadingTx ? (
                            <div className="flex flex-col items-center justify-center h-full bg-green-50/30 dark:bg-green-900/30">
                                <div className="p-4 bg-white dark:bg-gray-950 rounded-full mb-4">
                                    <LoaderCircle className="animate-spin text-green-600 dark:text-green-400 w-8 h-8" />
                                </div>
                                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Cargando transacciones</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Obteniendo historial de pagos...</p>
                            </div>
                        ) : errorTx ? (
                            <div className="flex flex-col items-center justify-center h-full bg-red-50/30 dark:bg-red-900/30">
                                <div className="p-4 bg-white dark:bg-gray-950 rounded-full mb-4">
                                    <AlertCircle className="text-red-600 dark:text-red-400 w-8 h-8" />
                                </div>
                                <h3 className="font-medium text-red-900 dark:text-red-400 mb-1">Error al cargar</h3>
                                <p className="text-sm text-red-600 dark:text-red-400 text-center max-w-sm">
                                    No se pudo cargar las transacciones. Intenta nuevamente.
                                </p>
                            </div>
                        ) : (
                            <PaymentTransactionsPanel transactions={transactions} currency={reservation.currency ?? "USD"} />
                        )}
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
