"use client";

import { useMemo } from "react";
import { Table as TableInstance } from "@tanstack/react-table";

import { DataTableExpanded } from "@/components/datatable/data-table-expanded";
import { Lead } from "../../_types/lead";
import { facetedFilters } from "../../_utils/leads.filter.utils";
import { leadsColumns } from "./LeadsTableColumns";
import { LeadsTableToolbarActions } from "./LeadsTableToolbarActions";
import {
    CustomPaginationTableParams,
    ServerPaginationChangeEventCallback,
} from "@/types/tanstack-table/CustomPagination";

interface LeadsTableProps {
    data: Array<Lead>;
    pagination: CustomPaginationTableParams;
    onPaginationChange: ServerPaginationChangeEventCallback;
}

export function LeadsTable({
    data,
    pagination,
    onPaginationChange,
}: LeadsTableProps) {
    const columns = useMemo(() => leadsColumns(), []);

    return (
        <DataTableExpanded
            isLoading={false}
            data={data}
            columns={columns}
            toolbarActions={(table: TableInstance<Lead>) => <LeadsTableToolbarActions table={table} />}
            filterPlaceholder="Buscar leads..."
            facetedFilters={facetedFilters}
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
