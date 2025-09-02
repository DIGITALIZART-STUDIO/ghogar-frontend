"use client";

import { usePaymentTransaction, useQuotaStatusByReservation } from "@/app/(admin)/payments-transaction/_hooks/usePaymentTransactions";
import { useReservationById } from "@/app/(admin)/reservations/_hooks/useReservations";
import { HeaderPage } from "@/components/common/HeaderPage";
import ErrorGeneral from "@/components/errors/general-error";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Link from "next/link";
import React from "react";
import ClientUpdatePaymentsTransactionPage from "./ClientUpdatePaymentsTransactionPage";

interface ManageStateUpdateTransactionProps {
    id: string;
    idPayment: string;
}

export default function ManageStateUpdateTransaction({ id, idPayment }: ManageStateUpdateTransactionProps) {
    const { data: availablePayments, isLoading, error } = useQuotaStatusByReservation(id, idPayment);
    const { data: transaction, isLoading: isLoadingTransaction, error: errorTransaction } = usePaymentTransaction(idPayment ?? "");

    const { data: reservation, isLoading: isLoadingReservation, error: errorReservation } = useReservationById(id ?? "");

    // Mostrar loading spinner mientras carga
    if (isLoading || isLoadingReservation || isLoadingTransaction) {
        return (
            <div className="space-y-6">
                <HeaderPage title="Editar transacción" description="Cargando cuotas..." />
                <LoadingSpinner text="Cargando cuotas..." />
            </div>
        );
    }

    if (error || errorReservation || errorTransaction) {
        return (
            <div className="space-y-6">
                <HeaderPage title="Editar transacción" description="Error al cargar cuotas" />
                <ErrorGeneral
                    title="Error al cargar cuotas"

                />
            </div>
        );
    }
    return (
        <>
            <div className="mb-4">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <Link href="/payments-transaction">Gestión de Pagos</Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <Link href="/payments-transaction">{reservation?.clientName ?? "Sin nombre"}</Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbPage>Editar transacción</BreadcrumbPage>

                    </BreadcrumbList>

                </Breadcrumb>
            </div>
            <HeaderPage title="Editar transacción" description="Modifica los datos de la transacción." />
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <ClientUpdatePaymentsTransactionPage
                    availablePayments={availablePayments ?? { pendingQuotas: [] }}
                    id={id}
                    transaction={transaction}
                    paymentTransactionId={idPayment}
                />
            </div>
        </>
    );
}
