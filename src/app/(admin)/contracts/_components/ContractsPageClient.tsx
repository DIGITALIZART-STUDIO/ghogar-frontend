"use client";

import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import ErrorGeneral from "@/components/errors/general-error";
import { usePaginatedContracts } from "../_hooks/useContracts";
import { isContractStatus } from "../_utils/contracts.utils";
import { ContractsTable } from "./table/ContractsTable";

export function ContractsPageClient() {
  const searchParams = useSearchParams();
  const overdue = searchParams.get("credit") === "pending";
  const initialStatus = useMemo(() => searchParams.getAll("status").filter(isContractStatus), [searchParams]);
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
    handleOriginChange,
  } = usePaginatedContracts(page, pageSize, initialStatus, overdue);

  const handlePaginationChange = useCallback(async (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  }, []);

  if (isLoading && !contracts.length && !error) {
    return (
      <div>
        <HeaderPage title="Contratos" description="Cargando contratos..." />
        <DataTableSkeleton columns={7} numFilters={2} />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <HeaderPage title="Contratos" description="Listado de contratos de compraventa." />
        <ErrorGeneral message="No se pudieron cargar los contratos. Recarga la página o vuelve a iniciar sesión." />
      </div>
    );
  }

  return (
    <div>
      <HeaderPage
        title={overdue ? "Créditos pendientes" : "Contratos"}
        description={
          overdue
            ? "Contratos con cuotas vencidas o saldo pendiente."
            : "Contratos de compraventa. El cronograma y la cobranza viven en la ficha de cada contrato."
        }
      />
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1">
        <ContractsTable
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
          origin={filters.origin}
          onOriginChange={handleOriginChange}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
