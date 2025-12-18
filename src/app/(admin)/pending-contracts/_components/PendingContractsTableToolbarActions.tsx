"use client";

import { type Table } from "@tanstack/react-table";
import { ReservationDto } from "../../reservations/_types/reservation";

export interface ReservationsTableToolbarActionsProps {
  table?: Table<ReservationDto>;
}

export function ReservationsTableToolbarActions({  }: ReservationsTableToolbarActionsProps) {

    return (
        <div className="flex flex-wrap items-center justify-end gap-2" />
    );
}
