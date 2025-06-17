"use server";

import { revalidatePath } from "next/cache";

import { components } from "@/types/api";
import { backend, FetchError, wrapper } from "@/types/backend";
import { err, ok, Result } from "@/utils/result";

// Obtener todos los bloques
export async function GetAllBlocks(): Promise<Result<Array<components["schemas"]["BlockDTO"]>, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/Blocks", {
        ...auth,
    }));

    if (error) {
        console.log("Error getting blocks:", error);
        return err(error);
    }
    return ok(response);
}

// Obtener bloques por proyecto
export async function GetBlocksByProject(projectId: string): Promise<Result<Array<components["schemas"]["BlockDTO"]>, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/Blocks/project/{projectId}", {
        ...auth,
        params: {
            path: {
                projectId,
            },
        },
    }));

    if (error) {
        console.log(`Error getting blocks for project ${projectId}:`, error);
        return err(error);
    }
    return ok(response);
}

// Obtener bloques activos por proyecto
export async function GetActiveBlocksByProject(projectId: string): Promise<Result<Array<components["schemas"]["BlockDTO"]>, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/Blocks/project/{projectId}/active", {
        ...auth,
        params: {
            path: {
                projectId,
            },
        },
    }));

    if (error) {
        console.log(`Error getting active blocks for project ${projectId}:`, error);
        return err(error);
    }
    return ok(response);
}

// Obtener un bloque específico
export async function GetBlock(id: string): Promise<Result<components["schemas"]["BlockDTO"], FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/Blocks/{id}", {
        ...auth,
        params: {
            path: {
                id,
            },
        },
    }));

    if (error) {
        console.log(`Error getting block ${id}:`, error);
        return err(error);
    }
    return ok(response);
}

// Crear un bloque
export async function CreateBlock(block: components["schemas"]["BlockCreateDTO"]): Promise<Result<components["schemas"]["BlockDTO"], FetchError>> {
    const [response, error] = await wrapper((auth) => backend.POST("/api/Blocks", {
        ...auth,
        body: block,
    }));

    revalidatePath("/(admin)/blocks", "page");
    revalidatePath("/(admin)/projects", "page");

    if (error) {
        console.log("Error creating block:", error);
        return err(error);
    }
    return ok(response);
}

// Actualizar un bloque
export async function UpdateBlock(
    id: string,
    block: components["schemas"]["BlockUpdateDTO"],
): Promise<Result<components["schemas"]["BlockDTO"], FetchError>> {
    const [response, error] = await wrapper((auth) => backend.PUT("/api/Blocks/{id}", {
        ...auth,
        params: {
            path: {
                id,
            },
        },
        body: block,
    }));

    revalidatePath("/(admin)/blocks", "page");
    revalidatePath("/(admin)/projects", "page");

    if (error) {
        console.log("Error updating block:", error);
        return err(error);
    }
    return ok(response);
}

// Eliminar un bloque
export async function DeleteBlock(id: string): Promise<Result<void, FetchError>> {
    const [, error] = await wrapper((auth) => backend.DELETE("/api/Blocks/{id}", {
        ...auth,
        params: {
            path: {
                id,
            },
        },
    }));

    revalidatePath("/(admin)/blocks", "page");
    revalidatePath("/(admin)/projects", "page");

    if (error) {
        console.log(`Error deleting block ${id}:`, error);
        return err(error);
    }
    return ok(undefined);
}

// Activar un bloque
export async function ActivateBlock(id: string): Promise<Result<void, FetchError>> {
    const [, error] = await wrapper((auth) => backend.PUT("/api/Blocks/{id}/activate", {
        ...auth,
        params: {
            path: {
                id,
            },
        },
    }));

    revalidatePath("/(admin)/blocks", "page");
    revalidatePath("/(admin)/projects", "page");

    if (error) {
        console.log(`Error activating block ${id}:`, error);
        return err(error);
    }
    return ok(undefined);
}

// Desactivar un bloque
export async function DeactivateBlock(id: string): Promise<Result<void, FetchError>> {
    const [, error] = await wrapper((auth) => backend.PUT("/api/Blocks/{id}/deactivate", {
        ...auth,
        params: {
            path: {
                id,
            },
        },
    }));

    revalidatePath("/(admin)/blocks", "page");
    revalidatePath("/(admin)/projects", "page");

    if (error) {
        console.log(`Error deactivating block ${id}:`, error);
        return err(error);
    }
    return ok(undefined);
}
