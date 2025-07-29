"use server";

import { revalidatePath } from "next/cache";

import { components } from "@/types/api";
import { backend, DownloadFile, FetchError, wrapper } from "@/types/backend";
import { err, ok, Result } from "@/utils/result";
import { PaginatedResponse } from "@/types/api/paginated-response";

// Obtener todas las reservas
export async function GetAllReservations(): Promise<Result<Array<components["schemas"]["ReservationDto"]>, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/Reservations", {
        ...auth,
    }));

    if (error) {
        console.log("Error getting reservations:", error);
        return err(error);
    }
    return ok(response);
}

// Obtener todas las reservas canceladas
export async function GetAllCanceledReservations(): Promise<Result<Array<components["schemas"]["ReservationDto"]>, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/Reservations/canceled", {
        ...auth,
    }));

    if (error) {
        console.log("Error getting canceled reservations:", error);
        return err(error);
    }
    return ok(response);
}

// Traer reservas canceladas paginadas
export async function GetAllCanceledReservationsPaginated(
    page: number = 1,
    pageSize: number = 10
): Promise<Result<PaginatedResponse<components["schemas"]["ReservationWithPaymentsDto"]>, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/Reservations/canceled/paginated", {
        ...auth,
        params: {
            query: {
                page,
                pageSize,
            },
        },
    }));

    if (error) {
        console.log("Error getting paginated canceled reservations:", error);
        return err(error);
    }

    // Normaliza la respuesta para que nunca sea undefined
    return ok({
        data: response?.data ?? [],
        meta: response?.meta ?? {
            page: page,
            pageSize: pageSize,
            totalCount: 0,
            totalPages: 0,
        },
    });
}

// Obtener una reserva específica por ID
export async function GetReservationById(id: string): Promise<Result<components["schemas"]["ReservationDto"], FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/Reservations/{id}", {
        ...auth,
        params: {
            path: {
                id,
            },
        },
    }));

    if (error) {
        console.log(`Error getting reservation ${id}:`, error);
        return err(error);
    }
    return ok(response);
}

// Obtener reservas por ID de cliente
export async function GetReservationsByClientId(clientId: string): Promise<Result<Array<components["schemas"]["ReservationDto"]>, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/Reservations/client/{clientId}", {
        ...auth,
        params: {
            path: {
                clientId,
            },
        },
    }));

    if (error) {
        console.log(`Error getting reservations for client ${clientId}:`, error);
        return err(error);
    }
    return ok(response);
}

// Obtener reservas por ID de cotización
export async function GetReservationsByQuotationId(quotationId: string): Promise<Result<Array<components["schemas"]["ReservationDto"]>, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/Reservations/quotation/{quotationId}", {
        ...auth,
        params: {
            path: {
                quotationId,
            },
        },
    }));

    if (error) {
        console.log(`Error getting reservations for quotation ${quotationId}:`, error);
        return err(error);
    }
    return ok(response);
}

// Crear una nueva reserva
export async function CreateReservation(reservation: components["schemas"]["ReservationCreateDto"]): Promise<Result<components["schemas"]["ReservationDto"], FetchError>> {
    const [response, error] = await wrapper((auth) => backend.POST("/api/Reservations", {
        ...auth,
        body: reservation,
    }));

    revalidatePath("/(admin)/reservations", "page");

    if (error) {
        console.log("Error creating reservation:", error);
        return err(error);
    }
    return ok(response);
}

// Actualizar una reserva existente
export async function UpdateReservation(id: string, reservation: components["schemas"]["ReservationUpdateDto"]): Promise<Result<components["schemas"]["ReservationDto"], FetchError>> {
    const [response, error] = await wrapper((auth) => backend.PATCH("/api/Reservations/{id}", {
        ...auth,
        params: {
            path: {
                id,
            },
        },
        body: reservation,
    }));

    revalidatePath("/(admin)/reservations", "page");

    if (error) {
        console.log(`Error updating reservation ${id}:`, error);
        return err(error);
    }
    return ok(response);
}

// Eliminar una reserva
export async function DeleteReservation(id: string): Promise<Result<void, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.DELETE("/api/Reservations/{id}", {
        ...auth,
        params: {
            path: {
                id,
            },
        },
    }));

    revalidatePath("/(admin)/reservations", "page");

    if (error) {
        console.log(`Error deleting reservation ${id}:`, error);
        return err(error);
    }
    return ok(response);
}

// Cambiar el estado de una reserva
export async function ChangeReservationStatus(
    id: string,
    statusDto: components["schemas"]["ReservationStatusDto"],
): Promise<Result<components["schemas"]["ReservationDto"], FetchError>> {
    const [response, error] = await wrapper((auth) => backend.PUT("/api/Reservations/{id}/status", {
        ...auth,
        params: {
            path: {
                id,
            },
        },
        body: statusDto,
    }));

    revalidatePath("/(admin)/reservations", "page");

    if (error) {
        console.log(`Error changing status for reservation ${id}:`, error);
        return err(error);
    }
    return ok(response);
}

export async function DownloadReservationPDF(reservationId: string): Promise<Result<Blob, FetchError>> {
    return DownloadFile(`/api/Reservations/${reservationId}/pdf`, "get", null);
}

export async function DownloadReservationContractPDF(reservationId: string): Promise<Result<Blob, FetchError>> {
    return DownloadFile(`/api/Reservations/${reservationId}/contract/pdf`, "get", null);
}

export async function DownloadReservationContractDOCX(reservationId: string): Promise<Result<Blob, FetchError>> {
    return DownloadFile(`/api/Reservations/${reservationId}/contract/docx`, "get", null);
}

export async function DownloadReservationSchedulePDF(reservationId: string): Promise<Result<Blob, FetchError>> {
    return DownloadFile(`/api/Reservations/${reservationId}/schedule/pdf`, "get", null);
}
