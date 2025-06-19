"use client";

import { useMemo, useState, useTransition } from "react";
import { Filter, Home, Search } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toastWrapper } from "@/types/toasts";
import { ActivateBlock, DeactivateBlock } from "../_actions/BlockActions";
import { BlockData } from "../_types/block";
import { BlockCard } from "./BlockCard";

interface BlocksClientProps {
  blocks: Array<BlockData>;
  projectId: string;
}

export function BlocksClient({ blocks: initialBlocks, projectId }: BlocksClientProps) {
    const [blocks, setBlocks] = useState(initialBlocks);
    const [isPending, startTransition] = useTransition();
    const [searchTerm, setSearchTerm] = useState("");

    // Filtrar bloques basado en el término de búsqueda
    const filteredBlocks = useMemo(() => {
        if (!searchTerm.trim()) {
            return blocks;
        }

        return blocks.filter((block) => (block.name ?? "").toLowerCase().includes(searchTerm.toLowerCase()));
    }, [blocks, searchTerm]);

    const handleToggleActive = (blockId: string, isActive: boolean) => {
    // Actualizar optimistamente la UI
        setBlocks((prev) => prev.map((block) => (block.id === blockId ? { ...block, isActive } : block)));

        // Llamar a la API con toast
        startTransition(async() => {
            const action = isActive ? ActivateBlock(blockId) : DeactivateBlock(blockId);
            const actionText = isActive ? "activar" : "desactivar";

            const [, error] = await toastWrapper(action, {
                loading: `${isActive ? "Activando" : "Desactivando"} manzana...`,
                success: `Manzana ${isActive ? "activada" : "desactivada"} exitosamente`,
                error: (e) => `Error al ${actionText} manzana: ${e.message}`,
            });

            if (error) {
                // Revertir el cambio en caso de error
                setBlocks((prev) => prev.map((block) => (block.id === blockId ? { ...block, isActive: !isActive } : block)));
            }
        });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    if (blocks.length === 0) {
        return (
            <div className="text-center py-12">
                <Home className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    No hay manzanas
                </h3>
                <p className="text-gray-500">
                    No hay manzanas disponibles para este proyecto.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Buscador */}
            <div className="w-full gap-4">
                <Card className="border pt-0">
                    <CardHeader className="my-4">
                        <CardTitle className="text-xl flex items-center mt-2">
                            <Filter className="mr-2 h-5 w-5 text-purple-600" />
                            Filtros de Búsqueda
                        </CardTitle>
                        <CardDescription>
                            Encuentra lotes específicos usando los filtros disponibles
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    type="text"
                                    placeholder="Buscar manzana por nombre..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                {searchTerm && (
                    <div className="text-sm text-gray-500">
                        {filteredBlocks.length}
                        {" "}
                        de
                        {blocks.length}
                        {" "}
                        manzanas
                    </div>
                )}
            </div>

            {/* Resultados */}
            {filteredBlocks.length === 0 && searchTerm ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">
                        No se encontraron manzanas que coincidan con &quot;
                        {searchTerm}
                        &quot;
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredBlocks.map((block) => (
                        <BlockCard
                            key={block.id}
                            block={block}
                            projectId={projectId}
                            onToggleActive={handleToggleActive}
                            isLoading={isPending}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
