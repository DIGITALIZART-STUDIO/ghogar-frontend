"use client";

import { useCallback, useState } from "react";
import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import ErrorGeneral from "@/components/errors/general-error";
import { usePaginatedCanceledPendingValidationReservations } from "../reservations/_hooks/useReservations";
import { PendingContractsTable } from "./_components/PendingContractsTable";

export default function PendingContractsPage() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const { data: paginatedLeads, isLoading, error } = usePaginatedCanceledPendingValidationReservations(page, pageSize);

    const handlePaginationChange = useCallback(async (newPage: number, newPageSize: number) => {
        setPage(newPage);
        setPageSize(newPageSize);
    }, []);

    if (isLoading) {
        return (
            <div>
                <HeaderPage title="Separaciones pendientes de validación" description="Listado de contratos y reservas que requieren validación de estado." />
                <DataTableSkeleton columns={7} numFilters={3} />
            </div>
        );
    }

    if (error || !paginatedLeads) {
        return (
            <div>
                <HeaderPage title="Separaciones pendientes de validación" description="Listado de contratos y reservas que requieren validación de estado." />
                <ErrorGeneral />
            </div>
        );
    }

    return (
        <div>
            <HeaderPage title="Separaciones pendientes de validación" description="Listado de contratos y reservas que requieren validación de estado." />
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <PendingContractsTable
                    data={paginatedLeads.data}
                    pagination={{
                        page: paginatedLeads.meta.page ?? 1,
                        pageSize: paginatedLeads.meta.pageSize ?? 10,
                        total: paginatedLeads.meta.total ?? 0,
                        totalPages: paginatedLeads.meta.totalPages ?? 1,
                    }}
                    onPaginationChange={handlePaginationChange}
                />
            </div>
        </div>
    );
}

