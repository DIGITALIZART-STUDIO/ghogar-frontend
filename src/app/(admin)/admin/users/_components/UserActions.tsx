"use client";

import { components } from "@/types/api";
import { type Table } from "@tanstack/react-table";

type UserGetDTO = components["schemas"]["UserGetDTO"];

export interface ClientsTableToolbarActionsProps {
    table?: Table<UserGetDTO>;
}

export function UsersTableToolbarActions({ }: ClientsTableToolbarActionsProps) {
    return (
        <div className="flex flex-wrap items-center justify-end gap-2">
            --Acciones--
        </div>
    );
}
