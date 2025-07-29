import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    GetAllQuotations,
    GetQuotationById,
    GetQuotationsByAdvisor,
    GetAcceptedQuotationsByAdvisor,
    CreateQuotation,
    UpdateQuotation,
    DeleteQuotation,
    ChangeQuotationStatus,
    GetQuotationsByAdvisorPaginated,
    GetQuotationByReservationId,
} from "../_actions/QuotationActions";
import type { PaginatedResponse } from "@/types/api/paginated-response";
import type { components } from "@/types/api";
import type { FetchError } from "@/types/backend";

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

// Cotizaciones aceptadas por asesor
export function useAcceptedQuotationsByAdvisor(advisorId: string, enabled = true) {
    return useQuery({
        queryKey: ["quotations", "advisor", "accepted", advisorId],
        queryFn: async () => {
            const [data, error] = await GetAcceptedQuotationsByAdvisor(advisorId);
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
