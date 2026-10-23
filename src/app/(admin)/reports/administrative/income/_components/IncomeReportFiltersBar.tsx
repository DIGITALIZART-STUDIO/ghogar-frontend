"use client";

import { useMemo } from "react";
import { Download, Loader2, RotateCcw } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Label } from "@/components/ui/label";
import { IncomeReportFilters } from "../_types/incomeReport";
import { nextReportDateRange, parseLocalDate } from "../../../_utils/report-dates";

interface IncomeReportFiltersBarProps {
  filters: IncomeReportFilters;
  onDateRangeChange: (from: string, to: string) => void;
  onReset: () => void;
  onExport: () => void;
  isExporting?: boolean;
}

export function IncomeReportFiltersBar({
  filters,
  onDateRangeChange,
  onReset,
  onExport,
  isExporting = false,
}: IncomeReportFiltersBarProps) {
  const dateRange = useMemo<DateRange | undefined>(
    () => ({
      from: parseLocalDate(filters.from),
      to: parseLocalDate(filters.to),
    }),
    [filters.from, filters.to]
  );

  const handleDateRangeChange = (range: DateRange | undefined) => {
    const next = nextReportDateRange(range, filters.from, filters.to);
    if (!next) {
      return;
    }

    onDateRangeChange(next.from, next.to);
  };

  return (
    <Card>
      <CardContent className="flex flex-wrap items-end gap-4 pt-6">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs">Periodo (fecha de pago)</Label>
          <DateRangePicker
            dateRange={dateRange}
            setDateRange={handleDateRangeChange}
            placeholder="Seleccionar rango"
            className="h-9 w-[280px]"
          />
        </div>

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
