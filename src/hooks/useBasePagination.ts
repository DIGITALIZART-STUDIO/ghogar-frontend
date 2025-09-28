import { useState, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";

/**
 * Hook base para manejar estados de paginación, búsqueda y filtros
 * Este hook maneja la lógica común sin depender de APIs específicas
 */
export function useBasePagination<TFilters extends Record<string, Array<unknown>>>(
    initialFilters: TFilters = {} as TFilters
) {
    // Estados internos para mantener los filtros (para UI inmediata)
    const [internalSearch, setInternalSearch] = useState<string>("");
    const [internalFilters, setInternalFilters] = useState<TFilters>(initialFilters);

    // Estados para la consulta (con debounce para search)
    const [search, setSearch] = useState<string | undefined>(undefined);
    const [filters, setFilters] = useState<TFilters>(initialFilters);
    const [orderBy, setOrderBy] = useState<string | undefined>(undefined);
    const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("desc");

    // Debounce para la búsqueda (500ms de delay)
    const debouncedSearch = useDebouncedCallback((value: string) => {
        setSearch(value.trim() || undefined);
    }, 500);

    // Handler para búsqueda con debounce
    const handleSearchChange = useCallback((value: string) => {
        setInternalSearch(value);
        debouncedSearch(value);
    }, [debouncedSearch]);

    // Handler genérico para filtros
    const handleFilterChange = useCallback(<K extends keyof TFilters>(
        filterKey: K,
        values: TFilters[K]
    ) => {
        setInternalFilters((prev) => ({ ...prev, [filterKey]: values }));
        setFilters((prev) => ({ ...prev, [filterKey]: values }));
    }, []);

    // Handler para ordenamiento
    const handleOrderChange = useCallback((field: string, direction: "asc" | "desc") => {
        setOrderBy(field);
        setOrderDirection(direction);
    }, []);

    // Reset de todos los filtros
    const resetFilters = useCallback(() => {
        setInternalSearch("");
        setInternalFilters(initialFilters);
        setSearch(undefined);
        setFilters(initialFilters);
        setOrderBy(undefined);
        setOrderDirection("desc");
    }, [initialFilters]);

    // Construir parámetros de query
    const buildQueryParams = useCallback((page: number, pageSize: number) => ({
        page,
        pageSize,
        search,
        ...Object.entries(filters).reduce((acc, [key, value]) => {
            if (value.length > 0) {
                acc[key] = value;
            }
            return acc;
        }, {} as Record<string, Array<unknown>>),
        orderBy: orderBy ? `${orderBy} ${orderDirection}` : undefined,
    }), [search, filters, orderBy, orderDirection]);

    return {
        // Estados internos para la UI (sin debounce)
        search: internalSearch,
        filters: internalFilters,
        orderBy,
        orderDirection,
        // Estados para la query
        querySearch: search,
        queryFilters: filters,
        // Handlers
        setSearch: handleSearchChange,
        setFilter: handleFilterChange,
        handleOrderChange,
        resetFilters,
        // Utilidades
        buildQueryParams,
    };
}
