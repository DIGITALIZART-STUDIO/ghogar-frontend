"use client";

import * as React from "react";
import { Check, Loader2, PlusCircle } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export type ServerFacetedOptionInfinite = {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
};

interface ServerSingleFacetedFilterInfiniteProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  options: Array<ServerFacetedOptionInfinite>;
  value?: string;
  onChange: (value: string | undefined) => void;
  onSearch?: (search: string) => void;
  onLoadMore?: () => void;
  hasNextPage?: boolean;
  isLoadingMore?: boolean;
  isSearching?: boolean;
  searchPlaceholder?: string;
}

export function ServerSingleFacetedFilterInfinite({
  title,
  options,
  value,
  onChange,
  onSearch,
  onLoadMore,
  hasNextPage = false,
  isLoadingMore = false,
  isSearching = false,
  searchPlaceholder,
  icon: Icon,
}: ServerSingleFacetedFilterInfiniteProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  // Manejo de búsqueda con debounce
  const debouncedSearch = useDebouncedCallback((value: string) => {
    if (onSearch) {
      onSearch(value);
    }
  }, 300);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    debouncedSearch(value);
  };

  // Manejo de scroll infinito
  React.useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement || !onLoadMore || !hasNextPage || isLoadingMore) {
      return;
    }

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      // Cargar más cuando esté cerca del final (80% del scroll)
      if (scrollTop + clientHeight >= scrollHeight * 0.8) {
        onLoadMore();
      }
    };

    scrollElement.addEventListener("scroll", handleScroll);
    return () => scrollElement.removeEventListener("scroll", handleScroll);
  }, [onLoadMore, hasNextPage, isLoadingMore]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="secondary" size="sm" className={cn("h-8 border-secondary", value && "border-emerald-500")}>
          {Icon ? <Icon className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
          {title}
          {selected && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                1
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                  {selected.label}
                </Badge>
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command shouldFilter={false}>
          {onSearch && (
            <CommandInput
              placeholder={searchPlaceholder ?? title}
              value={searchTerm}
              onValueChange={handleSearchChange}
            />
          )}
          <CommandList ref={scrollRef} className="max-h-[300px]">
            {isSearching ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => {
                    const isSelected = option.value === value;
                    return (
                      <CommandItem
                        key={option.value}
                        onSelect={() => {
                          onChange(isSelected ? undefined : option.value);
                        }}
                      >
                        <div
                          className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            isSelected ? "" : "opacity-50 [&_svg]:invisible"
                          )}
                        >
                          <Check className={cn("h-4 w-4")} />
                        </div>
                        {option.icon && <option.icon className="mr-2 h-4 w-4" />}
                        <span>{option.label}</span>
                      </CommandItem>
                    );
                  })}
                  {isLoadingMore && (
                    <div className="flex items-center justify-center py-2">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      <span className="ml-2 text-xs text-muted-foreground">Cargando más...</span>
                    </div>
                  )}
                </CommandGroup>
              </>
            )}
            {value && !isSearching && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      onChange(undefined);
                      setOpen(false);
                    }}
                    className="justify-center text-center"
                  >
                    Limpiar filtros
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default ServerSingleFacetedFilterInfinite;
