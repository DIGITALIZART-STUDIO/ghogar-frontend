import { useQuery } from "@tanstack/react-query";
import { GetAllCanceledReservations } from "../_actions/ReservationActions";

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
