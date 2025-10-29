import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import React, { useCallback, useEffect, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";

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
  // API alternativa (simple) para control externo del filtro global
  externalFilterValue?: string;
  onGlobalFilterChange?: (value: string) => void;
}

export function DataTableToolbar<TData, TValue>({
    table,
    toolbarActions,
    filterPlaceholder = "Filter...",
    facetedFilters = [],
    serverConfig,
    externalFilterValue,
    onGlobalFilterChange,
}: DataTableToolbarProps<TData, TValue>) {
    // Valor directo del filtro (sin debounce)
    const currentFilterValue = externalFilterValue ?? serverConfig?.search?.search ?? table.getState().globalFilter ?? "";

    // Placeholder
    const inputPlaceholder = serverConfig?.search?.searchPlaceholder ?? filterPlaceholder;

    // Ref para saber si el usuario está escribiendo activamente
    const isUserTypingRef = useRef(false);

    // Estado local para el input cuando usamos onGlobalFilterChange
    const [localInputValue, setLocalInputValue] = React.useState(currentFilterValue);

    // Sincronizar el estado local cuando cambie externalFilterValue, pero solo si no está escribiendo
    useEffect(() => {
        if (!isUserTypingRef.current) {
            setLocalInputValue(currentFilterValue);
        }
    }, [currentFilterValue]);

    // Fuente única de verdad para el valor del input
    // Cuando usamos onGlobalFilterChange, usamos el estado local
    // En otros casos, usamos el valor directo
    const inputValue = onGlobalFilterChange ? localInputValue : currentFilterValue;

    // Para filtrado, usamos el valor debounced cuando está disponible
    const filterValue = onGlobalFilterChange ? externalFilterValue ?? "" : currentFilterValue;

    const isFiltered = table.getState().columnFilters.length > 0 || filterValue !== "";

    // Debounce para onGlobalFilterChange
    const debouncedGlobalFilterChange = useDebouncedCallback((value: string) => {
        if (onGlobalFilterChange) {
            onGlobalFilterChange(value);
        }
    }, 500);

    // Handler de cambio (prioridad: prop externa > serverConfig > local tanstack)
    const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        // Marcar que el usuario está escribiendo
        isUserTypingRef.current = true;

        // Actualizar UI inmediatamente (siempre)
        setLocalInputValue(value);

        if (onGlobalFilterChange) {
            // Usar debounce para búsqueda externa
            debouncedGlobalFilterChange(value);
            return;
        }
        if (serverConfig?.search?.onSearchChange) {
            serverConfig.search.onSearchChange(value);
            return;
        }
        table.setGlobalFilter(value);
    }, [onGlobalFilterChange, debouncedGlobalFilterChange, serverConfig, table]);

    // Resetear la marca de "escribiendo" después del debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            isUserTypingRef.current = false;
        }, 600); // Un poco más que el debounce para asegurar

        return () => clearTimeout(timer);
    }, [localInputValue]);

    return (
        <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
                <Input
                    type="search"
                    placeholder={inputPlaceholder}
                    value={inputValue}
                    onChange={handleInputChange}
                    className="h-8 w-[150px] lg:w-[250px]"
                    autoComplete="off"
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

                            // Limpiar búsqueda (prioridad: prop externa > serverConfig)
                            if (onGlobalFilterChange) {
                                onGlobalFilterChange("");
                            } else if (serverConfig?.search?.onSearchChange) {
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
            <div className="flex flex-wrap items-center gap-2">
                {typeof toolbarActions === "function" ? toolbarActions(table) : toolbarActions}
                <DataTableViewOptions table={table} />
            </div>
        </div>
    );
}
