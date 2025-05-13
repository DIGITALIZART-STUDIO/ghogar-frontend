import * as React from "react";
import { useEffect } from "react";
import {
    Column,
    ColumnDef,
    ColumnFiltersState,
    ColumnPinningState,
    FilterFn,
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
import { ServerPaginationTanstackTableConfig } from "@/types/tanstack-table/CustomPagination";
import { Empty } from "../common/Empty";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { FacetedFilter } from "./facetedFilters";

// Función de filtrado global correcta para TanStack Table v8
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalFilterFn: FilterFn<any> = (row, columnId, value) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getValue = (row: Row<any>) => {
    // Si es _all, busca en todos los valores concatenados
        if (columnId === "_all") {
            const allValues = Object.values(row.original)
                .filter((val) => val !== null && val !== undefined)
                .join(" ")
                .toLowerCase();
            return allValues;
        }

        // Busca en la columna específica
        const cellValue = row.getValue(columnId);
        return cellValue !== null && cellValue !== undefined ? String(cellValue).toLowerCase() : "";
    };

    const searchValue = value.toLowerCase();
    return getValue(row).includes(searchValue);
};

interface DataTableExpandedProps<TData, TValue> {
  columns: Array<ColumnDef<TData, TValue>>;
  data: Array<TData>;
  toolbarActions?: React.ReactNode | ((table: TableInstance<TData>) => React.ReactNode);
  filterPlaceholder?: string;
  facetedFilters?: Array<FacetedFilter<TValue>>;
  renderExpandedRow?: (row: TData) => React.ReactNode; // Nueva prop para el contenido expandido
  onClickRow?: (row: TData) => void;
  columnVisibilityConfig?: Partial<Record<keyof TData, boolean>>;
  // Nuevas props para paginación del servidor
  serverPagination?: ServerPaginationTanstackTableConfig;
}

export function DataTableExpanded<TData, TValue>({
    columns,
    data,
    toolbarActions,
    filterPlaceholder,
    facetedFilters,
    renderExpandedRow,
    onClickRow,
    columnVisibilityConfig,
    serverPagination,
}: DataTableExpandedProps<TData, TValue>) {
    const [rowSelection, setRowSelection] = React.useState({});
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnPinning, setColumnPinning] = React.useState<ColumnPinningState>({
        left: ["select"],
        right: ["actions"],
    });
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>((columnVisibilityConfig as VisibilityState) ?? {});

    // Usamos el estado expandedState de tanstack table directamente
    const [expanded, setExpanded] = React.useState({});

    // Estado de paginación local o del servidor
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: serverPagination?.pageIndex ?? 0,
        pageSize: serverPagination?.pageSize ?? 10,
    });

    // Estado para carga de paginación
    const [isLoading, setIsLoading] = React.useState(false);

    useEffect(() => {
        if (serverPagination?.onPaginationChange) {
            setIsLoading(true);
            serverPagination.onPaginationChange(pagination.pageIndex, pagination.pageSize).finally(() => setIsLoading(false));
        }
    }, [pagination.pageIndex, pagination.pageSize, serverPagination]);

    // Manejar cambios de paginación
    const handlePaginationChange = React.useCallback(
        (updaterOrValue: PaginationState | ((old: PaginationState) => PaginationState)) => {
            const newPagination = typeof updaterOrValue === "function" ? updaterOrValue(pagination) : updaterOrValue;

            setPagination(newPagination);
            if (serverPagination?.onPaginationChange) {
                serverPagination.onPaginationChange(newPagination.pageIndex, newPagination.pageSize);
            }
        },
        [pagination, serverPagination],
    );

    const table = useReactTable({
        data,
        columns,
        filterFns: {
            global: globalFilterFn,
        },
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            globalFilter,
            columnPinning,
            expanded, // Utilizar el estado de expansión
            pagination,
        },
        onExpandedChange: setExpanded, // Manejar los cambios en la expansión
        getRowCanExpand: () => true, // Permitir que todas las filas puedan expandirse
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onColumnPinningChange: setColumnPinning,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: handlePaginationChange,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: serverPagination ? undefined : getPaginationRowModel(), // Usar la paginación de cliente si no hay serverPagination
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        globalFilterFn: globalFilterFn,
        // Configuración para paginación del servidor solo si serverPagination está definido
        ...(serverPagination
            ? {
                pageCount: serverPagination.pageCount,
                manualPagination: true,
            }
            : {
                manualPagination: false,
            }),
    });

    // Estilos para columnas fijadas
    const getCommonPinningStyles = (column: Column<TData>): React.CSSProperties => {
        const isPinned = column.getIsPinned();

        return {
            left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
            right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
            zIndex: isPinned ? 1 : 0,
        };
    };

    return (
        <div className="space-y-4">
            <DataTableToolbar
                table={table}
                toolbarActions={toolbarActions}
                filterPlaceholder={filterPlaceholder}
                facetedFilters={facetedFilters}
            />
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    const { column } = header;
                                    return (
                                        <TableHead
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            style={{
                                                ...getCommonPinningStyles(column),
                                            }}
                                        >
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                        // Show loading state while fetching data
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    <div className="flex justify-center">
                                        <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <React.Fragment key={row.id}>
                                    <TableRow
                                        data-state={row.getIsSelected() && "selected"}
                                        onClick={() => {
                                            if (onClickRow) {
                                                onClickRow(row.original);
                                            }
                                            // Ya no expandimos la fila al hacer clic en la fila completa
                                        }}
                                    >
                                        {row.getVisibleCells().map((cell) => {
                                            const { column } = cell;
                                            return (
                                                <TableCell
                                                    key={cell.id}
                                                    style={{
                                                        ...getCommonPinningStyles(column),
                                                    }}
                                                >
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                    {row.getIsExpanded() && renderExpandedRow && (
                                        <TableRow
                                            data-state={row.getIsExpanded() ? "expanded" : "collapsed"}
                                            className="animate-fade-down animate-duration-500 animate-ease-in-out animate-fill-forwards data-[state=collapsed]:animate-out data-[state=collapsed]:fade-out-0"
                                        >
                                            <TableCell colSpan={columns.length}>
                                                {renderExpandedRow(row.original)}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
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
            <DataTablePagination table={table} serverPagination={serverPagination} />
        </div>
    );
}
