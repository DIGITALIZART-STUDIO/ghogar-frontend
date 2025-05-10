"use client";

import { type Table } from "@tanstack/react-table";

import { Lead } from "../../_types/lead";
import { CreateLeadsDialog } from "../create/CreateLeadssDialog";
import { ImportLeadsDialog } from "../imports/ImportLeadsDialog";
import { DeleteLeadsDialog } from "../state-management/DeleteLeadsDialog";
import { ReactivateLeadsDialog } from "../state-management/ReactivateLeadsDialog";

export interface LeadsTableToolbarActionsProps {
  table?: Table<Lead>;
}

export function LeadsTableToolbarActions({ table }: LeadsTableToolbarActionsProps) {
    return (
        <div className="flex flex-wrap items-center justify-end gap-2">
            {table && table.getFilteredSelectedRowModel().rows.length > 0 ? (
                <>
                    <DeleteLeadsDialog
                        leads={table.getFilteredSelectedRowModel().rows.map((row) => row.original)}
                        onSuccess={() => table.toggleAllRowsSelected(false)}
                    />
                    <ReactivateLeadsDialog
                        leads={table.getFilteredSelectedRowModel().rows.map((row) => row.original)}
                        onSuccess={() => table.toggleAllRowsSelected(false)}
                    />
                </>
            ) : null}
            <ImportLeadsDialog />
            <CreateLeadsDialog />
        </div>
    );
}
