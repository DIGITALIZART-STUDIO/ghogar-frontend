"use client";

import React from "react";
import { FileText } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/use-media-query";
import ReservationViewContent from "./ReservationViewContent";
import { ReservationDto } from "../../reservations/_types/reservation";
import { useReservationById } from "../../reservations/_hooks/useReservations";

interface ReservationViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: ReservationDto;
}

export function ReservationViewDialog({ open, onOpenChange, reservation }: ReservationViewDialogProps) {
    const isDesktop = useMediaQuery("(min-width: 900px)");
    const { data, isLoading } = useReservationById(reservation?.id ?? "", open);

    // Calcular días restantes hasta vencimiento
    const calculateDaysLeft = () => {
        if (!data?.expiresAt) {
            return 0;
        }
        const expiryDate = new Date(data.expiresAt);
        const today = new Date();
        const diffTime = expiryDate.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const daysLeft = calculateDaysLeft();

    // Renderizar diálogo o drawer según el tamaño de pantalla
    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[900px] px-0">
                    <DialogHeader className="px-4 flex flex-row items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        <div>
                            <DialogTitle className="flex items-center font-montserrat">
                                Detalles de Reserva
                            </DialogTitle>
                            <DialogDescription className="text-sm text-muted-foreground">
                                Detalles de la reserva seleccionada
                            </DialogDescription>
                        </div>
                    </DialogHeader>
                    <ScrollArea className="h-full max-h-[70vh] px-0">
                        <div className="px-6">
                            <ReservationViewContent
                                data={data}
                                isLoading={isLoading}
                                daysLeft={daysLeft}
                            />
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="h-[80vh]">
                <DrawerHeader className="border-b border-border flex flex-row items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    <div>
                        <DrawerTitle className="flex items-center font-montserrat">
                            Detalles de Reserva
                        </DrawerTitle>
                        <DrawerDescription className="text-sm text-muted-foreground">
                            Detalles de la reserva seleccionada
                        </DrawerDescription>
                    </div>
                </DrawerHeader>
                <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full px-0">
                        <div className="p-4">
                            <ReservationViewContent
                                data={data}
                                isLoading={isLoading}
                                daysLeft={daysLeft}
                            />
                        </div>
                    </ScrollArea>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
