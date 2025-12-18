"use client";

import { type Table } from "@tanstack/react-table";

import { CreateLeadsDialog } from "@/app/(admin)/leads/_components/create/CreateLeadsDialog";
import { Lead } from "@/app/(admin)/leads/_types/lead";

export interface AssignmentsTableToolbarActionsProps {
  table?: Table<Lead>;
}

export function AssignmentsTableToolbarActions({}: AssignmentsTableToolbarActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <CreateLeadsDialog />
    </div>
  );
}
