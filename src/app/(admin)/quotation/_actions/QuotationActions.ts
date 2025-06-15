"use server";

import { revalidatePath } from "next/cache";

import { components } from "@/types/api";
import { backend, DownloadFile, FetchError, wrapper } from "@/types/backend";
import { err, ok, Result } from "@/utils/result";

// Obtener todas las cotizaciones
export async function GetAllQuotations(): Promise<Result<Array<components["schemas"]["QuotationDTO"]>, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/Quotations", {
        ...auth,
    }));

    if (error) {
        console.log("Error getting quotations:", error);
        return err(error);
    }
    return ok(response);
}

// Obtener una cotización específica por ID
export async function GetQuotationById(id: string): Promise<Result<components["schemas"]["QuotationDTO"], FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/Quotations/{id}", {
        ...auth,
        params: {
            path: {
                id,
            },
        },
    }));

    if (error) {
        console.log(`Error getting quotation ${id}:`, error);
        return err(error);
    }
    return ok(response);
}

// Obtener cotizaciones por ID de lead
export async function GetQuotationsByLeadId(leadId: string): Promise<Result<Array<components["schemas"]["QuotationDTO"]>, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/Quotations/lead/{leadId}", {
        ...auth,
        params: {
            path: {
                leadId,
            },
        },
    }));

    if (error) {
        console.log(`Error getting quotations for lead ${leadId}:`, error);
        return err(error);
    }
    return ok(response);
}

// Obtener cotizaciones por ID de asesor
export async function GetQuotationsByAdvisor(advisorId: string): Promise<Result<Array<components["schemas"]["QuotationSummaryDTO"]>, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/Quotations/advisor/{advisorId}", {
        ...auth,
        params: {
            path: {
                advisorId,
            },
        },
    }));

    if (error) {
        console.log(`Error getting quotations for advisor ${advisorId}:`, error);
        return err(error);
    }
    return ok(response);
}

// Crear una nueva cotización
export async function CreateQuotation(quotation: components["schemas"]["QuotationCreateDTO"]): Promise<Result<components["schemas"]["QuotationDTO"], FetchError>> {
    const [response, error] = await wrapper((auth) => backend.POST("/api/Quotations", {
        ...auth,
        body: quotation,
    }));

    revalidatePath("/(admin)/quotation", "page");

    if (error) {
        console.log("Error creating quotation:", error);
        return err(error);
    }
    return ok(response);
}

// Actualizar una cotización
export async function UpdateQuotation(
    id: string,
    quotation: components["schemas"]["QuotationUpdateDTO"],
): Promise<Result<components["schemas"]["QuotationDTO"], FetchError>> {
    const [response, error] = await wrapper((auth) => backend.PUT("/api/Quotations/{id}", {
        ...auth,
        params: {
            path: {
                id,
            },
        },
        body: quotation,
    }));

    revalidatePath("/(admin)/quotation", "page");

    if (error) {
        console.log(`Error updating quotation ${id}:`, error);
        return err(error);
    }
    return ok(response);
}

// Eliminar una cotización
export async function DeleteQuotation(id: string): Promise<Result<void, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.DELETE("/api/Quotations/{id}", {
        ...auth,
        params: {
            path: {
                id,
            },
        },
    }));

    revalidatePath("/(admin)/quotation", "page");

    if (error) {
        console.log(`Error deleting quotation ${id}:`, error);
        return err(error);
    }
    return ok(response);
}

// Cambiar el estado de una cotización
export async function ChangeQuotationStatus(
    id: string,
    statusDto: components["schemas"]["QuotationStatusDTO"],
): Promise<Result<components["schemas"]["QuotationDTO"], FetchError>> {
    const [response, error] = await wrapper((auth) => backend.PUT("/api/Quotations/{id}/status", {
        ...auth,
        params: {
            path: {
                id,
            },
        },
        body: statusDto,
    }));

    revalidatePath("/(admin)/quotation", "page");

    if (error) {
        console.log(`Error changing status for quotation ${id}:`, error);
        return err(error);
    }
    return ok(response);
}

// Generar código de cotización
export async function GenerateQuotationCode(): Promise<Result<{ code: string }, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/Quotations/generate-code", {
        ...auth,
    }));

    if (error) {
        console.log("Error generating quotation code:", error);
        return err(error);
    }
    // @ts-expect-error - Response type doesn't match the expected { code: string } structure
    return ok(response);
}

export async function DownloadQuotationPDF(quotationId: string): Promise<Result<Blob, FetchError>> {
    return DownloadFile(`/api/Quotations/${quotationId}/pdf`, "get", null);
}
