import { useQueryClient } from "@tanstack/react-query";
import { backend as api, downloadFileWithClient, uploadWithFormData } from "@/types/backend";
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

// Query keys constants for better maintainability - matching openapi-react-query format
const PAYMENT_TRANSACTION_QUERY_KEYS = {
    all: ["get", "/api/PaymentTransaction"] as const,
    byId: (id: string) => ["get", "/api/PaymentTransaction/{id}", { path: { id } }] as const,
    byReservation: (reservationId: string) => ["get", "/api/PaymentTransaction/by-reservation/{reservationId}", { path: { reservationId } }] as const,
    quotaStatusByReservation: (reservationId: string, excludeTransactionId?: string) => ["get", "/api/PaymentTransaction/quota-status/by-reservation/{reservationId}/{excludeTransactionId}", {
        path: {
            reservationId,
            excludeTransactionId: excludeTransactionId ?? "",
        },
    }] as const,
} as const;

// Helper function to invalidate all payment transaction-related queries
const invalidatePaymentTransactionQueries = (queryClient: ReturnType<typeof useQueryClient>) => {
    queryClient.invalidateQueries({ queryKey: PAYMENT_TRANSACTION_QUERY_KEYS.all });
    // Invalidar todas las queries de PaymentTransaction (incluye variaciones con parámetros)
    queryClient.invalidateQueries({ queryKey: ["get", "/api/PaymentTransaction"] });
    queryClient.invalidateQueries({ queryKey: ["get", "/api/PaymentTransaction/{id}"] });
    queryClient.invalidateQueries({ queryKey: ["get", "/api/PaymentTransaction/by-reservation"] });
    queryClient.invalidateQueries({ queryKey: ["get", "/api/PaymentTransaction/quota-status/by-reservation"] });
    // Invalidar queries relacionadas de Reservations
    queryClient.invalidateQueries({ queryKey: ["get", "/api/Reservations"] });
    queryClient.invalidateQueries({ queryKey: ["get", "/api/Reservations/canceled"] });
    queryClient.invalidateQueries({ queryKey: ["get", "/api/Reservations/canceled/paginated"] });
    queryClient.invalidateQueries({ queryKey: ["get", "/api/Reservations/canceled/pending-validation/paginated"] });
    queryClient.invalidateQueries({ queryKey: ["get", "/api/Reservations/pending-payments/paginated"] });
    queryClient.invalidateQueries({ queryKey: ["get", "/api/Reservations/advisor/paginated"] });
};

// Crear una transacción con soporte para archivos
export const useCreatePaymentTransaction = uploadWithFormData("post", "/api/PaymentTransaction", {
    useAuthContext,
    invalidateQueries: (queryClient) => {
        invalidatePaymentTransactionQueries(queryClient);
    },
});

// Actualizar una transacción con soporte para archivos
export const useUpdatePaymentTransaction = uploadWithFormData("put", "/api/PaymentTransaction/{id}", {
    useAuthContext,
    invalidateQueries: (queryClient) => {
        invalidatePaymentTransactionQueries(queryClient);
    },
});

// Eliminar una transacción
export function useDeletePaymentTransaction() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("delete", "/api/PaymentTransaction/{id}", {
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
        onSuccess: () => {
            // Invalidar queries de transacciones de pago con las query keys correctas
            queryClient.invalidateQueries({ queryKey: ["get", "/api/PaymentTransaction"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/PaymentTransaction/{id}"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/PaymentTransaction/by-reservation"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/PaymentTransaction/quota-status/by-reservation"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Reservations"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Reservations/canceled"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Reservations/canceled/paginated"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Reservations/canceled/pending-validation/paginated"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Reservations/pending-payments/paginated"] });
            queryClient.invalidateQueries({ queryKey: ["get", "/api/Reservations/advisor/paginated"] });
        },
    });
}

// Hook para descargar PDF de cronograma de pagos
export function useDownloadSchedulePDF() {
    const { handleAuthError } = useAuthContext();

    return async (reservationId: string) => {
        try {
            return await downloadFileWithClient("get", "/api/Reservations/{reservationId}/schedule/pdf", {
                path: { reservationId },
            });
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
            return await downloadFileWithClient("get", "/api/Reservations/{reservationId}/processed-payments/pdf", {
                path: { reservationId },
            });
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
            return await downloadFileWithClient("get", "/api/Reservations/{reservationId}/receipt/pdf", {
                path: { reservationId },
            });
        } catch (error) {
            await handleAuthError(error);
            throw error;
        }
    };
}
