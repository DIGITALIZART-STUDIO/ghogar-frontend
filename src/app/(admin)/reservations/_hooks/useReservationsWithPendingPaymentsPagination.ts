import { useCallback } from "react";
import { backend as api } from "@/types/backend";
import { useAuthContext } from "@/context/auth-provider";
import { useBasePagination } from "../../../../hooks/useBasePagination";
import { useSelectedProject } from "../../../../hooks/use-selected-project";
import { ReservationStatus, PaymentMethod, ContractValidationStatus } from "@/app/(admin)/reservations/_types/reservation";

interface ReservationsFilters extends Record<string, Array<unknown>> {
    status: Array<string>;
    paymentMethod: Array<string>;
    contractValidationStatus: Array<string>;
}

export function useReservationsWithPendingPaymentsPagination(page: number = 1, pageSize: number = 10) {
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
    } = useBasePagination<ReservationsFilters>({
        status: [],
        paymentMethod: [],
        contractValidationStatus: [],
    }, { disableDebounce: true }); // Debounce manejado en data-table-toolbar

    // Convertir status strings a ReservationStatus enum
    const statusEnums = filters.status?.length > 0
        ? filters.status.map((s) => s as ReservationStatus)
        : undefined;

    // Convertir paymentMethod strings a PaymentMethod enum
    const paymentMethodEnums = filters.paymentMethod?.length > 0
        ? filters.paymentMethod.map((p) => p as PaymentMethod)
        : undefined;

    // Convertir contractValidationStatus strings a ContractValidationStatus enum
    const contractValidationStatusEnums = filters.contractValidationStatus?.length > 0
        ? filters.contractValidationStatus.map((c) => c as ContractValidationStatus)
        : undefined;

    // Obtener el ID del proyecto seleccionado
    const selectedProjectId = getSelectedProjectId();

    const query = api.useQuery("get", "/api/Reservations/pending-payments/paginated", {
        params: {
            query: {
                page,
                pageSize,
                search,
                status: statusEnums,
                paymentMethod: paymentMethodEnums,
                contractValidationStatus: contractValidationStatusEnums,
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

    const handlePaymentMethodChange = useCallback((values: Array<string>) => {
        setFilter("paymentMethod", values);
    }, [setFilter]);

    const handleContractValidationStatusChange = useCallback((values: Array<string>) => {
        setFilter("contractValidationStatus", values);
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
        handlePaymentMethodChange,
        handleContractValidationStatusChange,
        handleOrderChange,
        resetFilters,
    };
}
