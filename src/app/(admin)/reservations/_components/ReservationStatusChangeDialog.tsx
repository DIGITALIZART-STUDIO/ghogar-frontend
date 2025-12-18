"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ResponsiveDialog } from "@/components/common/ResponsiveDialog";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useChangeReservationStatus } from "../_hooks/useReservations";
import { ReservationDto, ReservationStatus } from "../_types/reservation";
import {
  reservationStatusChangeSchema,
  type ReservationStatusChangeSchema,
} from "../create/_schemas/createReservationSchema";
import ReservationStatusChangeContent from "./ReservationStatusChangeContent";

interface ReservationStatusChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: ReservationStatus;
  reservationId: string;
  reservationData?: ReservationDto;
}

export function ReservationStatusChangeDialog({
  isOpen,
  onClose,
  currentStatus,
  reservationId,
  reservationData,
}: ReservationStatusChangeDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const [showSuccess, setShowSuccess] = useState(false);
  const changeStatus = useChangeReservationStatus();

  const form = useForm<ReservationStatusChangeSchema>({
    resolver: zodResolver(reservationStatusChangeSchema),
    defaultValues: {
      status: undefined,
      isFullPayment: false,
      paymentAmount: 0,
      paymentDate: new Date().toISOString(),
      paymentMethod: undefined,
      bankName: "",
      paymentReference: "",
      paymentNotes: "",
    },
  });

  const handleSubmit = async (data: ReservationStatusChangeSchema) => {
    if (data.status === currentStatus) {
      return;
    }

    // Si es pago completo, establecer paymentAmount al totalAmountRequired
    if (data.isFullPayment && reservationData?.totalAmountRequired) {
      data.paymentAmount = reservationData.totalAmountRequired;
    }

    try {
      await toast.promise(
        changeStatus.mutateAsync({
          params: {
            path: { id: reservationId },
          },
          body: data,
        }),
        {
          loading: "Actualizando estado de reserva...",
          success: "Estado actualizado exitosamente",
          error: (error) => `Error al cambiar el estado: ${error.message ?? "Error desconocido"}`,
        }
      );

      setShowSuccess(true);
      // Cerrar el diálogo después de 2 segundos
      setTimeout(() => {
        onClose();
        // Resetear estados después del cierre
        setTimeout(() => {
          form.reset();
          setShowSuccess(false);
        }, 300);
      }, 2000);
    } catch (error) {
      console.error("Error changing reservation status:", error);
    }
  };

  return (
    <ResponsiveDialog
      open={isOpen}
      onOpenChange={onClose}
      isDesktop={isDesktop}
      title="Actualizar Estado"
      description="Seleccione el nuevo estado para esta reserva"
      dialogContentClassName="sm:max-w-2xl px-0"
      showTrigger={false}
    >
      <ReservationStatusChangeContent
        showSuccess={showSuccess}
        currentStatus={currentStatus}
        form={form}
        isPending={changeStatus.isPending}
        onClose={onClose}
        onSubmit={handleSubmit}
        reservationData={reservationData}
      />
    </ResponsiveDialog>
  );
}
