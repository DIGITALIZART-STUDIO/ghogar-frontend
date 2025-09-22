"use client";

import type { Row } from "@tanstack/react-table";
import { RefreshCcwDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useActivateLeads } from "../../_hooks/useLeads";
import type { Lead } from "../../_types/lead";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";

interface ReactivateLeadsDialogProps {
    leads: Array<Row<Lead>["original"]>;
    showTrigger?: boolean;
    onSuccess?: () => void;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ReactivateLeadsDialog({
    leads,
    showTrigger = true,
    onSuccess,
    open,
    onOpenChange,
}: ReactivateLeadsDialogProps) {
    const activateLeads = useActivateLeads();

    const handleReactivateLeads = async () => {
        const leadIds = leads.map((lead) => lead?.id).filter((id): id is string => id !== undefined);

        if (leadIds.length === 0) {
            toast.error("No hay leads válidas para reactivar");
            return;
        }

        const promise = activateLeads.mutateAsync({
            body: leadIds,
        });

        toast.promise(promise, {
            loading: `Reactivando ${leads.length === 1 ? "lead" : "leads"}...`,
            success: `${leads.length} ${leads.length === 1 ? "lead reactivada" : "leads reactivadas"} correctamente`,
            error: (e) => `Error al reactivar: ${e.message ?? e}`,
        });

        promise.then(() => {
            if (onSuccess) {
                onSuccess();
            }
        });
    };

    return (
        <ConfirmationDialog
            title="¿Estás absolutamente seguro?"
            description={
                <>
                    Esta acción reactivará a
                    <span className="font-medium"> {leads.length}</span>
                    {leads.length === 1 ? " lead" : " leads"}
                </>
            }
            confirmText="Reactivar"
            cancelText="Cancelar"
            variant="default"
            trigger={
                <Button variant="outline" size="sm">
                    <RefreshCcwDot className="mr-2 size-4" aria-hidden="true" />
                    Reactivar ({leads.length})
                </Button>
            }
            showTrigger={showTrigger}
            open={open}
            onOpenChange={onOpenChange}
            onConfirm={handleReactivateLeads}
            onSuccess={onSuccess}
        />
    );
}
