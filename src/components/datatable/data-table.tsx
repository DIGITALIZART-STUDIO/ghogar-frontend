import * as React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    PaginationState,
    Row,
    SortingState,
    Table as TableInstance,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ServerPaginationTanstackTableConfig, ServerPaginationWithSearchConfig } from "@/types/tanstack-table/CustomPagination";
import { Empty } from "../common/Empty";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { FacetedFilter } from "./facetedFilters";

// Filtro global genérico y estricto
function globalFilterFn<TData>(row: Row<TData>, _columnId: string, value: string): boolean {
    // Convierte todo el objeto original de la fila a string (incluye anidados)
    const rowString = JSON.stringify(row.original).toLowerCase();
    return rowString.includes(value.toLowerCase());
}

interface DataTableProps<TData, TValue> {
  columns: Array<ColumnDef<TData, TValue>>;
  data: Array<TData>;
  toolbarActions?: React.ReactNode | ((table: TableInstance<TData>) => React.ReactNode);
  filterPlaceholder?: string;
  facetedFilters?: Array<FacetedFilter<TValue>>;
  // Configuración para paginación del servidor (básica)
  serverPagination?: ServerPaginationTanstackTableConfig;
  // Configuración extendida para paginación del servidor con búsqueda y filtros
  serverConfig?: ServerPaginationWithSearchConfig;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    toolbarActions,
    filterPlaceholder,
    facetedFilters,
    serverPagination,
    serverConfig,
}: DataTableProps<TData, TValue>) {
    const [rowSelection, setRowSelection] = React.useState({});
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [sorting, setSorting] = React.useState<SortingState>([]);

    // Determinar qué configuración usar (prioridad: serverConfig > serverPagination)
    const activeServerConfig = serverConfig ?? serverPagination;
    // Estado de paginación local o del servidor
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: activeServerConfig?.pageIndex ?? 0,
        pageSize: activeServerConfig?.pageSize ?? 10,
    });

    // Estado para carga de paginación
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        // Solo activar carga y llamar al servidor si hay configuración del servidor
        if (activeServerConfig?.onPaginationChange) {
            setIsLoading(true);
            activeServerConfig.onPaginationChange(pagination.pageIndex, pagination.pageSize).finally(() => {
                setIsLoading(false);
            });
        }
    }, [pagination.pageIndex, pagination.pageSize, activeServerConfig]);

    // Manejar cambios de paginación
    const handlePaginationChange = React.useCallback(
        (updaterOrValue: PaginationState | ((old: PaginationState) => PaginationState)) => {
            const newPagination = typeof updaterOrValue === "function" ? updaterOrValue(pagination) : updaterOrValue;
            setPagination(newPagination);
        },
        [pagination],
    );

    const table = useReactTable<TData>({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            globalFilter,
            pagination,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: handlePaginationChange,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: serverPagination ? undefined : getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        globalFilterFn,
        filterFns: {
            global: globalFilterFn,
        },
        ...(activeServerConfig
            ? {
                pageCount: activeServerConfig.pageCount,
                manualPagination: true,
            }
            : {
                manualPagination: false,
            }),
    });

    return (
        <div className="space-y-4">
            <DataTableToolbar
                table={table}
                toolbarActions={toolbarActions}
                filterPlaceholder={filterPlaceholder}
                facetedFilters={facetedFilters}
                serverConfig={serverConfig}
            />
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} colSpan={header.colSpan}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading && activeServerConfig ? (
                            // Show skeleton rows while fetching data - solo el contenido de la tabla
                            Array(5)
                                .fill(0)
                                .map((_, index) => (
                                    <TableRow key={`skeleton-${index}`}>
                                        {columns.map((_, colIndex) => (
                                            <TableCell key={`skeleton-${index}-${colIndex}`} className="h-12">
                                                <div className="h-4 bg-muted animate-pulse rounded" />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    <Empty />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} serverPagination={activeServerConfig} />
        </div>
    );
}
