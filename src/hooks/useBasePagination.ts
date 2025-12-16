import { useState, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";

/**
 * Hook base para manejar estados de paginación, búsqueda y filtros
 * Este hook maneja la lógica común sin depender de APIs específicas
 * Soporta tanto filtros de array como filtros de valor único
 */
export function useBasePagination<TFilters extends Record<string, Array<unknown> | unknown>>(
    initialFilters: TFilters = {} as TFilters,
    options: { disableDebounce?: boolean } = {}
) {
    // Estados para la consulta
    const [search, setSearch] = useState<string>("");
    const [debouncedSearch, setDebouncedSearch] = useState<string | undefined>(undefined);
    const [filters, setFilters] = useState<TFilters>(initialFilters);
    const [orderBy, setOrderBy] = useState<string | undefined>(undefined);
    const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("desc");

    // Debounce para la búsqueda (500ms de delay) - opcional
    const debouncedSearchUpdate = useDebouncedCallback((value: string) => {
        const trimmedValue = value.trim();
        setDebouncedSearch(trimmedValue || undefined);
    }, 500);

    // Handler para búsqueda
    const handleSearchChange = useCallback((value: string) => {
        // Actualizar inmediatamente para la UI
        setSearch(value);
        // Aplicar debounce solo si está habilitado
        if (!options.disableDebounce) {
            debouncedSearchUpdate(value);
        } else {
            // Si el debounce está deshabilitado, actualizar inmediatamente
            setDebouncedSearch(value.trim() || undefined);
        }
    }, [options.disableDebounce, debouncedSearchUpdate]);

    // Handler genérico para filtros
    const handleFilterChange = useCallback(<K extends keyof TFilters>(
        filterKey: K,
        values: TFilters[K]
    ) => {
        setFilters((prev) => ({ ...prev, [filterKey]: values }));
    }, []);

    // Handler para ordenamiento
    const handleOrderChange = useCallback((field: string, direction: "asc" | "desc") => {
        setOrderBy(field);
        setOrderDirection(direction);
    }, []);

    // Reset de todos los filtros
    const resetFilters = useCallback(() => {
        setSearch("");
        setDebouncedSearch(undefined);
        setFilters(initialFilters);
        setOrderBy(undefined);
        setOrderDirection("desc");
    }, [initialFilters]);

    // Construir parámetros de query con memoización para evitar re-renders
    const buildQueryParams = useCallback((page: number, pageSize: number) => {
        const params = {
            page,
            pageSize,
            search: debouncedSearch,
            ...Object.entries(filters).reduce((acc, [key, value]) => {
                // Manejar arrays (filtros múltiples)
                if (Array.isArray(value)) {
                    if (value.length > 0) {
                        acc[key] = value;
                    }
                } else if (value !== null && value !== undefined) {
                    // Manejar valores únicos (incluyendo null/undefined)
                    acc[key] = value;
                }
                return acc;
            }, {} as Record<string, unknown>),
            orderBy: orderBy ? `${orderBy} ${orderDirection}` : undefined,
        };
        return params;
    }, [debouncedSearch, filters, orderBy, orderDirection]);

    return {
        // Estados para la UI y query
        search,
        filters,
        orderBy,
        orderDirection,
        // Handlers
        setSearch: handleSearchChange,
        setFilter: handleFilterChange,
        handleOrderChange,
        resetFilters,
        // Utilidades
        buildQueryParams,
    };
}
