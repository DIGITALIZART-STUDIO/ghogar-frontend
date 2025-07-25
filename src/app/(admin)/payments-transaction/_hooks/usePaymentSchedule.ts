import { useQuery } from "@tanstack/react-query";
import { GetPaymentScheduleByReservation } from "../../reservations/_actions/PaymentActions";

export function usePaymentSchedule(reservationId: string) {
    return useQuery({
        queryKey: ["paymentSchedule", reservationId],
        queryFn: async () => {
            const [data, error] = await GetPaymentScheduleByReservation(reservationId);
            if (error) {
                throw new Error(error.message);
            }
            return data ?? [];
        },
        enabled: !!reservationId,
    });
}
