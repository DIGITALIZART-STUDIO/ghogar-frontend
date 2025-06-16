"use client";

import { Building2, Calendar, DollarSign, MapPin, Ruler } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LotFormDialog } from "./LotFormDialog";

interface LotCardProps {
  lot: {
    id: string;
    lotNumber: string;
    area: number;
    price: number;
    status: "Available" | "Quoted" | "Reserved" | "Sold";
    blockId: string;
    blockName: string;
    projectName: string;
    projectLocation: string;
    isActive: boolean;
    createdAt: string;
    modifiedAt: string;
  };
}

const statusLabels = {
    Available: "Disponible",
    Quoted: "Cotizado",
    Reserved: "Reservado",
    Sold: "Vendido",
};

const statusStyles = {
    Available: "status-available text-white",
    Quoted: "status-quoted text-white",
    Reserved: "status-reserved text-white",
    Sold: "status-sold text-white",
};

export function LotCard({ lot }: LotCardProps) {
    const pricePerSquareMeter = lot.price / lot.area;

    const handleStatusChange = (newStatus: string) => {
        console.log(`Changing lot ${lot.id} status to ${newStatus}`);
    // Here you would call your API to update the lot status
    };

    return (
        <Card className="overflow-hidden hover-lift border-0 shadow-xl bg-white">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-xl font-bold">
                            {lot.lotNumber}
                        </CardTitle>
                        <CardDescription className="flex items-center text-sm">
                            <Building2 className="mr-1 h-3 w-3" />
                            Bloque
                            {" "}
                            {lot.blockName}
                        </CardDescription>
                    </div>
                    <Badge className={`${statusStyles[lot.status]} font-medium`}>
                        {statusLabels[lot.status]}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Project Info */}
                <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">
                        {lot.projectName}
                    </h4>
                    <p className="text-sm text-gray-600 flex items-center">
                        <MapPin className="mr-1 h-3 w-3" />
                        {lot.projectLocation}
                    </p>
                </div>

                {/* Lot Details */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center text-blue-600 mb-1">
                            <Ruler className="mr-1 h-4 w-4" />
                            <span className="text-xs font-medium">
                                Área
                            </span>
                        </div>
                        <div className="text-lg font-bold text-blue-700">
                            {lot.area.toFixed(1)}
                            {" "}
                            m²
                        </div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center text-green-600 mb-1">
                            <DollarSign className="mr-1 h-4 w-4" />
                            <span className="text-xs font-medium">
                                Precio Total
                            </span>
                        </div>
                        <div className="text-lg font-bold text-green-700">
                            $
                            {lot.price.toLocaleString()}
                        </div>
                    </div>
                </div>

                {/* Price per m² */}
                <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-purple-700">
                            Precio por m²
                        </span>
                        <span className="text-lg font-bold text-purple-800">
                            $
                            {pricePerSquareMeter.toFixed(0)}
                        </span>
                    </div>
                </div>

                {/* Status Change */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                        Cambiar Estado:
                    </label>
                    <Select value={lot.status} onValueChange={handleStatusChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Available">
                                🟢 Disponible
                            </SelectItem>
                            <SelectItem value="Quoted">
                                🔵 Cotizado
                            </SelectItem>
                            <SelectItem value="Reserved">
                                🟡 Reservado
                            </SelectItem>
                            <SelectItem value="Sold">
                                🔴 Vendido
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                    <LotFormDialog lot={lot}>
                        <Button variant="outline" size="sm" className="flex-1">
                            Editar
                        </Button>
                    </LotFormDialog>
                    <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                    >
                        Ver Detalles
                    </Button>
                </div>

                {/* Creation Date */}
                <div className="text-xs text-gray-500 flex items-center pt-2 border-t">
                    <Calendar className="mr-1 h-3 w-3" />
                    Creado:
                    {" "}
                    {new Date(lot.createdAt).toLocaleDateString()}
                </div>
            </CardContent>
        </Card>
    );
}
