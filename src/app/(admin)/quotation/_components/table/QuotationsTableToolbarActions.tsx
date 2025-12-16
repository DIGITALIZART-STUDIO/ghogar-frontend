"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { type Table } from "@tanstack/react-table";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SummaryQuotation } from "../../_types/quotation";

export interface QuotationsTableToolbarActionsProps {
  table?: Table<SummaryQuotation>;
}

export function QuotationsTableToolbarActions({ table }: QuotationsTableToolbarActionsProps) {
    const router = useRouter();

    const handleCreateQuotationInterface = useCallback(() => {
        router.push("/quotation/create");
    }, [router]);
    return (
        <div className="flex flex-wrap items-center justify-end gap-2">
            {table && table.getFilteredSelectedRowModel().rows.length > 0 ? null : null}
            <Button variant="outline" size="sm" onClick={handleCreateQuotationInterface}>
                <Plus className="mr-2 size-4" aria-hidden="true" />
                Crear cotización
            </Button>
        </div>
    );
}
