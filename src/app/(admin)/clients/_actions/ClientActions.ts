"use server";

import { revalidatePath } from "next/cache";

import { components } from "@/types/api";
import { backend, FetchError, wrapper } from "@/types/backend";
import { err, ok, Result } from "@/utils/result";

// Obtener todos los clientes
export async function GetAllClients(): Promise<Result<Array<components["schemas"]["Client"]>, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/Clients", {
        ...auth,
    }));

    if (error) {
        console.log("Error getting clients:", error);
        return err(error);
    }
    return ok(response);
}

// Obtener clientes inactivos
export async function GetInactiveClients(): Promise<Result<Array<components["schemas"]["Client"]>, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/Clients/inactive", {
        ...auth,
    }));

    if (error) {
        console.log("Error getting inactive clients:", error);
        return err(error);
    }
    return ok(response);
}

// Crear un cliente
export async function CreateClient(client: components["schemas"]["ClientCreateDto"]): Promise<Result<components["schemas"]["Client"], FetchError>> {
    const [response, error] = await wrapper((auth) => backend.POST("/api/Clients", {
        ...auth,
        body: client,
    }));

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
    client: components["schemas"]["ClientUpdateDto"],
): Promise<Result<components["schemas"]["Client"], FetchError>> {
    const [response, error] = await wrapper((auth) => backend.PUT("/api/Clients/{id}", {
        ...auth,
        params: { path: { id } },
        body: client,
    }));

    revalidatePath("/(admin)/clients", "page");

    if (error) {
        console.log("Error updating client:", error);
        return err(error);
    }
    return ok(response);
}

// Desactivar múltiples clientes (eliminar)
export async function DeleteClients(ids: Array<string>): Promise<Result<components["schemas"]["BatchOperationResult"], FetchError>> {
    const [response, error] = await wrapper((auth) => backend.DELETE("/api/Clients/batch", {
        ...auth,
        body: ids,
    }));

    revalidatePath("/(admin)/clients", "page");

    if (error) {
        console.log("Error deleting clients:", error);
        return err(error);
    }
    return ok(response);
}

// Activar múltiples clientes
export async function ActivateClients(ids: Array<string>): Promise<Result<components["schemas"]["BatchOperationResult"], FetchError>> {
    const [response, error] = await wrapper((auth) => backend.POST("/api/Clients/batch/activate", {
        ...auth,
        body: ids,
    }));

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
    }));

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
    }));

    if (error) {
        console.log("Error getting clients summary:", error);
        return err(error);
    }
    return ok(response);
}
