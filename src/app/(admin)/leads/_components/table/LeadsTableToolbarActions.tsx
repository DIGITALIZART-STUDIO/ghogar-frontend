"use client";

import { type Table } from "@tanstack/react-table";

import { Lead } from "../../_types/lead";
import { CreateLeadsDialog } from "../create/CreateLeadsDialog";
import { ImportLeadsDialog } from "../imports/ImportLeadsDialog";
import { DeleteLeadsDialog } from "../state-management/DeleteLeadsDialog";
import { ReactivateLeadsDialog } from "../state-management/ReactivateLeadsDialog";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useState } from "react";
import { CheckAndUpdateExpiredLeads } from "../../_actions/LeadActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface LeadsTableToolbarActionsProps {
  table?: Table<Lead>;
}

export function LeadsTableToolbarActions({ table }: LeadsTableToolbarActionsProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleExpireLeads = async () => {
        setLoading(true);
        const [result, error] = await CheckAndUpdateExpiredLeads(); // <-- Cambia aquí
        setLoading(false);

        if (!error && result) {
            toast.success(`Leads expirados: ${result.expiredLeadsCount}`);
            router.refresh();
        } else {
            toast.error("Error al forzar expiración de leads");
        }
    };

    return (
        <div className="flex flex-wrap items-center justify-end gap-2">
            {table && table.getFilteredSelectedRowModel().rows.length > 0 ? (
                <>
                    <DeleteLeadsDialog
                        leads={table.getFilteredSelectedRowModel().rows.map((row) => row.original)}
                        onSuccess={() => table.toggleAllRowsSelected(false)}
                    />
                    <ReactivateLeadsDialog
                        leads={table.getFilteredSelectedRowModel().rows.map((row) => row.original)}
                        onSuccess={() => table.toggleAllRowsSelected(false)}
                        open={false}
                        onOpenChange={() => {}}
                    />
                </>
            ) : null}
            {/* Botón para forzar expiración de leads */}
            <Button
                variant="outline"
                size="sm"
                onClick={handleExpireLeads}
                disabled={loading}
                title="Forzar expiración de leads"
            >
                <RotateCcw className="mr-2 h-4 w-4" />
                {loading ? "Expirando..." : "Forzar expiración"}
            </Button>
            <ImportLeadsDialog />
            <CreateLeadsDialog />
        </div>
    );
}
