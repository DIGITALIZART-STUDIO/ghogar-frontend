"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Filter, Home, Search } from "lucide-react";

import { HeaderPage } from "@/components/common/HeaderPage";
import ErrorGeneral from "@/components/errors/general-error";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useActivateBlock, useDeactivateBlock, useBlocks } from "../_hooks/useBlocks";
import { ProjectData } from "../../../_types/project";
import { BlockData } from "../_types/block";
import { BlockCard } from "./BlockCard";
import { CreateBlocksDialog } from "./create/CreateBlocksDialog";

interface BlocksClientProps {
  projectId: string;
  project: ProjectData;
}

export function BlocksClient({ projectId, project }: BlocksClientProps) {
    const { data: blocks = [], isError, refetch } = useBlocks(projectId);
    const [isPending, startTransition] = useTransition();
    const [searchTerm, setSearchTerm] = useState("");

    const activateBlock = useActivateBlock();
    const deactivateBlock = useDeactivateBlock();

    // Mueve useMemo aquí, antes de cualquier return
    const filteredBlocks = useMemo(() => {
        if (!searchTerm.trim()) {
            return blocks;
        }
        return blocks.filter((block: BlockData) => (block.name ?? "").toLowerCase().includes(searchTerm.toLowerCase()));
    }, [blocks, searchTerm]);

    // Mostrar error si ocurre
    if (isError) {
        return (
            <div className="space-y-6">
                <HeaderPage title={"Manzanas"} description={"Sin ubicación"} />
                <ErrorGeneral />
            </div>
        );
    }

    const handleToggleActive = (blockId: string, isActive: boolean) => {
        startTransition(async () => {
            try {
                if (isActive) {
                    // Activar bloque
                    const promise = activateBlock.mutateAsync({
                        params: {
                            path: { id: blockId },
                        },
                    });

                    toast.promise(promise, {
                        loading: "Activando manzana...",
                        success: "Manzana activada exitosamente",
                        error: (e) => `Error al activar manzana: ${e.message}`,
                    });

                    await promise;
                } else {
                    // Desactivar bloque
                    const promise = deactivateBlock.mutateAsync({
                        params: {
                            path: { id: blockId },
                        },
                    });

                    toast.promise(promise, {
                        loading: "Desactivando manzana...",
                        success: "Manzana desactivada exitosamente",
                        error: (e) => `Error al desactivar manzana: ${e.message}`,
                    });

                    await promise;
                }
            } catch (error) {
                // Este catch es para errores inesperados
                console.error("Error inesperado:", error);
            }
        });
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    return (
        <>
            <div className="mb-4">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <Link href="/admin/projects">Proyectos</Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem className="capitalize">
                            <Link href={"/admin/projects"}>{project?.name}</Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbPage>Manzanas</BreadcrumbPage>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <HeaderPage
                        title={`Manzanas - ${project?.name ?? "Sin nombre"}`}
                        description={project?.location ?? "Sin ubicación"}
                    />
                </div>
                <CreateBlocksDialog projectId={projectId} refetch={refetch} />
            </div>
            <div className="space-y-6">
                {/* Buscador */}
                <div className="w-full gap-4">
                    <Card className="border pt-0">
                        <CardHeader className="my-4">
                            <CardTitle className="text-xl flex items-center mt-2">
                                <Filter className="mr-2 h-5 w-5 text-primary" />
                                Filtros de Búsqueda
                            </CardTitle>
                            <CardDescription>Encuentra lotes específicos usando los filtros disponibles</CardDescription>
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
                        <div className="text-sm text-gray-500 mt-4">
                            {filteredBlocks.length} de {blocks.length} manzanas
                        </div>
                    )}
                </div>

                {/* Resultados */}
                {/* Mostrar mensaje si no hay manzanas en el proyecto */}
                {blocks.length === 0 ? (
                    <div className="text-center py-12">
                        <Home className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            No hay manzanas
                        </h3>
                        <p className="text-gray-500">
                            No hay manzanas disponibles para este proyecto.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Resultados */}
                        {filteredBlocks.length === 0 && searchTerm ? (
                            <div className="text-center py-12 flex flex-col items-center justify-center gap-2">
                                <Search className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                    Sin resultados
                                </h3>
                                <p className="text-gray-500">
                                    No se encontraron manzanas que coincidan con&nbsp;
                                    <span className="font-semibold text-primary">&quot;{searchTerm}&quot;</span>
                                </p>
                                <p className="text-xs text-gray-400 mt-2">
                                    Prueba con otro nombre o revisa los filtros.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {filteredBlocks.map((block: BlockData) => (
                                    <BlockCard
                                        key={block.id}
                                        block={block}
                                        projectId={projectId}
                                        onToggleActive={handleToggleActive}
                                        isLoading={isPending}
                                        refetch={refetch}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}
