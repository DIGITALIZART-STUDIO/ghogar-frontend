import React from "react";
import { ArrowRight, CheckCircle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { QuotationStatus } from "../../_types/quotation";
import { getStatusDetails } from "../../_utils/quotations.filter.utils";

interface QuotationStatusChangeContentProps {
  showSuccess: boolean;
  quotationCode: string;
  currentStatus: QuotationStatus;
  selectedStatus: QuotationStatus | null;
  isPending: boolean;
  onClose: () => void;
  handleStatusChange: (status: QuotationStatus) => void;
  handleConfirm: () => void;
}

export default function QuotationStatusChangeContent({
    showSuccess,
    quotationCode,
    currentStatus,
    selectedStatus,
    isPending,
    onClose,
    handleStatusChange,
    handleConfirm,
}: QuotationStatusChangeContentProps) {
    return (
        <div className="space-y-6 font-montserrat">
            {showSuccess ? (
                <div className="flex flex-col items-center justify-center py-8 transition-opacity duration-300 ease-in-out">
                    <div className="bg-chart-1/20 p-4 rounded-full mb-4">
                        <CheckCircle className="h-12 w-12 text-chart-1" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">
                        ¡Estado actualizado!
                    </h3>
                    <p className="text-muted-foreground text-center">
                        La cotización
                        {" "}
                        {quotationCode}
                        {" "}
                        ha sido actualizada correctamente.
                    </p>
                </div>
            ) : (
                <>
                    <div className="bg-card rounded-lg p-6">
                        <div className="flex flex-col items-center mb-6">
                            <h3 className="text-lg font-medium mb-1">
                                Cotización
                                {quotationCode}
                            </h3>
                            <p className="text-sm text-muted-foreground text-center">
                                Selecciona el nuevo estado para esta cotización
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {Object.values(QuotationStatus).map((status) => {
                                const statusDetails = getStatusDetails(status);
                                const isSelected = selectedStatus === status;
                                const isCurrent = currentStatus === status;

                                return (
                                    <button
                                        key={status}
                                        onClick={() => handleStatusChange(status)}
                                        disabled={isCurrent || isPending}
                                        className={cn(
                                            "flex items-center p-4 rounded-lg border-2 transition-all duration-200",
                                            isSelected ? "border-primary" : "border-border",
                                            isCurrent ? "opacity-50 cursor-not-allowed" : "hover:border-primary/50",
                                            "relative",
                                        )}
                                    >
                                        {/* Contenedor del ícono como círculo perfecto */}
                                        <div
                                            className={cn(
                                                "w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center mr-3", // Añadido flex-shrink-0
                                                statusDetails.color,
                                            )}
                                        >
                                            {/* Usar tamaño fijo para el ícono */}
                                            <div className="flex items-center justify-center w-5 h-5">
                                                {statusDetails.icon}
                                            </div>
                                        </div>
                                        <div className="text-left">
                                            <div className="font-medium flex items-center">
                                                {statusDetails.label}
                                                {isCurrent && <span className="ml-2 text-xs text-muted-foreground">
                                                    (Estado actual)
                                                </span>}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {statusDetails.description}
                                            </div>
                                        </div>
                                        {isSelected && (
                                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                                    <CheckCircle className="h-4 w-4 text-white" />
                                                </div>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={onClose} disabled={isPending}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            disabled={!selectedStatus || currentStatus === selectedStatus || isPending}
                            className="min-w-[120px]"
                        >
                            {isPending ? (
                                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <ArrowRight className="h-4 w-4 mr-2" />
                            )}
                            {isPending ? "Actualizando..." : "Actualizar"}
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}
