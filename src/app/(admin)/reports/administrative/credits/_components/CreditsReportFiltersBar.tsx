"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, Loader2, RotateCcw } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { useDebouncedCallback } from "use-debounce";

import { ServerFiltersBar } from "@/components/datatable/filters/ServerFiltersBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditsReportFilters, PendingInstallmentsFilter } from "../_types/creditsReport";
import { nextReportDateRange, parseLocalDate } from "../../../_utils/report-dates";

interface CreditsReportFiltersBarProps {
  filters: CreditsReportFilters;
  onDateRangeChange: (from: string, to: string) => void;
  onSearchChange: (search: string) => void;
  onPendingInstallmentsChange: (value: PendingInstallmentsFilter) => void;
  onReset: () => void;
  onExport: () => void;
  isExporting?: boolean;
}

const PENDING_OPTIONS = [
  { label: "Con cuotas pendientes", value: "pending" },
  { label: "Con cuotas vencidas", value: "overdue" },
];

export function CreditsReportFiltersBar({
  filters,
  onDateRangeChange,
  onSearchChange,
  onPendingInstallmentsChange,
  onReset,
  onExport,
  isExporting = false,
}: CreditsReportFiltersBarProps) {
  const [searchValue, setSearchValue] = useState(filters.search ?? "");
  const debouncedSearchChange = useDebouncedCallback(onSearchChange, 400);

  useEffect(() => {
    setSearchValue(filters.search ?? "");
    debouncedSearchChange.cancel();
  }, [filters.search, debouncedSearchChange]);

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
          <Label className="text-xs">Periodo (fecha de inicio)</Label>
          <DateRangePicker
            dateRange={dateRange}
            setDateRange={handleDateRangeChange}
            placeholder="Seleccionar rango"
            className="h-9 w-[280px]"
          />
        </div>

        <div className="flex flex-col gap-1.5 min-w-[240px]">
          <Label className="text-xs">Cliente</Label>
          <Input
            value={searchValue}
            onChange={(event) => {
              setSearchValue(event.target.value);
              debouncedSearchChange(event.target.value);
            }}
            placeholder="Nombre o DNI / RUC"
            className="h-9"
          />
        </div>

        <ServerFiltersBar
          filters={[
            {
              id: "pendingInstallments",
              label: "Cuotas",
              value: filters.pendingInstallments === "all" ? undefined : filters.pendingInstallments,
              options: PENDING_OPTIONS,
              placeholder: "Todas",
              widthClassName: "w-[210px]",
            },
          ]}
          onChange={(_id, value) => onPendingInstallmentsChange((value as PendingInstallmentsFilter) ?? "all")}
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
