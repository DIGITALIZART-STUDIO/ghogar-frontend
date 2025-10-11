"use client";

import { useCallback, useState } from "react";
import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import ErrorGeneral from "@/components/errors/general-error";
import { usePaginatedQuotationsByAdvisor } from "./_hooks/useQuotations";
import { QuotationsTable } from "./_components/table/QuotationsTable";

export default function QuotationPage() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Obtener cotizaciones paginadas por asesor con filtros
    const {
        data: quotations,
        meta,
        isLoading,
        error,
        search,
        filters,
        setSearch,
        handleStatusChange,
    } = usePaginatedQuotationsByAdvisor(page, pageSize);

    const handlePaginationChange = useCallback(async (newPage: number, newPageSize: number) => {
        setPage(newPage);
        setPageSize(newPageSize);
    }, []);

    // Solo mostrar skeleton completo en la carga inicial (cuando no hay datos)
    if (isLoading && !quotations) {
        return (
            <div>
                <HeaderPage title="Mis Cotizaciones" description="Cargando cotizaciones..." />
                <DataTableSkeleton columns={7} numFilters={1} />
            </div>
        );
    }

    if (error || !quotations) {
        return (
            <div>
                <HeaderPage title="Mis Cotizaciones" description="Gestión de cotizaciones generadas por el usuario." />
                <ErrorGeneral />
            </div>
        );
    }

    return (
        <div>
            <HeaderPage title="Mis Cotizaciones" description="Gestión de cotizaciones generadas por el usuario." />
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <QuotationsTable
                    data={quotations}
                    pagination={{
                        page: meta?.page ?? 1,
                        pageSize: meta?.pageSize ?? 10,
                        total: meta?.total ?? 0,
                        totalPages: meta?.totalPages ?? 1,
                    }}
                    onPaginationChange={handlePaginationChange}
                    search={search}
                    onSearchChange={setSearch}
                    status={filters.status}
                    onStatusChange={handleStatusChange}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}
