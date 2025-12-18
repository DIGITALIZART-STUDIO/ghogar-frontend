"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface FilterOption {
  label: string;
  value: string;
}

export interface ServerFilterDescriptor {
  id: string;
  label: string;
  value?: string;
  options: Array<FilterOption>;
  placeholder?: string;
  widthClassName?: string; // ej: w-[180px]
}

interface ServerFiltersBarProps {
  filters: Array<ServerFilterDescriptor>;
  onChange: (id: string, value: string | undefined) => void;
  className?: string;
}

// Valor centinela para representar "Todos" sin usar string vacío
const ALL_SENTINEL = "__ALL__" as const;

export function ServerFiltersBar({ filters, onChange, className }: ServerFiltersBarProps) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className ?? ""}`}>
      {filters.map((f) => (
        <div key={f.id} className="flex items-center gap-2">
          <Label className="text-xs">{f.label}</Label>
          <Select
            value={f.value ?? ALL_SENTINEL}
            onValueChange={(v) => onChange(f.id, v === ALL_SENTINEL ? undefined : v)}
          >
            <SelectTrigger className={`h-8 ${f.widthClassName ?? "w-[180px]"}`}>
              <SelectValue placeholder={f.placeholder ?? "Todos"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_SENTINEL}>Todos</SelectItem>
              {f.options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
}

export default ServerFiltersBar;
