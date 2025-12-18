"use client";

import { toast } from "sonner";

import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { useToggleContractValidationStatus } from "../../../reservations/_hooks/useReservations";
import { ReservationPendingValidationDto } from "../../../reservations/_types/reservation";

interface ToggleValidationStatusDialogProps {
  reservation: ReservationPendingValidationDto;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ToggleValidationStatusDialog({
  reservation,
  open,
  onOpenChange,
  onSuccess,
}: ToggleValidationStatusDialogProps) {
  const toggleStatus = useToggleContractValidationStatus();

  const isValidated = reservation.contractValidationStatus === "Validated";
  const nextStatusText = isValidated ? "pendiente de validación" : "validado";
  const actionText = isValidated ? "marcar como pendiente" : "marcar como validado";

  const handleToggle = async () => {
    const promise = toggleStatus.mutateAsync({
      params: {
        path: { id: reservation.id ?? "" },
      },
    });

    toast.promise(promise, {
      loading: "Cambiando estado de validación...",
      success: "Estado de validación actualizado correctamente",
      error: (e) => `Error al cambiar estado: ${e.message ?? e}`,
    });

    promise.then(() => {
      if (onSuccess) {
        onSuccess();
      }
    });
  };

  return (
    <ConfirmationDialog
      title={`¿Estás seguro que quieres ${actionText}?`}
      description={
        <>
          Esta acción cambiará el estado de validación del contrato para la reserva{" "}
          <span className="font-medium">{reservation.quotationCode ?? reservation.id}</span> a{" "}
          <span className="font-semibold">{nextStatusText}</span>.
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
