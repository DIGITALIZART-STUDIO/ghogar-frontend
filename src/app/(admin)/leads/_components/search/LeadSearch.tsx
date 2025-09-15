"use client";

import { useMemo } from "react";
import { toast } from "sonner";
import { User, FileText, Calendar, MapPin, Phone } from "lucide-react";

import { usePaginatedAvailableLeadsForQuotationWithSearch } from "../../_hooks/useLeads";
import { AutoComplete, Option } from "@/components/ui/autocomplete";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { components } from "@/types/api";
import { LeadStatusLabels } from "../../_utils/leads.utils";
import { LeadStatus } from "../../_types/lead";

type LeadSummary = components["schemas"]["LeadSummaryDto"];

interface LeadSearchProps {
    disabled?: boolean;
    value: string;
    onSelect: (leadId: string, lead: LeadSummary) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    preselectedId?: string;
}

export function LeadSearch({
    disabled,
    value,
    onSelect,
    placeholder = "Selecciona un lead...",
    searchPlaceholder = "Buscar por código, cliente, proyecto...",
    emptyMessage = "No se encontraron leads",
    preselectedId,
}: LeadSearchProps) {
    const { allLeads, query, handleScrollEnd, handleSearchChange, search } = usePaginatedAvailableLeadsForQuotationWithSearch(10, preselectedId);

    const leadOptions: Array<Option<LeadSummary>> = useMemo(() => allLeads.map((lead) => ({
        value: lead.id ?? "",
        label: lead.code ?? "Lead sin código",
        entity: lead,
        component: (
            <div className="grid grid-cols-2 gap-2 w-full" title={lead.code ?? "Lead sin código"}>
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold truncate">
                        {lead.code ?? "Lead sin código"}
                    </span>
                    <div className="text-xs text-muted-foreground flex flex-col gap-1">
                        {lead.client && (
                            <Badge variant="outline" className="text-xs font-semibold">
                                <User className="w-3 h-3 mr-1" />
                                {lead.client.name ?? "Cliente sin nombre"}
                            </Badge>
                        )}
                        {lead.client?.phoneNumber && (
                            <Badge variant="outline" className="text-xs font-semibold">
                                <Phone className="w-3 h-3 mr-1" />
                                {lead.client.phoneNumber}
                            </Badge>
                        )}
                        {lead.projectName && (
                            <Badge variant="secondary" className="text-xs font-semibold">
                                <MapPin className="w-3 h-3 mr-1" />
                                {lead.projectName}
                            </Badge>
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-1 items-end">
                    {(() => {
                        const statusInfo = LeadStatusLabels[lead.status as LeadStatus];
                        const StatusIcon = statusInfo?.icon || FileText;
                        return (
                            <Badge
                                variant="outline"
                                className={cn(
                                    "text-xs font-semibold",
                                    statusInfo?.className || "text-gray-600 border-gray-200"
                                )}
                            >
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusInfo?.label || lead.status}
                            </Badge>
                        );
                    })()}
                    {lead.expirationDate && (() => {
                        const expDate = new Date(lead.expirationDate);
                        const currentDate = new Date();

                        // Calcular la diferencia en días
                        const diffTime = expDate.getTime() - currentDate.getTime();
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                        // Determinar el estado basado en los días restantes
                        let badgeClass = "";
                        let label = "";

                        if (diffDays > 3) {
                            badgeClass = "text-emerald-500 border-emerald-200";
                            label = `${diffDays} días restantes`;
                        } else if (diffDays >= 0) {
                            badgeClass = "text-amber-500 border-amber-200";
                            label = diffDays === 0
                                ? "Expira hoy"
                                : `${diffDays} día${diffDays !== 1 ? "s" : ""} restante${diffDays !== 1 ? "s" : ""}`;
                        } else {
                            badgeClass = "text-red-500 border-red-200";
                            label = `Expirado hace ${Math.abs(diffDays)} día${Math.abs(diffDays) !== 1 ? "s" : ""}`;
                        }

                        return (
                            <Badge variant="outline" className={cn("text-xs", badgeClass)}>
                                <Calendar className="w-3 h-3 mr-1" />
                                {label}
                            </Badge>
                        );
                    })()}
                </div>
            </div>
        ),
    })), [allLeads]);

    const selectedLead = leadOptions.find((lead) => lead.value === value);

    const handleSelect = ({ value, entity }: Option<LeadSummary>) => {
        if (!entity) {
            toast.error("No se pudo seleccionar el lead. Por favor, inténtalo de nuevo.");
            return;
        }
        onSelect(value, entity);
    };

    return (
        <AutoComplete<LeadSummary>
            queryState={query}
            options={leadOptions}
            value={selectedLead}
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
            commandContentClassName="min-w-[400px]"
            variant="outline"
            disabled={disabled}
            showComponentOnSelection={false}
        />
    );
}
