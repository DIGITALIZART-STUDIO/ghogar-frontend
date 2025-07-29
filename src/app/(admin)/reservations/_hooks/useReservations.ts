import { useQuery } from "@tanstack/react-query";
import { GetAllCanceledReservations, GetAllCanceledReservationsPaginated, GetReservationById } from "../_actions/ReservationActions";
import type { PaginatedResponse } from "@/types/api/paginated-response";
import type { components } from "@/types/api";
import type { FetchError } from "@/types/backend";

// Hook para reservas canceladas (no paginado)
export function useCanceledReservations() {
    return useQuery({
        queryKey: ["canceledReservations"],
        queryFn: async () => {
            const [data, error] = await GetAllCanceledReservations();
            if (error) {
                throw new Error(error.message);
            }
            return data ?? [];
        },
    });
}

// Hook para reservas canceladas paginadas (retorna la query completa)
export function usePaginatedCanceledReservations(page: number = 1, pageSize: number = 10) {
    return useQuery<PaginatedResponse<components["schemas"]["ReservationWithPaymentsDto"]>, FetchError>({
        queryKey: ["canceledReservationsPaginated", page, pageSize],
        queryFn: async () => {
            const [data, error] = await GetAllCanceledReservationsPaginated(page, pageSize);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
    });
}

// Hook para obtener una reserva por ID
export function useReservationById(reservationId: string, enabled = true) {
    return useQuery<components["schemas"]["ReservationDto"], FetchError>({
        queryKey: ["reservation", reservationId],
        queryFn: async () => {
            const [data, error] = await GetReservationById(reservationId);
            if (error) {
                throw error;
            }
            if (!data) {
                throw new Error("No se encontró la reserva");
            }
            return data;
        },
        enabled: !!reservationId && enabled,
    });
}
