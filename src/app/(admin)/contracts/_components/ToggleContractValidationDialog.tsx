"use client";

import { toast } from "sonner";

import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { useToggleContractValidation } from "../_hooks/useContracts";
import { ContractDto, ContractStatus } from "../_types/contract";

interface ToggleContractValidationDialogProps {
  contract: ContractDto;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ToggleContractValidationDialog({
  contract,
  open,
  onOpenChange,
  onSuccess,
}: ToggleContractValidationDialogProps) {
  const toggleStatus = useToggleContractValidation();
  const isValidated = contract.status === ContractStatus.Active;
  const nextStatusText = isValidated ? "pendiente de validación" : "validado";
  const actionText = isValidated ? "marcar como pendiente" : "marcar como validado";

  const handleToggle = async () => {
    const promise = toggleStatus.mutateAsync(contract.id);
    toast.promise(promise, {
      loading: "Cambiando estado de validación...",
      success: `Contrato ${contract.code} ${isValidated ? "queda pendiente" : "validado"}`,
      error: (e) => `Error al cambiar estado: ${e.message ?? e}`,
    });
    await promise;
    onSuccess?.();
  };

  return (
    <ConfirmationDialog
      title={`¿Estás seguro que quieres ${actionText}?`}
      description={
        <>
          Esta acción cambiará el estado de validación del contrato <span className="font-medium">{contract.code}</span>{" "}
          a <span className="font-semibold">{nextStatusText}</span>.
        </>
      }
      confirmText={actionText.charAt(0).toUpperCase() + actionText.slice(1)}
      cancelText="Cancelar"
      variant="default"
      showTrigger={false}
      onConfirm={handleToggle}
      onSuccess={onSuccess}
      open={open}
      onOpenChange={onOpenChange}
    />
  );
}
