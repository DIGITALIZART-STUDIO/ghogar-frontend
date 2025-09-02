"use client";

import {  useMemo } from "react";
import { Table as TableInstance } from "@tanstack/react-table";

import { DataTable } from "@/components/datatable/data-table";
import { ReservationsTableToolbarActions } from "./PendingContractsTableToolbarActions";
import { CustomPaginationTableParams, ServerPaginationChangeEventCallback } from "@/types/tanstack-table/CustomPagination";
import { ReservationDto, ReservationWithPendingPaymentsDto } from "../../reservations/_types/reservation";
import { creditManagementColumns } from "./PendingContractsTableColumns";

interface CreditManagementTableProps {
    data: Array<ReservationWithPendingPaymentsDto>;
    pagination: CustomPaginationTableParams;
    onPaginationChange: ServerPaginationChangeEventCallback;
}

export function CreditManagementTable({ data, pagination, onPaginationChange }: CreditManagementTableProps) {

    const columns = useMemo(() => creditManagementColumns(), []);

    return (
        <DataTable
            data={data}
            columns={columns}
            toolbarActions={(table: TableInstance<ReservationDto>) => <ReservationsTableToolbarActions table={table} />}
            filterPlaceholder="Buscar separaciones con pagos pendientes..."
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
