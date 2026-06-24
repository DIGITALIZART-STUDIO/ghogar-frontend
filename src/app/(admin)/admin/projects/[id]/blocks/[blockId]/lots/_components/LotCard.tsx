"use client";

import { useState } from "react";
import { Building2, Calendar, DollarSign, MoreVertical, Pencil, Power, PowerOff, Ruler } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useActivateLot, useDeactivateLot, useUpdateLotStatus } from "../_hooks/useLots";
import { LotData, LotStatus } from "../_types/lot";
import { getAllLotStatuses, getLotStatusConfig } from "../_utils/lots.filter.utils";
import { UpdateLotsSheet } from "./update/UpdateLotsSheet";

interface LotCardProps {
  lot: LotData;
  projectId: string;
  projectCurrency?: string;
}

export function LotCard({ lot, projectId, projectCurrency = "USD" }: LotCardProps) {
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

  const handleStatusChange = async (newStatus: LotStatus) => {
    if (newStatus === status || isUpdatingStatus) {
      return;
    }

    setIsUpdatingStatus(true);

    const promise = updateLotStatus.mutateAsync({
      params: {
        path: { id: lot.id! },
      },
      body: { status: newStatus },
    });

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
        const promise = deactivateLot.mutateAsync({
          params: {
            path: { id: lot.id! },
          },
        });

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
        const promise = activateLot.mutateAsync({
          params: {
            path: { id: lot.id! },
          },
        });

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

  const handleEdit = () => {
    setOpenUpdateSheet(true);
  };

  // Obtener configuración del estado para el diseño
  const statusConfig = getLotStatusConfig(status as LotStatus);
  const StatusIcon = statusConfig.icon;

  const isSoles = projectCurrency.toUpperCase() === "PEN" || projectCurrency.toLowerCase() === "soles";
  const currencySymbol = isSoles ? "S/" : "$";
  const CurrencyIcon = isSoles
    ? ({ className }: { className?: string }) => (
        <span className={`font-bold inline-flex items-center justify-center ${className ?? ""}`}>S/</span>
      )
    : DollarSign;

  return (
    <Card className="overflow-hidden hover-lift border bg-card">
      <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
        {/* Header superior con número de lote y acciones */}
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-muted flex-shrink-0">
                <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-foreground leading-tight truncate">
                  Lote {lot.lotNumber}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-muted-foreground mt-0.5 truncate">
                  {lot.blockName ?? "Sin bloque"} • {lot.projectName ?? "Sin proyecto"}
                </CardDescription>
              </div>
            </div>
          </div>

          {/* Botón de acciones */}
          <div className="flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
                  <span className="sr-only">Abrir menú</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={handleEdit} disabled={isToggling}>
                    <Pencil />
                    Editar
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {lot.isActive ? (
                    <DropdownMenuItem variant="destructive" onClick={handleToggleStatus} disabled={isToggling}>
                      <PowerOff />
                      Desactivar
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={handleToggleStatus} disabled={isToggling}>
                      <Power />
                      Activar
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Badge de estado */}
        <div className="flex items-center gap-2 flex-wrap">
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${statusConfig.badgeClassName}`}
          >
            <StatusIcon className="w-3 h-3" />
            {statusConfig.label}
          </div>
          {!lot.isActive && <span className="text-xs text-muted-foreground">• Inactivo</span>}
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-4">
        {/* Métricas principales - Responsive grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          <div className="flex flex-col p-2 sm:p-3 rounded-lg border bg-muted/30">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
              <Ruler className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              <span className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide truncate">
                Área
              </span>
            </div>
            <div className="text-base sm:text-lg lg:text-xl font-bold text-foreground truncate">
              {area.toFixed(1)} m²
            </div>
          </div>
          <div className="flex flex-col p-2 sm:p-3 rounded-lg border bg-muted/30">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
              <CurrencyIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              <span className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide truncate">
                Precio
              </span>
            </div>
            <div className="text-base sm:text-lg lg:text-xl font-bold text-foreground truncate">
              {currencySymbol}
              {price.toLocaleString()}
            </div>
          </div>
          <div className="flex flex-col p-2 sm:p-3 rounded-lg border bg-muted/30 col-span-2 sm:col-span-1">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
              <CurrencyIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              <span className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide truncate">
                Precio/m²
              </span>
            </div>
            <div className="text-base sm:text-lg lg:text-xl font-bold text-foreground truncate">
              {currencySymbol}
              {pricePerSquareMeter.toFixed(0)}
            </div>
          </div>
        </div>

        {/* Selector de estado - Conservado como solicitaste */}
        <div className="space-y-2 pt-2 border-t">
          <label className="text-sm font-medium text-foreground">Cambiar Estado</label>
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
                      <span>{config.label}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Fecha de creación */}
        <div className="text-xs text-muted-foreground flex items-center pt-2 border-t">
          <Calendar className="mr-1.5 h-3 w-3" />
          {lot.createdAt
            ? new Date(lot.createdAt).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "Fecha no disponible"}
        </div>
      </CardContent>
      {openUpdateSheet && (
        <UpdateLotsSheet
          lot={lot}
          projectId={projectId}
          projectCurrency={projectCurrency}
          open={openUpdateSheet}
          onOpenChange={setOpenUpdateSheet}
        />
      )}
    </Card>
  );
}
