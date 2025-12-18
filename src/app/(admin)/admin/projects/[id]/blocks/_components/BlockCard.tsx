"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Building, MoreVertical, Pencil, Power, PowerOff, TrendingUp } from "lucide-react";

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
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { BlockData } from "../_types/block";
import { UpdateBlocksSheet } from "./update/UpdateBlocksSheet";

interface BlockCardProps {
  block: BlockData;
  projectId: string;
  onToggleActive: (blockId: string, isActive: boolean) => void;
  isLoading?: boolean;
  refetch: () => void;
}

export function BlockCard({ block, projectId, onToggleActive, isLoading = false, refetch }: BlockCardProps) {
  const [openSheet, setOpenSheet] = useState(false);

  // Calcular porcentajes para mejor visualización
  const soldPercentage = (block?.totalLots ?? 0) > 0 ? ((block?.soldLots ?? 0) / (block?.totalLots ?? 1)) * 100 : 0;

  const statusConfig = [
    {
      label: "Disponibles",
      value: block.availableLots,
      color: "bg-emerald-500",
      textColor: "text-emerald-700",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
    },
    {
      label: "Cotizados",
      value: block.quotedLots,
      color: "bg-blue-500",
      textColor: "text-blue-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      label: "Reservados",
      value: block.reservedLots,
      color: "bg-amber-500",
      textColor: "text-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    },
    {
      label: "Vendidos",
      value: block.soldLots,
      color: "bg-red-500",
      textColor: "text-red-700",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
  ];

  const handleEdit = () => {
    setOpenSheet(true);
  };

  return (
    <Card
      className={`group transition-all duration-300 border ${isLoading ? "opacity-70" : ""} ${
        !block.isActive
          ? "bg-gray-50/50 dark:bg-gray-950/50 border-gray-200 dark:border-gray-800"
          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      }`}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Icono con indicador de estado */}
            <div className="relative flex-shrink-0">
              <div
                className={`p-3 rounded-xl transition-colors ${
                  block.isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                }`}
              >
                <Building className="h-5 w-5" />
              </div>
              {/* Indicador de estado sutil */}
              <div
                className={`absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-white dark:border-gray-800 ${
                  block.isActive ? "bg-green-500" : "bg-gray-400"
                }`}
              />
            </div>

            {/* Información del bloque */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
                  {block.name}
                </CardTitle>
              </div>
              <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                {block.totalLots} lotes en total
              </CardDescription>
            </div>
          </div>

          {/* Botón de acciones */}
          <div className="flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  <span className="sr-only">Abrir menú</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={handleEdit} disabled={isLoading}>
                    <Pencil />
                    Editar
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {block.isActive ? (
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => onToggleActive(block.id ?? "", false)}
                      disabled={isLoading}
                    >
                      <PowerOff />
                      Desactivar
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => onToggleActive(block.id ?? "", true)} disabled={isLoading}>
                      <Power />
                      Activar
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Overview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progreso de ventas</span>
            <span className="text-sm text-gray-500">{soldPercentage.toFixed(1)}% vendido</span>
          </div>
          <Progress value={soldPercentage} className="h-2" />
        </div>

        <Separator />

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 gap-3">
          {statusConfig.map((status, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border ${status.bgColor} ${status.borderColor} transition-colors`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">{status.label}</span>
                <div className={`w-2 h-2 rounded-full ${status.color}`} />
              </div>
              <div className="flex items-end justify-between">
                <span className={`text-2xl font-bold ${status.textColor}`}>{status.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Button asChild size="sm" className="w-full" disabled={isLoading}>
            <Link href={`/admin/projects/${projectId}/blocks/${block.id}/lots`}>
              Ver Lotes
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Performance Indicator */}
        {soldPercentage > 50 && (
          <div className="flex items-center justify-center p-2 bg-green-50 rounded-lg border border-green-200">
            <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-700">Alto rendimiento</span>
          </div>
        )}
      </CardContent>

      {/* Simulated UpdateBlocksSheet component */}
      {openSheet && (
        <UpdateBlocksSheet
          open={openSheet}
          onOpenChange={setOpenSheet}
          block={block}
          projectId={projectId}
          refetch={refetch}
        />
      )}
    </Card>
  );
}
