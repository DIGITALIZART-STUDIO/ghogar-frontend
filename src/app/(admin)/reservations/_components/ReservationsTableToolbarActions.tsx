"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { type Table } from "@tanstack/react-table";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ReservationDto } from "../_types/reservation";

export interface ReservationsTableToolbarActionsProps {
  table?: Table<ReservationDto>;
}

export function ReservationsTableToolbarActions({ table }: ReservationsTableToolbarActionsProps) {
    const router = useRouter();

    const handleCreateReservationInterface = useCallback(() => {
        router.push("/reservations/create");
    }, [router]);
    
    return (
        <div className="flex flex-wrap items-center justify-end gap-2">
            {table && table.getFilteredSelectedRowModel().rows.length > 0 ? null : null}
            <Button variant="outline" size="sm" onClick={handleCreateReservationInterface}>
                <Plus className="mr-2 size-4" aria-hidden="true" />
                Crear separación
            </Button>
        </div>
    );
} 