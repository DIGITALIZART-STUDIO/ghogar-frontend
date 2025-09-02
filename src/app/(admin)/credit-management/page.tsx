"use client";

import { useCallback, useState } from "react";
import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import ErrorGeneral from "@/components/errors/general-error";
import { usePaginatedReservationsWithPendingPayments } from "../reservations/_hooks/useReservations";
import { CreditManagementTable } from "./_components/PendingContractsTable";

export default function CreditManagementPage() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const { data: paginatedReservationsWithPendingPayments, isLoading, error } = usePaginatedReservationsWithPendingPayments(page, pageSize);

    const handlePaginationChange = useCallback(async (newPage: number, newPageSize: number) => {
        setPage(newPage);
        setPageSize(newPageSize);
    }, []);

    if (isLoading) {
        return (
            <div>
                <HeaderPage title="Manejo de Creditos" description="Listado de reservas con pagos pendientes." />
                <DataTableSkeleton columns={7} numFilters={3} />
            </div>
        );
    }

    if (error || !paginatedReservationsWithPendingPayments) {
        return (
            <div>
                <HeaderPage title="Manejo de Creditos" description="Listado de reservas con pagos pendientes." />
                <ErrorGeneral />
            </div>
        );
    }

    return (
        <div>
            <HeaderPage title="Manejo de Creditos" description="Listado de separaciones con pagos pendientes." />
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <CreditManagementTable
                    data={paginatedReservationsWithPendingPayments.data}
                    pagination={{
                        page: paginatedReservationsWithPendingPayments.meta.page ?? 1,
                        pageSize: paginatedReservationsWithPendingPayments.meta.pageSize ?? 10,
                        total: paginatedReservationsWithPendingPayments.meta.total ?? 0,
                        totalPages: paginatedReservationsWithPendingPayments.meta.totalPages ?? 1,
                    }}
                    onPaginationChange={handlePaginationChange}
                />
            </div>
        </div>
    );
}

