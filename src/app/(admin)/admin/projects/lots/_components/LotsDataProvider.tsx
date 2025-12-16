"use client";

import Link from "next/link";
import { useProject } from "../../_hooks/useProjects";
import { useBlock } from "../../[id]/blocks/_hooks/useBlocks";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import ErrorGeneral from "@/components/errors/general-error";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import LotsServerComponent from "./LotsServerComponent";

interface LotsDataProviderProps {
  blockId?: string;
  projectId?: string;
  title: string;
  description: string;
  canCreateLot: boolean;
}

export default function LotsDataProvider({
    blockId,
    projectId,
    title,
    description,
    canCreateLot
}: LotsDataProviderProps) {
    // Obtener datos del proyecto si tenemos projectId
    const projectQuery = useProject(projectId ?? "");
    const projectData = projectQuery.data;

    // Obtener datos del bloque si tenemos blockId
    const blockQuery = useBlock(blockId ?? "");
    const blockData = blockQuery.data;

    // Determinar el projectId final
    let finalProjectId = projectId;
    if (blockId && blockData?.projectId) {
        finalProjectId = blockData.projectId;
    }

    // Mostrar loading si estamos cargando datos de proyecto o bloque
    if ((projectId && projectQuery.isLoading) || (blockId && blockQuery.isLoading)) {
        return (
            <div className="flex items-center justify-center py-12">
                <LoadingSpinner />
            </div>
        );
    }

    // Mostrar error si hay alguno
    if ((projectId && projectQuery.error) || (blockId && blockQuery.error)) {
        return <ErrorGeneral />;
    }

    // Actualizar título y descripción basado en los datos obtenidos
    let finalTitle = title;
    let finalDescription = description;

    if (blockId && blockData) {
        finalTitle = `Lotes - Manzana ${blockData.name ?? "Sin nombre"}`;
        finalDescription = `Administra los lotes de la manzana ${blockData.name ?? "Sin nombre"}`;
    } else if (projectId && projectData) {
        finalTitle = `Lotes - ${projectData.name ?? "Sin nombre"}`;
        finalDescription = `Administra todos los lotes del proyecto ${projectData.name ?? "Sin nombre"}`;
    }

    return (
        <div className="space-y-6">
            {/* Breadcrumbs */}
            <div className="mb-4">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <Link href="/admin/projects">Proyectos</Link>
                        </BreadcrumbItem>

                        {/* Si hay datos de proyecto, mostrar en breadcrumb */}
                        {projectData && (
                            <>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem className="capitalize">
                                    <Link href={`/admin/projects/${projectData.id}/blocks`}>{projectData.name}</Link>
                                </BreadcrumbItem>
                            </>
                        )}

                        {/* Si hay datos de bloque, mostrar en breadcrumb */}
                        {blockData && (
                            <>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem className="capitalize">
                                    <Link href={`/admin/projects/${projectData?.id}/blocks`}>Manzanas</Link>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem className="capitalize">
                                    <Link href={`/admin/projects/lots?blockId=${blockData.id}`}>{blockData.name}</Link>
                                </BreadcrumbItem>
                            </>
                        )}

                        {/* Si solo hay proyecto (no bloque específico) */}
                        {projectData && !blockData && (
                            <>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem className="capitalize">
                                    <Link href={`/admin/projects/${projectData.id}/blocks`}>Manzanas</Link>
                                </BreadcrumbItem>
                            </>
                        )}

                        <BreadcrumbSeparator />
                        <BreadcrumbPage>Lotes</BreadcrumbPage>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* Client Component que usa los hooks de React Query */}
            <LotsServerComponent
                blockId={blockId}
                projectId={finalProjectId}
                title={finalTitle}
                description={finalDescription}
                canCreateLot={canCreateLot}
            />
        </div>
    );
}
