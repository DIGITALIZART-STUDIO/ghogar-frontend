"use client";

import { useState } from "react";
import { Building2, Calendar, DollarSign, MapPin, Power, PowerOff, Ruler } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useActivateLot, useDeactivateLot, useUpdateLotStatus } from "../_hooks/useLots";
import { LotData, LotStatus } from "../_types/lot";
import { getAllLotStatuses, getLotStatusConfig } from "../_utils/lots.filter.utils";
import { UpdateLotsSheet } from "./update/UpdateLotsSheet";

interface LotCardProps {
  lot: LotData;
  projectId: string;
}

export function LotCard({ lot, projectId }: LotCardProps) {
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [openUpdateSheet, setOpenUpdateSheet] = useState(false);
    const [isToggling, setIsToggling] = useState(false);

    const activateLot = useActivateLot();
    const deactivateLot = useDeactivateLot();
    const updateLotStatus = useUpdateLotStatus();
    // Validar que los datos necesarios existan
    if (!lot?.id || !lot?.lotNumber) {
        return null;
    }

    const area = lot.area ?? 0;
    const price = lot.price ?? 0;
    const status = lot.status ?? LotStatus.Available;
    const pricePerSquareMeter = area > 0 ? price / area : 0;

    // Obtener configuración del status actual
    const statusConfig = getLotStatusConfig(status);
    const StatusIcon = statusConfig.icon;

    const handleStatusChange = async(newStatus: LotStatus) => {
        if (newStatus === status || isUpdatingStatus) {
            return;
        }

        setIsUpdatingStatus(true);

        const promise = updateLotStatus.mutateAsync({ id: lot.id!, statusUpdate: { status: newStatus } });

        toast.promise(promise, {
            loading: `Actualizando estado del lote ${lot.lotNumber}...`,
            success: `Estado del Lote ${lot.lotNumber} actualizado exitosamente`,
            error: (e) => `Error al actualizar estado del lote: ${e.message}`,
        });

        try {
            await promise;
        } catch (error) {
            console.error(`Error updating lot ${lot.id} status:`, error);
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const handleToggleStatus = async () => {
        setIsToggling(true);
        try {
            if (lot.isActive) {
                // Desactivar lote usando hook
                const promise = deactivateLot.mutateAsync(lot.id);

                toast.promise(promise, {
                    loading: "Desactivando lote...",
                    success: `El lote ${lot.lotNumber} ha sido desactivado`,
                    error: (e) => `Error al desactivar el lote: ${e.message}`,
                });

                await promise;
                // Actualiza el estado local del lote si es necesario
                lot.isActive = false;
            } else {
                // Activar lote usando hook
                const promise = activateLot.mutateAsync(lot.id);

                toast.promise(promise, {
                    loading: "Activando lote...",
                    success: `El lote ${lot.lotNumber} ha sido activado`,
                    error: (e) => `Error al activar el lote: ${e.message}`,
                });

                await promise;
                // Actualiza el estado local del lote si es necesario
                lot.isActive = true;
            }
        } catch (error) {
            // Este catch es para errores inesperados
            console.error("Error inesperado:", error);
        } finally {
            setIsToggling(false);
        }
    };

    return (
        <Card className="overflow-hidden hover-lift border-0 bg-white dark:bg-gray-900">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            {lot.lotNumber}
                        </CardTitle>
                        <CardDescription className="flex items-center text-sm">
                            <Building2 className="mr-1 h-3 w-3" />
                            Bloque
                            {" "}
                            {lot.blockName ?? "Sin nombre"}
                        </CardDescription>
                    </div>
                    {/* Status Badge */}
                    <Badge className={statusConfig.badgeClassName}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig.label}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Project Info */}
                <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        {lot.projectName ?? "Sin proyecto"}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                        <MapPin className="mr-1 h-3 w-3" />
                        {lot.blockName ?? "Sin bloque"}
                        {" "}
                        -
                        {lot.projectName ?? "Sin proyecto"}
                    </p>
                </div>

                {/* Lot Details */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center text-blue-600 dark:text-blue-300 mb-1">
                            <Ruler className="mr-1 h-4 w-4" />
                            <span className="text-xs font-medium">
                                Área
                            </span>
                        </div>
                        <div className="text-lg font-bold text-blue-700 dark:text-blue-200">
                            {area.toFixed(1)}
                            {" "}
                            m²
                        </div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center text-green-600 dark:text-green-300 mb-1">
                            <DollarSign className="mr-1 h-4 w-4" />
                            <span className="text-xs font-medium">
                                Precio Total
                            </span>
                        </div>
                        <div className="text-lg font-bold text-green-700 dark:text-green-200">
                            $
                            {price.toLocaleString()}
                        </div>
                    </div>
                </div>

                {/* Price per m² */}
                <div className="bg-purple-50 dark:bg-purple-950 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                            Precio por m²
                        </span>
                        <span className="text-lg font-bold text-purple-800 dark:text-purple-200">
                            $
                            {pricePerSquareMeter.toFixed(0)}
                        </span>
                    </div>
                </div>

                {/* Status Change */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Cambiar Estado:
                    </label>
                    <Select value={status} onValueChange={handleStatusChange} disabled={isUpdatingStatus}>
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {getAllLotStatuses().map((lotStatus) => {
                                const config = getLotStatusConfig(lotStatus);
                                const Icon = config.icon;
                                return (
                                    <SelectItem key={lotStatus} value={lotStatus}>
                                        <div className="flex items-center gap-2">
                                            <Icon className={`w-4 h-4 ${config.textClassName}`} />
                                            <span>
                                                {config.label}
                                            </span>
                                        </div>
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => setOpenUpdateSheet(true)}>
                        Editar
                    </Button>
                    <UpdateLotsSheet lot={lot} projectId={projectId} open={openUpdateSheet} onOpenChange={setOpenUpdateSheet} />
                    <Button
                        variant={lot.isActive ? "destructive" : "success"}
                        size="sm"
                        className="flex-1"
                        onClick={handleToggleStatus}
                        disabled={isToggling}
                    >
                        {isToggling ? (
                            "Procesando..."
                        ) : lot.isActive ? (
                            <>
                                <PowerOff className="mr-1 h-3 w-3" />
                                Desactivar
                            </>
                        ) : (
                            <>
                                <Power className="mr-1 h-3 w-3" />
                                Activar
                            </>
                        )}
                    </Button>
                </div>

                {/* Creation Date */}
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                    <Calendar className="mr-1 h-3 w-3" />
                    Creado:
                    {" "}
                    {lot.createdAt ? new Date(lot.createdAt).toLocaleDateString() : "Fecha no disponible"}
                </div>
            </CardContent>
        </Card>
    );
}
