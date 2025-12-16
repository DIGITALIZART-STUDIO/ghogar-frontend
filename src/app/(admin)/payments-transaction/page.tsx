"use client";

import { useCallback, useState } from "react";
import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import ErrorGeneral from "@/components/errors/general-error";
import { usePaginatedCanceledReservations } from "../reservations/_hooks/useReservations";
import { PaymentsTransactionTable } from "./_components/table/PaymentsTransactionTable";

export default function PaymentsTransactionPage() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const { data: paginatedReservations, isLoading, error } = usePaginatedCanceledReservations(page, pageSize);

    // Cambia a async para cumplir con el tipo Promise<void>
    const handlePaginationChange = useCallback(async (newPage: number, newPageSize: number) => {
        setPage(newPage);
        setPageSize(newPageSize);
    }, []);

    if (isLoading) {
        return (
            <div>
                <HeaderPage title="Gestión de Pagos" description="Cargando transacciones..." />
                <DataTableSkeleton columns={7} numFilters={3} />
            </div>
        );
    }

    if (error || !paginatedReservations) {
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
                <PaymentsTransactionTable
                    data={paginatedReservations.data ?? []}
                    pagination={{
                        page: paginatedReservations.meta?.page ?? 1,
                        pageSize: paginatedReservations.meta?.pageSize ?? 10,
                        total: paginatedReservations.meta?.total ?? 0,
                        totalPages: paginatedReservations.meta?.totalPages ?? 1,
                    }}
                    onPaginationChange={handlePaginationChange}
                />
            </div>
        </div>
    );
}
