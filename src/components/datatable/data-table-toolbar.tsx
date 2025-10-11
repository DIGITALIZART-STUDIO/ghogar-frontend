import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { useMemo} from "react";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";
import { FacetedFilter } from "./facetedFilters";
import { ServerPaginationWithSearchConfig } from "@/types/tanstack-table/CustomPagination";

// Tipo para filtros con callbacks del servidor
interface ServerFacetedFilter<TValue> extends FacetedFilter<TValue> {
    onFilterChange?: (value: TValue | undefined | Array<TValue>) => void;
    currentValue?: TValue | Array<TValue>;
}

interface DataTableToolbarProps<TData, TValue> {
  table: Table<TData>;
  toolbarActions?: React.ReactNode | ((table: Table<TData>) => React.ReactNode);
  filterPlaceholder?: string;
  facetedFilters?: Array<FacetedFilter<TValue>>;
  serverConfig?: ServerPaginationWithSearchConfig;
}

export function DataTableToolbar<TData, TValue>({
    table,
    toolbarActions,
    filterPlaceholder = "Filter...",
    facetedFilters = [],
    serverConfig,
}: DataTableToolbarProps<TData, TValue>) {
    const isFiltered = table.getState().columnFilters.length > 0 || table.getState().globalFilter !== "";

    // Memoizar el valor del input para evitar re-renders innecesarios
    const globalFilter = table.getState().globalFilter;
    const serverSearch = serverConfig?.search?.search;
    const inputValue = useMemo(() => serverSearch ?? globalFilter ?? "", [serverSearch, globalFilter]);

    // Memoizar el placeholder
    const inputPlaceholder = useMemo(() => serverConfig?.search?.searchPlaceholder ?? filterPlaceholder, [serverConfig?.search?.searchPlaceholder, filterPlaceholder]);

    // Memoizar el handler de cambio
    const onSearchChange = serverConfig?.search?.onSearchChange;
    const handleInputChange = useMemo(() => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (onSearchChange) {
            // Usar búsqueda del servidor
            onSearchChange(value);
        } else {
            // Usar búsqueda local
            table.setGlobalFilter(value);
        }
    }, [onSearchChange, table]);

    return (
        <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
                <Input
                    type="search"
                    placeholder={inputPlaceholder}
                    value={inputValue}
                    onChange={handleInputChange}
                    className="h-8 w-[150px] lg:w-[250px]"
                />
                <div className="flex flex-wrap items-center gap-2">
                    {/* Filtros locales (faceted filters) */}
                    {facetedFilters.map((filter) => {
                        const column = table.getColumn(filter.column);
                        const serverFilter = filter as ServerFacetedFilter<TValue>;
                        return (
                            column && (
                                <DataTableFacetedFilter
                                    key={filter.column}
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    column={column as any}
                                    title={filter.title}
                                    options={filter.options}
                                    onFilterChange={serverFilter.onFilterChange}
                                    currentValue={serverFilter.currentValue as TValue}
                                />
                            )
                        );
                    })}

                    {/* Filtros del servidor - Solo si NO hay faceted filters locales */}
                    {facetedFilters.length === 0 && serverConfig?.filters?.availableFilters?.map((filter) => {
                        if (filter.type === "select" && filter.options) {
                            const column = table.getColumn(filter.key);
                            return (
                                <DataTableFacetedFilter
                                    key={filter.key}
                                    column={column ?? {
                                        id: filter.key,
                                        getFilterValue: () => serverConfig.filters?.filters[filter.key],
                                        setFilterValue: (value: unknown) => {
                                            if (serverConfig.filters?.onFiltersChange) {
                                                serverConfig.filters.onFiltersChange({
                                                    ...serverConfig.filters.filters,
                                                    [filter.key]: value,
                                                });
                                            }
                                        },
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    } as any}
                                    title={filter.label}
                                    options={filter.options}
                                />
                            );
                        }
                        return null;
                    })}
                </div>
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => {
                            // Limpiar filtros locales
                            table.resetColumnFilters();
                            table.setGlobalFilter("");

                            // Limpiar filtros del servidor
                            if (serverConfig?.search?.onSearchChange) {
                                serverConfig.search.onSearchChange("");
                            }
                            if (serverConfig?.filters?.onFiltersChange) {
                                serverConfig.filters.onFiltersChange({});
                            }
                        }}
                        className="h-8 px-2 lg:px-3"
                    >
                        Limpiar
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <div className="flex items-center space-x-2">
                {typeof toolbarActions === "function" ? toolbarActions(table) : toolbarActions}
                <DataTableViewOptions table={table} />
            </div>
        </div>
    );
}
