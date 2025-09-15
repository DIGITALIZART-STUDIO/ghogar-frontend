"use client";

import { useMemo } from "react";
import { toast } from "sonner";
import { Building2 } from "lucide-react";

import { usePaginatedActiveBlocksByProjectWithSearch } from "../../_hooks/useBlocks";
import { AutoComplete, Option } from "@/components/ui/autocomplete";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { components } from "@/types/api";

type Block = components["schemas"]["BlockDTO"];

interface BlockSearchProps {
    projectId: string;
    disabled?: boolean;
    value: string;
    onSelect: (blockId: string, block: Block) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    preselectedId?: string;
}

export function BlockSearch({
    projectId,
    disabled,
    value,
    onSelect,
    placeholder = "Selecciona una manzana...",
    searchPlaceholder = "Buscar por nombre de manzana...",
    emptyMessage = "No se encontraron manzanas",
    preselectedId,
}: BlockSearchProps) {
    const { allBlocks, query, handleScrollEnd, handleSearchChange, search } = usePaginatedActiveBlocksByProjectWithSearch(projectId, 10, preselectedId);

    const blockOptions: Array<Option<Block>> = useMemo(() => allBlocks.map((block) => ({
        value: block.id ?? "",
        label: block.name ?? "Sin nombre",
        entity: block,
        component: (
            <div className="grid grid-cols-2 gap-2 w-full" title={block.name ?? "Sin nombre"}>
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold truncate">
                        Manzana {block.name ?? "Sin nombre"}
                    </span>
                    <div className="text-xs text-muted-foreground flex flex-col gap-1">
                        {block.projectName && (
                            <Badge variant="outline" className="text-xs font-semibold">
                                <Building2 className="w-3 h-3 mr-1" />
                                {block.projectName}
                            </Badge>
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-1 items-end">
                    <Badge
                        variant="outline"
                        className={cn(
                            "text-xs font-semibold",
                            block.isActive ? "text-green-600 border-green-200" : "text-gray-600 border-gray-200"
                        )}
                    >
                        {block.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                    {block.createdAt && (
                        <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                            {new Date(block.createdAt).toLocaleDateString()}
                        </span>
                    )}
                </div>
            </div>
        ),
    })), [allBlocks]);

    const selectedBlock = blockOptions.find((block) => block.value === value);

    const handleSelect = ({ value, entity }: Option<Block>) => {
        if (!entity) {
            toast.error("No se pudo seleccionar la manzana. Por favor, inténtalo de nuevo.");
            return;
        }
        onSelect(value, entity);
    };

    return (
        <AutoComplete<Block>
            queryState={query}
            options={blockOptions}
            value={selectedBlock}
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
