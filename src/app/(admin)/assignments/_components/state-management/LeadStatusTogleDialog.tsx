"use client";

import { useState, useTransition } from "react";
import { CheckCircle, RefreshCw } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { getStatusDetails, reasonOptions, statusOptions } from "../../../leads/_utils/leads.filter.utils";
import { LeadCompletionReason, LeadStatus } from "@/app/(admin)/leads/_types/lead";
import { useUpdateLeadStatus } from "@/app/(admin)/leads/_hooks/useLeads";
import { toast } from "sonner";

interface LeadStatusToggleDialogProps {
  isOpen: boolean
  onClose: () => void
  currentStatus: LeadStatus
  leadId: string
  leadName: string
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
    const [selectedStatus, setSelectedStatus] = useState<LeadStatus | "">("");
    const [selectedReason, setSelectedReason] = useState<LeadCompletionReason | "">("");

    const requiresReason = selectedStatus === LeadStatus.Completed || selectedStatus === LeadStatus.Canceled;
    const canSubmit = selectedStatus && (!requiresReason || selectedReason);

    // Usa el hook personalizado
    const updateLeadStatus = useUpdateLeadStatus();

    const handleConfirm = () => {
        if (!canSubmit) {
            return;
        }

        startTransition(async () => {
            const promise = updateLeadStatus.mutateAsync({
                id: leadId,
                dto: {
                    status: selectedStatus as LeadStatus,
                    completionReason: requiresReason ? (selectedReason as LeadCompletionReason) : undefined,
                },
            });

            toast.promise(promise, {
                loading: "Cambiando estado del lead...",
                success: "Lead actualizado exitosamente",
                error: (e) => `Error al cambiar estado: ${e.message ?? e}`,
            });

            const result = await promise;
            if (result) {
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                    setSelectedStatus("");
                    setSelectedReason("");
                    onClose();
                }, 2000);
            }
        });
    };

    const handleCancel = () => {
        setSelectedStatus("");
        setSelectedReason("");
        onClose();
    };

    const currentStatusDetails = getStatusDetails(currentStatus);
    const selectedStatusOption = statusOptions.find((opt) => opt.value === selectedStatus);
    const selectedReasonOption = reasonOptions.find((opt) => opt.value === selectedReason);

    // Contenido común para ambos componentes
    const content = (
        <div className="space-y-6 font-montserrat">
            {showSuccess ? (
                <div className="flex flex-col items-center justify-center py-8">
                    <div className="bg-green-100 p-6 rounded-full mb-6">
                        <CheckCircle className="h-16 w-16 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-center">¡Estado Actualizado!</h3>
                    <p className="text-muted-foreground text-center text-lg">
                        <span className="font-semibold">{leadName}</span> ha sido actualizado correctamente
                    </p>
                    {selectedStatusOption && (
                        <div className="mt-4 flex items-center gap-2">
                            <Badge className={selectedStatusOption.badgeColor}>
                                {selectedStatusOption && (
                                    <selectedStatusOption.icon className="w-4 h-4 mr-1" />
                                )}
                                {selectedStatusOption?.label}
                            </Badge>
                            {selectedReasonOption && (
                                <>
                                    <span className="text-muted-foreground">•</span>
                                    <span className="text-sm text-muted-foreground">{selectedReasonOption.label}</span>
                                </>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <>
                    {/* Header con información del lead */}
                    <div className="text-center pb-4 border-b">
                        <div className="flex items-center justify-center gap-3 mb-3">
                            <Badge className={currentStatusDetails.color}>
                                <span className="flex items-center">
                                    {currentStatusDetails.icon}
                                    <span className="ml-1 text-gray-500">{currentStatusDetails.label}</span>
                                </span>
                            </Badge>
                            {selectedStatusOption && (
                                <>
                                    <div className="w-8 h-px bg-muted-foreground/30" />
                                    <Badge className={selectedStatusOption.badgeColor}>
                                        <selectedStatusOption.icon className="w-4 h-4 mr-1" />
                                        {selectedStatusOption.label}
                                    </Badge>
                                </>
                            )}
                        </div>
                        <h3 className="text-xl font-semibold mb-1">{leadName}</h3>
                        <p className="text-sm text-muted-foreground">Selecciona el nuevo estado para este lead</p>
                    </div>

                    {/* Selección de estado */}
                    <div className="space-y-3">
                        <h4 className="font-semibold text-base">Nuevo Estado</h4>
                        <div className="grid gap-3">
                            {statusOptions.map((option) => {
                                const Icon = option.icon;
                                const isSelected = selectedStatus === option.value;
                                return (
                                    <div
                                        key={option.value}
                                        onClick={() => {
                                            setSelectedStatus(option.value);
                                            setSelectedReason(""); // Reset reason when status changes
                                        }}
                                        className={cn(
                                            "p-4 border-2 rounded-lg cursor-pointer transition-all",
                                            option.color,
                                            isSelected ? "ring-2 ring-primary ring-offset-2" : "",
                                        )}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={cn("p-2 rounded-lg bg-white", option.iconColor)}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h5 className="font-semibold">{option.label}</h5>
                                                    {isSelected && <CheckCircle className="w-4 h-4 text-primary" />}
                                                </div>
                                                <p className="text-sm text-muted-foreground dark:text-white mt-1">{option.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Selección de razón (solo si es necesario) */}
                    {requiresReason && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-base">
                                    Razón {selectedStatus === LeadStatus.Completed ? "de Completado" : "de Cancelación"}
                                </h4>
                                <Badge variant="secondary" className="text-xs">
                                    Obligatorio
                                </Badge>
                            </div>
                            <div className="grid gap-3">
                                {reasonOptions.map((option) => {
                                    const Icon = option.icon;
                                    const isSelected = selectedReason === option.value;
                                    return (
                                        <div
                                            key={option.value}
                                            onClick={() => setSelectedReason(option.value)}
                                            className={cn(
                                                "p-4 border-2 rounded-lg cursor-pointer transition-all",
                                                option.color,
                                                isSelected ? "ring-2 ring-primary ring-offset-2" : "",
                                            )}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={cn("p-2 rounded-lg bg-white", option.iconColor)}>
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <h5 className="font-semibold">{option.label}</h5>
                                                        {isSelected && <CheckCircle className="w-4 h-4 text-primary" />}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mt-1 dark:text-white">{option.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Resumen de selección */}
                    {selectedStatus && (
                        <div className="bg-muted/30 rounded-lg p-4 border">
                            <h5 className="font-semibold mb-2 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-primary" />
                                Resumen del Cambio
                            </h5>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Estado actual:</span>
                                    <span className="font-medium">{currentStatusDetails.label}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Nuevo estado:</span>
                                    <span className="font-medium">{selectedStatusOption?.label}</span>
                                </div>
                                {requiresReason && selectedReason && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Razón:</span>
                                        <span className="font-medium">{selectedReasonOption?.label}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );

    // Renderizar Dialog o Drawer según el tamaño de pantalla
    if (isDesktop) {
        return (
            <Dialog open={isOpen} onOpenChange={!isPending ? onClose : undefined}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center font-montserrat text-xl">
                            <RefreshCw className="h-6 w-6 mr-3" />
                            Cambiar Estado del Lead
                        </DialogTitle>
                        <DialogDescription className="text-base">
                            Selecciona el nuevo estado. Los estados Completado y Cancelado requieren una razón.
                        </DialogDescription>
                    </DialogHeader>

                    {content}

                    {!showSuccess && (
                        <DialogFooter className="gap-3 sm:gap-3 pt-6">
                            <Button variant="outline" onClick={handleCancel} disabled={isPending} className="px-6 bg-transparent">
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleConfirm}
                                disabled={!canSubmit || isPending}
                                className={cn(
                                    "px-6 min-w-[140px]",
                                    selectedStatus === LeadStatus.Completed
                                        ? "bg-green-600 hover:bg-green-700 text-white"
                                        : selectedStatus === LeadStatus.Canceled
                                            ? "bg-red-600 hover:bg-red-700 text-white"
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
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Actualizar Estado
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    )}
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={isOpen} onOpenChange={!isPending ? onClose : undefined}>
            <DrawerContent className="max-h-[95vh]">
                <DrawerHeader className="border-b border-border pb-4">
                    <DrawerTitle className="flex items-center font-montserrat text-xl">
                        <RefreshCw className="h-6 w-6 mr-3" />
                        Cambiar Estado del Lead
                    </DrawerTitle>
                    <p className="text-sm text-muted-foreground">
                        Selecciona el nuevo estado. Los estados Completado y Cancelado requieren una razón.
                    </p>
                </DrawerHeader>

                <div className="p-4 overflow-y-auto flex-1">{content}</div>

                {!showSuccess && (
                    <DrawerFooter className="border-t pt-4">
                        <Button
                            onClick={handleConfirm}
                            disabled={!canSubmit || isPending}
                            className={cn(
                                "w-full h-12 text-base",
                                selectedStatus === LeadStatus.Completed
                                    ? "bg-green-600 hover:bg-green-700"
                                    : selectedStatus === LeadStatus.Canceled
                                        ? "bg-red-600 hover:bg-red-700"
                                        : "bg-primary hover:bg-primary/90",
                            )}
                        >
                            {isPending ? (
                                <>
                                    <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                                    Actualizando...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="h-5 w-5 mr-2" />
                                    Actualizar Estado
                                </>
                            )}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isPending}
                            className="w-full h-12 text-base bg-transparent"
                        >
                            Cancelar
                        </Button>
                    </DrawerFooter>
                )}
            </DrawerContent>
        </Drawer>
    );
}
