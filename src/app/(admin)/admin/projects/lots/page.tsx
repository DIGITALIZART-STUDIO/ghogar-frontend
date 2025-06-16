import { Suspense } from "react";
import Link from "next/link";

import { HeaderPage } from "@/components/common/HeaderPage";
import ErrorGeneral from "@/components/errors/general-error";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { GetProject } from "../_actions/ProjectActions";
import { GetBlock } from "../[id]/blocks/_actions/BlockActions";
import { GetAllLots, GetLotsByBlock, GetLotsByProject } from "./_actions/LotActions";
import { CreateLotsDialog } from "./_components/create/CreateLotsDialog";
import { LotsClient } from "./_components/LotsClient";

interface LotsPageProps {
  searchParams: {
    blockId?: string;
    projectId?: string;
  };
}

export default async function LotsPage({ searchParams }: LotsPageProps) {
    const { blockId, projectId } = searchParams;

    // Determinar qué datos obtener basado en los parámetros
    let lotsResult;
    let error;
    let title;
    let description;
    let projectData = null;
    let blockData = null;

    if (blockId) {
    // Si hay blockId, obtener lotes del bloque específico y datos del bloque
        [lotsResult, error] = await GetLotsByBlock(blockId);
        const [blockResult] = await GetBlock(blockId);
        blockData = blockResult;

        // También obtener datos del proyecto del bloque
        if (blockData?.projectId) {
            const [projectResult] = await GetProject(blockData.projectId);
            projectData = projectResult;
        }

        title = `Lotes - Manzana ${blockData?.name ?? "Sin nombre"}`;
        description = `Administra los lotes de la manzana ${blockData?.name ?? "Sin nombre"}`;
    } else if (projectId) {
    // Si hay projectId, obtener lotes del proyecto específico
        [lotsResult, error] = await GetLotsByProject(projectId);
        const [projectResult] = await GetProject(projectId);
        projectData = projectResult;

        title = `Lotes - ${projectData?.name ?? "Sin nombre"}`;
        description = `Administra todos los lotes del proyecto ${projectData?.name ?? "Sin nombre"}`;
    } else {
    // Si no hay parámetros, obtener todos los lotes
        [lotsResult, error] = await GetAllLots();
        title = "Gestión de Lotes";
        description = "Administra todos los lotes de tus proyectos inmobiliarios";
    }

    if (error) {
        return (
            <div className="space-y-6">
                <HeaderPage title={title} description="Error al cargar los datos" />
                <ErrorGeneral />
            </div>
        );
    }

    const lots = lotsResult ?? [];

    return (
        <div className="space-y-6">
            {/* Breadcrumbs */}
            <div className="mb-4">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <Link href="/admin/projects">
                                Proyectos
                            </Link>
                        </BreadcrumbItem>

                        {/* Si hay datos de proyecto, mostrar en breadcrumb */}
                        {projectData && (
                            <>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem className="capitalize">
                                    <Link href={`/admin/projects/${projectData.id}/blocks`}>
                                        {projectData.name}
                                    </Link>
                                </BreadcrumbItem>
                            </>
                        )}

                        {/* Si hay datos de bloque, mostrar en breadcrumb */}
                        {blockData && (
                            <>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem className="capitalize">
                                    <Link href={`/admin/projects/${projectData?.id}/blocks`}>
                                        Manzanas
                                    </Link>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem className="capitalize">
                                    <Link href={`/admin/projects/lots?blockId=${blockData.id}`}>
                                        Manzana
                                        {blockData.name}
                                    </Link>
                                </BreadcrumbItem>
                            </>
                        )}

                        {/* Si solo hay proyecto (no bloque específico) */}
                        {projectData && !blockData && (
                            <>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem className="capitalize">
                                    <Link href={`/admin/projects/${projectData.id}/blocks`}>
                                        Manzanas
                                    </Link>
                                </BreadcrumbItem>
                            </>
                        )}

                        <BreadcrumbSeparator />
                        <BreadcrumbPage>
                            Lotes
                        </BreadcrumbPage>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <HeaderPage title={title} description={description} />
                </div>
                <CreateLotsDialog projectId={projectId ?? ""} />
            </div>

            {/* Client Component que maneja los filtros y la interactividad */}
            <Suspense fallback={<div>
                Cargando lotes...
            </div>}
            >
                <LotsClient lots={lots} blockId={blockId} projectId={projectId} />
            </Suspense>
        </div>
    );
}
