"use client";

import { useMemo } from "react";
import { toast } from "sonner";
import { Building2, MapPin, DollarSign } from "lucide-react";

import { usePaginatedAcceptedQuotationsWithSearch } from "../../_hooks/useQuotations";
import { AutoComplete, Option } from "@/components/ui/autocomplete";
import { Badge } from "@/components/ui/badge";
import type { components } from "@/types/api";

type QuotationSummary = components["schemas"]["QuotationSummaryDTO"];

interface QuotationSearchProps {
    disabled?: boolean;
    value: string;
    onSelect: (quotationId: string, quotation: QuotationSummary) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    preselectedId?: string;
}

export function QuotationSearch({
    disabled,
    value,
    onSelect,
    placeholder = "Selecciona una cotización...",
    searchPlaceholder = "Buscar por cliente, proyecto, lote...",
    emptyMessage = "No se encontraron cotizaciones",
    preselectedId,
}: QuotationSearchProps) {
    const { allQuotations, query, handleScrollEnd, handleSearchChange, search } = usePaginatedAcceptedQuotationsWithSearch(10, preselectedId);

    const quotationOptions: Array<Option<QuotationSummary>> = useMemo(() => allQuotations.map((quotation) => ({
        value: quotation.id ?? "",
        label: `${quotation.code} - ${quotation.clientName}`,
        entity: quotation,
        component: (
            <div className="flex items-center justify-between w-full" title={`${quotation.code} - ${quotation.clientName}`}>
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold truncate">
                            {quotation.code}
                        </span>
                        <span className="text-sm text-muted-foreground truncate">
                            - {quotation.clientName}
                        </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {quotation.projectName && (
                            <div className="flex items-center gap-1">
                                <Building2 className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{quotation.projectName}</span>
                            </div>
                        )}
                        {quotation.lotNumber && (
                            <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">Lt. {quotation.lotNumber}</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    {quotation.finalPrice && (
                        <Badge variant="outline" className="text-xs">
                            <DollarSign className="w-3 h-3 mr-1" />
                            {quotation.currency === "PEN" ? "S/" : "$"}
                            {quotation.finalPrice.toLocaleString()}
                        </Badge>
                    )}
                    {quotation.areaAtQuotation && (
                        <Badge variant="secondary" className="text-xs">
                            {quotation.areaAtQuotation} m²
                        </Badge>
                    )}
                </div>
            </div>
        ),
    })), [allQuotations]);

    const selectedQuotation = quotationOptions.find((quotation) => quotation.value === value);

    const handleSelect = ({ value, entity }: Option<QuotationSummary>) => {
        if (!entity) {
            toast.error("No se pudo seleccionar la cotización. Por favor, inténtalo de nuevo.");
            return;
        }
        onSelect(value, entity);
    };

    return (
        <AutoComplete<QuotationSummary>
            queryState={query}
            options={quotationOptions}
            value={selectedQuotation}
            onValueChange={handleSelect}
            onSearchChange={handleSearchChange}
            onScrollEnd={handleScrollEnd}
            placeholder={placeholder}
            searchPlaceholder={searchPlaceholder}
            emptyMessage={
                search !== "" ? `No se encontraron resultados para "${search}"` : emptyMessage
            }
            debounceMs={400}
            regexInput={/^[a-zA-Z0-9\s\-.@]*$/}
            className="w-full"
            commandContentClassName="min-w-[500px]"
            variant="outline"
            disabled={disabled}
            showComponentOnSelection={false}
        />
    );
}
