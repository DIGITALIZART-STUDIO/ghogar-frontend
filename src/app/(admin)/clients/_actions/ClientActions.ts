"use server";

import { revalidatePath } from "next/cache";

import { components } from "@/types/api";
import { PaginatedResponse } from "@/types/api/paginated-response";
import { backend, DownloadFile, FetchError, wrapper } from "@/types/backend";
import { err, ok, Result } from "@/utils/result";

// Obtener todos los clientes
export async function GetAllClients(): Promise<Result<Array<components["schemas"]["Client"]>, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/Clients", {
        ...auth,
    })
    );

    if (error) {
        console.log("Error getting clients:", error);
        return err(error);
    }
    return ok(response);
}

// Obtener clientes paginados
export async function GetPaginatedClients(
    page: number = 1,
    pageSize: number = 10
): Promise<Result<PaginatedResponse<components["schemas"]["Client"]>, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/Clients/paginated", {
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
        console.log("Error getting paginated clients:", error);
        return err(error);
    }

    // Normaliza la respuesta para que nunca sea undefined
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

// Obtener clientes inactivos
export async function GetInactiveClients(): Promise<Result<Array<components["schemas"]["Client"]>, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/Clients/inactive", {
        ...auth,
    })
    );

    if (error) {
        console.log("Error getting inactive clients:", error);
        return err(error);
    }
    return ok(response);
}

// Crear un cliente
export async function CreateClient(
    client: components["schemas"]["ClientCreateDto"]
): Promise<Result<components["schemas"]["Client"], FetchError>> {
    const [response, error] = await wrapper((auth) => backend.POST("/api/Clients", {
        ...auth,
        body: client,
    })
    );

    if (error) {
        console.log("Error creating client:", error);
        return err(error);
    }

    revalidatePath("/(admin)/clients", "page");
    return ok(response);
}

// Actualizar un cliente
export async function UpdateClient(
    id: string,
    client: components["schemas"]["ClientUpdateDto"]
): Promise<Result<components["schemas"]["Client"], FetchError>> {
    const [response, error] = await wrapper((auth) => backend.PUT("/api/Clients/{id}", {
        ...auth,
        params: { path: { id } },
        body: client,
    })
    );

    revalidatePath("/(admin)/clients", "page");

    if (error) {
        console.log("Error updating client:", error);
        return err(error);
    }
    return ok(response);
}

// Desactivar múltiples clientes (eliminar)
export async function DeleteClients(
    ids: Array<string>
): Promise<Result<components["schemas"]["BatchOperationResult"], FetchError>> {
    const [response, error] = await wrapper((auth) => backend.DELETE("/api/Clients/batch", {
        ...auth,
        body: ids,
    })
    );

    revalidatePath("/(admin)/clients", "page");

    if (error) {
        console.log("Error deleting clients:", error);
        return err(error);
    }
    return ok(response);
}

// Activar múltiples clientes
export async function ActivateClients(
    ids: Array<string>
): Promise<Result<components["schemas"]["BatchOperationResult"], FetchError>> {
    const [response, error] = await wrapper((auth) => backend.POST("/api/Clients/batch/activate", {
        ...auth,
        body: ids,
    })
    );

    revalidatePath("/(admin)/clients", "page");

    if (error) {
        console.log("Error activating clients:", error);
        return err(error);
    }
    return ok(response);
}

// Obtener un cliente específico
export async function GetClient(id: string): Promise<Result<components["schemas"]["Client"], FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/Clients/{id}", {
        ...auth,
        params: { path: { id } },
    })
    );

    if (error) {
        console.log(`Error getting client ${id}:`, error);
        return err(error);
    }
    return ok(response);
}

// Obtener resumen de clientes
export async function GetClientsSummary(): Promise<
  Result<Array<components["schemas"]["ClientSummaryDto"]>, FetchError>
  > {
    const [response, error] = await wrapper((auth) => backend.GET("/api/Clients/summary", {
        ...auth,
    })
    );

    if (error) {
        console.log("Error getting clients summary:", error);
        return err(error);
    }
    return ok(response);
}

export async function ImportClients(file: File): Promise<Result<components["schemas"]["ImportResult"], FetchError>> {
    const formData = new FormData();
    formData.append("file", file);

    const [response, error] = await wrapper((auth) => backend.POST("/api/Clients/import", {
        ...auth,
        body: formData as unknown as { file?: string | undefined },
        // Importante: al enviar FormData, no debemos establecer el Content-Type
        // para que el navegador lo establezca automáticamente con el boundary correcto
        formData: true,
    })
    );

    revalidatePath("/(admin)/clients", "page");

    if (error) {
        console.log("Error importing clients:", error);
        return err(error);
    }
    return ok(response);
}

// Descargar plantilla de importación de clientes
export async function DownloadImportTemplate(): Promise<Result<Blob, FetchError>> {
    // Usar la función DownloadFile específica para descargas de archivos
    const result = await DownloadFile(
        "/api/Clients/template", // URL del endpoint
        "GET", // Método HTTP
        undefined // Sin cuerpo para GET
    );

    if (!result[0]) {
    // Si hay un error (segundo elemento no es null)
        const error = result[1];
        console.log("Error downloading import template:", error);
        return err(error);
    }

    return result; // Devuelve el resultado tal cual
}

// Descargar Excel de clientes
export async function DownloadClientsExcel(): Promise<Result<Blob, FetchError>> {
    const result = await DownloadFile(
        "/api/Clients/excel", // Endpoint del backend
        "GET",
        undefined
    );

    if (!result[0]) {
        const error = result[1];
        console.log("Error downloading clients excel:", error);
        return err(error);
    }

    return result;
}
