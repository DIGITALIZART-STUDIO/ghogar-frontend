"use client";

import type { Row } from "@tanstack/react-table";
import { RefreshCcwDot } from "lucide-react";
import { toast } from "sonner";

import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { useActivateClients } from "../../_hooks/useClients";
import type { Client } from "../../_types/client";

interface ReactivateClientsDialogProps {
  clients: Array<Row<Client>["original"]>;
  showTrigger?: boolean;
  onSuccess?: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReactivateClientsDialog({
  clients,
  showTrigger = true,
  onSuccess,
  open,
  onOpenChange,
}: ReactivateClientsDialogProps) {
  const activateClients = useActivateClients();

  const handleReactivateClients = async () => {
    const clientIds = clients.map((client) => client.id).filter((id): id is string => id !== undefined);

    if (clientIds.length === 0) {
      toast.error("No hay clientes válidos para reactivar");
      return;
    }

    const promise = activateClients.mutateAsync({
      body: clientIds,
    });

    toast.promise(promise, {
      loading: `Reactivando ${clients.length === 1 ? "cliente" : "clientes"}...`,
      success: `${clients.length} ${clients.length === 1 ? "cliente reactivado" : "clientes reactivados"} correctamente`,
      error: (e) => `Error al reactivar: ${e.message ?? e}`,
    });

    await promise;
  };

  return (
    <ConfirmationDialog
      title="¿Estás absolutamente seguro?"
      description={
        <>
          Esta acción reactivará a<span className="font-medium"> {clients.length}</span>
          {clients.length === 1 ? " cliente" : " clientes"}
        </>
      }
      confirmText="Reactivar"
      cancelText="Cancelar"
      variant="default"
      trigger={
        <Button variant="outline" size="sm">
          <RefreshCcwDot className="mr-2 size-4" aria-hidden="true" />
          Reactivar ({clients.length})
        </Button>
      }
      showTrigger={showTrigger}
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={handleReactivateClients}
      onSuccess={onSuccess}
    />
  );
}
