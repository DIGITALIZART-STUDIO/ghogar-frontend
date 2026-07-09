import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface LeadsServerSortColumnHeaderProps {
  title: string;
  sortField: string;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
  onOrderChange?: (field: string, direction: "asc" | "desc") => void;
  className?: string;
}

export function LeadsServerSortColumnHeader({
  title,
  sortField,
  orderBy,
  orderDirection,
  onOrderChange,
  className,
}: LeadsServerSortColumnHeaderProps) {
  if (!onOrderChange) {
    return <div className={cn(className)}>{title}</div>;
  }

  const isActive = orderBy === sortField;

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent">
            <span>{title}</span>
            {isActive && orderDirection === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : isActive && orderDirection === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => onOrderChange(sortField, "asc")}>
            <ArrowUp className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onOrderChange(sortField, "desc")}>
            <ArrowDown className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Desc
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
