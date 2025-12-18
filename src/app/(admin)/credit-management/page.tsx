"use client";

import { useCallback, useState } from "react";

import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import ErrorGeneral from "@/components/errors/general-error";
import { useReservationsWithPendingPaymentsPagination } from "../reservations/_hooks/useReservationsWithPendingPaymentsPagination";
import { CreditManagementTable } from "./_components/CreditManagementTable";

export default function CreditManagementPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    data: paginatedReservationsWithPendingPayments,
    meta,
    isLoading,
    error,
    search,
    setSearch,
    filters,
    handleStatusChange,
    handlePaymentMethodChange,
    handleContractValidationStatusChange,
  } = useReservationsWithPendingPaymentsPagination(page, pageSize);

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

  if (error || !paginatedReservationsWithPendingPayments || !meta) {
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
          data={paginatedReservationsWithPendingPayments}
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
        />
      </div>
    </div>
  );
}
