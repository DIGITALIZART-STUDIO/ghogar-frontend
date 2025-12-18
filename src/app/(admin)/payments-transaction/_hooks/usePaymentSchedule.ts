import { useQueryClient } from "@tanstack/react-query";

import { useAuthContext } from "@/context/auth-provider";
import { backend as api } from "@/types/backend";

// Query keys constants for better maintainability - matching openapi-react-query format
const PAYMENT_SCHEDULE_QUERY_KEYS = {
  byReservation: (reservationId: string) =>
    ["get", "/api/Payments/reservation/{id}/schedule", { path: { id: reservationId } }] as const,
} as const;

// Helper function to invalidate payment schedule queries
export const invalidatePaymentScheduleQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
  reservationId?: string
) => {
  // Invalidar todas las queries de payment schedule usando predicate
  queryClient.invalidateQueries({
    predicate: (query) => {
      const key = query.queryKey;
      return (
        Array.isArray(key) &&
        key.length > 0 &&
        key[0] === "get" &&
        typeof key[1] === "string" &&
        key[1].startsWith("/api/Payments/reservation") &&
        key[1].includes("/schedule")
      );
    },
  });

  // Invalidar query específica si se proporciona reservationId (para mayor precisión)
  if (reservationId) {
    queryClient.invalidateQueries({ queryKey: PAYMENT_SCHEDULE_QUERY_KEYS.byReservation(reservationId) });
  }
};

export function usePaymentSchedule(reservationId: string) {
  const { handleAuthError } = useAuthContext();

  return api.useQuery("get", "/api/Payments/reservation/{id}/schedule", {
    params: {
      path: { id: reservationId },
    },
    enabled: !!reservationId,
    onError: async (error: unknown) => {
      await handleAuthError(error);
    },
  });
}
