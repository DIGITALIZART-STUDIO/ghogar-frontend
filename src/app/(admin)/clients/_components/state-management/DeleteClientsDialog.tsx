"use client";

import type { Row } from "@tanstack/react-table";
import { Trash } from "lucide-react";
import { toast } from "sonner";

import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { useDeleteClients } from "../../_hooks/useClients";
import type { Client } from "../../_types/client";

interface DeleteClientsDialogProps {
  clients: Array<Row<Client>["original"]>;
  showTrigger?: boolean;
  onSuccess?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DeleteClientsDialog({
  clients,
  showTrigger = true,
  onSuccess,
  open,
  onOpenChange,
}: DeleteClientsDialogProps) {
  const deleteClients = useDeleteClients();

  const handleDeleteClients = async () => {
    const clientIds = clients.map((client) => client.id).filter((id): id is string => id !== undefined);

    if (clientIds.length === 0) {
      toast.error("No hay clientes válidos para eliminar");
      return;
    }

    const promise = deleteClients.mutateAsync({
      body: clientIds,
    });

    toast.promise(promise, {
      loading: `Eliminando ${clients.length === 1 ? "cliente" : "clientes"}...`,
      success: `${clients.length} ${clients.length === 1 ? "cliente eliminado" : "clientes eliminados"} correctamente`,
      error: (e) => `Error al eliminar: ${e.message ?? e}`,
    });

    await promise;
  };

  return (
    <ConfirmationDialog
      title="¿Estás absolutamente seguro?"
      description={
        <>
          Esta acción eliminará a<span className="font-medium"> {clients.length}</span>
          {clients.length === 1 ? " cliente" : " clientes"}
        </>
      }
      confirmText="Eliminar"
      cancelText="Cancelar"
      variant="destructive"
      trigger={
        <Button variant="outline" size="sm">
          <Trash className="mr-2 size-4" aria-hidden="true" />
          Eliminar ({clients.length})
        </Button>
      }
      showTrigger={showTrigger}
      onConfirm={handleDeleteClients}
      onSuccess={onSuccess}
      open={open}
      onOpenChange={onOpenChange}
    />
  );
}
