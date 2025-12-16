"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Table as TableInstance } from "@tanstack/react-table";

import { Lead } from "@/app/(admin)/leads/_types/lead";
import { assignmentsColumns } from "./AssignmentsTableColumns";
import { AssignmentsTableToolbarActions } from "./AssignmentsTableToolbarActions";
import { AssignmentDescription } from "./AssignmentDescription";
import {
    CustomPaginationTableParams,
    ServerPaginationChangeEventCallback,
} from "@/types/tanstack-table/CustomPagination";
import { createFacetedFilters } from "../../_utils/assignments.filter.utils";
import { DataTable } from "@/components/datatable/data-table";

interface AssignmentsTableProps {
    data: Array<Lead>;
    pagination: CustomPaginationTableParams;
    onPaginationChange: ServerPaginationChangeEventCallback;
    search?: string;
    setSearch?: (search: string) => void;
    status?: Array<string>;
    setStatus?: (status: Array<string>) => void;
    captureSource?: Array<string>;
    setCaptureSource?: (captureSource: Array<string>) => void;
    handleOrderChange?: (field: string, direction: "asc" | "desc") => void;
    resetFilters?: () => void;
    isLoading?: boolean;
}

export function AssignmentsTable({
    data,
    pagination,
    onPaginationChange,
    search,
    setSearch,
    status,
    setStatus,
    captureSource,
    setCaptureSource,
    isLoading = false,
}: AssignmentsTableProps) {
    const router = useRouter();

    const handleTasksInterface = useCallback(
        (id: string) => {
            router.push(`/assignments/${id}/tasks`);
        },
        [router]
    );

    const columns = useMemo(() => assignmentsColumns(handleTasksInterface), [handleTasksInterface]);

    // Crear faceted filters con callbacks del servidor
    const customFacetedFilters = useMemo(() => {
        if (setStatus && setCaptureSource) {
            return createFacetedFilters(
                setStatus,
                setCaptureSource,
                status ?? [],
                captureSource ?? []
            );
        }
        return [];
    }, [setStatus, setCaptureSource, status, captureSource]);

    return (
        <DataTable
            isLoading={isLoading}
            data={data}
            columns={columns}
            toolbarActions={(table: TableInstance<Lead>) => <AssignmentsTableToolbarActions table={table} />}
            filterPlaceholder="Buscar mis leads..."
            facetedFilters={customFacetedFilters}
            renderExpandedRow={(row) => <AssignmentDescription row={row} />}
            externalFilterValue={search}
            onGlobalFilterChange={setSearch}
            serverPagination={{
                pageIndex: pagination.page - 1,
                pageSize: pagination.pageSize,
                pageCount: pagination.totalPages,
                total: pagination.total,
                onPaginationChange: onPaginationChange,
            }}
        />
    );
}
