"use client";

import { useState, useTransition } from "react";
import { RefreshCw } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/use-media-query";
import { toastWrapper } from "@/types/toasts";
import { ChangeQuotationStatus } from "../../_actions/QuotationActions";
import { QuotationStatus } from "../../_types/quotation";
import QuotationStatusChangeContent from "./QuotationStatusChangeContent";

interface QuotationStatusChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: QuotationStatus;
  quotationCode: string;
  quotationId: string;
}

export function QuotationStatusChangeDialog({
    isOpen,
    onClose,
    currentStatus,
    quotationCode,
    quotationId,
}: QuotationStatusChangeDialogProps) {
    const isDesktop = useMediaQuery("(min-width: 640px)");
    const [selectedStatus, setSelectedStatus] = useState<QuotationStatus | null>(null);
    const [isPending, startTransition] = useTransition();
    const [showSuccess, setShowSuccess] = useState(false);

    const handleStatusChange = (status: QuotationStatus) => {
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

            const [, error] = await toastWrapper(ChangeQuotationStatus(quotationId, statusDto), {
                loading: "Actualizando estado de cotización...",
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

    // Renderizar diálogo o drawer según el tamaño de pantalla
    if (isDesktop) {
        return (
            <Dialog open={isOpen} onOpenChange={() => !isPending && !showSuccess && onClose()}>
                <DialogContent className="sm:max-w-[500px] px-0">
                    <DialogHeader className="px-4">
                        <DialogTitle className="flex items-center font-montserrat">
                            <RefreshCw className="h-5 w-5 mr-2" />
                            Cambiar Estado de Cotización
                        </DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-full max-h-[70vh] px-0">
                        <div className="px-6">
                            <QuotationStatusChangeContent
                                showSuccess={showSuccess}
                                quotationCode={quotationCode}
                                currentStatus={currentStatus}
                                selectedStatus={selectedStatus}
                                isPending={isPending}
                                onClose={onClose}
                                handleStatusChange={handleStatusChange}
                                handleConfirm={handleConfirm}
                            />
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={isOpen} onOpenChange={() => !isPending && !showSuccess && onClose()}>
            <DrawerContent className="h-[55vh]">
                <DrawerHeader className="border-b border-border">
                    <DrawerTitle className="flex items-center font-montserrat">
                        <RefreshCw className="h-5 w-5 mr-2" />
                        Cambiar Estado de Cotización
                    </DrawerTitle>
                </DrawerHeader>
                <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full px-0">
                        <div className="p-4">
                            <QuotationStatusChangeContent
                                showSuccess={showSuccess}
                                quotationCode={quotationCode}
                                currentStatus={currentStatus}
                                selectedStatus={selectedStatus}
                                isPending={isPending}
                                onClose={onClose}
                                handleStatusChange={handleStatusChange}
                                handleConfirm={handleConfirm}
                            />
                        </div>
                    </ScrollArea>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
