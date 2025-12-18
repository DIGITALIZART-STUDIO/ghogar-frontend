"use client";

import { useState, useTransition } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/use-media-query";
import { toastWrapper } from "@/types/toasts";
import ReservationStatusChangeContent from "./ReservationStatusChangeContent";
import { ReservationStatus } from "../../reservations/_types/reservation";
import { ChangeReservationStatus } from "../../reservations/_actions/ReservationActions";

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
    const [isPending, startTransition] = useTransition();
    const [showSuccess, setShowSuccess] = useState(false);

    const handleStatusChange = (status: ReservationStatus) => {
        setSelectedStatus(status);
    };

    const handleConfirm = () => {
        if (!selectedStatus || selectedStatus === currentStatus) {
            return;
        }

        startTransition(async() => {
            // Preparar el DTO para la acción de cambio de estado
            const statusDto = {
                status: selectedStatus,
            };

            const [, error] = await toastWrapper(ChangeReservationStatus(reservationId, statusDto), {
                loading: "Actualizando estado de reserva...",
                success: "Estado actualizado exitosamente",
                error: (e) => `Error al cambiar el estado: ${e.message || "Error desconocido"}`,
            });

            if (!error) {
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
            }
        });
    };

    const dialogContent = (
        <ReservationStatusChangeContent
            showSuccess={showSuccess}
            reservationId={reservationId}
            currentStatus={currentStatus}
            selectedStatus={selectedStatus}
            isPending={isPending}
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
