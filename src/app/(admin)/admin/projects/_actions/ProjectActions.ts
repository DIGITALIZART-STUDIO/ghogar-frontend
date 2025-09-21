"use server";

import { revalidatePath } from "next/cache";

import { components } from "@/types/api";
import { backend, FetchError, wrapper } from "@/types/backend";
import { err, ok, Result } from "@/utils/result";
import { CreateProjectSchema } from "../_schemas/createProjectsSchema";

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
export async function CreateProject(project: CreateProjectSchema): Promise<Result<components["schemas"]["ProjectDTO"], FetchError>> {
    const { projectImage, ...projectData } = project;

    // Crear FormData para enviar tanto el DTO como la imagen
    const formData = new FormData();

    // Agregar cada campo del DTO individualmente
    formData.append("dto.name", projectData.name);
    formData.append("dto.location", projectData.location);
    formData.append("dto.currency", projectData.currency);

    if (projectData.defaultDownPayment !== undefined && projectData.defaultDownPayment !== null) {
        formData.append("dto.defaultDownPayment", projectData.defaultDownPayment.toString());
    }
    if (projectData.defaultFinancingMonths !== undefined && projectData.defaultFinancingMonths !== null) {
        formData.append("dto.defaultFinancingMonths", projectData.defaultFinancingMonths.toString());
    }
    if (projectData.maxDiscountPercentage !== undefined && projectData.maxDiscountPercentage !== null) {
        formData.append("dto.maxDiscountPercentage", projectData.maxDiscountPercentage.toString());
    }

    // Agregar la imagen si existe
    if (projectImage) {
        formData.append("projectImage", projectImage);
    }

    const [response, error] = await wrapper((auth) => backend.POST("/api/Projects", {
        ...auth,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        body: formData as any,
        formData: true,
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
    project: CreateProjectSchema,
): Promise<Result<components["schemas"]["ProjectDTO"], FetchError>> {
    const { projectImage, ...projectData } = project;

    // Crear FormData para enviar tanto el DTO como la imagen
    const formData = new FormData();

    // Agregar cada campo del DTO individualmente
    if (projectData.name !== undefined && projectData.name !== null) {
        formData.append("dto.name", projectData.name);
    }
    if (projectData.location !== undefined && projectData.location !== null) {
        formData.append("dto.location", projectData.location);
    }
    if (projectData.currency !== undefined && projectData.currency !== null) {
        formData.append("dto.currency", projectData.currency);
    }
    if (projectData.defaultDownPayment !== undefined && projectData.defaultDownPayment !== null) {
        formData.append("dto.defaultDownPayment", projectData.defaultDownPayment.toString());
    }
    if (projectData.defaultFinancingMonths !== undefined && projectData.defaultFinancingMonths !== null) {
        formData.append("dto.defaultFinancingMonths", projectData.defaultFinancingMonths.toString());
    }
    if (projectData.maxDiscountPercentage !== undefined && projectData.maxDiscountPercentage !== null) {
        formData.append("dto.maxDiscountPercentage", projectData.maxDiscountPercentage.toString());
    }

    // Agregar la imagen si existe
    if (projectImage) {
        formData.append("projectImage", projectImage);
    }

    const [response, error] = await wrapper((auth) => backend.PUT("/api/Projects/{id}", {
        ...auth,
        params: {
            path: {
                id,
            },
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        body: formData as any,
        formData: true,
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
