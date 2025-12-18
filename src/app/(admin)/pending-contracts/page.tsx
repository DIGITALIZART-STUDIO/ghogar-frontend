"use client";

import { useCallback, useState } from "react";

import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import ErrorGeneral from "@/components/errors/general-error";
import { usePaginatedCanceledPendingValidationReservations } from "../reservations/_hooks/usePaginatedCanceledPendingValidationReservations";
import { PendingContractsTable } from "./_components/table/PendingContractsTable";

export default function PendingContractsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Obtener reservas paginadas con filtros
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
    handleContractValidationStatusChange,
  } = usePaginatedCanceledPendingValidationReservations(page, pageSize);

  const handlePaginationChange = useCallback(async (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  }, []);

  // Solo mostrar skeleton completo en la carga inicial (cuando no hay datos)
  if (isLoading && !reservations) {
    return (
      <div>
        <HeaderPage title="Separaciones pendientes de validación" description="Cargando separaciones..." />
        <DataTableSkeleton columns={7} numFilters={3} />
      </div>
    );
  }

  if (error || !reservations) {
    return (
      <div>
        <HeaderPage
          title="Separaciones pendientes de validación"
          description="Listado de contratos y reservas que requieren validación de estado."
        />
        <ErrorGeneral />
      </div>
    );
  }

  return (
    <div>
      <HeaderPage
        title="Separaciones pendientes de validación"
        description="Listado de contratos y reservas que requieren validación de estado."
      />
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <PendingContractsTable
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
          contractValidationStatus={filters.contractValidationStatus}
          onContractValidationStatusChange={handleContractValidationStatusChange}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
