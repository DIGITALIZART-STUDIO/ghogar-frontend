"use server";

import { revalidatePath } from "next/cache";

import { components } from "@/types/api";
import { backend, FetchError, wrapper } from "@/types/backend";
import { err, ok, Result } from "@/utils/result";

// Obtener todos los lotes
export async function GetAllLots(): Promise<Result<Array<components["schemas"]["LotDTO"]>, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/Lots", {
        ...auth,
    }));

    if (error) {
        console.log("Error getting lots:", error);
        return err(error);
    }
    return ok(response);
}

// Obtener lotes por bloque
export async function GetLotsByBlock(blockId: string): Promise<Result<Array<components["schemas"]["LotDTO"]>, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/Lots/block/{blockId}", {
        ...auth,
        params: {
            path: {
                blockId,
            },
        },
    }));

    if (error) {
        console.log(`Error getting lots for block ${blockId}:`, error);
        return err(error);
    }
    return ok(response);
}

// Obtener lotes por proyecto
export async function GetLotsByProject(projectId: string): Promise<Result<Array<components["schemas"]["LotDTO"]>, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/Lots/project/{projectId}", {
        ...auth,
        params: {
            path: {
                projectId,
            },
        },
    }));

    if (error) {
        console.log(`Error getting lots for project ${projectId}:`, error);
        return err(error);
    }
    return ok(response);
}

// Obtener lotes disponibles
export async function GetAvailableLots(): Promise<Result<Array<components["schemas"]["LotDTO"]>, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/Lots/available", {
        ...auth,
    }));

    if (error) {
        console.log("Error getting available lots:", error);
        return err(error);
    }
    return ok(response);
}

// Obtener un lote específico
export async function GetLot(id: string): Promise<Result<components["schemas"]["LotDTO"], FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/Lots/{id}", {
        ...auth,
        params: {
            path: {
                id,
            },
        },
    }));

    if (error) {
        console.log(`Error getting lot ${id}:`, error);
        return err(error);
    }
    return ok(response);
}

// Crear un lote
export async function CreateLot(lot: components["schemas"]["LotCreateDTO"]): Promise<Result<components["schemas"]["LotDTO"], FetchError>> {
    const [response, error] = await wrapper((auth) => backend.POST("/api/Lots", {
        ...auth,
        body: lot,
    }));

    revalidatePath("/(admin)/lots", "page");
    revalidatePath("/(admin)/blocks", "page");
    revalidatePath("/(admin)/projects", "page");

    if (error) {
        console.log("Error creating lot:", error);
        return err(error);
    }
    return ok(response);
}

// Actualizar un lote
export async function UpdateLot(
    id: string,
    lot: components["schemas"]["LotUpdateDTO"],
): Promise<Result<components["schemas"]["LotDTO"], FetchError>> {
    const [response, error] = await wrapper((auth) => backend.PUT("/api/Lots/{id}", {
        ...auth,
        params: {
            path: {
                id,
            },
        },
        body: lot,
    }));

    revalidatePath("/(admin)/lots", "page");
    revalidatePath("/(admin)/blocks", "page");
    revalidatePath("/(admin)/projects", "page");

    if (error) {
        console.log("Error updating lot:", error);
        return err(error);
    }
    return ok(response);
}

// Actualizar estado de un lote
export async function UpdateLotStatus(
    id: string,
    statusUpdate: components["schemas"]["LotStatusUpdateDTO"],
): Promise<Result<components["schemas"]["LotDTO"], FetchError>> {
    const [response, error] = await wrapper((auth) => backend.PUT("/api/Lots/{id}/status", {
        ...auth,
        params: {
            path: {
                id,
            },
        },
        body: statusUpdate,
    }));

    revalidatePath("/(admin)/lots", "page");
    revalidatePath("/(admin)/blocks", "page");
    revalidatePath("/(admin)/projects", "page");

    if (error) {
        console.log("Error updating lot status:", error);
        return err(error);
    }
    return ok(response);
}

// Eliminar un lote
export async function DeleteLot(id: string): Promise<Result<void, FetchError>> {
    const [, error] = await wrapper((auth) => backend.DELETE("/api/Lots/{id}", {
        ...auth,
        params: {
            path: {
                id,
            },
        },
    }));

    revalidatePath("/(admin)/lots", "page");
    revalidatePath("/(admin)/blocks", "page");
    revalidatePath("/(admin)/projects", "page");

    if (error) {
        console.log(`Error deleting lot ${id}:`, error);
        return err(error);
    }
    return ok(undefined);
}

// Activar un lote
export async function ActivateLot(id: string): Promise<Result<void, FetchError>> {
    const [, error] = await wrapper((auth) => backend.PUT("/api/Lots/{id}/activate", {
        ...auth,
        params: {
            path: {
                id,
            },
        },
    }));

    revalidatePath("/(admin)/lots", "page");
    revalidatePath("/(admin)/blocks", "page");
    revalidatePath("/(admin)/projects", "page");

    if (error) {
        console.log(`Error activating lot ${id}:`, error);
        return err(error);
    }
    return ok(undefined);
}

// Desactivar un lote
export async function DeactivateLot(id: string): Promise<Result<void, FetchError>> {
    const [, error] = await wrapper((auth) => backend.PUT("/api/Lots/{id}/deactivate", {
        ...auth,
        params: {
            path: {
                id,
            },
        },
    }));

    revalidatePath("/(admin)/lots", "page");
    revalidatePath("/(admin)/blocks", "page");
    revalidatePath("/(admin)/projects", "page");

    if (error) {
        console.log(`Error deactivating lot ${id}:`, error);
        return err(error);
    }
    return ok(undefined);
}
