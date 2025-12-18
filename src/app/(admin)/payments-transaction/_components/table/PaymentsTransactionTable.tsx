"use client";

import { useMemo } from "react";
import { Table as TableInstance } from "@tanstack/react-table";

import { ReservationDto, ReservationWithPaymentsDto } from "@/app/(admin)/reservations/_types/reservation";
import { DataTable } from "@/components/datatable/data-table";
import {
  CustomPaginationTableParams,
  ServerPaginationChangeEventCallback,
} from "@/types/tanstack-table/CustomPagination";
import { PaymentsExpandedContent } from "./PaymentsTransactionContent";
import { paymentsTransactionColumns } from "./PaymentsTransactionTableColumns";
import { PaymentsTransactionTableToolbarActions } from "./PaymentsTransactionTableToolbarActions";

interface PaymentsTransactionTableProps {
  data: Array<ReservationWithPaymentsDto>;
  pagination: CustomPaginationTableParams;
  onPaginationChange: ServerPaginationChangeEventCallback;
}

export function PaymentsTransactionTable({ data, pagination, onPaginationChange }: PaymentsTransactionTableProps) {
  const columns = useMemo(() => paymentsTransactionColumns(), []);

  return (
    <DataTable
      isLoading={false}
      data={data}
      columns={columns}
      toolbarActions={(table: TableInstance<ReservationDto>) => (
        <PaymentsTransactionTableToolbarActions table={table} />
      )}
      filterPlaceholder="Buscar pagos..."
      renderExpandedRow={(reservation) => <PaymentsExpandedContent reservation={reservation} />}
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
