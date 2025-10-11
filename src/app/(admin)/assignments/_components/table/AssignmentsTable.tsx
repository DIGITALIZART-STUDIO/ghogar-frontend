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
    ServerPaginationWithSearchConfig,
} from "@/types/tanstack-table/CustomPagination";
import { createFacetedFilters } from "../../_utils/assignments.filter.utils";

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
    completionReason?: Array<string>;
    setCompletionReason?: (completionReason: Array<string>) => void;
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
    completionReason,
    setCompletionReason,
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

    // Configuración del servidor para búsqueda y filtros
    const serverConfig: ServerPaginationWithSearchConfig = useMemo(() => ({
        pageIndex: pagination.page - 1,
        pageSize: pagination.pageSize,
        pageCount: pagination.totalPages,
        total: pagination.total,
        onPaginationChange: async (pageIndex, pageSize) => {
            onPaginationChange(pageIndex + 1, pageSize);
        },
        search: search !== undefined && setSearch ? {
            search,
            onSearchChange: setSearch,
            searchPlaceholder: "Buscar mis leads...",
        } : undefined,
        filters: {
            filters: {
                status: status ?? [],
                captureSource: captureSource ?? [],
                completionReason: completionReason ?? [],
            },
            onFiltersChange: (filters) => {
                if (setStatus && setCaptureSource && setCompletionReason) {
                    setStatus(filters.status as Array<string> ?? []);
                    setCaptureSource(filters.captureSource as Array<string> ?? []);
                    setCompletionReason(filters.completionReason as Array<string> ?? []);
                }
            },
        },
    }), [pagination, onPaginationChange, search, setSearch, status, setStatus, captureSource, setCaptureSource, completionReason, setCompletionReason]);

    return (
        <DataTableExpanded
            isLoading={isLoading}
            data={data}
            columns={columns}
            toolbarActions={(table: TableInstance<Lead>) => <AssignmentsTableToolbarActions table={table} />}
            filterPlaceholder="Buscar mis leads..."
            facetedFilters={customFacetedFilters}
            renderExpandedRow={(row) => <AssignmentDescription row={row} />}
            serverConfig={serverConfig}
        />
    );
}
