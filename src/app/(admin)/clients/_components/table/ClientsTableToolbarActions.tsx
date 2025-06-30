"use client";

import { type Table } from "@tanstack/react-table";

import { Client } from "../../_types/client";
import { CreateClientsDialog } from "../create/CreateClientsDialog";
import { DeleteClientsDialog } from "../state-management/DeleteClientsDialog";
import { ReactivateClientsDialog } from "../state-management/ReactivateClientsDialog";

export interface ClientsTableToolbarActionsProps {
  table?: Table<Client>;
}

export function ClientsTableToolbarActions({ table }: ClientsTableToolbarActionsProps) {
    return (
        <div className="flex flex-wrap items-center justify-end gap-2">
            {table && table.getFilteredSelectedRowModel().rows.length > 0 ? (
                <>
                    <DeleteClientsDialog
                        clients={table.getFilteredSelectedRowModel().rows.map((row) => row.original)}
                        onSuccess={() => table.toggleAllRowsSelected(false)}
                    />
                    <ReactivateClientsDialog
                        clients={table.getFilteredSelectedRowModel().rows.map((row) => row.original)}
                        onSuccess={() => table.toggleAllRowsSelected(false)}
                        open={false}
                        onOpenChange={() => {}}
                    />
                </>
            ) : null}
            <CreateClientsDialog />
        </div>
    );
}
