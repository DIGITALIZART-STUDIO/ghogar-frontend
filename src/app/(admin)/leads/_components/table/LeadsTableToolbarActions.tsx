"use client";

import { type Table } from "@tanstack/react-table";
import { Lead } from "../../_types/lead";
import { CreateLeadsDialog } from "../create/CreateLeadsDialog";
import { ImportLeadsDialog } from "../imports/ImportLeadsDialog";
import { DeleteLeadsDialog } from "../state-management/DeleteLeadsDialog";
import { ReactivateLeadsDialog } from "../state-management/ReactivateLeadsDialog";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCheckAndUpdateExpiredLeads } from "../../_hooks/useLeads";

export interface LeadsTableToolbarActionsProps {
  table?: Table<Lead>;
}

export function LeadsTableToolbarActions({ table }: LeadsTableToolbarActionsProps) {
    const router = useRouter();
    const checkAndUpdateExpiredLeads = useCheckAndUpdateExpiredLeads();

    const handleExpireLeads = async () => {
        const promise = checkAndUpdateExpiredLeads.mutateAsync();

        toast.promise(promise, {
            loading: "Expirando leads...",
            success: (data) => `Leads expirados: ${data?.expiredLeadsCount ?? "?"}`,
            error: (e) => `Error al forzar expiración de leads: ${e.message ?? e}`,
        });

        promise.then(() => {
            router.refresh();
        });
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
                disabled={checkAndUpdateExpiredLeads.isPending}
                title="Forzar expiración de leads"
            >
                <RotateCcw className="mr-2 h-4 w-4" />
                {checkAndUpdateExpiredLeads.isPending ? "Expirando..." : "Forzar expiración"}
            </Button>
            <ImportLeadsDialog />
            <CreateLeadsDialog />
        </div>
    );
}
