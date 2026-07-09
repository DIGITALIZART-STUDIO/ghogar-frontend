"use client";

import { useMemo } from "react";
import { Calendar, FileText, MapPin, Phone, User } from "lucide-react";
import { toast } from "sonner";

import { AutoComplete, Option } from "@/components/ui/autocomplete";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { usePaginatedAvailableLeadsForQuotationWithSearch } from "../../_hooks/useLeads";
import { LeadStatus, SummaryLead } from "../../_types/lead";
import { getLeadExpirationBadge, LeadStatusLabels } from "../../_utils/leads.utils";

interface LeadSearchProps {
  disabled?: boolean;
  value: string;
  onSelect: (leadId: string, lead: SummaryLead) => void;
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
  const { allLeads, query, handleScrollEnd, handleSearchChange, search } =
    usePaginatedAvailableLeadsForQuotationWithSearch(10, preselectedId);

  const leadOptions: Array<Option<SummaryLead>> = useMemo(
    () =>
      allLeads.map((lead) => ({
        value: lead.id ?? "",
        label: lead.code ?? "Lead sin código",
        entity: lead,
        component: (
          <div className="grid grid-cols-2 gap-2 w-full" title={lead.code ?? "Lead sin código"}>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold truncate">{lead.code ?? "Lead sin código"}</span>
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
                    className={cn("text-xs font-semibold", statusInfo?.className || "text-gray-600 border-gray-200")}
                  >
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {statusInfo?.label || lead.status}
                  </Badge>
                );
              })()}
              {(() => {
                const expirationBadge = getLeadExpirationBadge(lead, "outline");

                if (!expirationBadge.showBadge) {
                  return null;
                }

                return (
                  <Badge variant="outline" className={cn("text-xs", expirationBadge.className)}>
                    <Calendar className="w-3 h-3 mr-1" />
                    {expirationBadge.label}
                  </Badge>
                );
              })()}
            </div>
          </div>
        ),
      })),
    [allLeads]
  );

  const selectedLead = leadOptions.find((lead) => lead.value === value);

  const handleSelect = ({ value, entity }: Option<SummaryLead>) => {
    if (!entity) {
      toast.error("No se pudo seleccionar el lead. Por favor, inténtalo de nuevo.");
      return;
    }
    onSelect(value, entity);
  };

  return (
    <AutoComplete<SummaryLead>
      queryState={query}
      options={leadOptions}
      value={selectedLead}
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
