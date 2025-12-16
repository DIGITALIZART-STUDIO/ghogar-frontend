"use client";

import { useQuotaStatusByReservation } from "@/app/(admin)/payments-transaction/_hooks/usePaymentTransactions";
import { HeaderPage } from "@/components/common/HeaderPage";
import ErrorGeneral from "@/components/errors/general-error";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import ClientCreatePaymentsTransactionPage from "./ClientCreatePaymentsTransactionPage";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { useReservationById } from "@/app/(admin)/reservations/_hooks/useReservations";

interface ManageStateCreateTransactionProps {
    id: string;
}

export default function ManageStateCreateTransaction({ id }: ManageStateCreateTransactionProps) {
    const { data: availablePayments, isLoading, error } = useQuotaStatusByReservation(id ?? "");

    const { data: reservation, isLoading: isLoadingReservation, error: errorReservation } = useReservationById(id ?? "");

    // Mostrar loading spinner mientras carga
    if (isLoading || isLoadingReservation) {
        return (
            <div className="space-y-6">
                <HeaderPage title="Crear transacción" description="Cargando cuotas..." />
                <LoadingSpinner text="Cargando cuotas..." />
            </div>
        );
    }

    if (error || errorReservation) {
        return (
            <div className="space-y-6">
                <HeaderPage title="Crear transacción" description="Error al cargar cuotas" />
                <ErrorGeneral
                    title="Error al cargar cuotas"

                />
            </div>
        );
    }

    if (!availablePayments) {
        return (
            <div className="space-y-6">
                <HeaderPage title="Crear transacción" description="No se encontraron cuotas disponibles" />
                <ErrorGeneral
                    title="No se encontraron cuotas disponibles"
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
                            <Link href={`/payments-transaction/${id}`}>{reservation?.clientName ?? "Sin nombre"}</Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <Link href={`/payments-transaction/${id}/create`}>Crear transacción</Link>
                        </BreadcrumbItem>
                    </BreadcrumbList>

                </Breadcrumb>
            </div>
            <HeaderPage title="Crear transacción" description="Completa los datos para registrar la transacción." />
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <ClientCreatePaymentsTransactionPage
                    availablePayments={availablePayments}
                    id={id}
                />
            </div>
        </>
    );
}
