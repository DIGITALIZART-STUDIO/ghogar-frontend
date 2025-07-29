"use client";

import { useCallback, useState } from "react";
import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import ErrorGeneral from "@/components/errors/general-error";
import { usePaginatedClients } from "./_hooks/useClients";
import { ClientsTable } from "./_components/table/ClientsTable";

export default function ClientsPage() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const { data: paginatedClients, isLoading, error } = usePaginatedClients(page, pageSize);

    const handlePaginationChange = useCallback(async (newPage: number, newPageSize: number) => {
        setPage(newPage);
        setPageSize(newPageSize);
    }, []);

    if (isLoading) {
        return (
            <div>
                <HeaderPage title="Clientes" description="Cargando clientes..." />
                <DataTableSkeleton columns={7} numFilters={3} />
            </div>
        );
    }

    if (error || !paginatedClients) {
        return (
            <div>
                <HeaderPage title="Clientes" description="Clientes registrados en el sistema." />
                <ErrorGeneral />
            </div>
        );
    }

    return (
        <div>
            <HeaderPage title="Clientes" description="Clientes registrados en el sistema." />
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <ClientsTable
                    data={paginatedClients.data}
                    pagination={{
                        page: paginatedClients.meta.page ?? 1,
                        pageSize: paginatedClients.meta.pageSize ?? 10,
                        total: paginatedClients.meta.total ?? 0,
                        totalPages: paginatedClients.meta.totalPages ?? 1,
                    }}
                    onPaginationChange={handlePaginationChange}
                />
            </div>
        </div>
    );
}
