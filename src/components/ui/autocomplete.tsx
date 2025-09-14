import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    // InfiniteData,
    UseInfiniteQueryResult,
    UseQueryResult,
    UseSuspenseInfiniteQueryResult,
} from "@tanstack/react-query";
import { AlertCircle, Check, ChevronDown, Loader2 } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./command";

export type Option<T> = {
    value: string;
    label: string;
    entity?: T;
    component?: React.ReactNode;
};

type AutoCompleteProps<T> = {
    // Props básicas (compatibilidad con versión anterior)
    options?: Array<Option<T>>;
    emptyMessage?: string;
    value?: Option<T>;
    onValueChange?: (value: Option<T>) => void;
    isLoading?: boolean;
    disabled?: boolean;
    placeholder?: string;
    onPreventSelection?: (value: Option<T>) => boolean;
    showComponentOnSelection?: boolean; // Nueva prop para controlar si mostrar component o label cuando se selecciona

    // Props para búsqueda remota (nuevas)
    queryState?: UseQueryResult<Array<T>, unknown> | UseInfiniteQueryResult<unknown, unknown> | UseSuspenseInfiniteQueryResult<unknown, unknown>;
    onSearchChange?: (searchTerm: string) => void;
    searchPlaceholder?: string;
    debounceMs?: number;
    regexInput?: RegExp;
    total?: number;
    notFoundAction?: React.ReactNode;

    // Props de scroll infinito
    onScrollEnd?: () => void;

    // Props de UI mejoradas
    className?: string;
    commandContentClassName?: string;
    commandInputClassName?: string;
    variant?: "default" | "outline";
};

export function AutoComplete<T = unknown>({
    // Props básicas
    options = [],
    placeholder = "Buscar...",
    emptyMessage = "No se encontraron resultados",
    value,
    onValueChange,
    disabled = false,
    isLoading: externalLoading = false,
    onPreventSelection,
    showComponentOnSelection = false, // Por defecto, mostrar solo el label

    // Props de búsqueda remota
    queryState,
    onSearchChange,
    searchPlaceholder,
    debounceMs = 300,
    regexInput,
    total,
    notFoundAction,

    // Props de scroll
    onScrollEnd,

    // Props de UI
    className,
    commandContentClassName,
    commandInputClassName,
}: AutoCompleteProps<T>) {
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const isInteractingWithDropdownRef = useRef(false);

    const [isOpen, setOpen] = useState(false);
    const [selected, setSelected] = useState<Option<T> | undefined>(value);
    const [inputValue, setInputValue] = useState<string>(value?.label ?? "");
    const [, setSearchTerm] = useState("");

    // Sincronizar con el prop value cuando cambie externamente
    useEffect(() => {
        setSelected(value);
        setInputValue(value?.label ?? "");
        if (!value) {
            setSearchTerm("");
        }
    }, [value]);

    // Determinar si usamos búsqueda remota o local
    const isRemoteSearch = Boolean(queryState && onSearchChange);

    // Estados de la query remota
    const remoteData = queryState?.data;
    const remoteLoading = queryState?.isLoading;
    const isError = queryState?.isError;
    const error = queryState?.error;
    const refetch = queryState?.refetch;

    // Determinar estado de loading
    const isLoading = isRemoteSearch ? remoteLoading : externalLoading;

    // Determinar opciones a usar
    const currentOptions = useMemo(() => {
        if (isRemoteSearch && remoteData) {
            return options.length > 0 ? options : [];
        }
        return options;
    }, [isRemoteSearch, remoteData, options]);

    // Mensajes memoizados
    const messages = useMemo(
        () => ({
            loading: "Cargando...",
            error: "Error al cargar los datos",
            empty: emptyMessage,
            noResults: "Sin resultados",
        }),
        [emptyMessage],
    );

    // Callback con debounce para búsqueda remota
    const debouncedSearch = useDebouncedCallback((term: string) => {
        if (!isRemoteSearch) {
            return;
        }

        if (regexInput) {
            if (regexInput.test(term) || term === "") {
                onSearchChange?.(term);
                setSearchTerm(term);
            }
        } else {
            onSearchChange?.(term);
            setSearchTerm(term);
        }
    }, debounceMs);

    // Manejo de cambios en el input
    const handleInputChange = useCallback(
        (newValue: string) => {
            setInputValue(newValue);

            // Si estamos buscando y hay algo seleccionado, deseleccionar
            if (selected && newValue !== selected.label) {
                setSelected(undefined);
                // No llamar onValueChange con undefined, solo limpiar internamente
            }

            if (isRemoteSearch) {
                debouncedSearch(newValue);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isRemoteSearch, debouncedSearch, selected, onValueChange],
    );

    const handleSelectOption = useCallback(
        (selectedOption: Option<T>) => {
            onValueChange?.(selectedOption);
            if (onPreventSelection && onPreventSelection(selectedOption)) {
                return; // Si la selección está bloqueada, no hacer nada mas
            }
            setInputValue(selectedOption.label);
            setSelected(selectedOption);
            //onValueChange?.(selectedOption);
            setOpen(false);
        },
        [onPreventSelection, onValueChange],
    );

    const handleFocus = useCallback(() => {
        setOpen(true);
        // Al hacer focus, si hay algo seleccionado, limpiar para buscar
        if (selected) {
            setInputValue("");
            if (isRemoteSearch) {
                debouncedSearch("");
            }
        }
    }, [selected, isRemoteSearch, debouncedSearch]);

    const handleBlur = useCallback(() => {
        // Delay para permitir clicks en opciones
        setTimeout(() => {
            if (isInteractingWithDropdownRef.current) {
                // Mantener abierto si la interacción ocurre dentro del dropdown
                isInteractingWithDropdownRef.current = false;
                // restaurar el foco para evitar cerrar por blur
                inputRef.current?.focus();
                return;
            }
            setOpen(false);

            // Si hay algo seleccionado, mantener el label; si no, limpiar
            if (selected) {
                setInputValue(selected.label);
            } else {
                setInputValue("");
            }

            // Limpiar búsqueda al cerrar solo si no hay nada seleccionado
            if (isRemoteSearch && !selected) {
                debouncedSearch("");
            }
        }, 200);
    }, [selected, isRemoteSearch, debouncedSearch]);

    // Calcular opciones adicionales disponibles
    const moreOptions = useMemo(() => (total ? Math.max(0, total - currentOptions.length) : 0), [total, currentOptions.length]);

    // Renderizar el trigger/input
    const renderTrigger = () => {
        if (selected && !isOpen) {
            // Mostrar información del item seleccionado
            return (
                <div
                    className={cn(
                        "flex items-center justify-between w-full px-3 py-2 text-sm bg-background border border-input rounded-md cursor-pointer hover:bg-accent transition-colors",
                        disabled && "opacity-50 cursor-not-allowed",
                    )}
                    onClick={() => !disabled && setOpen(true)}
                >
                    <div className="flex-1 min-w-0">
                        {showComponentOnSelection && selected.component ? (
                            <div className="truncate">{selected.component}</div>
                        ) : (
                            <span className="truncate" title={selected.label}>
                                {selected.label}
                            </span>
                        )}
                    </div>
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                </div>
            );
        }

        // Input normal para búsqueda usando CommandInput
        return (
            <CommandInput
                ref={inputRef}
                value={inputValue}
                onValueChange={handleInputChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                placeholder={searchPlaceholder ?? placeholder}
                disabled={disabled}
                className={cn("h-10", commandInputClassName)}
                showBorder
            />
        );
    };

    return (
        <div className={cn("relative", className)}>
            <Command shouldFilter={false}>
                {renderTrigger()}

                {isOpen && (
                    <div
                        className={cn(
                            "absolute top-full left-0 right-0 z-50 mt-1 rounded-md border bg-popover shadow-lg animate-in fade-in-0 zoom-in-95 overflow-hidden",
                            commandContentClassName,
                        )}
                        data-prevent-dialog-close="true"
                        ref={dropdownRef}
                        onPointerDown={(e) => {
                            isInteractingWithDropdownRef.current = true;
                            e.stopPropagation();
                        }}
                        onMouseDown={(e) => {
                            isInteractingWithDropdownRef.current = true;
                            e.stopPropagation();
                        }}
                        onClick={(e) => {
                            isInteractingWithDropdownRef.current = true;
                            e.stopPropagation();
                        }}
                    >
                        <CommandList
                            className="max-h-64 overflow-auto"
                            onScrollEnd={onScrollEnd}
                            onPointerDown={(e) => {
                                isInteractingWithDropdownRef.current = true;
                                e.stopPropagation();
                            }}
                            onMouseDown={(e) => {
                                isInteractingWithDropdownRef.current = true;
                                e.stopPropagation();
                            }}
                            onClick={(e) => {
                                isInteractingWithDropdownRef.current = true;
                                e.stopPropagation();
                            }}
                        >
                            {/* Estado de carga */}
                            {isLoading ? (
                                <div className="flex items-center justify-center p-4">
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    <span className="text-sm text-muted-foreground">{String(messages.loading)}</span>
                                </div>
                            ) : null}

                            {/* Estado de error */}
                            {isError && error ? (
                                <div className="flex flex-col items-center justify-center p-4 space-y-2">
                                    <AlertCircle className="h-8 w-8 text-destructive" />
                                    <p className="text-sm text-muted-foreground text-center">{messages.error}</p>
                                    {refetch && (
                                        <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-2">
                                            Reintentar
                                        </Button>
                                    )}
                                </div>
                            ) : null}

                            {/* Lista de opciones */}
                            {!isLoading && !isError && currentOptions.length > 0 && (
                                <CommandGroup>
                                    {currentOptions.map((option: Option<T>) => {
                                        const isSelected = selected?.value === option.value;
                                        return (
                                            <CommandItem
                                                key={option.value}
                                                value={option.value}
                                                onSelect={() => handleSelectOption(option)}
                                                className={cn(
                                                    "flex w-full items-center gap-2 cursor-pointer",
                                                    !isSelected ? "" : "pl-8",
                                                    isSelected && "bg-accent text-accent-foreground",
                                                )}
                                            >
                                                {option.component ?? option.label}
                                                <Check
                                                    className={cn(
                                                        "ml-auto h-4 w-4 text-emerald-500 shrink-0",
                                                        isSelected ? "opacity-100" : "opacity-0",
                                                    )}
                                                />
                                            </CommandItem>
                                        );
                                    })}
                                </CommandGroup>
                            )}

                            {/* Sin resultados */}
                            {!isLoading && !isError && currentOptions.length === 0 && (
                                <CommandEmpty>
                                    <div className="p-4 text-center">
                                        <p className="text-sm text-muted-foreground mb-2">{messages.noResults}</p>
                                        {notFoundAction}
                                    </div>
                                </CommandEmpty>
                            )}

                            {/* Indicador de opciones adicionales */}
                            {moreOptions > 0 && (
                                <div className="px-3 py-2 text-xs text-muted-foreground border-t bg-muted/50">
                                    {moreOptions} opciones adicionales disponibles
                                </div>
                            )}
                        </CommandList>
                    </div>
                )}
            </Command>
        </div>
    );
}
