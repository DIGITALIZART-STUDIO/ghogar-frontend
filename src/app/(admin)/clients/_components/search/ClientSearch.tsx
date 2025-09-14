"use client";

import { useMemo } from "react";
import { toast } from "sonner";
import { User, Building2, Phone } from "lucide-react";

import { usePaginatedClientsWithSearch } from "../../_hooks/useClients";
import { AutoComplete, Option } from "@/components/ui/autocomplete";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { components } from "@/types/api";
import { ClientTypesLabels } from "../../_utils/clients.utils";

type Client = components["schemas"]["Client"];

interface ClientSearchProps {
    disabled?: boolean;
    value: string;
    onSelect: (clientId: string, client: Client) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
}

export function ClientSearch({
    disabled,
    value,
    onSelect,
    placeholder = "Selecciona un cliente...",
    searchPlaceholder = "Buscar por nombre, DNI, RUC, teléfono...",
    emptyMessage = "No se encontraron clientes",
}: ClientSearchProps) {
    const { allClients, query, handleScrollEnd, handleSearchChange, search } = usePaginatedClientsWithSearch();

    const clientOptions: Array<Option<Client>> = useMemo(() => allClients.map((client) => ({
        value: client.id ?? "",
        label: client.name ?? "Sin nombre",
        entity: client,
        component: (
            <div className="grid grid-cols-2 gap-2 w-full" title={client.name ?? "Sin nombre"}>
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold truncate">
                        {client.name ?? "Sin nombre"}
                    </span>
                    <div className="text-xs text-muted-foreground flex flex-col gap-2">
                        {client.dni && (
                            <Badge variant="outline" className="text-xs font-semibold mr-1">
                                DNI: {client.dni}
                            </Badge>
                        )}
                        {client.ruc && (
                            <Badge variant="outline" className="text-xs font-semibold mr-1">
                                RUC: {client.ruc}
                            </Badge>
                        )}
                        {client.phoneNumber && (
                            <Badge variant="secondary" className="text-xs font-semibold">
                                <Phone className="w-3 h-3 mr-1" />
                                {client.phoneNumber}
                            </Badge>
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-1 items-end">
                    <Badge
                        className={cn(
                            "text-xs font-semibold bg-transparent",
                            ClientTypesLabels[client.type as keyof typeof ClientTypesLabels]?.className
                        )}
                    >
                        {client.type === "Natural" ? (
                            <User className="w-3 h-3 mr-1" />
                        ) : (
                            <Building2 className="w-3 h-3 mr-1" />
                        )}
                        {ClientTypesLabels[client.type as keyof typeof ClientTypesLabels]?.label}
                    </Badge>
                    {client.email && (
                        <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                            {client.email}
                        </span>
                    )}
                </div>
            </div>
        ),
    })), [allClients]);

    const selectedClient = clientOptions.find((client) => client.value === value);

    const handleSelect = ({ value, entity }: Option<Client>) => {
        if (!entity) {
            toast.error("No se pudo seleccionar el cliente. Por favor, inténtalo de nuevo.");
            return;
        }
        onSelect(value, entity);
    };

    return (
        <AutoComplete<Client>
            queryState={query}
            options={clientOptions}
            value={selectedClient}
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
