"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, Info, Loader2, Search, User } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateClientsSchema } from "../../_schemas/createClientsSchema";
import { useDniInfo, useRucFullInfo } from "../../_hooks/useApiPeru";
import { responseDNI, responseRUC } from "../../_types/client";

interface DocumentNumberLookupProps {
  form: UseFormReturn<CreateClientsSchema>;
  type: "dni" | "ruc";
  initialValue?: string
  isUpdate: boolean;
}

export default function DocumentNumberLookup({ form, type, initialValue, isUpdate = false }: DocumentNumberLookupProps) {
    const [input, setInput] = useState("");
    const [hasSearched, setHasSearched] = useState(false);
    const [lastSearched, setLastSearched] = useState("");
    const [toSearch, setToSearch] = useState("");

    useEffect(() => {
        if (initialValue !== undefined) {
            setInput(initialValue);
            setLastSearched(initialValue);
        }
    }, [initialValue]);

    const dniQuery = useDniInfo(type === "dni" ? toSearch : "");
    const rucQuery = useRucFullInfo(type === "ruc" ? toSearch : "");

    const isDni = type === "dni";
    const data = isDni ? (dniQuery.data as responseDNI | undefined) : (rucQuery.data as responseRUC | undefined);
    const isLoading = isDni ? dniQuery.isLoading : rucQuery.isLoading;
    const error = isDni ? dniQuery.error : rucQuery.error;
    const isSuccess = isDni ? dniQuery.isSuccess : rucQuery.isSuccess;

    console.log("DocumentNumberLookup", JSON.stringify({
        data
    }, null, 2));

    // Validar si el DNI es válido (8 dígitos)
    const isValid =
        type === "dni"
            ? input.length === 8 && /^\d{8}$/.test(input)
            : input.length === 11 && /^\d{11}$/.test(input);

    // Determinar si el botón debe estar deshabilitado
    const isButtonDisabled = isLoading ?? input === lastSearched ?? !isValid;

    // Manejar la búsqueda del DNI - Solo cuando se presiona el botón
    const handleSearch = () => {
        if (isButtonDisabled) {
            return;
        }
        setHasSearched(true);
        setLastSearched(input);
        setToSearch(input);
    };

    // Auto-llenar el formulario cuando se encuentren datos
    useEffect(() => {
        if (isSuccess && data) {
            if (isDni) {
                const dniData = data as responseDNI;
                form.setValue("dni", dniData.numero ?? "");
                form.setValue("name", dniData.nombreCompleto ?? "");
            } else {
                const rucData = data as responseRUC;
                form.setValue("ruc", rucData.ruc ?? "");
                form.setValue("companyName", rucData.nombreORazonSocial ?? "");
                form.setValue("name", rucData.representantes?.[0]?.nombre ?? "");
                form.setValue("address", rucData.direccion ?? "");
            }
        }
    }, [isSuccess, data, form, isDni]);

    // Manejar el cambio en el input del DNI
    const handleChange = (value: string) => {
        const numericValue = value.replace(/\D/g, "").slice(0, type === "dni" ? 8 : 11);
        setInput(numericValue);
        form.setValue(type, numericValue);
    };

    // Manejar Enter para buscar
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !isButtonDisabled) {
            e.preventDefault();
            handleSearch();
        }
    };

    const hasError = (): boolean => Boolean(error);

    return (
        <div className="space-y-4">
            {/* Input Section */}
            <div className="space-y-3">
                <div className="flex gap-2">
                    <div className="flex-1 relative group">
                        <Input
                            placeholder={type === "dni" ? "Ingrese DNI (8 dígitos)" : "Ingrese RUC (11 dígitos)"}
                            value={input}
                            onChange={(e) => handleChange(e.target.value)}
                            onKeyDown={handleKeyDown}
                            maxLength={type === "dni" ? 8 : 11}
                            className={`tracking-wider transition-all duration-200 ${isValid ? "border-primary/60 bg-primary/5" : ""} ${hasSearched && error ? "border-destructive/60 bg-destructive/5" : ""}`}
                        />

                        {/* Indicador de progreso sutil */}
                        <div className="absolute bottom-0 left-0 h-0.5 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-300 ease-out"
                                style={{ width: `${(input.length / 8) * 100}%` }}
                            />
                        </div>

                        {/* Icono de estado */}
                        {input.length > 0 && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                {isValid ? (
                                    <CheckCircle className="h-4 w-4 text-primary" />
                                ) : (
                                    <div className="h-2 w-2 rounded-full bg-muted-foreground/40" />
                                )}
                            </div>
                        )}
                    </div>

                    <Button
                        type="button"
                        onClick={handleSearch}
                        disabled={isButtonDisabled}
                        variant={!isButtonDisabled ? "default" : "outline"}
                        size="default"
                        className="px-4"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                <Search className="h-4 w-4 mr-2" />
                                Buscar
                            </>
                        )}
                    </Button>
                </div>

                {/* Status simple */}
                {input.length > 0 && (
                    <div className={`flex items-center justify-between text-xs${isUpdate ? " flex-col gap-2" : ""}`}>
                        <div className="flex items-center gap-2">
                            {isValid ? (
                                <span className="text-primary font-medium">
                                    ✓ {type === "dni" ? "DNI" : "RUC"} válido. Verifique y haga clic en &quot;Buscar&quot; para consultar
                                </span>
                            ) : (
                                <span className="text-muted-foreground">
                                    {input.length}/{type === "dni" ? 8 : 11} dígitos
                                </span>
                            )}
                        </div>

                        {input === lastSearched && hasSearched && (
                            <Badge variant="secondary" className="text-xs">
                                Consultado
                            </Badge>
                        )}
                    </div>
                )}
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <div className="text-sm">
                        <span className="font-medium">
                            Consultando {type === "dni" ? "RENIEC" : "SUNAT"}...
                        </span>
                        <span className="text-muted-foreground ml-2">
                            {type === "dni" ? "DNI" : "RUC"} {input}
                        </span>
                    </div>
                </div>
            )}

            {/* Success State */}
            {isSuccess && data && hasSearched && (
                <div className="flex items-center gap-3 p-3 rounded-lg border bg-primary/5 border-primary/20">
                    <div className="p-1.5 rounded-md bg-primary/10">
                        <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                    </div>
                    <div className="flex-1">
                        <div className="font-medium text-sm">Datos encontrados</div>
                        <div className="text-foreground font-semibold">
                            {isDni
                                ? (data as responseDNI).nombreCompleto
                                : (data as responseRUC).nombreORazonSocial}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {isDni
                                ? `DNI: ${(data as responseDNI).numero}`
                                : `RUC: ${(data as responseRUC).ruc}`}
                        </div>
                    </div>
                    <User className="h-5 w-5 text-primary/60 shrink-0" />
                </div>
            )}

            {/* Error State */}
            {hasSearched && hasError() && (
                <div className="flex items-start gap-3 p-3 rounded-lg border bg-destructive/5 border-destructive/20">
                    <div className="p-1.5 rounded-md bg-destructive/10">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                    </div>
                    <div className="flex-1">
                        <div className="font-medium text-sm text-destructive">Error en la consulta</div>
                        <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            {error instanceof Error
                                ? error.message
                                : typeof error === "object" && error !== null && "message" in error
                                    ? String((error as { message?: unknown }).message)
                                    : `No se pudo obtener los datos del ${type.toUpperCase()}. Verifique el número e intente nuevamente.`}
                        </div>
                    </div>
                </div>
            )}

            {/* Help Text */}
            {!hasSearched && input.length === 0 && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-muted">
                    <Info className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                        Los datos se completarán automáticamente una vez encontrados
                    </span>
                </div>
            )}
        </div>
    );
}
