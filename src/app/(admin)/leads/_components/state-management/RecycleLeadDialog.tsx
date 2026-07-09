"use client";

import { toast } from "sonner";

import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { useRecycleLead } from "../../_hooks/useLeads";
import type { Lead } from "../../_types/lead";

type RecyclableLead = NonNullable<Lead>;

interface RecycleLeadDialogProps {
  lead: RecyclableLead;
  showTrigger?: boolean;
  onSuccess?: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RecycleLeadDialog({ lead, showTrigger = true, onSuccess, open, onOpenChange }: RecycleLeadDialogProps) {
  const recycleLead = useRecycleLead();

  const handleRecycleLead = async () => {
    if (!lead.id) {
      toast.error("No se pudo identificar el lead");
      return;
    }

    const promise = recycleLead.mutateAsync({
      params: {
        path: {
          id: lead.id,
        },
      },
    });

    toast.promise(promise, {
      loading: "Reciclando lead...",
      success: `Lead ${lead.code} reciclado correctamente`,
      error: (e) => `Error al reciclar lead: ${e.message ?? e}`,
    });

    await promise;

    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <ConfirmationDialog
      title="¿Reciclar este lead?"
      description={
        <>
          El lead <span className="font-medium">{lead.code}</span> pasará a seguimiento, tendrá{" "}
          <span className="font-medium">7 días</span> nuevos de vigencia y se incrementará su contador de reciclajes.
        </>
      }
      confirmText="Reciclar"
      cancelText="Cancelar"
      variant="default"
      showTrigger={showTrigger}
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={handleRecycleLead}
      onSuccess={onSuccess}
    />
  );
}
