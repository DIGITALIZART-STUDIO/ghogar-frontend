"use client";

import { useCallback, useState } from "react";

import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import ErrorGeneral from "@/components/errors/general-error";
import { usePaginatedContracts } from "../../contracts/_hooks/useContracts";
import { CreditManagementTable } from "./CreditManagementTable";

export function CreditManagementPageClient() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    data: contracts,
    meta,
    isLoading,
    error,
    search,
    filters,
    setSearch,
    handleStatusChange,
  } = usePaginatedContracts(page, pageSize, [], false, true);

  const handlePaginationChange = useCallback(async (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  }, []);

  if (isLoading && !contracts.length && !error) {
    return (
      <div>
        <HeaderPage title="Gestión de créditos" description="Cargando cartera..." />
        <DataTableSkeleton columns={8} numFilters={1} />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <HeaderPage title="Gestión de créditos" description="Cartera de contratos con saldo pendiente." />
        <ErrorGeneral message="No se pudo cargar la cartera de créditos. Recarga la página o vuelve a iniciar sesión." />
      </div>
    );
  }

  return (
    <div>
      <HeaderPage
        title="Gestión de créditos"
        description="Contratos con saldo pendiente: próxima cuota, inicial, monto pagado y restante."
      />
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1">
        <CreditManagementTable
          data={contracts}
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
