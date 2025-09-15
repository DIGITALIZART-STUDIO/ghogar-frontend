import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import {
    GetAllQuotations,
    GetQuotationById,
    GetQuotationsByAdvisor,
    CreateQuotation,
    UpdateQuotation,
    DeleteQuotation,
    ChangeQuotationStatus,
    GetQuotationsByAdvisorPaginated,
    GetQuotationByReservationId,
    SendOtpToUser,
    ValidateOtp,
} from "../_actions/QuotationActions";
import type { PaginatedResponse } from "@/types/api/paginated-response";
import type { components } from "@/types/api";
import type { FetchError } from "@/types/backend";
import { backend } from "@/types/backend2";

// Todas las cotizaciones
export function useAllQuotations() {
    return useQuery({
        queryKey: ["quotations"],
        queryFn: async () => {
            const [data, error] = await GetAllQuotations();
            if (error) {
                throw error;
            }
            return data ?? [];
        },
    });
}

// Cotización por ID
export function useQuotationById(id: string, enabled = true) {
    return useQuery({
        queryKey: ["quotation", id],
        queryFn: async () => {
            const [data, error] = await GetQuotationById(id);
            if (error) {
                throw error;
            }
            return data!;
        },
        enabled: !!id && enabled,
    });
}

// Cotizaciones por ID de reserva
export function useQuotationByReservationId(reservationId: string, enabled = true) {
    return useQuery<components["schemas"]["QuotationDTO"], FetchError>({
        queryKey: ["quotationByReservation", reservationId],
        queryFn: async () => {
            const [data, error] = await GetQuotationByReservationId(reservationId);
            if (error) {
                throw error;
            }
            if (!data) {
                throw new Error("No se encontró cotización para la reserva");
            }
            return data;
        },
        enabled: !!reservationId && enabled,
    });
}

// Cotizaciones por asesor
export function useQuotationsByAdvisor(advisorId: string, enabled = true) {
    return useQuery({
        queryKey: ["quotations", "advisor", advisorId],
        queryFn: async () => {
            const [data, error] = await GetQuotationsByAdvisor(advisorId);
            if (error) {
                throw error;
            }
            return data ?? [];
        },
        enabled: !!advisorId && enabled,
    });
}

// Cotizaciones paginadas por asesor
export function usePaginatedQuotationsByAdvisor(
    advisorId: string,
    page: number = 1,
    pageSize: number = 10,
    enabled: boolean = true
) {
    return useQuery<PaginatedResponse<components["schemas"]["QuotationSummaryDTO"]>, FetchError>({
        queryKey: ["quotationsByAdvisorPaginated", advisorId, page, pageSize],
        queryFn: async () => {
            const [data, error] = await GetQuotationsByAdvisorPaginated(advisorId, page, pageSize);
            if (error) {
                throw error;
            }
            return data!;
        },
        enabled: !!advisorId && enabled,
    });
}

// Crear cotización
export function useCreateQuotation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: CreateQuotation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["quotations"] });
            queryClient.invalidateQueries({ queryKey: ["quotationsByAdvisorPaginated"] });
        },
    });
}

// Actualizar cotización
export function useUpdateQuotation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, quotation }: { id: string; quotation: components["schemas"]["QuotationUpdateDTO"] }) => UpdateQuotation(id, quotation),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["quotations"] });
            queryClient.invalidateQueries({ queryKey: ["quotation", variables.id] });
            queryClient.invalidateQueries({ queryKey: ["quotationsByAdvisorPaginated"] });
        },
    });
}

// Eliminar cotización
export function useDeleteQuotation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: DeleteQuotation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["quotations"] });
            queryClient.invalidateQueries({ queryKey: ["quotationsByAdvisorPaginated"] });
        },
    });
}

// Cambiar estado de cotización
export function useChangeQuotationStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, statusDto }: { id: string; statusDto: components["schemas"]["QuotationStatusDTO"] }) => ChangeQuotationStatus(id, statusDto),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["quotations"] });
            queryClient.invalidateQueries({ queryKey: ["quotation", variables.id] });
            queryClient.invalidateQueries({ queryKey: ["quotationsByAdvisorPaginated"] });
        },
    });
}

// Enviar OTP a un usuario
export function useSendOtpToUser() {
    return useMutation({
        mutationFn: SendOtpToUser,
    });
}

// Validar OTP de un usuario
export function useValidateOtp() {
    return useMutation({
        mutationFn: ({ userId, otpCode }: { userId: string; otpCode: string }) => ValidateOtp(userId, otpCode),
    });
}

// Hook para paginación infinita de cotizaciones aceptadas con búsqueda
export function usePaginatedAcceptedQuotationsWithSearch(pageSize: number = 10, preselectedId?: string) {
    const [search, setSearch] = useState<string | undefined>(undefined);
    const [orderBy, setOrderBy] = useState<string | undefined>(undefined);
    const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");

    const query = backend.useInfiniteQuery(
        "get",
        "/api/Quotations/advisor/accepted",
        {
            params: {
                query: {
                    search,
                    page: 1, // Este valor será reemplazado automáticamente por pageParam
                    pageSize,
                    orderBy,
                    orderDirection,
                    preselectedId,
                },
            },
        },
        {
            getNextPageParam: (lastPage) => {
                // Si hay más páginas disponibles, devolver el siguiente número de página
                if (lastPage.meta?.page && lastPage.meta?.totalPages && lastPage.meta.page < lastPage.meta.totalPages) {
                    return lastPage.meta.page + 1;
                }
                return undefined; // No hay más páginas
            },
            getPreviousPageParam: (firstPage) => {
                // Si no estamos en la primera página, devolver la página anterior
                if (firstPage.meta?.page && firstPage.meta.page > 1) {
                    return firstPage.meta.page - 1;
                }
                return undefined; // No hay páginas anteriores
            },
            initialPageParam: 1,
            pageParamName: "page", // Esto le dice a openapi-react-query que use "page" como parámetro de paginación
        }
    );

    // Obtener todas las cotizaciones de todas las páginas de forma plana
    const allQuotations = query.data?.pages.flatMap((page) => page.data ?? []) ?? [];

    const handleScrollEnd = useCallback(() => {
        if (query.hasNextPage && !query.isFetchingNextPage) {
            query.fetchNextPage();
        }
    }, [query]);

    const handleSearchChange = useCallback((value: string) => {
        if (value !== "None" && value !== null && value !== undefined) {
            setSearch(value.trim());
        } else {
            setSearch(undefined);
        }
    }, []);

    const handleOrderChange = useCallback((field: string, direction: "asc" | "desc") => {
        setOrderBy(field);
        setOrderDirection(direction);
    }, []);

    const resetSearch = useCallback(() => {
        setSearch(undefined);
        setOrderBy(undefined);
        setOrderDirection("asc");
    }, []);

    return {
        query,
        allQuotations, // Todas las cotizaciones acumuladas
        fetchNextPage: query.fetchNextPage,
        hasNextPage: query.hasNextPage,
        isFetchingNextPage: query.isFetchingNextPage,
        isLoading: query.isLoading,
        isError: query.isError,
        search,
        setSearch,
        orderBy,
        orderDirection,
        handleScrollEnd,
        handleSearchChange,
        handleOrderChange,
        resetSearch,
        // Información de paginación
        totalCount: query.data?.pages[0]?.meta?.total ?? 0,
        totalPages: query.data?.pages[0]?.meta?.totalPages ?? 0,
        currentPage: query.data?.pages[0]?.meta?.page ?? 1,
    };
}
