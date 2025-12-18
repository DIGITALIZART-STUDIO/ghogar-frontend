"use server";

import { components } from "@/types/api";
import { backend, FetchError, wrapper } from "@/types/backend";
import { err, ok, Result } from "@/utils/result";

// Obtener cronograma de pagos por ID de reserva
export async function GetPaymentScheduleByReservation(reservationId: string): Promise<Result<Array<components["schemas"]["PaymentDto"]>, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/Payments/reservation/{id}/schedule", {
        ...auth,
        params: {
            path: {
                id: reservationId,
            },
        },
    }));

    if (error) {
        console.log(`Error getting payment schedule for reservation ${reservationId}:`, error);
        return err(error);
    }
    return ok(response);
}
