import { useQueryClient } from "@tanstack/react-query";

import { useAuthContext } from "@/context/auth-provider";
import { backend as api } from "@/types/backend";

// Helper function to invalidate all reservation-related queries
const invalidateReservationQueries = (queryClient: ReturnType<typeof useQueryClient>, reservationId?: string) => {
  // Invalidar todas las queries de reservas usando predicate
  queryClient.invalidateQueries({
    predicate: (query) => {
      const key = query.queryKey;
      return (
        Array.isArray(key) &&
        key.length > 0 &&
        key[0] === "get" &&
        typeof key[1] === "string" &&
        key[1].startsWith("/api/Reservations")
      );
    },
  });

  // Invalidar queries específicas si se proporciona un ID
  if (reservationId) {
    queryClient.invalidateQueries({
      queryKey: ["get", "/api/Reservations/{id}", { path: { id: reservationId } }],
    });
    queryClient.invalidateQueries({
      queryKey: ["get", "/api/Reservations/{id}/payment-history", { path: { id: reservationId } }],
    });
  }
};

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
    onSuccess: (data, variables) => {
      const reservationId = variables.params?.path?.id;
      invalidateReservationQueries(queryClient, reservationId);
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
    onSuccess: (data, variables) => {
      const reservationId = variables.params?.path?.id;
      invalidateReservationQueries(queryClient, reservationId);
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
    onSuccess: (data, variables) => {
      const reservationId = variables.params?.path?.id;
      invalidateReservationQueries(queryClient, reservationId);
    },
    onError: async (error: unknown) => {
      await handleAuthError(error);
    },
  });
}
