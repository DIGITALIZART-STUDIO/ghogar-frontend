"use client";

import { useCallback, useState } from "react";
import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import ErrorGeneral from "@/components/errors/general-error";
import { usePaginatedReservationsByAdvisor } from "../_hooks/useReservations";
import { ReservationsTable } from "./ReservationsTable";

export default function ReservationsClient() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Obtener reservas paginadas por asesor con filtros
    const {
        data: reservations,
        meta,
        isLoading,
        error,
        search,
        filters,
        setSearch,
        handleStatusChange,
        handlePaymentMethodChange,
    } = usePaginatedReservationsByAdvisor(page, pageSize);

    const handlePaginationChange = useCallback(async (newPage: number, newPageSize: number) => {
        setPage(newPage);
        setPageSize(newPageSize);
    }, []);

    // Solo mostrar skeleton completo en la carga inicial (cuando no hay datos)
    if (isLoading && !reservations) {
        return (
            <div>
                <HeaderPage title="Separaciones" description="Cargando separaciones..." />
                <DataTableSkeleton columns={7} numFilters={2} />
            </div>
        );
    }

    if (error || !reservations) {
        return (
            <div>
                <HeaderPage title="Separaciones" description="Gestión y administración de recibos de separaciones para proyectos inmobiliarios" />
                <ErrorGeneral />
            </div>
        );
    }

    return (
        <div>
            <HeaderPage title="Separaciones" description="Gestión y administración de recibos de separaciones para proyectos inmobiliarios" />
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <ReservationsTable
                    data={reservations}
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
                    paymentMethod={filters.paymentMethod}
                    onPaymentMethodChange={handlePaymentMethodChange}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}
