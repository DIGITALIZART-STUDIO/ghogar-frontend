"use server";

import { backend, FetchError, wrapper } from "@/types/backend";
import { err, ok, Result } from "@/utils/result";
import { components } from "@/types/api";

// Obtener información completa de RUC
export async function GetRucFullInfo(ruc: string): Promise<Result<components["schemas"]["ResponseApiRucFull"], FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/apiperu/ruc/{ruc}/info", {
        ...auth,
        params: {
            path: { ruc },
        },
    })
    );

    if (error) {
        console.log(`Error getting RUC info for ${ruc}:`, error);
        return err(error);
    }
    return ok(response);
}

// Obtener información de DNI
export async function GetDniInfo(dni: string): Promise<Result<components["schemas"]["ResponseApiDni"], FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/apiperu/dni/{dni}/info", {
        ...auth,
        params: {
            path: { dni },
        },
    })
    );

    if (error) {
        console.log(`Error getting DNI info for ${dni}:`, error);
        return err(error);
    }
    return ok(response);
}
