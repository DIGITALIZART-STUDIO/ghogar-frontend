"use client";

import { useMemo } from "react";
import { Table as TableInstance } from "@tanstack/react-table";

import { Lead } from "../../_types/lead";
import { createFacetedFilters } from "../../_utils/leads.filter.utils";
import { leadsColumns } from "./LeadsTableColumns";
import { LeadsTableToolbarActions } from "./LeadsTableToolbarActions";
import {
    CustomPaginationTableParams,
    ServerPaginationChangeEventCallback,
} from "@/types/tanstack-table/CustomPagination";
import { DataTable } from "@/components/datatable/data-table";

interface LeadsTableProps {
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

export function LeadsTable({
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
}: LeadsTableProps) {
    const columns = useMemo(() => leadsColumns(), []);

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
            toolbarActions={(table: TableInstance<Lead>) => <LeadsTableToolbarActions table={table} />}
            filterPlaceholder="Buscar leads..."
            facetedFilters={customFacetedFilters}
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
