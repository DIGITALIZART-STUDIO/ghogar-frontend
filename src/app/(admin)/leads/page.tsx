"use client";

import { useCallback, useEffect, useState } from "react";

import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import ErrorGeneral from "@/components/errors/general-error";
import { LeadsTable } from "./_components/table/LeadsTable";
import { usePaginatedLeads } from "./_hooks/useLeads";
import { useLeadsStore } from "./_store/useLeadsStore";

export default function LeadsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { selectedUserId, selectedClientId } = useLeadsStore();

  const {
    data: paginatedLeads,
    isLoading,
    error,
    search,
    setSearch,
    status,
    setStatus,
    captureSource,
    setCaptureSource,
    userId,
    setUserId,
    clientId,
    setClientId,
    handleOrderChange,
    resetFilters,
  } = usePaginatedLeads(page, pageSize);

  // Sincronizar los filtros del store con los filtros de leads
  useEffect(() => {
    if (selectedUserId !== userId) {
      setUserId(selectedUserId);
    }
  }, [selectedUserId, userId, setUserId]);

  useEffect(() => {
    if (selectedClientId !== clientId) {
      setClientId(selectedClientId);
    }
  }, [selectedClientId, clientId, setClientId]);

  const handlePaginationChange = useCallback(async (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  }, []);

  if (isLoading && !paginatedLeads) {
    return (
      <div>
        <HeaderPage title="Leads" description="Cargando leads..." />
        <DataTableSkeleton columns={7} numFilters={3} />
      </div>
    );
  }

  if (error || !paginatedLeads) {
    return (
      <div>
        <HeaderPage title="Leads" description="Prospectos y contactos comerciales potenciales." />
        <ErrorGeneral />
      </div>
    );
  }

  return (
    <div>
      <HeaderPage title="Leads" description="Prospectos y contactos comerciales potenciales." />
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <LeadsTable
          data={paginatedLeads.data ?? []}
          pagination={{
            page: paginatedLeads.meta?.page ?? 1,
            pageSize: paginatedLeads.meta?.pageSize ?? 10,
            total: paginatedLeads.meta?.total ?? 0,
            totalPages: paginatedLeads.meta?.totalPages ?? 1,
          }}
          onPaginationChange={handlePaginationChange}
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          captureSource={captureSource}
          setCaptureSource={setCaptureSource}
          handleOrderChange={handleOrderChange}
          resetFilters={resetFilters}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
