"use client";

import { useMemo } from "react";
import { Table as TableInstance } from "@tanstack/react-table";

import { DataTableExpanded } from "@/components/datatable/data-table-expanded";
import { Lead } from "../../_types/lead";
import { createFacetedFilters } from "../../_utils/leads.filter.utils";
import { leadsColumns } from "./LeadsTableColumns";
import { LeadsTableToolbarActions } from "./LeadsTableToolbarActions";
import {
    CustomPaginationTableParams,
    ServerPaginationChangeEventCallback,
    ServerPaginationWithSearchConfig,
} from "@/types/tanstack-table/CustomPagination";

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
    completionReason?: Array<string>;
    setCompletionReason?: (completionReason: Array<string>) => void;
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
    completionReason,
    setCompletionReason,
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
            searchPlaceholder: "Buscar leads...",
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
            toolbarActions={(table: TableInstance<Lead>) => <LeadsTableToolbarActions table={table} />}
            filterPlaceholder="Buscar leads..."
            facetedFilters={customFacetedFilters}
            serverConfig={serverConfig}
        />
    );
}
