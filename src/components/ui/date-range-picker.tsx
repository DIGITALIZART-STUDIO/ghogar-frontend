"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, XCircleIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { Separator } from "./separator";

interface DateRangePickerProps {
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  placeholder?: string;
  className?: string;
}

export function DateRangePicker({
    dateRange,
    setDateRange,
    placeholder = "Seleccionar rango de fechas",
    className,
}: DateRangePickerProps) {
    const [tempRange, setTempRange] = useState<DateRange | undefined>(dateRange);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    // Sync tempRange with dateRange when dateRange changes externally
    useEffect(() => {
        setTempRange(dateRange);
    }, [dateRange]);

    // Clear selection with a dedicated button
    const clearSelection = () => {
        setTempRange(undefined);
        setDateRange(undefined);
    };

    return (
        <Popover>
            <PopoverTrigger asChild >
                <Button
                    variant="outline"
                    className={cn(
                        "justify-start text-left font-normal truncate text-ellipsis w-full",
                        !tempRange && "text-muted-foreground",
                        className,
                    )}
                    // Removed onClick handler to prevent clearing on open
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {tempRange?.from ? (
                        tempRange.to ? (
                            <>
                                <span className="max-w-[100px] sm:max-w-full truncate text-ellipsis">
                                    {format(tempRange.from, "PPP", { locale: es })}
                                </span>
                                {" - "}
                                <span className="max-w-[100px] sm:max-w-full truncate text-ellipsis">
                                    {format(tempRange.to, "PPP", { locale: es })}
                                </span>
                            </>
                        ) : (
                            <span className="max-w-[150px] sm:max-w-full truncate text-ellipsis">
                                {format(tempRange.from, "PPP", { locale: es })}
                            </span>
                        )
                    ) : (
                        <span>
                            {placeholder}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={tempRange?.from ?? new Date()}
                    selected={tempRange}
                    onSelect={(range) => {
                        if (!range) {
                            return;
                        }

                        setTempRange(range);

                        // Only update parent state when we have a complete range
                        if (range.from && range.to) {
                            setDateRange(range);
                        }
                    }}
                    numberOfMonths={isDesktop ? 2 : 1}
                    locale={es}
                />
                <Separator className="my-2" />
                <div className="flex justify-end items-center p-2">
                    {tempRange?.from && (
                        <Button variant="ghost" size="sm" className="h-8 px-2" onClick={clearSelection}>
                            <XCircleIcon className="h-4 w-4 mr-1" />
                            <span className="text-xs">
                                Limpiar
                            </span>
                        </Button>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
