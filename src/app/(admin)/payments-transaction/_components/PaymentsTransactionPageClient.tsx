"use client";

import { useCallback, useState } from "react";

import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import ErrorGeneral from "@/components/errors/general-error";
import { usePaginatedContracts } from "../../contracts/_hooks/useContracts";
import { ContractStatus } from "../../contracts/_types/contract";
import { PaymentsContractsTable } from "./table/PaymentsContractsTable";

export function PaymentsTransactionPageClient() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    data: contracts,
    meta,
    isLoading,
    error,
    search,
    setSearch,
  } = usePaginatedContracts(page, pageSize, [ContractStatus.Active]);

  const handlePaginationChange = useCallback(async (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  }, []);

  if (isLoading && !contracts.length && !error) {
    return (
      <div>
        <HeaderPage title="Gestión de Pagos" description="Cargando contratos..." />
        <DataTableSkeleton columns={7} numFilters={1} />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <HeaderPage title="Gestión de Pagos" description="Consulta y administra las transacciones de pago" />
        <ErrorGeneral />
      </div>
    );
  }

  return (
    <div>
      <HeaderPage title="Gestión de Pagos" description="Registra vouchers contra las cuotas del contrato." />
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1">
        <PaymentsContractsTable
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
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
