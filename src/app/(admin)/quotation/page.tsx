"use client";

import { useCallback, useState } from "react";
import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import ErrorGeneral from "@/components/errors/general-error";
import { usePaginatedQuotationsByAdvisor } from "./_hooks/useQuotations";
import { QuotationsTable } from "./_components/table/QuotationsTable";
import { useUsers } from "../admin/users/_hooks/useUser";

export default function QuotationPage() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Obtener usuario actual
    const { data: userData, isLoading: loadingUser, error: errorUser } = useUsers();

    // Obtener el ID del usuario
    const userId = userData?.user?.id ?? "";

    // Obtener cotizaciones paginadas por asesor
    const {
        data: paginatedQuotations,
        isLoading: loadingQuotations,
        error: errorQuotations,
    } = usePaginatedQuotationsByAdvisor(userId, page, pageSize, !!userId);

    const handlePaginationChange = useCallback(async (newPage: number, newPageSize: number) => {
        setPage(newPage);
        setPageSize(newPageSize);
    }, []);

    if (loadingUser || loadingQuotations) {
        return (
            <div>
                <HeaderPage title="Mis Cotizaciones" description="Cargando cotizaciones..." />
                <DataTableSkeleton columns={7} numFilters={3} />
            </div>
        );
    }

    if (errorUser || errorQuotations || !paginatedQuotations) {
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
                    data={paginatedQuotations.data}
                    pagination={{
                        page: paginatedQuotations.meta.page ?? 1,
                        pageSize: paginatedQuotations.meta.pageSize ?? 10,
                        total: paginatedQuotations.meta.total ?? 0,
                        totalPages: paginatedQuotations.meta.totalPages ?? 1,
                    }}
                    onPaginationChange={handlePaginationChange}
                />
            </div>
        </div>
    );
}
