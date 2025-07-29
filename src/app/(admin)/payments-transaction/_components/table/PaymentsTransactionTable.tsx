"use client";

import { useMemo } from "react";
import { Table as TableInstance } from "@tanstack/react-table";

import { DataTableExpanded } from "@/components/datatable/data-table-expanded";
import { PaymentsTransactionTableToolbarActions } from "./PaymentsTransactionTableToolbarActions";
import { ReservationDto, ReservationWithPaymentsDto } from "@/app/(admin)/reservations/_types/reservation";
import { paymentsTransactionColumns } from "./PaymentsTransactionTableColumns";
import { PaymentsExpandedContent } from "./PaymentsTransactionContent";
import {
    CustomPaginationTableParams,
    ServerPaginationChangeEventCallback,
} from "@/types/tanstack-table/CustomPagination";

interface PaymentsTransactionTableProps {
  data: Array<ReservationWithPaymentsDto>;
  pagination: CustomPaginationTableParams;
  onPaginationChange: ServerPaginationChangeEventCallback;
}

export function PaymentsTransactionTable({
    data,
    pagination,
    onPaginationChange,
}: PaymentsTransactionTableProps) {
    const columns = useMemo(() => paymentsTransactionColumns(), []);

    return (
        <DataTableExpanded
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
