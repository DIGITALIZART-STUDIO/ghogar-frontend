"use server";

import { revalidatePath } from "next/cache";

import { components } from "@/types/api";
import { backend, FetchError, wrapper } from "@/types/backend";
import { err, ok, Result } from "@/utils/result";

// Obtener todas las tareas
export async function GetAllTasks(): Promise<Result<Array<components["schemas"]["LeadTask"]>, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/LeadTasks", {
        ...auth,
    }));

    if (error) {
        console.log("Error getting tasks:", error);
        return err(error);
    }
    return ok(response);
}

// Obtener una tarea específica por ID
export async function GetTask(id: string): Promise<Result<components["schemas"]["LeadTask"], FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET(`/api/LeadTasks/${id}`, {
        ...auth,
    }));

    if (error) {
        console.log(`Error getting task ${id}:`, error);
        return err(error);
    }
    return ok(response);
}

// Obtener tareas por ID de lead
export async function GetTasksByLead(leadId: string): Promise<Result<Array<components["schemas"]["LeadTask"]>, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET(`/api/LeadTasks/lead/${leadId}`, {
        ...auth,
    }));

    if (error) {
        console.log(`Error getting tasks for lead ${leadId}:`, error);
        return err(error);
    }
    return ok(response);
}

// Obtener tareas por ID de usuario asignado
export async function GetTasksByUser(userId: string): Promise<Result<Array<components["schemas"]["LeadTask"]>, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET(`/api/LeadTasks/user/${userId}`, {
        ...auth,
    }));

    if (error) {
        console.log(`Error getting tasks for user ${userId}:`, error);
        return err(error);
    }
    return ok(response);
}

// Obtener tareas pendientes
export async function GetPendingTasks(): Promise<Result<Array<components["schemas"]["LeadTask"]>, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/LeadTasks/pending", {
        ...auth,
    }));

    if (error) {
        console.log("Error getting pending tasks:", error);
        return err(error);
    }
    return ok(response);
}

// Obtener tareas completadas
export async function GetCompletedTasks(): Promise<Result<Array<components["schemas"]["LeadTask"]>, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/LeadTasks/completed", {
        ...auth,
    }));

    if (error) {
        console.log("Error getting completed tasks:", error);
        return err(error);
    }
    return ok(response);
}

// Obtener tareas por rango de fechas
export async function GetTasksByDateRange(
    startDate: string,
    endDate: string,
): Promise<Result<Array<components["schemas"]["LeadTask"]>, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/LeadTasks/daterange", {
        ...auth,
        query: { startDate, endDate },
    }));

    if (error) {
        console.log(`Error getting tasks between ${startDate} and ${endDate}:`, error);
        return err(error);
    }
    return ok(response);
}

// Crear una nueva tarea
export async function CreateTask(task: components["schemas"]["LeadTaskCreateDto"]): Promise<Result<components["schemas"]["LeadTask"], FetchError>> {
    const [response, error] = await wrapper((auth) => backend.POST("/api/LeadTasks", {
        ...auth,
        body: task,
    }));

    revalidatePath("/(admin)/assignments", "page");

    if (error) {
        console.log("Error creating task:", error);
        return err(error);
    }
    return ok(response);
}

// Actualizar una tarea
export async function UpdateTask(
    id: string,
    task: components["schemas"]["LeadTaskUpdateDto"],
): Promise<Result<components["schemas"]["LeadTask"], FetchError>> {
    const [response, error] = await wrapper((auth) => backend.PUT(`/api/LeadTasks/${id}`, {
        ...auth,
        body: task,
    }));

    revalidatePath("/(admin)/assignments", "page");

    if (error) {
        console.log("Error updating task:", error);
        return err(error);
    }
    return ok(response);
}

// Completar una tarea
export async function CompleteTask(id: string): Promise<Result<void, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.POST(`/api/LeadTasks/${id}/complete`, {
        ...auth,
    }));

    revalidatePath("/(admin)/assignments", "page");

    if (error) {
        console.log(`Error completing task ${id}:`, error);
        return err(error);
    }
    return ok(response);
}

// Eliminar una tarea
export async function DeleteTask(id: string): Promise<Result<void, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.DELETE(`/api/LeadTasks/${id}`, {
        ...auth,
    }));

    revalidatePath("/(admin)/assignments", "page");

    if (error) {
        console.log(`Error deleting task ${id}:`, error);
        return err(error);
    }
    return ok(response);
}
