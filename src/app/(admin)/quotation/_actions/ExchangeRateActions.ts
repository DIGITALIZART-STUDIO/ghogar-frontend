"use server";

import { revalidatePath } from "next/cache";

import { backend, FetchError, wrapper } from "@/types/backend";
import { err, ok, Result } from "@/utils/result";

// Definir la interfaz para la respuesta del endpoint
interface ExchangeRateResponse {
  exchangeRate: number;
}

/**
 * Obtiene el tipo de cambio actual del dólar a soles
 * @returns Resultado con el valor del tipo de cambio actual
 */
export async function GetCurrentExchangeRate(): Promise<Result<number, FetchError>> {
    const [response, error] = await wrapper((auth) => backend.GET("/api/ExchangeRate", {
        ...auth,
    })
    );

    if (error) {
        console.log("Error getting exchange rate:", error);
        return err(error);
    }

    // Usar una aserción de tipo explícita para la respuesta
    const typedResponse = response as unknown as ExchangeRateResponse;

    // Validar que la respuesta tenga el formato esperado
    if (typedResponse === null || typedResponse === undefined || typeof typedResponse.exchangeRate !== "number") {
        return err({
            statusCode: 500,
            message: "Formato de respuesta inválido del tipo de cambio",
            error: null,
        });
    }

    // Revalidar páginas que puedan depender del tipo de cambio
    revalidatePath("/(admin)/quotation", "page");
    revalidatePath("/(admin)/reservations", "page");

    return ok(typedResponse.exchangeRate);
}

// El resto del archivo permanece igual
/**
 * Convierte un monto en dólares a soles usando el tipo de cambio actual
 * @param amountUSD Monto en dólares a convertir
 * @returns Resultado con el monto convertido a soles
 */
export async function ConvertUSDToPEN(amountUSD: number): Promise<Result<number, FetchError>> {
    const [exchangeRate, error] = await GetCurrentExchangeRate();

    if (error) {
        return err(error);
    }

    const amountPEN = amountUSD * exchangeRate;
    return ok(amountPEN);
}

/**
 * Convierte un monto en soles a dólares usando el tipo de cambio actual
 * @param amountPEN Monto en soles a convertir
 * @returns Resultado con el monto convertido a dólares
 */
export async function ConvertPENToUSD(amountPEN: number): Promise<Result<number, FetchError>> {
    const [exchangeRate, error] = await GetCurrentExchangeRate();

    if (error) {
        return err(error);
    }

    if (exchangeRate === 0) {
        return err({
            statusCode: 500,
            message: "No se puede dividir por cero. Tipo de cambio inválido.",
            error: null,
        });
    }

    const amountUSD = amountPEN / exchangeRate;
    return ok(amountUSD);
}

/**
 * Actualiza los valores de un formulario convirtiendo entre monedas
 * @param amount Monto a convertir
 * @param fromCurrency Moneda origen ('USD' o 'PEN')
 * @returns Valores actualizados con la conversión
 */
export async function convertAmount(
    amount: number,
    fromCurrency: "USD" | "PEN"
): Promise<Result<{ originalAmount: number; convertedAmount: number; exchangeRate: number }, FetchError>> {
    try {
        const [exchangeRate, exchangeRateError] = await GetCurrentExchangeRate();

        if (exchangeRateError) {
            return err(exchangeRateError);
        }

        let convertedAmount: number;

        if (fromCurrency === "USD") {
            // Convertir de USD a PEN
            convertedAmount = amount * exchangeRate;
        } else {
            // Convertir de PEN a USD
            if (exchangeRate === 0) {
                return err({
                    statusCode: 500,
                    message: "No se puede dividir por cero. Tipo de cambio inválido.",
                    error: null,
                });
            }
            convertedAmount = amount / exchangeRate;
        }

        return ok({
            originalAmount: amount,
            convertedAmount: Number(convertedAmount.toFixed(2)),
            exchangeRate,
        });
    } catch (error) {
        console.error("Error en convertAmount:", error);
        return err({
            statusCode: 500,
            message: `Error al convertir la moneda: ${(error as Error).message}`,
            error: null,
        });
    }
}
