"use client";

import { useMemo, useState } from "react";
import { endOfMonth, endOfYear, format, startOfDay, startOfMonth, startOfYear, subDays } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, Check, ChevronDown, X } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type DashboardPeriodFilter = {
  year: number;
  from?: string;
  to?: string;
};

type DatePreset = "none" | "today" | "last7" | "thisMonth" | "thisYear" | "custom";

const PRESET_LABELS: Record<DatePreset, string> = {
  none: "Sin rango",
  today: "Hoy",
  last7: "Últimos 7 días",
  thisMonth: "Este mes",
  thisYear: "Este año",
  custom: "Personalizado",
};

function toDateOnly(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

function getPresetRange(preset: DatePreset, year: number): { from: string; to: string } | undefined {
  const today = startOfDay(new Date());

  switch (preset) {
    case "today":
      return { from: toDateOnly(today), to: toDateOnly(today) };
    case "last7":
      return { from: toDateOnly(subDays(today, 6)), to: toDateOnly(today) };
    case "thisMonth":
      return { from: toDateOnly(startOfMonth(today)), to: toDateOnly(endOfMonth(today)) };
    case "thisYear":
      return {
        from: toDateOnly(startOfYear(new Date(year, 0, 1))),
        to: toDateOnly(endOfYear(new Date(year, 0, 1))),
      };
    default:
      return undefined;
  }
}

interface FilterDashboardPeriodProps {
  value: DashboardPeriodFilter;
  onChange: (value: DashboardPeriodFilter) => void;
  className?: string;
}

export function FilterDashboardPeriod({ value, onChange, className }: FilterDashboardPeriodProps) {
  const [preset, setPreset] = useState<DatePreset>(value.from && value.to ? "custom" : "none");
  const currentYear = new Date().getFullYear();
  const years = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => {
        const year = currentYear - i;
        return { value: year, label: year.toString() };
      }),
    [currentYear]
  );

  const dateRange: DateRange | undefined =
    value.from && value.to
      ? {
          from: new Date(`${value.from}T00:00:00`),
          to: new Date(`${value.to}T00:00:00`),
        }
      : undefined;

  const applyYear = (year: number) => {
    if (preset === "thisYear") {
      const range = getPresetRange("thisYear", year);
      onChange({ year, ...range });
      return;
    }
    onChange({
      year,
      from: value.from,
      to: value.to,
    });
  };

  const applyPreset = (nextPreset: DatePreset) => {
    setPreset(nextPreset);

    if (nextPreset === "none") {
      onChange({ year: value.year });
      return;
    }

    if (nextPreset === "custom") {
      return;
    }

    const range = getPresetRange(nextPreset, value.year);
    onChange({ year: value.year, ...range });
  };

  const applyCustomRange = (range: DateRange | undefined) => {
    if (!range?.from || !range.to) {
      setPreset("none");
      onChange({ year: value.year });
      return;
    }

    setPreset("custom");
    onChange({
      year: value.year,
      from: toDateOnly(range.from),
      to: toDateOnly(range.to),
    });
  };

  const clearRange = () => {
    setPreset("none");
    onChange({ year: value.year });
  };

  const rangeLabel =
    value.from && value.to
      ? `${format(new Date(`${value.from}T00:00:00`), "dd MMM yyyy", { locale: es })} – ${format(
          new Date(`${value.to}T00:00:00`),
          "dd MMM yyyy",
          { locale: es }
        )}`
      : null;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            <span className="font-medium text-sm">Año:</span>
            <span className="font-medium text-sm">{value.year}</span>
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Filtrar por año</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {years.map((year) => (
            <DropdownMenuItem
              key={year.value}
              className="flex items-center justify-between"
              onClick={() => applyYear(year.value)}
            >
              <span>{year.label}</span>
              {value.year === year.value && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <span className="font-medium text-sm">Periodo:</span>
            <span className="font-medium text-sm">{PRESET_LABELS[preset]}</span>
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Presets de fecha</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {(Object.keys(PRESET_LABELS) as Array<DatePreset>).map((key) => (
            <DropdownMenuItem key={key} className="flex items-center justify-between" onClick={() => applyPreset(key)}>
              <span>{PRESET_LABELS[key]}</span>
              {preset === key && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {(preset === "custom" || (value.from && value.to)) && (
        <div className="flex items-center gap-2">
          <DateRangePicker
            dateRange={dateRange}
            setDateRange={applyCustomRange}
            placeholder="Rango personalizado"
            className="w-[260px]"
          />
          {rangeLabel && (
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={clearRange} title="Limpiar rango">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
