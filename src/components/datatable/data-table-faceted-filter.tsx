import * as React from "react";
import { Column } from "@tanstack/react-table";
import { Check, PlusCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: Array<{
    label: string;
    value: TValue; // Usamos TValue directamente
    icon?: React.ComponentType<{ className?: string }>;
  }>;
  onFilterChange?: (value: TValue | undefined | Array<TValue>) => void; // Callback personalizado para el servidor
  currentValue?: TValue; // Valor actual del filtro desde el servidor
}

export function DataTableFacetedFilter<TData, TValue>({
    column,
    title,
    options,
    onFilterChange,
    currentValue,
}: DataTableFacetedFilterProps<TData, TValue>) {
    // Estado interno para mantener los valores seleccionados
    const [internalSelectedValues, setInternalSelectedValues] = React.useState<Set<TValue>>(new Set());

    // Modificamos esta parte para manejar diferentes tipos de valores
    const filterValue = column?.getFilterValue(); // Extraemos esto fuera del useMemo

    // Sincronizar estado interno con el valor del filtro cuando hay callback personalizado
    React.useEffect(() => {
        if (onFilterChange) {
            // Priorizar currentValue si está disponible, sino usar filterValue
            const valueToUse = currentValue ?? filterValue;

            if (valueToUse !== undefined && valueToUse !== null) {
                if (Array.isArray(valueToUse)) {
                    setInternalSelectedValues(new Set(valueToUse as Array<TValue>));
                } else {
                    setInternalSelectedValues(new Set([valueToUse as TValue]));
                }
            } else {
                setInternalSelectedValues(new Set());
            }
        }
    }, [filterValue, currentValue, onFilterChange]);

    const selectedValues = React.useMemo(() => {
        // Si hay callback personalizado, usar estado interno
        if (onFilterChange) {
            return internalSelectedValues;
        }

        // Si no hay valor de filtro
        if (filterValue === undefined || filterValue === null) {
            return new Set<TValue>();
        }

        // Si es un array, lo convertimos directamente a Set
        if (Array.isArray(filterValue)) {
            return new Set<TValue>(filterValue as Array<TValue>);
        }

        // Si es un valor único (como un booleano), lo envolvemos en un array
        return new Set<TValue>([filterValue as TValue]);
    }, [filterValue, internalSelectedValues, onFilterChange]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 border-dashed">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {title}
                    {selectedValues?.size > 0 && (
                        <>
                            <Separator orientation="vertical" className="mx-2 h-4" />
                            <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                                {selectedValues.size}
                            </Badge>
                            <div className="hidden space-x-1 lg:flex">
                                {selectedValues.size > 2 ? (
                                    <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                                        {selectedValues.size}
                                        {" "}
                                        seleccionados
                                    </Badge>
                                ) : (
                                    options
                                        .filter((option) => selectedValues.has(option.value))
                                        .map((option) => (
                                            <Badge variant="secondary" key={String(option.value)} className="rounded-sm px-1 font-normal">
                                                {option.label}
                                            </Badge>
                                        ))
                                )}
                            </div>
                        </>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
                <Command>
                    <CommandInput placeholder={title} />
                    <CommandList>
                        <CommandEmpty>
                            No se encontraron resultados.
                        </CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => {
                                const isSelected = selectedValues.has(option.value);
                                return (
                                    <CommandItem
                                        key={String(option.value)}
                                        onSelect={() => {
                                            const filterValues = new Set(selectedValues);
                                            if (isSelected) {
                                                filterValues.delete(option.value);
                                            } else {
                                                filterValues.add(option.value);
                                            }

                                            // Usar callback personalizado si está disponible, sino usar el filtro local
                                            if (onFilterChange) {
                                                setInternalSelectedValues(filterValues);
                                                // Para callbacks del servidor, siempre enviar array
                                                const arrayValue = Array.from(filterValues) as Array<TValue>;
                                                onFilterChange(arrayValue);
                                            } else {
                                                // Para filtros locales, mantener lógica original
                                                let finalValue: TValue | undefined;
                                                if (filterValues.size === 1 && typeof Array.from(filterValues)[0] === "boolean") {
                                                    finalValue = Array.from(filterValues)[0];
                                                } else {
                                                    finalValue = filterValues.size ? Array.from(filterValues)[0] : undefined;
                                                }
                                                column?.setFilterValue(finalValue);
                                            }
                                        }}
                                    >
                                        <div
                                            className={cn(
                                                "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                isSelected ? "" : "opacity-50 [&_svg]:invisible",
                                            )}
                                        >
                                            <Check className={cn("h-4 w-4")} />
                                        </div>
                                        {option.icon && <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
                                        <span>
                                            {option.label}
                                        </span>
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                        {selectedValues.size > 0 && (
                            <>
                                <CommandSeparator />
                                <CommandGroup>
                                    <CommandItem
                                        onSelect={() => {
                                            if (onFilterChange) {
                                                setInternalSelectedValues(new Set());
                                                onFilterChange([]);
                                            } else {
                                                column?.setFilterValue(undefined);
                                            }
                                        }}
                                        className="justify-center text-center"
                                    >
                                        Limpiar filtros
                                    </CommandItem>
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
