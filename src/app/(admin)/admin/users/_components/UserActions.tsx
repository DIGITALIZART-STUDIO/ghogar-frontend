"use client";

import { components } from "@/types/api";
import { type Table } from "@tanstack/react-table";
import { UserCreateDialog } from "./create/UserCreateDialog";

type UserGetDTO = components["schemas"]["UserGetDTO"];

export interface ClientsTableToolbarActionsProps {
    table?: Table<UserGetDTO>;
    refetch: () => void;
}

export function UsersTableToolbarActions({ refetch}: ClientsTableToolbarActionsProps) {
    return (
        <div className="flex flex-wrap items-center justify-end gap-2">
            <UserCreateDialog refetch={refetch} />
        </div>
    );
}
