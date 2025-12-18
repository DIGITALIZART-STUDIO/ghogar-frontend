"use client";

import { useMemo } from "react";
import { DollarSign, Ruler } from "lucide-react";
import { toast } from "sonner";

import { AutoComplete, Option } from "@/components/ui/autocomplete";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { usePaginatedLotsByBlockWithSearch } from "../../_hooks/useLots";
import { LotData } from "../../_types/lot";

interface LotSearchProps {
  blockId: string;
  disabled?: boolean;
  value: string;
  onSelect: (lotId: string, lot: LotData) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  preselectedId?: string;
}

export function LotSearch({
  blockId,
  disabled,
  value,
  onSelect,
  placeholder = "Selecciona un lote...",
  searchPlaceholder = "Buscar por número de lote, área, precio...",
  emptyMessage = "No se encontraron lotes",
  preselectedId,
}: LotSearchProps) {
  const { allLots, query, handleScrollEnd, handleSearchChange, search } = usePaginatedLotsByBlockWithSearch(
    blockId,
    10,
    preselectedId
  );

  const lotOptions: Array<Option<LotData>> = useMemo(
    () =>
      allLots.map((lot) => ({
        value: lot.id ?? "",
        label: lot.lotNumber ?? "Sin número",
        entity: lot,
        component: (
          <div className="grid grid-cols-2 gap-2 w-full" title={lot.lotNumber ?? "Sin número"}>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold truncate">Lote {lot.lotNumber ?? "Sin número"}</span>
              <div className="text-xs text-muted-foreground flex flex-col gap-1">
                {lot.area && (
                  <Badge variant="outline" className="text-xs font-semibold">
                    <Ruler className="w-3 h-3 mr-1" />
                    {lot.area} m²
                  </Badge>
                )}
                {lot.price && (
                  <Badge variant="secondary" className="text-xs font-semibold">
                    <DollarSign className="w-3 h-3 mr-1" />${lot.price.toLocaleString()}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1 items-end">
              <Badge
                variant="outline"
                className={cn(
                  "text-xs font-semibold",
                  lot.status === "Available" && "text-green-600 border-green-200",
                  lot.status === "Quoted" && "text-blue-600 border-blue-200",
                  lot.status === "Reserved" && "text-orange-600 border-orange-200",
                  lot.status === "Sold" && "text-red-600 border-red-200"
                )}
              >
                {lot.status === "Available" && "Disponible"}
                {lot.status === "Quoted" && "Cotizado"}
                {lot.status === "Reserved" && "Reservado"}
                {lot.status === "Sold" && "Vendido"}
              </Badge>
              {lot.blockName && (
                <span className="text-xs text-muted-foreground truncate max-w-[120px]">{lot.blockName}</span>
              )}
            </div>
          </div>
        ),
      })),
    [allLots]
  );

  const selectedLot = lotOptions.find((lot) => lot.value === value);

  const handleSelect = ({ value, entity }: Option<LotData>) => {
    if (!entity) {
      toast.error("No se pudo seleccionar el lote. Por favor, inténtalo de nuevo.");
      return;
    }
    onSelect(value, entity);
  };

  return (
    <AutoComplete<LotData>
      queryState={query}
      options={lotOptions}
      value={selectedLot}
      onValueChange={handleSelect}
      onSearchChange={handleSearchChange}
      onScrollEnd={handleScrollEnd}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      emptyMessage={search !== "" ? `No se encontraron resultados para "${search}"` : emptyMessage}
      debounceMs={400}
      regexInput={/^[a-zA-Z0-9\s\-.@]*$/}
      className="w-full"
      commandContentClassName="min-w-[400px]"
      variant="outline"
      disabled={disabled}
      showComponentOnSelection={false}
    />
  );
}
