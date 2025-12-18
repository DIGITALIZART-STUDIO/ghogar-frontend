"use client";

import { type Table } from "@tanstack/react-table";

import { Lead } from "@/app/(admin)/leads/_types/lead";

export interface AssignmentsTableToolbarActionsProps {
  table?: Table<Lead>;
}

export function AssignmentsTableToolbarActions({}: AssignmentsTableToolbarActionsProps) {
    return <div className="flex flex-wrap items-center justify-end gap-2" />;
}
