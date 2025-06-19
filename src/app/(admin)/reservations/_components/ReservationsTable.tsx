"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Table as TableInstance } from "@tanstack/react-table";

import { DataTable } from "@/components/datatable/data-table";
import { ReservationDto } from "../_types/reservation";
import { reservationsColumns } from "./ReservationsTableColumns";
import { facetedFilters } from "../_utils/reservations.filter.utils";
import { ReservationsTableToolbarActions } from "./ReservationsTableToolbarActions";

interface ReservationsTableProps {
    data: Array<ReservationDto>;
}

export function ReservationsTable({ data }: ReservationsTableProps) {
    const router = useRouter();

    const handleEditInterface = useCallback(
        (id: string) => {
            router.push(`/reservations/${id}/edit`);
        },
        [router],
    );

    const columns = useMemo(() => reservationsColumns(handleEditInterface), [handleEditInterface]);

    return (
        <DataTable
            data={data}
            columns={columns}
            toolbarActions={(table: TableInstance<ReservationDto>) => <ReservationsTableToolbarActions table={table} />}
            filterPlaceholder="Buscar separaciones..."
            facetedFilters={facetedFilters}
        />
    );
}
