"use client";

import type { Table } from "@tanstack/react-table";

import { ReservationDto } from "@/app/(admin)/reservations/_types/reservation";

export interface PaymentsTransactionTableToolbarActionsProps {
  table?: Table<ReservationDto>
}

export function PaymentsTransactionTableToolbarActions({  }: PaymentsTransactionTableToolbarActionsProps) {

    return (
        <div className="flex flex-wrap items-center justify-end gap-2" />
    );
}
