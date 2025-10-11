"use client";

import { useGlobalErrorHandler } from "@/hooks/useGlobalErrorHandler";

/**
 * Componente que inicializa el manejador global de errores
 * Se ejecuta solo una vez en el nivel más alto de la aplicación
 */
export function GlobalErrorHandler() {
    useGlobalErrorHandler();
    return null; // Este componente no renderiza nada
}
