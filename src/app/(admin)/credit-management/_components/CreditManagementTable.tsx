"use client";

import { useMemo } from "react";
import { Table as TableInstance } from "@tanstack/react-table";

import { DataTable } from "@/components/datatable/data-table";
import {
  CustomPaginationTableParams,
  ServerPaginationChangeEventCallback,
} from "@/types/tanstack-table/CustomPagination";
import { createCreditManagementFacetedFilters } from "../_utils/credit-management.filter.utils";
import { ContractDto } from "../../contracts/_types/contract";
import { creditManagementColumns } from "./CreditManagementTableColumns";
import { CreditManagementTableToolbarActions } from "./CreditManagementTableToolbarActions";

interface CreditManagementTableProps {
  data: Array<ContractDto>;
  pagination: CustomPaginationTableParams;
  onPaginationChange: ServerPaginationChangeEventCallback;
  search?: string;
  onSearchChange: (search: string) => void;
  status?: Array<string>;
  onStatusChange: (status: Array<string>) => void;
  isLoading?: boolean;
}

export function CreditManagementTable({
  data,
  pagination,
  onPaginationChange,
  search,
  onSearchChange,
  status,
  onStatusChange,
  isLoading = false,
}: CreditManagementTableProps) {
  const columns = useMemo(() => creditManagementColumns(), []);
  const customFacetedFilters = useMemo(
    () => createCreditManagementFacetedFilters(onStatusChange, status ?? []),
    [onStatusChange, status]
  );

  return (
    <DataTable
      isLoading={isLoading}
      data={data}
      columns={columns}
      toolbarActions={(_table: TableInstance<ContractDto>) => <CreditManagementTableToolbarActions />}
      filterPlaceholder="Buscar contratos con saldo pendiente..."
      facetedFilters={customFacetedFilters}
      externalFilterValue={search}
      onGlobalFilterChange={onSearchChange}
      serverPagination={{
        pageIndex: pagination.page - 1,
        pageSize: pagination.pageSize,
        pageCount: pagination.totalPages,
        total: pagination.total,
        onPaginationChange: async (pageIndex, pageSize) => {
          onPaginationChange(pageIndex + 1, pageSize);
        },
      }}
    />
  );
}
