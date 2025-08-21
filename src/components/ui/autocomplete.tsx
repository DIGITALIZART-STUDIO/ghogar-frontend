import React, { forwardRef, ReactNode, useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { CommandGroup, CommandInput, CommandItem, CommandList } from "./command";
import { Skeleton } from "./skeleton";
import { ScrollArea } from "./scroll-area";

export type Option = {
  value: string;
  label: string;
  [key: string]: string;
};

type AutoCompleteProps = {
  options: Array<Option>;
  emptyMessage: string;
  value?: Option;
  onValueChange?: (value: Option) => void;
  onInputChange?: (value: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  showClearButton?: boolean;
  renderOption?: (option: Option) => ReactNode;
  renderSelectedValue?: (option: Option) => ReactNode;
  maxHeight?: number;
  // Nuevas props para hooks con debounce
  useSearchHook?: (searchTerm: string) => {
    data: Array<Option> | undefined;
    isLoading: boolean;
  };
  debounceMs?: number;
  minSearchLength?: number;
};

const AutoComplete = forwardRef<HTMLInputElement, AutoCompleteProps>((
    {
        options,
        placeholder,
        emptyMessage,
        value,
        onValueChange,
        onInputChange,
        disabled,
        isLoading = false,
        className,
        showClearButton = true,
        renderOption,
        renderSelectedValue,
        maxHeight = 300,
        useSearchHook,
        debounceMs = 300,
        minSearchLength = 2,
    },
    ref,
) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    const [isOpen, setOpen] = useState(false);
    const [selected, setSelected] = useState<Option | undefined>(value);
    const [inputValue, setInputValue] = useState<string>(value?.label ?? "");
    const [dropdownWidth, setDropdownWidth] = useState<number>(0);
    const [dropdownMinWidth, setDropdownMinWidth] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState<string>("");

    // Hook para búsqueda con debounce - siempre llamar el hook pero puede ser undefined
    const searchHookResult = useSearchHook?.(searchTerm);
    const searchOptions = searchHookResult?.data;
    const isSearchLoading = searchHookResult?.isLoading ?? false;

    // Determinar qué opciones usar
    const finalOptions = useSearchHook && searchTerm.length >= minSearchLength ? searchOptions ?? [] : options;
    const finalIsLoading = useSearchHook ? isSearchLoading : isLoading;

    useEffect(() => {
        setSelected(value);
        setInputValue(value?.label ?? "");
    }, [value]);

    // Calcular el ancho del dropdown basado en el contenedor
    useEffect(() => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setDropdownWidth(rect.width);
            setDropdownMinWidth(rect.width);
        }
    }, [isOpen]);

    const handleKeyDown = useCallback(
        (event: KeyboardEvent<HTMLDivElement>) => {
            const input = inputRef.current;
            if (!input) {
                return;
            }

            if (!isOpen) {
                setOpen(true);
            }

            if (event.key === "Enter" && input.value.trim() !== "") {
                const exactMatches = options.filter((option) => option.label.toLowerCase() === input.value.trim().toLowerCase()
                );

                if (exactMatches.length >= 1) {
                    setSelected(exactMatches[0]);
                    onValueChange?.(exactMatches[0]);
                    setOpen(false);
                }
            }

            if (event.key === "Escape") {
                input.blur();
                setOpen(false);
            }
        },
        [isOpen, options, onValueChange],
    );

    const handleBlur = useCallback(() => {
        // Delay para permitir que los clicks en las opciones se procesen
        setTimeout(() => {
            setOpen(false);
            setInputValue(selected?.label ?? "");
        }, 150);
    }, [selected]);

    const handleSelectOption = useCallback(
        (selectedOption: Option) => {
            setInputValue(selectedOption.label);
            setSelected(selectedOption);
            onValueChange?.(selectedOption);
            setOpen(false);
        },
        [onValueChange],
    );

    const handleClearSelection = useCallback(() => {
        const emptyOption: Option = { value: "", label: "" };
        setSelected(undefined);
        setInputValue("");
        onValueChange?.(emptyOption);
        setOpen(true); // Mantener abierto después de limpiar
        inputRef.current?.focus();
    }, [onValueChange]);

    const handleInputClick = useCallback(() => {
        if (!disabled) {
            setOpen(true);
        }
    }, [disabled]);

    const handleInputChange = useCallback((value: string) => {
        setInputValue(value);
        setOpen(true);

        // Llamar al callback onInputChange si existe
        onInputChange?.(value);

        // Si el input está vacío, limpiar la selección
        if (!value.trim()) {
            setSelected(undefined);
            onValueChange?.({ value: "", label: "" });
            setSearchTerm("");
            return;
        }

        // Implementar debounce para búsqueda
        if (useSearchHook) {
            // Limpiar timeout anterior
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }

            // Solo buscar si tiene la longitud mínima
            if (value.length >= minSearchLength) {
                debounceTimeoutRef.current = setTimeout(() => {
                    setSearchTerm(value);
                }, debounceMs);
            } else {
                setSearchTerm("");
            }
        }
    }, [onValueChange, onInputChange, useSearchHook, debounceMs, minSearchLength]);

    const SelectedValueDisplay = () => {
        if (!selected) {
            return null;
        }

        if (renderSelectedValue) {
            return (
                <div className="flex-1 overflow-hidden text-ellipsis">
                    {renderSelectedValue(selected)}
                </div>
            );
        }

        return (
            <div className="flex-1 overflow-hidden text-ellipsis capitalize">
                {selected.label}
            </div>
        );
    };

    const filteredOptions = finalOptions.filter((option) => option.label.toLowerCase().includes(inputValue.toLowerCase())
    );

    return (
        <div ref={containerRef} className="relative w-full">
            <CommandPrimitive onKeyDown={handleKeyDown}>
                <div className="relative">
                    {selected && renderSelectedValue ? (
                        <div
                            className="flex items-center border rounded-md pl-3 pr-8 py-2 h-10 bg-white dark:bg-slate-800 relative capitalize cursor-pointer"
                            onClick={handleInputClick}
                        >
                            <SelectedValueDisplay />
                            {showClearButton && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-gray-500 hover:text-red-600"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleClearSelection();
                                    }}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="relative">
                            <CommandInput
                                ref={ref}
                                value={inputValue}
                                onValueChange={finalIsLoading ? undefined : handleInputChange}
                                onBlur={handleBlur}
                                onFocus={() => setOpen(true)}
                                onClick={handleInputClick}
                                placeholder={placeholder}
                                disabled={disabled}
                                className={cn(className, "capitalize")}
                                showBorder
                            />
                            {selected && showClearButton && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-gray-500 hover:text-red-600"
                                    onClick={handleClearSelection}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                {isOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-transparent"
                        onMouseDown={() => {
                            setOpen(false);
                        }}
                    />
                )}

                <div
                    ref={dropdownRef}
                    className={cn(
                        "absolute top-full z-50 rounded-xl border border-input bg-white dark:bg-slate-800 shadow-lg outline-none animate-in fade-in-0 zoom-in-95 overflow-hidden mt-1",
                        isOpen ? "block" : "hidden",
                    )}
                    style={{
                        minWidth: dropdownMinWidth,
                        width: renderOption ? "auto" : dropdownWidth,
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <ScrollArea
                        className={`max-h-[${maxHeight}px]`}
                        preventPropagation
                    >
                        <CommandList className="h-full rounded-lg capitalize bg-white dark:bg-slate-800">
                            {finalIsLoading && (
                                <CommandPrimitive.Loading>
                                    <div className="p-1">
                                        <Skeleton className="h-8 w-full" />
                                    </div>
                                </CommandPrimitive.Loading>
                            )}
                            {!finalIsLoading && filteredOptions.length > 0 && (
                                <CommandGroup>
                                    {filteredOptions.map((option) => {
                                        const isSelected = selected?.value === option.value;
                                        return (
                                            <CommandItem
                                                key={option.value}
                                                value={option.label}
                                                onMouseDown={(event) => {
                                                    event.preventDefault();
                                                    event.stopPropagation();
                                                }}
                                                onSelect={() => handleSelectOption(option)}
                                                className={cn(
                                                    "flex w-full items-center gap-2 cursor-pointer",
                                                    !isSelected ? "pl-8" : null,
                                                )}
                                            >
                                                {isSelected && <Check className="w-4 h-4" />}
                                                {renderOption ? renderOption(option) : option.label}
                                            </CommandItem>
                                        );
                                    })}
                                </CommandGroup>
                            )}
                            {!finalIsLoading && filteredOptions.length === 0 && (
                                <CommandPrimitive.Empty className="select-none rounded-sm px-2 py-3 text-center text-sm">
                                    {emptyMessage}
                                </CommandPrimitive.Empty>
                            )}
                        </CommandList>
                    </ScrollArea>
                </div>
            </CommandPrimitive>
        </div>
    );
});

AutoComplete.displayName = "AutoComplete";

export { AutoComplete };
