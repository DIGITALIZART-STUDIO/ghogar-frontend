"use client";

import { useMemo } from "react";
import { Table as TableInstance } from "@tanstack/react-table";

import { DataTable } from "@/components/datatable/data-table";
import {
  CustomPaginationTableParams,
  ServerPaginationChangeEventCallback,
} from "@/types/tanstack-table/CustomPagination";
import { Client } from "../../_types/client";
import { createFacetedFilters } from "../../_utils/clients.filter.utils";
import { ClientDescription } from "./ClientDescription";
import { clientsColumns } from "./ClientsTableColumns";
import { ClientsTableToolbarActions } from "./ClientsTableToolbarActions";

interface ClientsTableProps {
  data: Array<Client>;
  pagination: CustomPaginationTableParams;
  onPaginationChange: ServerPaginationChangeEventCallback;
  search?: string;
  setSearch?: (search: string) => void;
  isActive?: Array<boolean>;
  setIsActive?: (isActive: Array<boolean>) => void;
  type?: Array<string>;
  setType?: (type: Array<string>) => void;
  handleOrderChange?: (field: string, direction: "asc" | "desc") => void;
  resetFilters?: () => void;
  isLoading?: boolean;
}

export function ClientsTable({
  data,
  pagination,
  onPaginationChange,
  search,
  setSearch,
  isActive,
  setIsActive,
  type,
  setType,
  isLoading = false,
}: ClientsTableProps) {
  const columns = useMemo(() => clientsColumns(), []);

  // Crear faceted filters con callbacks del servidor
  const customFacetedFilters = useMemo(() => {
    if (setIsActive && setType) {
      return createFacetedFilters(setIsActive, setType, isActive ?? [], type ?? []);
    }
    return [];
  }, [setIsActive, setType, isActive, type]);

  return (
    <DataTable
      isLoading={isLoading}
      data={data}
      columns={columns}
      toolbarActions={(table: TableInstance<Client>) => <ClientsTableToolbarActions table={table} />}
      filterPlaceholder="Buscar clientes..."
      facetedFilters={customFacetedFilters}
      renderExpandedRow={(row) => <ClientDescription row={row} />}
      externalFilterValue={search}
      onGlobalFilterChange={setSearch}
      serverPagination={{
        pageIndex: pagination.page - 1,
        pageSize: pagination.pageSize,
        pageCount: pagination.totalPages,
        total: pagination.total,
        onPaginationChange: onPaginationChange,
      }}
    />
  );
}
