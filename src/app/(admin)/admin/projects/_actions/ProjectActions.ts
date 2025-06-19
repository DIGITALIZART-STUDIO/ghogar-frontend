"use server";

import { revalidatePath } from "next/cache";

import { components } from "@/types/api";
import { backend, FetchError, wrapper } from "@/types/backend";
import { err, ok, Result } from "@/utils/result";

// Obtener todos los proyectos
export async function GetAllProjects(): Promise<Result<Array<components["schemas"]["ProjectDTO"]>, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/Projects", {
        ...auth,
    }));

    if (error) {
        console.log("Error getting projects:", error);
        return err(error);
    }
    return ok(response);
}

// Obtener proyectos activos
export async function GetActiveProjects(): Promise<Result<Array<components["schemas"]["ProjectDTO"]>, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/Projects/active", {
        ...auth,
    }));

    if (error) {
        console.log("Error getting active projects:", error);
        return err(error);
    }
    return ok(response);
}

// Obtener un proyecto específico
export async function GetProject(id: string): Promise<Result<components["schemas"]["ProjectDTO"], FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/Projects/{id}", {
        ...auth,
        params: {
            path: {
                id,
            },
        },
    }));

    if (error) {
        console.log(`Error getting project ${id}:`, error);
        return err(error);
    }
    return ok(response);
}

// Crear un proyecto
export async function CreateProject(project: components["schemas"]["ProjectCreateDTO"]): Promise<Result<components["schemas"]["ProjectDTO"], FetchError>> {
    const [response, error] = await wrapper((auth) => backend.POST("/api/Projects", {
        ...auth,
        body: project,
    }));

    revalidatePath("/(admin)/projects", "page");

    if (error) {
        console.log("Error creating project:", error);
        return err(error);
    }
    return ok(response);
}

// Actualizar un proyecto
export async function UpdateProject(
    id: string,
    project: components["schemas"]["ProjectUpdateDTO"],
): Promise<Result<components["schemas"]["ProjectDTO"], FetchError>> {
    const [response, error] = await wrapper((auth) => backend.PUT("/api/Projects/{id}", {
        ...auth,
        params: {
            path: {
                id,
            },
        },
        body: project,
    }));

    revalidatePath("/(admin)/projects", "page");

    if (error) {
        console.log("Error updating project:", error);
        return err(error);
    }
    return ok(response);
}

// Eliminar un proyecto
export async function DeleteProject(id: string): Promise<Result<void, FetchError>> {
    const [, error] = await wrapper((auth) => backend.DELETE("/api/Projects/{id}", {
        ...auth,
        params: {
            path: {
                id,
            },
        },
    }));

    revalidatePath("/(admin)/projects", "page");

    if (error) {
        console.log(`Error deleting project ${id}:`, error);
        return err(error);
    }
    return ok(undefined);
}

// Activar un proyecto
export async function ActivateProject(id: string): Promise<Result<void, FetchError>> {
    const [, error] = await wrapper((auth) => backend.PUT("/api/Projects/{id}/activate", {
        ...auth,
        params: {
            path: {
                id,
            },
        },
    }));

    revalidatePath("/(admin)/projects", "page");

    if (error) {
        console.log(`Error activating project ${id}:`, error);
        return err(error);
    }
    return ok(undefined);
}

// Desactivar un proyecto
export async function DeactivateProject(id: string): Promise<Result<void, FetchError>> {
    const [, error] = await wrapper((auth) => backend.PUT("/api/Projects/{id}/deactivate", {
        ...auth,
        params: {
            path: {
                id,
            },
        },
    }));

    revalidatePath("/(admin)/projects", "page");

    if (error) {
        console.log(`Error deactivating project ${id}:`, error);
        return err(error);
    }
    return ok(undefined);
}
