import React from "react";
import { ArrowRight, CheckCircle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReservationStatus } from "../_types/reservation";
import { ReservationStatusLabels } from "../_utils/reservations.utils";

interface ReservationStatusChangeContentProps {
  showSuccess: boolean;
  reservationId: string;
  currentStatus: ReservationStatus;
  selectedStatus: ReservationStatus | null;
  isPending: boolean;
  onClose: () => void;
  handleStatusChange: (status: ReservationStatus) => void;
  handleConfirm: () => void;
}

const ReservationStatusChangeContent: React.FC<ReservationStatusChangeContentProps> = ({
    showSuccess,
    reservationId,
    currentStatus,
    selectedStatus,
    isPending,
    onClose,
    handleStatusChange,
    handleConfirm,
}) => {
    if (showSuccess) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4 p-6">
                <CheckCircle className="h-16 w-16 text-green-500" />
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-green-700">
                        ¡Estado Actualizado!
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        El estado de la reserva se ha actualizado correctamente
                    </p>
                </div>
            </div>
        );
    }

    const statusOptions = Object.values(ReservationStatus).filter((status) => status !== currentStatus);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
                <h2 className="text-lg font-semibold">
                    Cambiar Estado de Reserva
                </h2>
                <p className="text-sm text-muted-foreground">
                    ID: {reservationId}
                </p>
            </div>

            {/* Current Status */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Estado Actual</label>
                <div className="flex items-center space-x-2 p-3 border rounded-lg bg-muted/50">
                    {React.createElement(ReservationStatusLabels[currentStatus]?.icon || CheckCircle, {
                        className: "h-4 w-4"
                    })}
                    <span className="text-sm font-medium">
                        {ReservationStatusLabels[currentStatus]?.label}
                    </span>
                </div>
            </div>

            {/* New Status Selection */}
            <div className="space-y-3">
                <label className="text-sm font-medium">Nuevo Estado</label>
                <div className="space-y-2">
                    {statusOptions.map((status) => {
                        const statusConfig = ReservationStatusLabels[status];
                        const isSelected = selectedStatus === status;

                        return (
                            <button
                                key={status}
                                onClick={() => handleStatusChange(status)}
                                className={cn(
                                    "w-full flex items-center space-x-3 p-3 border rounded-lg text-left transition-colors",
                                    isSelected
                                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                        : "border-border hover:border-primary/50 hover:bg-accent"
                                )}
                            >
                                {React.createElement(statusConfig?.icon || CheckCircle, {
                                    className: "h-4 w-4 text-muted-foreground"
                                })}
                                <span className="text-sm font-medium">
                                    {statusConfig?.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Preview */}
            {selectedStatus && (
                <div className="space-y-2">
                    <label className="text-sm font-medium">Vista Previa del Cambio</label>
                    <div className="flex items-center justify-center space-x-4 p-3 border rounded-lg bg-accent/30">
                        <div className="flex items-center space-x-2">
                            {React.createElement(ReservationStatusLabels[currentStatus]?.icon || CheckCircle, {
                                className: "h-4 w-4"
                            })}
                            <span className="text-sm">
                                {ReservationStatusLabels[currentStatus]?.label}
                            </span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <div className="flex items-center space-x-2">
                            {React.createElement(ReservationStatusLabels[selectedStatus]?.icon || CheckCircle, {
                                className: "h-4 w-4"
                            })}
                            <span className="text-sm font-medium">
                                {ReservationStatusLabels[selectedStatus]?.label}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3">
                <Button
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                    disabled={isPending}
                >
                    Cancelar
                </Button>
                <Button
                    onClick={handleConfirm}
                    className="flex-1"
                    disabled={!selectedStatus || selectedStatus === currentStatus || isPending}
                >
                    {isPending && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                    Confirmar Cambio
                </Button>
            </div>
        </div>
    );
};

export default ReservationStatusChangeContent;
