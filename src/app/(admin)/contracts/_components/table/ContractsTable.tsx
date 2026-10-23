"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Table as TableInstance } from "@tanstack/react-table";
import { Plus } from "lucide-react";

import { DataTable } from "@/components/datatable/data-table";
import { Button } from "@/components/ui/button";
import {
  CustomPaginationTableParams,
  ServerPaginationChangeEventCallback,
} from "@/types/tanstack-table/CustomPagination";
import { ContractDto } from "../../_types/contract";
import { createContractsFacetedFilters } from "../../_utils/contracts.filter.utils";
import { contractsColumns } from "./ContractsTableColumns";

interface ContractsTableProps {
  data: Array<ContractDto>;
  pagination: CustomPaginationTableParams;
  onPaginationChange: ServerPaginationChangeEventCallback;
  search?: string;
  onSearchChange: (search: string) => void;
  status?: Array<string>;
  onStatusChange: (status: Array<string>) => void;
  origin?: Array<string>;
  onOriginChange: (origin: Array<string>) => void;
  isLoading?: boolean;
}

export function ContractsTable({
  data,
  pagination,
  onPaginationChange,
  search,
  onSearchChange,
  status,
  onStatusChange,
  origin,
  onOriginChange,
  isLoading = false,
}: ContractsTableProps) {
  const columns = useMemo(() => contractsColumns(), []);
  const facetedFilters = useMemo(
    () => createContractsFacetedFilters(onStatusChange, onOriginChange, status, origin),
    [onStatusChange, onOriginChange, status, origin]
  );

  return (
    <DataTable
      isLoading={isLoading}
      data={data}
      columns={columns}
      toolbarActions={(_table: TableInstance<ContractDto>) => (
        <Button asChild size="sm">
          <Link href="/contracts/create">
            <Plus className="mr-1 h-4 w-4" />
            Crear contrato
          </Link>
        </Button>
      )}
      filterPlaceholder="Buscar contratos..."
      facetedFilters={facetedFilters}
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
