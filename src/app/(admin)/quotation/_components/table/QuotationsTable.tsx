"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Table as TableInstance } from "@tanstack/react-table";

import { DataTableExpanded } from "@/components/datatable/data-table-expanded";
import { SummaryQuotation } from "../../_types/quotation";
import { createFacetedFilters } from "../../_utils/quotations.filter.utils";
import { quotationsColumns } from "./QuotationsTableColumns";
import { QuotationsTableToolbarActions } from "./QuotationsTableToolbarActions";
import {
    CustomPaginationTableParams,
    ServerPaginationChangeEventCallback,
} from "@/types/tanstack-table/CustomPagination";

interface QuotationsTableProps {
    data: Array<SummaryQuotation>;
    pagination: CustomPaginationTableParams;
    onPaginationChange: ServerPaginationChangeEventCallback;
    search?: string;
    onSearchChange: (search: string) => void;
    status?: Array<string>;
    onStatusChange: (status: Array<string>) => void;
    isLoading?: boolean;
}

export function QuotationsTable({
    data,
    pagination,
    onPaginationChange,
    search,
    onSearchChange,
    status,
    onStatusChange,
    isLoading = false,
}: QuotationsTableProps) {
    const router = useRouter();

    const handleEditInterface = useCallback(
        (id: string) => {
            router.push(`/quotation/${id}/update`);
        },
        [router],
    );

    const columns = useMemo(() => quotationsColumns(handleEditInterface), [handleEditInterface]);

    // Crear filtros personalizados con callbacks del servidor
    const customFacetedFilters = useMemo(
        () => createFacetedFilters(onStatusChange, status),
        [onStatusChange, status]
    );

    return (
        <DataTableExpanded
            isLoading={isLoading}
            data={data}
            columns={columns}
            toolbarActions={(table: TableInstance<SummaryQuotation>) => (
                <QuotationsTableToolbarActions table={table} />
            )}
            filterPlaceholder="Buscar cotizaciones..."
            facetedFilters={customFacetedFilters}
            serverConfig={{
                pageIndex: pagination.page - 1,
                pageSize: pagination.pageSize,
                pageCount: pagination.totalPages,
                total: pagination.total,
                onPaginationChange: async (pageIndex, pageSize) => {
                    onPaginationChange(pageIndex + 1, pageSize);
                },
                search: {
                    search: search ?? "",
                    onSearchChange: onSearchChange,
                    searchPlaceholder: "Buscar cotizaciones...",
                },
            }}
        />
    );
}
