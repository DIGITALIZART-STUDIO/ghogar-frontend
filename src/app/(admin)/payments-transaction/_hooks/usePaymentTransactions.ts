import { useQueryClient } from "@tanstack/react-query";

import { useAuthContext } from "@/context/auth-provider";
import { backend as api, downloadFileWithClient, uploadWithFormData } from "@/types/backend";
import { invalidatePaymentScheduleQueries } from "./usePaymentSchedule";

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

  return api.useQuery(
    "get",
    "/api/PaymentTransaction/quota-status/by-reservation/{reservationId}/{excludeTransactionId}",
    {
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
    }
  );
}

// Query keys constants for better maintainability - matching openapi-react-query format
const PAYMENT_TRANSACTION_QUERY_KEYS = {
  all: ["get", "/api/PaymentTransaction"] as const,
  byId: (id: string) => ["get", "/api/PaymentTransaction/{id}", { path: { id } }] as const,
  byReservation: (reservationId: string) =>
    ["get", "/api/PaymentTransaction/by-reservation/{reservationId}", { path: { reservationId } }] as const,
  quotaStatusByReservation: (reservationId: string, excludeTransactionId?: string) =>
    [
      "get",
      "/api/PaymentTransaction/quota-status/by-reservation/{reservationId}/{excludeTransactionId}",
      {
        path: {
          reservationId,
          excludeTransactionId: excludeTransactionId ?? "",
        },
      },
    ] as const,
} as const;

// Helper function to invalidate all payment transaction-related queries
export const invalidatePaymentTransactionQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
  reservationId?: string,
  transactionId?: string
) => {
  // Invalidar todas las queries de PaymentTransaction usando predicate
  // React Query invalida todas las queries que coincidan con el predicate
  queryClient.invalidateQueries({
    predicate: (query) => {
      const key = query.queryKey;
      return (
        Array.isArray(key) &&
        key.length > 0 &&
        key[0] === "get" &&
        typeof key[1] === "string" &&
        (key[1].startsWith("/api/PaymentTransaction") ||
          key[1].startsWith("/api/Reservations") ||
          (key[1].startsWith("/api/Payments/reservation") && key[1].includes("/schedule")))
      );
    },
  });

  // Invalidar queries específicas si se proporcionan IDs (para mayor precisión)
  if (reservationId) {
    queryClient.invalidateQueries({ queryKey: PAYMENT_TRANSACTION_QUERY_KEYS.byReservation(reservationId) });
    // Invalidar también las queries de quota status para esta reserva (con y sin excludeTransactionId)
    queryClient.invalidateQueries({
      predicate: (query) => {
        const key = query.queryKey;
        if (!Array.isArray(key) || key.length < 2) {
          return false;
        }
        const path = key[1];
        if (typeof path !== "string") {
          return false;
        }
        if (!path.includes("/api/PaymentTransaction/quota-status/by-reservation")) {
          return false;
        }
        // Verificar si el reservationId coincide en el path del queryKey
        const pathParams = key[2] as { path?: { reservationId?: string } } | undefined;
        return pathParams?.path?.reservationId === reservationId;
      },
    });
    // Invalidar también el payment schedule para esta reserva
    invalidatePaymentScheduleQueries(queryClient, reservationId);
  }
  if (transactionId) {
    queryClient.invalidateQueries({ queryKey: PAYMENT_TRANSACTION_QUERY_KEYS.byId(transactionId) });
  }
};

// Crear una transacción con soporte para archivos
export const useCreatePaymentTransaction = uploadWithFormData("post", "/api/PaymentTransaction", {
  useAuthContext,
  invalidateQueries: (queryClient, variables) => {
    // Extraer reservationId del body si está disponible
    const reservationId = (variables?.body as { reservationId?: string })?.reservationId;
    invalidatePaymentTransactionQueries(queryClient, reservationId);
  },
});

// Actualizar una transacción con soporte para archivos
export const useUpdatePaymentTransaction = uploadWithFormData("put", "/api/PaymentTransaction/{id}", {
  useAuthContext,
  invalidateQueries: (queryClient, variables) => {
    // Extraer reservationId del body y transactionId de los params
    const reservationId = (variables?.body as { reservationId?: string })?.reservationId;
    const transactionId = (variables as { params?: { path?: { id?: string } } })?.params?.path?.id;
    invalidatePaymentTransactionQueries(queryClient, reservationId, transactionId);
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
    onSuccess: (data, variables) => {
      // Intentar obtener reservationId de la respuesta o de la query cache
      const transactionId = variables.params?.path?.id;
      const deletedTransaction = data as { reservationId?: string } | undefined;
      const reservationId = deletedTransaction?.reservationId;

      // Si no tenemos reservationId en la respuesta, intentar obtenerlo de la cache
      if (!reservationId && transactionId) {
        const cachedTransaction = queryClient.getQueryData<{ reservationId?: string }>(
          PAYMENT_TRANSACTION_QUERY_KEYS.byId(transactionId)
        );
        const cachedReservationId = cachedTransaction?.reservationId;
        invalidatePaymentTransactionQueries(queryClient, cachedReservationId, transactionId);
      } else {
        invalidatePaymentTransactionQueries(queryClient, reservationId, transactionId);
      }
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
