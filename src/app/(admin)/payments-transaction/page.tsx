"use client";

import React from "react";
import ErrorGeneral from "@/components/errors/general-error";
import { HeaderPage } from "@/components/common/HeaderPage";
import { useCanceledReservations } from "../reservations/_hooks/useReservations";
import { PaymentsTransactionTable } from "./_components/table/PaymentsTransactionTable";

export default function PaymentsTransactionPage() {
    const { data: canceledReservations, isLoading: loadingCanceled, error: errorCanceled } = useCanceledReservations();

    if (loadingCanceled) {
        return (
            <div>
                <HeaderPage title="Gestión de Pagos" description="Cargando transacciones..." />
                <div className="flex justify-center items-center py-8">
                    <span className="animate-spin rounded-full h-5 w-5 border border-gray-400" />
                    <span className="ml-3 text-gray-600 text-sm">Cargando transacciones...</span>
                </div>
            </div>
        );
    }

    // Si hay error o no hay transacciones, muestra error general
    if (errorCanceled) {
        return (
            <div>
                <HeaderPage title="Gestión de Pagos" description="Sin datos de transacciones" />
                <ErrorGeneral />
            </div>
        );
    }

    return (

        <div>
            <HeaderPage title="Gestión de Pagos" description="Consulta y administra las transacciones de pago" />
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <PaymentsTransactionTable data={canceledReservations ?? []} />
            </div>
        </div>
    );

}
