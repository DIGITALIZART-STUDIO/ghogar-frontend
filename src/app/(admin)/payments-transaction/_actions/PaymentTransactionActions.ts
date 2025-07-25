"use server";

import { backend, FetchError, wrapper } from "@/types/backend";
import {Result } from "@/utils/result";
import { PaymentQuotaSimple, PaymentTransaction, PaymentTransactionCreate, PaymentTransactionUpdate } from "../_types/paymentTransaction";

// Obtener todas las transacciones de pago
export async function getAllPaymentTransactions(): Promise<Result<Array<PaymentTransaction>, FetchError>> {
    return await wrapper(async (auth) => backend.GET("/api/PaymentTransaction", { ...auth })
    );
}

// Obtener una transacción por ID
export async function getPaymentTransactionById(id: string): Promise<Result<PaymentTransaction, FetchError>> {
    return await wrapper(async (auth) => backend.GET("/api/PaymentTransaction/{id}", {
        ...auth,
        params: { path: { id } },
    })
    );
}

// Obtener transacciones por ReservationId
export async function getPaymentTransactionsByReservationId(
    reservationId: string
): Promise<Result<Array<PaymentTransaction>, FetchError>> {
    return await wrapper(async (auth) => backend.GET("/api/PaymentTransaction/by-reservation/{reservationId}", {
        ...auth,
        params: { path: { reservationId } },
    })
    );
}

// Obtener estado de cuotas por ReservationId (y opcionalmente excluyendo una transacción)
export async function getQuotaStatusByReservationId(
    reservationId: string,
    excludeTransactionId?: string
): Promise<Result<Array<PaymentQuotaSimple>, FetchError>> {
    return await wrapper(async (auth) => backend.GET("/api/PaymentTransaction/quota-status/by-reservation/{reservationId}/{excludeTransactionId}", {
        ...auth,
        params: {
            path: {
                reservationId,
                excludeTransactionId: excludeTransactionId ?? "",
            },
        },
    })
    );
}

// Crear una transacción de pago
export async function createPaymentTransaction(
    dto: PaymentTransactionCreate
): Promise<Result<PaymentTransaction, FetchError>> {
    return await wrapper(async (auth) => backend.POST("/api/PaymentTransaction", {
        ...auth,
        body: dto,
    })
    );
}

// Actualizar una transacción de pago
export async function updatePaymentTransaction(
    id: string,
    dto: PaymentTransactionUpdate
): Promise<Result<PaymentTransaction, FetchError>> {
    return await wrapper(async (auth) => backend.PUT("/api/PaymentTransaction/{id}", {
        ...auth,
        params: { path: { id } },
        body: dto,
    })
    );
}

// Eliminar una transacción de pago
export async function deletePaymentTransaction(id: string): Promise<Result<void, FetchError>> {
    return await wrapper(async (auth) => backend.DELETE("/api/PaymentTransaction/{id}", {
        ...auth,
        params: { path: { id } },
    })
    );
}
