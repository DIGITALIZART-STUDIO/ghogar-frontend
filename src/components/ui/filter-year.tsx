"use client";

import { Calendar as CalendarIcon, Check, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FilterYearProps {
  selectedYear: number;
  onSelectYear: (year: number) => void;
}

export function FilterYear({ selectedYear, onSelectYear }: FilterYearProps) {
    // Generate years (current year and 5 years back)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 6 }, (_, i) => {
        const year = currentYear - i;
        return { value: year, label: year.toString() };
    });

    return (
        <div className="flex items-center gap-2">
            {/* Filtro de Año */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2 ">
                        <CalendarIcon className="h-4 w-4" />
                        <span className="font-medium text-sm">Año: </span>
                        <span className="font-medium text-sm">{selectedYear}</span>
                        <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Filtrar por año</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {years.map((year) => (
                        <DropdownMenuItem
                            key={year.value}
                            className="flex items-center justify-between"
                            onClick={() => onSelectYear(year.value)}
                        >
                            <span>{year.label}</span>
                            {selectedYear === year.value && <Check className="h-4 w-4" />}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
