"use client";

import { useMemo } from "react";
import { format, startOfMonth } from "date-fns";
import { Download, Loader2, RotateCcw } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { UserSearch } from "@/app/(admin)/leads/_components/search/UserSearch";
import { UserSummaryDto } from "@/app/(admin)/leads/_types/lead";
import { ServerFiltersBar } from "@/components/datatable/filters/ServerFiltersBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Label } from "@/components/ui/label";
import { AdvisorActivityFilters, HasAdvisorFilter } from "../_types/advisorActivity";

interface AdvisorActivityFiltersBarProps {
  filters: AdvisorActivityFilters;
  onDateRangeChange: (from: string, to: string) => void;
  onAdvisorChange: (advisorId: string | undefined) => void;
  onHasAdvisorChange: (value: HasAdvisorFilter) => void;
  onReset: () => void;
  onExport: () => void;
  isExporting?: boolean;
}

const HAS_ADVISOR_OPTIONS = [
  { label: "Con asesor asignado", value: "with-advisor" },
  { label: "Sin asesor asignado", value: "without-advisor" },
];

function parseLocalDate(dateOnly: string): Date {
  return new Date(`${dateOnly}T00:00:00`);
}

function toDateOnly(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

function defaultDateRange(): { from: string; to: string } {
  const now = new Date();
  return {
    from: toDateOnly(startOfMonth(now)),
    to: toDateOnly(now),
  };
}

export function AdvisorActivityFiltersBar({
  filters,
  onDateRangeChange,
  onAdvisorChange,
  onHasAdvisorChange,
  onReset,
  onExport,
  isExporting = false,
}: AdvisorActivityFiltersBarProps) {
  const dateRange = useMemo<DateRange | undefined>(
    () => ({
      from: parseLocalDate(filters.from),
      to: parseLocalDate(filters.to),
    }),
    [filters.from, filters.to]
  );

  const handleDateRangeChange = (range: DateRange | undefined) => {
    // from/to son obligatorios en el API. Si limpia, volvemos al mes actual.
    // Mientras elige el primer día o navega meses, DateRangePicker usa estado
    // temporal y solo llama aquí con el rango completo (o al limpiar).
    if (!range?.from || !range.to) {
      const defaults = defaultDateRange();
      onDateRangeChange(defaults.from, defaults.to);
      return;
    }

    onDateRangeChange(toDateOnly(range.from), toDateOnly(range.to));
  };

  return (
    <Card>
      <CardContent className="flex flex-wrap items-end gap-4 pt-6">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs">Periodo</Label>
          <DateRangePicker
            dateRange={dateRange}
            setDateRange={handleDateRangeChange}
            placeholder="Seleccionar rango"
            className="h-9 w-[280px]"
          />
        </div>

        <div className="flex flex-col gap-1.5 min-w-[260px]">
          <Label className="text-xs">Asesor</Label>
          <UserSearch
            value={filters.advisorId ?? ""}
            onSelect={(userId: string, _user: UserSummaryDto) => onAdvisorChange(userId || undefined)}
            placeholder="Todos los asesores"
          />
        </div>

        <ServerFiltersBar
          filters={[
            {
              id: "hasAdvisor",
              label: "Asignación",
              value: filters.hasAdvisor === "all" ? undefined : filters.hasAdvisor,
              options: HAS_ADVISOR_OPTIONS,
              placeholder: "Todos",
              widthClassName: "w-[200px]",
            },
          ]}
          onChange={(_id, value) => onHasAdvisorChange((value as HasAdvisorFilter) ?? "all")}
        />

        <div className="flex items-center gap-2 ml-auto">
          <Button type="button" variant="outline" size="sm" onClick={onReset} className="gap-1.5">
            <RotateCcw className="size-3.5" />
            Limpiar filtros
          </Button>

          <Button type="button" size="sm" onClick={onExport} disabled={isExporting} className="gap-1.5">
            {isExporting ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
            Exportar Excel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
