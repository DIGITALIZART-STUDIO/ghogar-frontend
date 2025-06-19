"use client";

import { useState } from "react";
import Link from "next/link";
import { Building, Eye, Pencil, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { BlockData } from "../_types/block";
import { UpdateBlocksSheet } from "./update/UpdateBlocksSheet";

interface BlockCardProps {
  block: BlockData;
  projectId: string;
  onToggleActive: (blockId: string, isActive: boolean) => void;
  isLoading?: boolean;
}

export function BlockCard({ block, projectId, onToggleActive, isLoading = false }: BlockCardProps) {
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

    return (
        <Card
            className={`group  transition-all duration-300 border-0 ${isLoading ? "opacity-70" : ""} ${!block.isActive ? "bg-gray-50 dark:bg-gray-950" : "bg-white dark:bg-gray-800"}`}
        >
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <div className={`p-2 rounded-lg ${block.isActive ? "bg-blue-100" : "bg-gray-100"}`}>
                                <Building className={`h-5 w-5 ${block.isActive ? "text-blue-600" : "text-gray-500"}`} />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-bold text-gray-900  dark:text-gray-100">
                                    {block.name}
                                </CardTitle>
                                <CardDescription className="text-sm text-gray-500 mt-1">
                                    {block.totalLots}
                                    {" "}
                                    lotes en total
                                </CardDescription>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                        <div className="flex items-center space-x-2">
                            <Switch
                                checked={block.isActive}
                                onCheckedChange={(checked) => onToggleActive(block.id ?? "", checked)}
                                disabled={isLoading}
                            />
                        </div>
                        <Badge
                            variant={block.isActive ? "default" : "secondary"}
                            className={`${block.isActive ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-red-100 text-red-600 hover:bg-red-200"}`}
                        >
                            {block.isActive ? "Activo" : "Inactivo"}
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Progress Overview */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Progreso de ventas
                        </span>
                        <span className="text-sm text-gray-500">
                            {soldPercentage.toFixed(1)}
                            % vendido
                        </span>
                    </div>
                    <Progress value={soldPercentage} className="h-2" />
                </div>

                <Separator />

                {/* Statistics Grid */}
                <div className="grid grid-cols-2 gap-3">
                    {statusConfig.map((status, index) => (
                        <div
                            key={index}
                            className={`p-3 rounded-lg border ${status.bgColor} ${status.borderColor} hover:shadow-sm transition-shadow`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                                    {status.label}
                                </span>
                                <div className={`w-2 h-2 rounded-full ${status.color}`} />
                            </div>
                            <div className="flex items-end justify-between">
                                <span className={`text-2xl font-bold ${status.textColor}`}>
                                    {status.value}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                    <Button asChild variant="outline" size="sm" className="flex-1 " disabled={isLoading}>
                        <Link href={`/admin/projects/lots?blockId=${block.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver Lotes
                        </Link>
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        disabled={isLoading}
                        onClick={() => setOpenSheet(true)}
                        className="hover:bg-gray-100 hover:text-gray-900 transition-colors dark:hover:bg-gray-700 dark:hover:text-gray-100 flex-1"
                    >
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                    </Button>
                </div>

                {/* Performance Indicator */}
                {soldPercentage > 50 && (
                    <div className="flex items-center justify-center p-2 bg-green-50 rounded-lg border border-green-200">
                        <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-sm font-medium text-green-700">
                            Alto rendimiento
                        </span>
                    </div>
                )}
            </CardContent>

            {/* Simulated UpdateBlocksSheet component */}
            {openSheet && (
                <UpdateBlocksSheet open={openSheet} onOpenChange={setOpenSheet} block={block} projectId={projectId} />
            )}
        </Card>
    );
}
