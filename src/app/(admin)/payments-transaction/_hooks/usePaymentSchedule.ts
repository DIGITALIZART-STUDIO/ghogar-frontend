import { backend as api } from "@/types/backend2";
import { useAuthContext } from "@/context/auth-provider";

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
