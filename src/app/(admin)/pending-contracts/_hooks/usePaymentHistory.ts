import { useQueryClient } from "@tanstack/react-query";
import { backend as api } from "@/types/backend";
import { useAuthContext } from "@/context/auth-provider";

// Hook para obtener el historial de pagos de una reserva
export function usePaymentHistory(reservationId: string, enabled = true) {
    const { handleAuthError } = useAuthContext();

    return api.useQuery("get", "/api/Reservations/{id}/payment-history", {
        params: {
            path: { id: reservationId },
        },
        enabled: !!reservationId && enabled,
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para agregar un pago al historial
export function useAddPaymentToHistory() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("post", "/api/Reservations/{id}/payment-history", {
        onSuccess: () => {
            // Invalidar queries relacionadas
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Reservations/{id}/payment-history"] });
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "get" && query.queryKey[1] === "/api/Reservations/canceled/pending-validation/paginated"
            });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Reservations"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Reservations/{id}"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Reservations/canceled"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Reservations/canceled/paginated"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Reservations/pending-payments/paginated"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Reservations/advisor/paginated"] });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para actualizar un pago en el historial
export function useUpdatePaymentInHistory() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("put", "/api/Reservations/{id}/payment-history", {
        onSuccess: () => {
            // Invalidar queries relacionadas
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Reservations/{id}/payment-history"] });
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "get" && query.queryKey[1] === "/api/Reservations/canceled/pending-validation/paginated"
            });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Reservations"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Reservations/{id}"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Reservations/canceled"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Reservations/canceled/paginated"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Reservations/pending-payments/paginated"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Reservations/advisor/paginated"] });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para eliminar un pago del historial
export function useRemovePaymentFromHistory() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("delete", "/api/Reservations/{id}/payment-history/{paymentId}", {
        onSuccess: () => {
            // Invalidar queries relacionadas
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Reservations/{id}/payment-history"] });
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "get" && query.queryKey[1] === "/api/Reservations/canceled/pending-validation/paginated"
            });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Reservations"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Reservations/{id}"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Reservations/canceled"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Reservations/canceled/paginated"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Reservations/pending-payments/paginated"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Reservations/advisor/paginated"] });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}
