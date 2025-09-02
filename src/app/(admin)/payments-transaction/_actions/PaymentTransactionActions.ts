"use server";

import { revalidatePath } from "next/cache";

import { backend, DownloadFile, FetchError, wrapper } from "@/types/backend";
import { err, ok, Result } from "@/utils/result";
import { PaymentTransactionCreateFormData } from "../_schemas/createPaymentTransactionSchema";
import { PaymentQuotaStatus, PaymentTransaction } from "../_types/paymentTransaction";

// Obtener todas las transacciones de pago
export async function getAllPaymentTransactions(): Promise<Result<Array<PaymentTransaction>, FetchError>> {
    return await wrapper(async (auth) => backend.GET("/api/PaymentTransaction", { ...auth }));
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
): Promise<Result<PaymentQuotaStatus, FetchError>> {
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

// Crear una transacción de pago con soporte para archivos
// Ahora soporta asignación automática de cuotas cuando paymentIds no se proporciona
export async function createPaymentTransaction(
    transactionData: PaymentTransactionCreateFormData & { comprobanteFile?: File | null }
): Promise<Result<PaymentTransaction, FetchError>> {
    const { comprobanteFile, ...dtoData } = transactionData;

    // Crear FormData para enviar tanto el DTO como el archivo
    const formData = new FormData();

    // Agregar campos requeridos
    formData.append("dto.paymentDate", dtoData.paymentDate);
    formData.append("dto.amountPaid", dtoData.amountPaid.toString());
    formData.append("dto.paymentMethod", dtoData.paymentMethod);

    // Agregar campos opcionales solo si tienen valor
    if (dtoData.reservationId !== undefined && dtoData.reservationId !== null) {
        formData.append("dto.reservationId", dtoData.reservationId);
    }

    if (dtoData.referenceNumber !== undefined && dtoData.referenceNumber !== null) {
        formData.append("dto.referenceNumber", dtoData.referenceNumber);
    }

    // Agregar los IDs de pagos como array (si existen)
    // Si no se proporcionan, el backend asignará automáticamente las cuotas
    if (dtoData.paymentIds && dtoData.paymentIds.length > 0) {
        dtoData.paymentIds.forEach((paymentId, index) => {
            formData.append(`dto.paymentIds[${index}]`, paymentId);
        });
    }

    // Agregar el archivo de comprobante si existe
    if (comprobanteFile) {
        formData.append("comprobanteFile", comprobanteFile);
    }

    const [response, error] = await wrapper(async (auth) => backend.POST("/api/PaymentTransaction", {
        ...auth,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        body: formData as any,
        formData: true,
    })
    );

    revalidatePath("/(admin)/payments-transaction", "page");

    if (error) {
        console.log("Error creating payment transaction:", error);
        return err(error);
    }
    return ok(response);
}

// Actualizar una transacción de pago con soporte para archivos
// Ahora soporta asignación automática de cuotas cuando paymentIds no se proporciona
export async function updatePaymentTransaction(
    id: string,
    transactionData: PaymentTransactionCreateFormData & { comprobanteFile?: File | null }
): Promise<Result<PaymentTransaction, FetchError>> {
    const { comprobanteFile, ...dtoData } = transactionData;

    // Crear FormData para enviar tanto el DTO como el archivo
    const formData = new FormData();

    // Agregar campos solo si tienen valor (para actualizaciones parciales)
    if (dtoData.paymentDate !== undefined && dtoData.paymentDate !== null) {
        formData.append("dto.paymentDate", dtoData.paymentDate);
    }
    if (dtoData.amountPaid !== undefined && dtoData.amountPaid !== null) {
        formData.append("dto.amountPaid", dtoData.amountPaid.toString());
    }
    if (dtoData.paymentMethod !== undefined && dtoData.paymentMethod !== null) {
        formData.append("dto.paymentMethod", dtoData.paymentMethod);
    }
    if (dtoData.reservationId !== undefined && dtoData.reservationId !== null) {
        formData.append("dto.reservationId", dtoData.reservationId);
    }
    if (dtoData.referenceNumber !== undefined && dtoData.referenceNumber !== null) {
        formData.append("dto.referenceNumber", dtoData.referenceNumber);
    }

    // Agregar los IDs de pagos como array (si existen)
    // Si no se proporcionan, el backend asignará automáticamente las cuotas
    if (dtoData.paymentIds && dtoData.paymentIds.length > 0) {
        dtoData.paymentIds.forEach((paymentId, index) => {
            formData.append(`dto.paymentIds[${index}]`, paymentId);
        });
    }

    // Agregar el archivo de comprobante si existe
    if (comprobanteFile) {
        formData.append("comprobanteFile", comprobanteFile);
    }

    const [response, error] = await wrapper(async (auth) => backend.PUT("/api/PaymentTransaction/{id}", {
        ...auth,
        params: { path: { id } },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        body: formData as any,
        formData: true,
    })
    );

    revalidatePath("/(admin)/payments-transaction", "page");

    if (error) {
        console.log("Error updating payment transaction:", error);
        return err(error);
    }
    return ok(response);
}

// Eliminar una transacción de pago
export async function deletePaymentTransaction(id: string): Promise<Result<void, FetchError>> {
    return await wrapper(async (auth) => backend.DELETE("/api/PaymentTransaction/{id}", {
        ...auth,
        params: { path: { id } },
    })
    );
}

export async function DownloadSchedulePDF(reservationId: string): Promise<Result<Blob, FetchError>> {
    return DownloadFile(`/api/Reservations/${reservationId}/schedule/pdf`, "get", null);
}

export async function DownloadProcessedPaymentsPDF(reservationId: string): Promise<Result<Blob, FetchError>> {
    return DownloadFile(`/api/Reservations/${reservationId}/processed-payments/pdf`, "get", null);
}

export async function DownloadReceiptPDF(reservationId: string): Promise<Result<Blob, FetchError>> {
    return DownloadFile(`/api/Reservations/${reservationId}/receipt/pdf`, "get", null);
}
