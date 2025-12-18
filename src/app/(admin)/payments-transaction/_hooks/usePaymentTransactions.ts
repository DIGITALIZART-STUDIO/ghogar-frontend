import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getAllPaymentTransactions,
    getPaymentTransactionById,
    createPaymentTransaction,
    updatePaymentTransaction,
    deletePaymentTransaction,
    getPaymentTransactionsByReservationId,
    getQuotaStatusByReservationId,
} from "../_actions/PaymentTransactionActions";
import { PaymentTransactionCreate, PaymentTransactionUpdate } from "../_types/paymentTransaction";

// Obtener todas las transacciones
export function usePaymentTransactions() {
    return useQuery({
        queryKey: ["paymentTransactions"],
        queryFn: async () => {
            const [data, error] = await getAllPaymentTransactions();
            if (error) {
                throw new Error(error.message);
            }
            return data ?? [];
        },
    });
}

// Obtener una transacción por ID
export function usePaymentTransaction(id: string) {
    return useQuery({
        queryKey: ["paymentTransaction", id],
        queryFn: async () => {
            const [data, error] = await getPaymentTransactionById(id);
            if (error) {
                throw new Error(error.message);
            }
            return data;
        },
        enabled: !!id,
    });
}

// Obtener transacciones por ReservationId
export function usePaymentTransactionsByReservation(reservationId: string) {
    return useQuery({
        queryKey: ["paymentTransactionsByReservation", reservationId],
        queryFn: async () => {
            const [data, error] = await getPaymentTransactionsByReservationId(reservationId);
            if (error) {
                throw new Error(error.message);
            }
            return data ?? [];
        },
        enabled: !!reservationId,
    });
}

// Obtener estado de cuotas por ReservationId (y opcionalmente excluyendo una transacción)
export function useQuotaStatusByReservation(reservationId: string, excludeTransactionId?: string) {
    return useQuery({
        queryKey: ["quotaStatusByReservation", reservationId, excludeTransactionId],
        queryFn: async () => {
            const [data, error] = await getQuotaStatusByReservationId(reservationId, excludeTransactionId);
            if (error) {
                throw new Error(error.message);
            }
            return data ?? [];
        },
        enabled: !!reservationId,
    });
}

// Crear una transacción
export function useCreatePaymentTransaction() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (dto: PaymentTransactionCreate) => {
            const [data, error] = await createPaymentTransaction(dto);
            if (error) {
                throw new Error(error.message);
            }
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["paymentTransactions"] });
            if (variables.reservationId) {
                queryClient.invalidateQueries({ queryKey: ["paymentTransactionsByReservation", variables.reservationId] });
                queryClient.invalidateQueries({ queryKey: ["quotaStatusByReservation", variables.reservationId] });
                queryClient.invalidateQueries({ queryKey: ["paymentSchedule", variables.reservationId] });
            }
            queryClient.invalidateQueries({ queryKey: ["canceledReservations"] });
        },
    });
}

// Actualizar una transacción
export function useUpdatePaymentTransaction() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, dto }: { id: string; dto: PaymentTransactionUpdate }) => {
            const [data, error] = await updatePaymentTransaction(id, dto);
            if (error) {
                throw new Error(error.message);
            }
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["paymentTransactions"] });
            if (variables.dto.reservationId) {
                queryClient.invalidateQueries({ queryKey: ["paymentTransactionsByReservation", variables.dto.reservationId] });
                queryClient.invalidateQueries({ queryKey: ["quotaStatusByReservation", variables.dto.reservationId] });
                queryClient.invalidateQueries({ queryKey: ["paymentSchedule", variables.dto.reservationId] });
            }
            queryClient.invalidateQueries({ queryKey: ["canceledReservations"] });
        },
    });
}

// Eliminar una transacción
export function useDeletePaymentTransaction() {
    const queryClient = useQueryClient();
    return useMutation({
        // Recibe un objeto con id y reservationId
        mutationFn: async ({ id, reservationId }: { id: string; reservationId?: string }) => {
            const [, error] = await deletePaymentTransaction(id);
            if (error) {
                throw new Error(error.message);
            }
            // Retorna ambos valores correctamente
            return { id, reservationId };
        },
        onSuccess: ({ reservationId }) => {
            queryClient.invalidateQueries({ queryKey: ["paymentTransactions"] });
            queryClient.invalidateQueries({ queryKey: ["canceledReservations"] });
            if (reservationId) {
                queryClient.invalidateQueries({ queryKey: ["paymentTransactionsByReservation", reservationId] });
                queryClient.invalidateQueries({ queryKey: ["quotaStatusByReservation", reservationId] });
                queryClient.invalidateQueries({ queryKey: ["paymentSchedule", reservationId] });
            }
        },
    });
}
