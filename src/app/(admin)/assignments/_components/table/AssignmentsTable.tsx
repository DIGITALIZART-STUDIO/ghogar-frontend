"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Table as TableInstance } from "@tanstack/react-table";

import { Lead } from "@/app/(admin)/leads/_types/lead";
import { DataTableExpanded } from "@/components/datatable/data-table-expanded";
import { assignmentsColumns } from "./AssignmentsTableColumns";
import { AssignmentsTableToolbarActions } from "./AssignmentsTableToolbarActions";
import { AssignmentDescription } from "./AssignmentDescription";
import {
    CustomPaginationTableParams,
    ServerPaginationChangeEventCallback,
} from "@/types/tanstack-table/CustomPagination";
import { facetedFilters } from "../../_utils/assignments.filter.utils";

interface AssignmentsTableProps {
    data: Array<Lead>;
    pagination: CustomPaginationTableParams;
    onPaginationChange: ServerPaginationChangeEventCallback;
}

export function AssignmentsTable({
    data,
    pagination,
    onPaginationChange,
}: AssignmentsTableProps) {
    const router = useRouter();

    const handleTasksInterface = useCallback(
        (id: string) => {
            router.push(`/assignments/${id}/tasks`);
        },
        [router]
    );

    const columns = useMemo(() => assignmentsColumns(handleTasksInterface), [handleTasksInterface]);

    return (
        <DataTableExpanded
            isLoading={false}
            data={data}
            columns={columns}
            toolbarActions={(table: TableInstance<Lead>) => <AssignmentsTableToolbarActions table={table} />}
            filterPlaceholder="Buscar mis leads..."
            facetedFilters={facetedFilters}
            renderExpandedRow={(row) => <AssignmentDescription row={row} />}
            serverPagination={{
                pageIndex: pagination.page - 1,
                pageSize: pagination.pageSize,
                pageCount: pagination.totalPages,
                total: pagination.total,
                onPaginationChange: async (pageIndex, pageSize) => {
                    onPaginationChange(pageIndex + 1, pageSize);
                },
            }}
        />
    );
}
