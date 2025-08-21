"use client";

import {  useMemo } from "react";
import { Table as TableInstance } from "@tanstack/react-table";

import { DataTable } from "@/components/datatable/data-table";
import { ReservationsTableToolbarActions } from "./PendingContractsTableToolbarActions";
import { CustomPaginationTableParams, ServerPaginationChangeEventCallback } from "@/types/tanstack-table/CustomPagination";
import { ReservationDto } from "../../reservations/_types/reservation";
import { pendingContractsColumns } from "./PendingContractsTableColumns";

interface PendingContractsTableProps {
    data: Array<ReservationDto>;
    pagination: CustomPaginationTableParams;
    onPaginationChange: ServerPaginationChangeEventCallback;
}

export function PendingContractsTable({ data, pagination, onPaginationChange }: PendingContractsTableProps) {

    const columns = useMemo(() => pendingContractsColumns(), []);

    return (
        <DataTable
            data={data}
            columns={columns}
            toolbarActions={(table: TableInstance<ReservationDto>) => <ReservationsTableToolbarActions table={table} />}
            filterPlaceholder="Buscar separaciones..."
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
