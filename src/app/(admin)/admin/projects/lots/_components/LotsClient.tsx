"use client";

import { useMemo, useState } from "react";
import { Filter, Home, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LotData, LotStatus } from "../_types/lot";
import { LotCard } from "./LotCard";

interface LotsClientProps {
  lots: Array<LotData> | undefined;
  blockId?: string;
  projectId?: string;
}

export function LotsClient({ lots, blockId, projectId }: LotsClientProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [projectFilter, setProjectFilter] = useState<string>("all");

    // Filtrar lotes basado en los términos de búsqueda
    const filteredLots = useMemo(
        () => lots.filter((lot) => {
            const matchesSearch =
          lot.lotNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ??
          lot.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ??
          lot.blockName?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === "all" ?? lot.status === statusFilter;
            const matchesProject = projectFilter === "all" ?? lot.projectName === projectFilter;

            return matchesSearch && matchesStatus && matchesProject;
        }),
        [lots, searchTerm, statusFilter, projectFilter],
    );

    // Proyectos únicos para el filtro
    const uniqueProjects = useMemo(
        () => Array.from(new Set((lots ?? []).map((lot) => lot.projectName).filter(Boolean))),
        [lots],
    );

    // Calcular estadísticas - CORREGIDO para usar strings
    const stats = useMemo(
        () => ({
            total: filteredLots.length,
            available: filteredLots.filter((lot) => lot.status === LotStatus.Available).length,
            reserved: filteredLots.filter((lot) => lot.status === LotStatus.Reserved).length,
            sold: filteredLots.filter((lot) => lot.status === LotStatus.Sold).length,
            quoted: filteredLots.filter((lot) => lot.status === LotStatus.Quoted).length,
        }),
        [filteredLots],
    );

    const clearFilters = () => {
        setSearchTerm("");
        setStatusFilter("all");
        setProjectFilter("all");
    };

    if (lots?.length === 0) {
        return (
            <div className="text-center py-12">
                <Home className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No hay lotes disponibles
                </h3>
                <p className="text-gray-600">
                    {blockId
                        ? "Este bloque no tiene lotes asignados."
                        : projectId
                            ? "Este proyecto no tiene lotes disponibles."
                            : "No se encontraron lotes en el sistema."}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card className="text-center border-0 shadow-lg">
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-gray-900">
                            {stats.total}
                        </div>
                        <div className="text-sm text-gray-600">
                            Total
                        </div>
                    </CardContent>
                </Card>
                <Card className="text-center border-0 shadow-lg">
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-green-600">
                            {stats.available}
                        </div>
                        <div className="text-sm text-gray-600">
                            Disponibles
                        </div>
                    </CardContent>
                </Card>
                <Card className="text-center border-0 shadow-lg">
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-yellow-600">
                            {stats.reserved}
                        </div>
                        <div className="text-sm text-gray-600">
                            Reservados
                        </div>
                    </CardContent>
                </Card>
                <Card className="text-center border-0 shadow-lg">
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-red-600">
                            {stats.sold}
                        </div>
                        <div className="text-sm text-gray-600">
                            Vendidos
                        </div>
                    </CardContent>
                </Card>
                <Card className="text-center border-0 shadow-lg">
                    <CardContent className="p-4">
                        <div className="text-2xl font-bold text-blue-600">
                            {stats.quoted}
                        </div>
                        <div className="text-sm text-gray-600">
                            Cotizados
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters - Solo mostrar si no es un bloque específico */}
            {!blockId && (
                <Card className="border-0 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <CardTitle className="text-xl flex items-center">
                            <Filter className="mr-2 h-5 w-5 text-purple-600" />
                            Filtros de Búsqueda
                        </CardTitle>
                        <CardDescription>
                            Encuentra lotes específicos usando los filtros disponibles
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Buscar por lote, proyecto o bloque..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 h-12 text-base"
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="h-12 text-base">
                                    <SelectValue placeholder="Filtrar por estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Todos los estados
                                    </SelectItem>
                                    <SelectItem value={LotStatus.Available}>
                                        🟢 Disponible
                                    </SelectItem>
                                    <SelectItem value={LotStatus.Quoted}>
                                        🔵 Cotizado
                                    </SelectItem>
                                    <SelectItem value={LotStatus.Reserved}>
                                        🟡 Reservado
                                    </SelectItem>
                                    <SelectItem value={LotStatus.Sold}>
                                        🔴 Vendido
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {!projectId && uniqueProjects.length > 1 && (
                                <Select value={projectFilter} onValueChange={setProjectFilter}>
                                    <SelectTrigger className="h-12 text-base">
                                        <SelectValue placeholder="Filtrar por proyecto" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Todos los proyectos
                                        </SelectItem>
                                        {uniqueProjects.map((project) => (
                                            <SelectItem key={project} value={project!}>
                                                {project}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Lots Grid */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Lotes Encontrados (
                        {filteredLots.length}
                        )
                    </h2>
                    {(searchTerm ?? statusFilter !== "all" ?? projectFilter !== "all") && (
                        <Button variant="outline" onClick={clearFilters}>
                            Limpiar Filtros
                        </Button>
                    )}
                </div>

                {filteredLots.length === 0 && (searchTerm ?? statusFilter !== "all" ?? projectFilter !== "all") ? (
                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-12 text-center">
                            <Home className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No se encontraron lotes
                            </h3>
                            <p className="text-gray-600 mb-4">
                                No hay lotes que coincidan con los filtros seleccionados.
                            </p>
                            <Button onClick={clearFilters}>
                                Limpiar Filtros
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredLots.map((lot) => (
                            <LotCard key={lot.id} lot={lot} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
