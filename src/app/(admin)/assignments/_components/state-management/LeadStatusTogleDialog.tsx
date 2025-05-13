"use client";

import { useState, useTransition } from "react";
import { CheckCircle, RefreshCw } from "lucide-react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { toastWrapper } from "@/types/toasts";
import { ToggleLeadStatus } from "../../../leads/_actions/LeadActions";
import { LeadStatus } from "../../../leads/_types/lead";
import { getStatusDetails } from "../../../leads/_utils/leads.filter.utils";

interface LeadStatusToggleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: LeadStatus;
  leadId: string;
  leadName: string;
}

export function LeadStatusToggleDialog({
    isOpen,
    onClose,
    currentStatus,
    leadName,
    leadId,
}: LeadStatusToggleDialogProps) {
    const isDesktop = useMediaQuery("(min-width: 640px)");
    const [isPending, startTransition] = useTransition();
    const [showSuccess, setShowSuccess] = useState(false);

    // Determinar el nuevo estado basado en el estado actual
    const newStatus = currentStatus === LeadStatus.Registered ? LeadStatus.Attended : LeadStatus.Registered;

    const handleConfirm = () => {
    // Usar startTransition para manejar el estado de carga
        startTransition(async() => {
            // Llamar a la acción del servidor ToggleLeadStatus
            const [, error] = await toastWrapper(ToggleLeadStatus(leadId), {
                loading: "Cambiando estado del lead...",
                success: `Lead marcado como ${newStatus === LeadStatus.Attended ? "atendido" : "registrado"} exitosamente`,
                error: (e) => `Error al cambiar estado: ${e.message}`,
            });

            // Si no hay errores, mostrar mensaje de éxito
            if (!error) {
                setShowSuccess(true);

                // Cerrar automáticamente después de mostrar éxito
                setTimeout(() => {
                    setShowSuccess(false);
                    onClose();
                }, 1500);
            }
        });
    };

    const currentStatusDetails = getStatusDetails(currentStatus);
    const newStatusDetails = getStatusDetails(newStatus);

    // Contenido común para ambos componentes
    const content = (
        <div className="space-y-6 font-montserrat">
            {showSuccess ? (
                <div className="flex flex-col items-center justify-center py-6 transition-opacity duration-300 ease-in-out">
                    <div className="bg-chart-1/20 p-4 rounded-full mb-4">
                        <CheckCircle className="h-12 w-12 text-chart-1" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">
                        ¡Estado actualizado!
                    </h3>
                    <p className="text-muted-foreground text-center">
                        El lead
                        {" "}
                        {leadName}
                        {" "}
                        ha sido marcado como
                        <span className="font-medium">
                            {newStatusDetails.label}
                        </span>
                        .
                    </p>
                </div>
            ) : (
                <>
                    <div className="flex flex-col items-center mb-6">
                        <div className="mb-4 flex items-center">
                            <Badge className={currentStatusDetails.color}>
                                <span className="flex items-center">
                                    {currentStatusDetails.icon}
                                    <span className="ml-1">
                                        {currentStatusDetails.label}
                                    </span>
                                </span>
                            </Badge>
                            <span className="mx-3 text-muted-foreground">
                                →
                            </span>
                            <Badge className={newStatusDetails.color}>
                                <span className="flex items-center">
                                    {newStatusDetails.icon}
                                    <span className="ml-1">
                                        {newStatusDetails.label}
                                    </span>
                                </span>
                            </Badge>
                        </div>
                        <h3 className="text-lg font-medium mb-1">
                            {leadName}
                        </h3>
                        <p className="text-sm text-muted-foreground text-center">
                            ¿Estás seguro de que deseas cambiar el estado de este lead?
                        </p>
                    </div>

                    <div className="bg-card rounded-lg p-5 border border-border">
                        <div className="flex items-center mb-4">
                            <div
                                className={cn("w-10 h-10 rounded-full flex items-center justify-center mr-3", newStatusDetails.color)}
                            >
                                {newStatusDetails.icon}
                            </div>
                            <div>
                                <h4 className="font-medium">
                                    Marcar como
                                    {newStatusDetails.label}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    {newStatusDetails.description}
                                </p>
                            </div>
                        </div>

                        <div className="bg-muted/50 rounded-lg p-3 text-sm">
                            {currentStatus === LeadStatus.Registered ? (
                                <p>
                                    Al marcar este lead como
                                    {" "}
                                    <strong>
                                        Atendido
                                    </strong>
                                    , estás confirmando que se ha contactado al cliente
                                    y ha registrado la interacción.
                                </p>
                            ) : (
                                <p>
                                    Al marcar este lead como
                                    {" "}
                                    <strong>
                                        Registrado
                                    </strong>
                                    , estás indicando que el lead requiere atención
                                    nuevamente.
                                </p>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );

    // Renderizar AlertDialog o Drawer según el tamaño de pantalla
    if (isDesktop) {
        return (
            <AlertDialog open={isOpen} onOpenChange={!isPending ? onClose : undefined}>
                <AlertDialogContent className="sm:max-w-[500px]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center font-montserrat">
                            <RefreshCw className="h-5 w-5 mr-2" />
                            Cambiar Estado del Lead
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción cambiará el estado del lead en el sistema.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    {content}

                    {!showSuccess && (
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isPending}>
                                Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleConfirm();
                                }}
                                disabled={isPending}
                                className={cn(
                                    "min-w-[120px]",
                                    currentStatus === LeadStatus.Registered
                                        ? "bg-chart-1 hover:bg-chart-1/90"
                                        : "bg-primary hover:bg-primary/90",
                                )}
                            >
                                {isPending ? (
                                    <>
                                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                                        Actualizando...
                                    </>
                                ) : (
                                    <>
                                        {newStatusDetails.icon && <span className="mr-2">
                                            {newStatusDetails.icon}
                                        </span>}
                                        Marcar como
                                        {" "}
                                        {newStatusDetails.label}
                                    </>
                                )}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    )}
                </AlertDialogContent>
            </AlertDialog>
        );
    }

    return (
        <Drawer open={isOpen} onOpenChange={!isPending ? onClose : undefined}>
            <DrawerContent>
                <DrawerHeader className="border-b border-border">
                    <DrawerTitle className="flex items-center font-montserrat">
                        <RefreshCw className="h-5 w-5 mr-2" />
                        Cambiar Estado del Lead
                    </DrawerTitle>
                    <p className="text-sm text-muted-foreground">
                        Esta acción cambiará el estado del lead en el sistema.
                    </p>
                </DrawerHeader>

                <div className="p-4">
                    {content}
                </div>

                {!showSuccess && (
                    <DrawerFooter>
                        <Button
                            onClick={handleConfirm}
                            disabled={isPending}
                            className={cn(
                                "w-full",
                                currentStatus === LeadStatus.Registered
                                    ? "bg-chart-1 hover:bg-chart-1/90"
                                    : "bg-primary hover:bg-primary/90",
                            )}
                        >
                            {isPending ? (
                                <>
                                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                                    Actualizando...
                                </>
                            ) : (
                                <>
                                    {newStatusDetails.icon && <span className="mr-2">
                                        {newStatusDetails.icon}
                                    </span>}
                                    Marcar como
                                    {" "}
                                    {newStatusDetails.label}
                                </>
                            )}
                        </Button>
                        <Button variant="outline" onClick={onClose} disabled={isPending} className="w-full">
                            Cancelar
                        </Button>
                    </DrawerFooter>
                )}
            </DrawerContent>
        </Drawer>
    );
}
