"use client";

import { useState } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/use-media-query";
import { toast } from "sonner";
import ReservationStatusChangeContent from "./ReservationStatusChangeContent";
import { ReservationStatus } from "../../reservations/_types/reservation";
import { useChangeReservationStatus } from "../../reservations/_hooks/useReservations";

interface ReservationStatusChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: ReservationStatus;
  reservationId: string;
}

export function ReservationStatusChangeDialog({
    isOpen,
    onClose,
    currentStatus,
    reservationId,
}: ReservationStatusChangeDialogProps) {
    const isDesktop = useMediaQuery("(min-width: 640px)");
    const [selectedStatus, setSelectedStatus] = useState<ReservationStatus | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const changeStatus = useChangeReservationStatus();

    const handleStatusChange = (status: ReservationStatus) => {
        setSelectedStatus(status);
    };

    const handleConfirm = async () => {
        if (!selectedStatus || selectedStatus === currentStatus) {
            return;
        }

        try {
            // Preparar el DTO para la acción de cambio de estado
            const statusDto = {
                status: selectedStatus,
            };

            await toast.promise(
                changeStatus.mutateAsync({
                    params: {
                        path: { id: reservationId },
                    },
                    body: statusDto,
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
                    setSelectedStatus(null);
                    setShowSuccess(false);
                }, 300);
            }, 2000);
        } catch (error) {
            console.error("Error changing reservation status:", error);
        }
    };

    const dialogContent = (
        <ReservationStatusChangeContent
            showSuccess={showSuccess}
            reservationId={reservationId}
            currentStatus={currentStatus}
            selectedStatus={selectedStatus}
            isPending={changeStatus.isPending}
            onClose={onClose}
            handleStatusChange={handleStatusChange}
            handleConfirm={handleConfirm}
        />
    );

    if (isDesktop) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="sr-only">
                            Cambiar Estado de Reserva
                        </DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="max-h-[calc(100vh-200px)]">
                        {dialogContent}
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={isOpen} onOpenChange={onClose}>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle className="sr-only">
                        Cambiar Estado de Reserva
                    </DrawerTitle>
                </DrawerHeader>
                <ScrollArea className="px-4 pb-4 max-h-[calc(100vh-200px)]">
                    {dialogContent}
                </ScrollArea>
            </DrawerContent>
        </Drawer>
    );
}
