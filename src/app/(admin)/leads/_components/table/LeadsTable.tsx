"use client";

import { useMemo } from "react";
import { Table as TableInstance } from "@tanstack/react-table";
import { IdCard } from "lucide-react";

import { DataTableExpanded } from "@/components/datatable/data-table-expanded";
import { Lead } from "../../_types/lead";
import { facetedFilters, getUniqueIdentifiers } from "../../_utils/leads.filter.utils";
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

    // Crear el filtro dinámico para identificadores (DNI/RUC)
    const uniqueIdentifiers = useMemo(() => getUniqueIdentifiers(data), [data]);

    // Crear todos los filtros
    const allFilters = useMemo(() => {
        const filters = [...facetedFilters];

        if (uniqueIdentifiers.length > 0) {
            filters.push({
                column: "Cliente",
                title: "Identificador",
                options: uniqueIdentifiers.map((identifier) => ({
                    label: `${identifier.type}: ${identifier.value}`,
                    value: identifier.value,
                    icon: IdCard,
                })),
            });
        }

        return filters;
    }, [uniqueIdentifiers]);

    return (
        <DataTableExpanded
            isLoading={false}
            data={data}
            columns={columns}
            toolbarActions={(table: TableInstance<Lead>) => <LeadsTableToolbarActions table={table} />}
            filterPlaceholder="Buscar leads..."
            facetedFilters={allFilters}
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
