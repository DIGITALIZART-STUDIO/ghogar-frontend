"use client";

import { useMemo } from "react";

import { DataTable } from "@/components/datatable/data-table";
import {
  CustomPaginationTableParams,
  ServerPaginationChangeEventCallback,
} from "@/types/tanstack-table/CustomPagination";
import { CreditsReportItem } from "../_types/creditsReport";
import { CreditsReportQuotaDetail } from "./CreditsReportQuotaDetail";
import { creditsReportColumns } from "./CreditsReportTableColumns";

interface CreditsReportTableProps {
  data: Array<CreditsReportItem>;
  pagination: CustomPaginationTableParams;
  onPaginationChange: ServerPaginationChangeEventCallback;
  isLoading?: boolean;
}

export function CreditsReportTable({
  data,
  pagination,
  onPaginationChange,
  isLoading = false,
}: CreditsReportTableProps) {
  const columns = useMemo(() => creditsReportColumns(), []);

  return (
    <DataTable
      isLoading={isLoading}
      data={data}
      columns={columns}
      filterPlaceholder="Buscar en esta página..."
      renderExpandedRow={(row) => <CreditsReportQuotaDetail row={row} />}
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
