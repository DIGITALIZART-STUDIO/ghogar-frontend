"use client";

import { useEffect, useState } from "react";
import { Trash } from "lucide-react";
import { toast } from "sonner";

import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRemovePaymentFromHistory } from "../../_hooks/usePaymentHistory";
import { PaymentHistoryDto } from "../../../reservations/_types/reservation";

interface DeletePaymentDialogProps {
  payment: PaymentHistoryDto;
  reservationId: string;
  showTrigger?: boolean;
  onSuccess?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DeletePaymentDialog({
  payment,
  reservationId,
  showTrigger = true,
  onSuccess,
  open,
  onOpenChange,
}: DeletePaymentDialogProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const removePayment = useRemovePaymentFromHistory();

  const handleDeletePayment = async () => {
    if (!payment.id) {
      toast.error("ID de pago no válido");
      return;
    }

    const promise = removePayment.mutateAsync({
      params: {
        path: {
          id: reservationId,
          paymentId: payment.id,
        },
      },
    });

    toast.promise(promise, {
      loading: "Eliminando pago...",
      success: () => {
        setIsSuccess(true);
        return "Pago eliminado correctamente";
      },
      error: (e) => `Error al eliminar pago: ${e.message ?? e}`,
    });

    await promise;
  };

  // Manejar el éxito de la operación
  useEffect(() => {
    if (isSuccess && onSuccess) {
      onSuccess();
      setIsSuccess(false);
    }
  }, [isSuccess, onSuccess]);

  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open ?? internalOpen;
  const handleOpenChange = onOpenChange ?? setInternalOpen;

  if (!showTrigger) {
    return (
      <>
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            handleOpenChange(true);
          }}
          className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
        >
          <Trash className="h-4 w-4 mr-2" />
          Eliminar
        </DropdownMenuItem>
        <ConfirmationDialog
          title="¿Estás seguro de eliminar este pago?"
          description={
            <>
              Esta acción eliminará el pago de{" "}
              <span className="font-medium">
                {payment.amount?.toLocaleString("es-PE", {
                  style: "currency",
                  currency: "PEN",
                })}
              </span>{" "}
              realizado el{" "}
              <span className="font-medium">
                {payment.date ? new Date(payment.date).toLocaleDateString("es-PE") : "fecha desconocida"}
              </span>
              . Esta acción no se puede deshacer.
            </>
          }
          confirmText="Eliminar pago"
          cancelText="Cancelar"
          variant="destructive"
          showTrigger={false}
          onConfirm={handleDeletePayment}
          onSuccess={onSuccess}
          open={isOpen}
          onOpenChange={handleOpenChange}
        />
      </>
    );
  }

  return (
    <ConfirmationDialog
      title="¿Estás seguro de eliminar este pago?"
      description={
        <>
          Esta acción eliminará el pago de{" "}
          <span className="font-medium">
            {payment.amount?.toLocaleString("es-PE", {
              style: "currency",
              currency: "PEN",
            })}
          </span>{" "}
          realizado el{" "}
          <span className="font-medium">
            {payment.date ? new Date(payment.date).toLocaleDateString("es-PE") : "fecha desconocida"}
          </span>
          . Esta acción no se puede deshacer.
        </>
      }
      confirmText="Eliminar pago"
      cancelText="Cancelar"
      variant="destructive"
      trigger={
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
        >
          <Trash className="h-4 w-4" />
        </Button>
      }
      showTrigger={showTrigger}
      onConfirm={handleDeletePayment}
      onSuccess={onSuccess}
      open={open}
      onOpenChange={onOpenChange}
    />
  );
}
