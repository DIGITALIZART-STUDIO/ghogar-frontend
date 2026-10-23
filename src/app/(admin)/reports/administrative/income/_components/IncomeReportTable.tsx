"use client";

import { useMemo } from "react";

import { DataTable } from "@/components/datatable/data-table";
import {
  CustomPaginationTableParams,
  ServerPaginationChangeEventCallback,
} from "@/types/tanstack-table/CustomPagination";
import { IncomeReportItem } from "../_types/incomeReport";
import { incomeReportColumns } from "./IncomeReportTableColumns";

interface IncomeReportTableProps {
  data: Array<IncomeReportItem>;
  pagination: CustomPaginationTableParams;
  onPaginationChange: ServerPaginationChangeEventCallback;
  isLoading?: boolean;
}

export function IncomeReportTable({ data, pagination, onPaginationChange, isLoading = false }: IncomeReportTableProps) {
  const columns = useMemo(() => incomeReportColumns(), []);

  return (
    <DataTable
      isLoading={isLoading}
      data={data}
      columns={columns}
      filterPlaceholder="Buscar en esta página..."
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
