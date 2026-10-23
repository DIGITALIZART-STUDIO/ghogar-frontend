"use client";

import { toast } from "sonner";

import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { getApiErrorMessage } from "@/lib/utils";
import { useRescindContract } from "../_hooks/useContracts";
import { ContractDto } from "../_types/contract";

interface RescindContractDialogProps {
  contract: ContractDto;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

export function RescindContractDialog({ contract, open, onOpenChange, onSuccess }: RescindContractDialogProps) {
  const rescind = useRescindContract();

  const handleConfirm = async () => {
    const promise = rescind.mutateAsync(contract.id);
    toast.promise(promise, {
      loading: "Anulando contrato...",
      success: `Contrato ${contract.code} anulado`,
      error: (error) => getApiErrorMessage(error, "No se pudo anular el contrato"),
    });
    await promise;
    onSuccess?.();
  };

  return (
    <ConfirmationDialog
      title="¿Anular este contrato?"
      description={
        <>
          El contrato <span className="font-medium">{contract.code}</span> de{" "}
          <span className="font-medium">{contract.clientName}</span> quedará anulado. El lote se libera para una nueva
          venta y los recibos se conservan como historial. Esta acción no se puede deshacer.
        </>
      }
      confirmText="Anular contrato"
      cancelText="Cancelar"
      variant="destructive"
      showTrigger={false}
      onConfirm={handleConfirm}
      onSuccess={onSuccess}
      open={open}
      onOpenChange={onOpenChange}
    />
  );
}
