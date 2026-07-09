"use client";

import { useCallback, useState } from "react";

import { useClaims } from "@/app/(admin)/_authorization_context";
import { hasGlobalListView } from "@/app/(admin)/_utils/global-list-view";
import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import ErrorGeneral from "@/components/errors/general-error";
import { QuotationsTable } from "./_components/table/QuotationsTable";
import { useQuotationsListPagination } from "./_hooks/useQuotationsListPagination";

export default function QuotationPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const roles = useClaims();
  const isGlobalView = hasGlobalListView(roles[0]);

  const {
    data: quotations,
    meta,
    isLoading,
    error,
    search,
    filters,
    setSearch,
    handleStatusChange,
  } = useQuotationsListPagination(page, pageSize, isGlobalView);

  const handlePaginationChange = useCallback(async (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  }, []);

  const pageTitle = isGlobalView ? "Todas las Cotizaciones" : "Mis Cotizaciones";
  const pageDescription = isGlobalView
    ? "Gestión de todas las cotizaciones del sistema."
    : "Gestión de cotizaciones generadas por el usuario.";

  if (isLoading && !quotations) {
    return (
      <div>
        <HeaderPage title={pageTitle} description="Cargando cotizaciones..." />
        <DataTableSkeleton columns={7} numFilters={1} />
      </div>
    );
  }

  if (error || !quotations) {
    return (
      <div>
        <HeaderPage title={pageTitle} description={pageDescription} />
        <ErrorGeneral />
      </div>
    );
  }

  return (
    <div>
      <HeaderPage title={pageTitle} description={pageDescription} />
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
