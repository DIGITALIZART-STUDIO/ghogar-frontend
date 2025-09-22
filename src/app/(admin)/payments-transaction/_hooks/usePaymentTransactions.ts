import { useQueryClient } from "@tanstack/react-query";
import { backend as api, downloadFileWithClient } from "@/types/backend";
import { useAuthContext } from "@/context/auth-provider";

// Obtener todas las transacciones
export function usePaymentTransactions() {
    const { handleAuthError } = useAuthContext();

    return api.useQuery("get", "/api/PaymentTransaction", {
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Obtener una transacción por ID
export function usePaymentTransaction(id: string) {
    const { handleAuthError } = useAuthContext();

    return api.useQuery("get", "/api/PaymentTransaction/{id}", {
        params: {
            path: { id },
        },
        enabled: !!id,
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Obtener transacciones por ReservationId
export function usePaymentTransactionsByReservation(reservationId: string) {
    const { handleAuthError } = useAuthContext();

    return api.useQuery("get", "/api/PaymentTransaction/by-reservation/{reservationId}", {
        params: {
            path: { reservationId },
        },
        enabled: !!reservationId,
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Obtener estado de cuotas por ReservationId (y opcionalmente excluyendo una transacción)
export function useQuotaStatusByReservation(reservationId: string, excludeTransactionId?: string) {
    const { handleAuthError } = useAuthContext();

    return api.useQuery("get", "/api/PaymentTransaction/quota-status/by-reservation/{reservationId}/{excludeTransactionId}", {
        params: {
            path: {
                reservationId,
                excludeTransactionId: excludeTransactionId ?? "",
            },
        },
        enabled: !!reservationId,
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Crear una transacción con soporte para archivos
export function useCreatePaymentTransaction() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("post", "/api/PaymentTransaction", {
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
        onSuccess: (_: unknown, variables: unknown) => {
            queryClient.invalidateQueries({ queryKey: ["paymentTransactions"] });
            // Invalidar queries relacionadas con la reserva
            if (variables && typeof variables === "object" && "reservationId" in variables) {
                const reservationId = (variables as { reservationId: string }).reservationId;
                queryClient.invalidateQueries({ queryKey: ["paymentTransactionsByReservation", reservationId] });
                queryClient.invalidateQueries({ queryKey: ["quotaStatusByReservation", reservationId] });
                queryClient.invalidateQueries({ queryKey: ["paymentSchedule", reservationId] });
            }
            queryClient.invalidateQueries({ queryKey: ["canceledReservations"] });
        },
    });
}

// Actualizar una transacción con soporte para archivos
export function useUpdatePaymentTransaction() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("put", "/api/PaymentTransaction/{id}", {
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
        onSuccess: (_: unknown, variables: unknown) => {
            queryClient.invalidateQueries({ queryKey: ["paymentTransactions"] });
            if (variables && typeof variables === "object" && "id" in variables) {
                const id = (variables as { id: string }).id;
                queryClient.invalidateQueries({ queryKey: ["paymentTransaction", id] });
            }
            // Invalidar queries relacionadas con la reserva si tenemos el reservationId
            queryClient.invalidateQueries({ queryKey: ["canceledReservations"] });
        },
    });
}

// Eliminar una transacción
export function useDeletePaymentTransaction() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("delete", "/api/PaymentTransaction/{id}", {
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
        onSuccess: (_: unknown, variables: unknown) => {
            queryClient.invalidateQueries({ queryKey: ["paymentTransactions"] });
            queryClient.invalidateQueries({ queryKey: ["canceledReservations"] });
            if (variables && typeof variables === "object" && "reservationId" in variables) {
                const reservationId = (variables as { reservationId: string }).reservationId;
                queryClient.invalidateQueries({ queryKey: ["paymentTransactionsByReservation", reservationId] });
                queryClient.invalidateQueries({ queryKey: ["quotaStatusByReservation", reservationId] });
                queryClient.invalidateQueries({ queryKey: ["paymentSchedule", reservationId] });
            }
        },
    });
}

// Hook para descargar PDF de cronograma de pagos
export function useDownloadSchedulePDF() {
    const { handleAuthError } = useAuthContext();

    return async (reservationId: string) => {
        try {
            return await downloadFileWithClient(
                "/api/Reservations/{reservationId}/schedule/pdf",
                { path: { reservationId } }
            );
        } catch (error) {
            await handleAuthError(error);
            throw error;
        }
    };
}

// Hook para descargar PDF de pagos procesados
export function useDownloadProcessedPaymentsPDF() {
    const { handleAuthError } = useAuthContext();

    return async (reservationId: string) => {
        try {
            return await downloadFileWithClient(
                "/api/Reservations/{reservationId}/processed-payments/pdf",
                { path: { reservationId } }
            );
        } catch (error) {
            await handleAuthError(error);
            throw error;
        }
    };
}

// Hook para descargar PDF de recibo
export function useDownloadReceiptPDF() {
    const { handleAuthError } = useAuthContext();

    return async (reservationId: string) => {
        try {
            return await downloadFileWithClient(
                "/api/Reservations/{reservationId}/receipt/pdf",
                { path: { reservationId } }
            );
        } catch (error) {
            await handleAuthError(error);
            throw error;
        }
    };
}
