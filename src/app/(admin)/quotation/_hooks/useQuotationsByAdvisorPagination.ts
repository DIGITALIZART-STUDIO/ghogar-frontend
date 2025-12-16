import { useCallback } from "react";
import { backend as api } from "@/types/backend";
import { useAuthContext } from "@/context/auth-provider";
import { useBasePagination } from "../../../../hooks/useBasePagination";
import { useSelectedProject } from "../../../../hooks/use-selected-project";
import { QuotationStatus } from "@/app/(admin)/quotation/_types/quotation";

interface QuotationsFilters extends Record<string, Array<unknown>> {
    status: Array<string>;
    clientId: Array<string>;
}

export function useQuotationsByAdvisorPagination(page: number = 1, pageSize: number = 10) {
    const { handleAuthError } = useAuthContext();
    const { getSelectedProjectId } = useSelectedProject();

    const {
        search,
        filters,
        orderBy,
        orderDirection,
        setSearch,
        setFilter,
        handleOrderChange,
        resetFilters,
    } = useBasePagination<QuotationsFilters>({
        status: [],
        clientId: [],
    }, { disableDebounce: true }); // Debounce manejado en data-table-toolbar

    // Convertir status strings a QuotationStatus enum
    const statusEnums = filters.status?.length > 0
        ? filters.status.map((s) => s as QuotationStatus)
        : undefined;

    // Convertir clientId strings a Guid
    const clientIdGuids = filters.clientId?.length > 0
        ? filters.clientId.map((id) => id as string)
        : undefined;

    // Obtener el ID del proyecto seleccionado
    const selectedProjectId = getSelectedProjectId();

    const query = api.useQuery("get", "/api/Quotations/advisor/paginated", {
        params: {
            query: {
                page,
                pageSize,
                search,
                status: statusEnums,
                clientId: clientIdGuids,
                projectId: selectedProjectId ?? undefined,
                orderBy,
            },
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });

    const handleStatusChange = useCallback((values: Array<string>) => {
        setFilter("status", values);
    }, [setFilter]);

    const handleClientIdChange = useCallback((values: Array<string>) => {
        setFilter("clientId", values);
    }, [setFilter]);

    return {
        // Datos de la query
        data: query.data?.data ?? [],
        meta: query.data?.meta,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,

        // Estados de filtros y búsqueda
        search,
        filters,
        orderBy,
        orderDirection,

        // Handlers
        setSearch,
        handleStatusChange,
        handleClientIdChange,
        handleOrderChange,
        resetFilters,
    };
}
