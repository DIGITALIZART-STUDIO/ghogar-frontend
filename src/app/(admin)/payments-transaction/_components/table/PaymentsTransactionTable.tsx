"use client";

import { useMemo } from "react";
import { Table as TableInstance } from "@tanstack/react-table";

import { DataTableExpanded } from "@/components/datatable/data-table-expanded";
import { PaymentsTransactionTableToolbarActions } from "./PaymentsTransactionTableToolbarActions";
import { ReservationDto, ReservationWithPaymentsDto } from "@/app/(admin)/reservations/_types/reservation";
import { paymentsTransactionColumns } from "./PaymentsTransactionTableColumns";
import { PaymentsExpandedContent } from "./PaymentsTransactionContent";

export function PaymentsTransactionTable({ data }: { data: Array<ReservationWithPaymentsDto> }) {
    const columns = useMemo(() => paymentsTransactionColumns(), []);

    return (
        <DataTableExpanded
            isLoading={false}
            data={data}
            columns={columns}
            toolbarActions={(table: TableInstance<ReservationDto>) => <PaymentsTransactionTableToolbarActions table={table} />}
            filterPlaceholder="Buscar pagos..."
            renderExpandedRow={(reservation) => <PaymentsExpandedContent reservation={reservation} />}
        />
    );
}
