"use client";

import type { Row } from "@tanstack/react-table";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { toastWrapper } from "@/types/toasts";
import { DeleteLeads } from "../../_actions/LeadActions";
import type { Lead } from "../../_types/lead";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";

interface DeleteLeadsDialogProps {
  leads: Array<Row<Lead>["original"]>
  showTrigger?: boolean
  onSuccess?: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function DeleteLeadsDialog({
    leads,
    showTrigger = true,
    onSuccess,
    open,
    onOpenChange,
}: DeleteLeadsDialogProps) {
    const handleDeleteLeads = async () => {
    // Extraer los IDs de los leads y filtrar los undefined
        const leadIds = leads.map((lead) => lead?.id).filter((id): id is string => id !== undefined);

        // Si no hay IDs válidos, mostrar error y salir
        if (leadIds.length === 0) {
            toast.error("No hay leads válidas para eliminar");
            return;
        }

        const [, error] = await toastWrapper(DeleteLeads(leadIds), {
            loading: `Eliminando ${leads.length === 1 ? "lead" : "leads"}...`,
            success: `${leads.length} ${leads.length === 1 ? "lead eliminada" : "leads eliminadas"} correctamente`,
            error: (e) => `Error al eliminar: ${e.message}`,
        });

        if (error) {
            throw error;
        }
    };

    return (
        <ConfirmationDialog
            title="¿Estás absolutamente seguro?"
            description={
                <>
                    Esta acción eliminará a<span className="font-medium"> {leads.length}</span>
                    {leads.length === 1 ? " lead" : " leads"}
                </>
            }
            confirmText="Eliminar"
            cancelText="Cancelar"
            variant="destructive"
            trigger={
                <Button variant="outline" size="sm">
                    <Trash className="mr-2 size-4" aria-hidden="true" />
                    Eliminar ({leads.length})
                </Button>
            }
            showTrigger={showTrigger}
            onConfirm={handleDeleteLeads}
            onSuccess={onSuccess}
            open={open}
            onOpenChange={onOpenChange}
        />
    );
}
