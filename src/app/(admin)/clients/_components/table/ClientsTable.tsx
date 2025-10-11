"use client";

import { useMemo } from "react";
import { Table as TableInstance } from "@tanstack/react-table";

import { DataTableExpanded } from "@/components/datatable/data-table-expanded";
import { Client } from "../../_types/client";
import { createFacetedFilters } from "../../_utils/clients.filter.utils";
import { ClientDescription } from "./ClientDescription";
import { clientsColumns } from "./ClientsTableColumns";
import { ClientsTableToolbarActions } from "./ClientsTableToolbarActions";
import {
    CustomPaginationTableParams,
    ServerPaginationChangeEventCallback,
    ServerPaginationWithSearchConfig,
} from "@/types/tanstack-table/CustomPagination";

interface ClientsTableProps {
    data: Array<Client>;
    pagination: CustomPaginationTableParams;
    onPaginationChange: ServerPaginationChangeEventCallback;
    search?: string;
    setSearch?: (search: string) => void;
    isActive?: Array<boolean>;
    setIsActive?: (isActive: Array<boolean>) => void;
    type?: Array<string>;
    setType?: (type: Array<string>) => void;
    handleOrderChange?: (field: string, direction: "asc" | "desc") => void;
    resetFilters?: () => void;
    isLoading?: boolean;
}

export function ClientsTable({
    data,
    pagination,
    onPaginationChange,
    search,
    setSearch,
    isActive,
    setIsActive,
    type,
    setType,
    isLoading = false,
}: ClientsTableProps) {
    const columns = useMemo(() => clientsColumns(), []);

    // Crear faceted filters con callbacks del servidor
    const customFacetedFilters = useMemo(() => {
        if (setIsActive && setType) {
            return createFacetedFilters(
                setIsActive,
                setType,
                isActive ?? [],
                type ?? []
            );
        }
        return [];
    }, [setIsActive, setType, isActive, type]);

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
            searchPlaceholder: "Buscar clientes...",
        } : undefined,
        filters: {
            filters: {
                estado: isActive ?? [],
                tipo: type ?? [],
            },
            onFiltersChange: (filters) => {
                if (setIsActive && setType) {
                    setIsActive(filters.estado as Array<boolean> ?? []);
                    setType(filters.tipo as Array<string> ?? []);
                }
            },
        },
    }), [pagination, onPaginationChange, search, setSearch, isActive, setIsActive, type, setType]);

    return (
        <DataTableExpanded
            isLoading={isLoading}
            data={data}
            columns={columns}
            toolbarActions={(table: TableInstance<Client>) => <ClientsTableToolbarActions table={table} />}
            filterPlaceholder="Buscar clientes..."
            facetedFilters={customFacetedFilters}
            renderExpandedRow={(row) => <ClientDescription row={row} />}
            serverConfig={serverConfig}
        />
    );
}
