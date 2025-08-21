"use server";

import { revalidatePath } from "next/cache";

import { components } from "@/types/api";
import { backend, DownloadFile, FetchError, wrapper } from "@/types/backend";
import { err, ok, Result } from "@/utils/result";
import { PaginatedResponse } from "@/types/api/paginated-response";

// Obtener todos los leads
export async function GetAllLeads(): Promise<Result<Array<components["schemas"]["Lead2"]>, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/Leads", {
        ...auth,
    }));

    if (error) {
        console.log("Error getting leads:", error);
        return err(error);
    }
    return ok(response);
}

// Obtener leads paginados
export async function GetPaginatedLeads(
    page: number = 1,
    pageSize: number = 10
): Promise<Result<PaginatedResponse<components["schemas"]["Lead2"]>, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/Leads/paginated", {
        ...auth,
        params: {
            query: {
                page,
                pageSize,
            },
        },
    })
    );

    if (error) {
        console.log("Error getting paginated leads:", error);
        return err(error);
    }

    return ok({
        data: response?.data ?? [],
        meta: response?.meta ?? {
            page,
            pageSize,
            totalCount: 0,
            totalPages: 0,
        },
    });
}

// Obtener leads inactivos
export async function GetInactiveLeads(): Promise<Result<Array<components["schemas"]["Lead2"]>, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/Leads/inactive", {
        ...auth,
    }));

    if (error) {
        console.log("Error getting inactive leads:", error);
        return err(error);
    }
    return ok(response);
}

// Crear un lead
export async function CreateLead(lead: components["schemas"]["LeadCreateDto"]): Promise<Result<components["schemas"]["Lead2"], FetchError>> {
    const [response, error] = await wrapper((auth) => backend.POST("/api/Leads", {
        ...auth,
        body: lead,
    }));

    revalidatePath("/(admin)/leads", "page");

    if (error) {
        console.log("Error creating lead:", error);
        return err(error);
    }
    return ok(response);
}

// Actualizar un lead
export async function UpdateLead(
    id: string,
    lead: components["schemas"]["LeadUpdateDto"],
): Promise<Result<components["schemas"]["Lead2"], FetchError>> {
    const [response, error] = await wrapper((auth) => backend.PUT("/api/Leads/{id}", {
        ...auth,
        params: {
            path: {
                id,
            },
        },
        body: lead,
    }));

    revalidatePath("/(admin)/leads", "page");

    if (error) {
        console.log("Error updating lead:", error);
        return err(error);
    }
    return ok(response);
}

// Cambiar estado de un lead (nuevo método)
export async function UpdateLeadStatus(
    id: string,
    dto: components["schemas"]["LeadStatusUpdateDto"],
): Promise<Result<components["schemas"]["Lead2"], FetchError>> {
    // @ts-expect-error Server response type doesn't match the expected type structure
    const [response, error] = await wrapper((auth) => backend.PUT(`/api/Leads/${id}/status`, {
        ...auth,
        body: dto,
    })
    );

    // Revalidar la ruta para refrescar los datos
    revalidatePath("/(admin)/assignments", "page");

    if (error) {
        console.log(`Error updating lead status ${id}:`, error);
        return err(error);
    }
    // @ts-expect-error Server response type doesn't match the expected type structure
    return ok(response);
}
// Desactivar múltiples leads (eliminar)
export async function DeleteLeads(ids: Array<string>): Promise<Result<components["schemas"]["BatchOperationResult"], FetchError>> {
    const [response, error] = await wrapper((auth) => backend.DELETE("/api/Leads/batch", {
        ...auth,
        body: ids,
    }));

    revalidatePath("/(admin)/leads", "page");

    if (error) {
        console.log("Error deleting leads:", error);
        return err(error);
    }
    return ok(response);
}

// Activar múltiples leads
export async function ActivateLeads(ids: Array<string>): Promise<Result<components["schemas"]["BatchOperationResult"], FetchError>> {
    const [response, error] = await wrapper((auth) => backend.POST("/api/Leads/batch/activate", {
        ...auth,
        body: ids,
    }));

    revalidatePath("/(admin)/leads", "page");

    if (error) {
        console.log("Error activating leads:", error);
        return err(error);
    }
    return ok(response);
}

// Obtener un lead específico
export async function GetLead(id: string): Promise<Result<components["schemas"]["Lead2"], FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/Leads/{id}", {
        ...auth,
        params: {
            path: {
                id,
            },
        },
    }));

    if (error) {
        console.log(`Error getting lead ${id}:`, error);
        return err(error);
    }
    return ok(response);
}

// Eliminar un lead
export async function DeleteLead(id: string): Promise<Result<void, FetchError>> {
    const [, error] = await wrapper((auth) => backend.DELETE("/api/Leads/{id}", {
        ...auth,
        params: {
            path: {
                id,
            },
        },
    }));

    revalidatePath("/(admin)/leads", "page");

    if (error) {
        console.log(`Error deleting lead ${id}:`, error);
        return err(error);
    }
    return ok(undefined);
}

// Activar un lead específico
export async function ActivateLead(id: string): Promise<Result<void, FetchError>> {
    const [, error] = await wrapper((auth) => backend.POST("/api/Leads/{id}/activate", {
        ...auth,
        params: {
            path: {
                id,
            },
        },
    }));

    revalidatePath("/(admin)/leads", "page");

    if (error) {
        console.log(`Error activating lead ${id}:`, error);
        return err(error);
    }
    return ok(undefined);
}

// Obtener leads por cliente
export async function GetLeadsByClient(clientId: string): Promise<Result<Array<components["schemas"]["Lead2"]>, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/Leads/client/{clientId}", {
        ...auth,
        params: {
            path: {
                clientId,
            },
        },
    }));

    if (error) {
        console.log(`Error getting leads for client ${clientId}:`, error);
        return err(error);
    }
    return ok(response);
}

// Obtener leads por usuario asignado
export async function GetLeadsByAssignedTo(userId: string): Promise<Result<Array<components["schemas"]["Lead2"]>, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/Leads/assignedto/{userId}", {
        ...auth,
        params: {
            path: {
                userId,
            },
        },
    }));

    if (error) {
        console.log(`Error getting leads assigned to ${userId}:`, error);
        return err(error);
    }
    return ok(response);
}

// Obtener leads asignados a un usuario, paginados
export async function GetPaginatedLeadsByAssignedTo(
    userId: string,
    page: number = 1,
    pageSize: number = 10
): Promise<Result<PaginatedResponse<components["schemas"]["Lead2"]>, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/Leads/assignedto/{userId}/paginated", {
        ...auth,
        params: {
            path: { userId },
            query: { page, pageSize },
        },
    })
    );

    if (error) {
        console.log("Error getting paginated leads by assigned user:", error);
        return err(error);
    }

    return ok({
        data: response?.data ?? [],
        meta: response?.meta ?? {
            page,
            pageSize,
            totalCount: 0,
            totalPages: 0,
        },
    });
}

// Obtener leads por estado
export async function GetLeadsByStatus(status: components["schemas"]["LeadStatus"]): Promise<Result<Array<components["schemas"]["Lead2"]>, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/Leads/status/{status}", {
        ...auth,
        params: {
            path: {
                status,
            },
        },
    }));

    if (error) {
        console.log(`Error getting leads with status ${status}:`, error);
        return err(error);
    }
    return ok(response);
}

// Obtener resumen de usuarios
export async function GetUsersSummary(): Promise<Result<Array<components["schemas"]["UserSummaryDto"]>, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/Leads/users/summary", {
        ...auth,
    }));

    if (error) {
        console.log("Error getting users summary:", error);
        return err(error);
    }
    return ok(response);
}

// Obtener resumen de leads asignados a un usuario específico
export async function GetAssignedLeadsSummary(assignedToId: string): Promise<Result<Array<components["schemas"]["LeadSummaryDto"]>, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/Leads/assigned/{assignedToId}/summary", {
        ...auth,
        params: {
            path: {
                assignedToId,
            },
        },
    }));

    if (error) {
        console.log(`Error getting leads summary for user ${assignedToId}:`, error);
        return err(error);
    }
    return ok(response);
}

// Obtener leads disponibles para cotización asignados a un usuario, excluyendo una cotización opcionalmente
export async function GetAvailableLeadsForQuotation(
    excludeQuotationId?: string
): Promise<Result<Array<components["schemas"]["LeadSummaryDto"]>, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/Leads/available-for-quotation/{excludeQuotationId}", {
        ...auth,
        params: {
            path: {
                excludeQuotationId: excludeQuotationId ?? "",
            },
        },
    })
    );

    if (error) {
        console.log("Error getting available leads for quotation for user", error);
        return err(error);
    }
    return ok(response);
}

export async function CheckAndUpdateExpiredLeads(): Promise<Result<{ expiredLeadsCount: number }, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.POST("/api/Leads/check-expired", {
        ...auth,
    })
    );

    // Solo llama a revalidatePath si esta función se usa como Server Action (por ejemplo, desde un botón)
    revalidatePath("/(admin)/leads", "page");

    if (error) {
        console.log("Error al forzar expiración de leads:", error);
        return err(error);
    }
    // Asegúrate de que response tenga la forma { expiredLeadsCount: number }
    return ok(response as unknown as { expiredLeadsCount: number });
}

// Descargar Excel de leads
export async function DownloadLeadsExcel(): Promise<Result<Blob, FetchError>> {
    const result = await DownloadFile(
        "/api/Leads/export", // Endpoint del backend
        "GET",
        undefined,
    );

    if (!result[0]) {
        const error = result[1];
        console.log("Error downloading leads excel:", error);
        return err(error);
    }

    return result;
}
