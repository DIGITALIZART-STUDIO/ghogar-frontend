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
import { LotData } from "./_types/lot";

type LotsPageProps = {
  searchParams: Promise<{
    blockId?: string;
    projectId?: string;
  }>;
};
// Función para validar y limpiar los datos del lote
const validateLotData = (rawLot: unknown): LotData | null => {
    if (!rawLot || typeof rawLot !== "object") {
        return null;
    }

    const lot = rawLot as Record<string, unknown>;

    if (!lot?.id || !lot?.lotNumber) {
        return null;
    }

    return {
        id: lot.id ?? "",
        lotNumber: lot.lotNumber ?? "",
        area: lot.area ?? 0,
        price: lot.price ?? 0,
        status: lot.status ?? "Available",
        statusText: lot.statusText ?? "",
        blockId: lot.blockId ?? "",
        blockName: lot.blockName ?? "",
        projectId: lot.projectId ?? "",
        projectName: lot.projectName ?? "",
        isActive: lot.isActive ?? true,
        createdAt: lot.createdAt ?? new Date().toISOString(),
        modifiedAt: lot.modifiedAt ?? new Date().toISOString(),
        pricePerSquareMeter: lot.pricePerSquareMeter ?? 0,
    } as LotData;
};

export default async function LotsPage({ searchParams }: LotsPageProps) {
    const { blockId, projectId } = await searchParams;

    // Determinar qué datos obtener basado en los parámetros
    let lotsResult;
    let error;
    let title;
    let description;
    let projectData = null;
    let blockData = null;
    let finalProjectId = projectId; // Variable para el projectId final

    if (blockId) {
    // Si hay blockId, obtener lotes del bloque específico y datos del bloque
        [lotsResult, error] = await GetLotsByBlock(blockId);
        const [blockResult] = await GetBlock(blockId);
        blockData = blockResult;

        // También obtener datos del proyecto del bloque
        if (blockData?.projectId) {
            const [projectResult] = await GetProject(blockData.projectId);
            projectData = projectResult;
            finalProjectId = blockData.projectId; // Usar el projectId del bloque
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

    // Validar y limpiar los datos de los lotes
    const rawLots = lotsResult ?? [];
    const lots = rawLots.map(validateLotData).filter((lot): lot is LotData => lot !== null);

    // No mostrar el botón de crear si no tenemos un projectId válido
    const canCreateLot = !!finalProjectId;

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

            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <HeaderPage title={title} description={description} />
                </div>
                {canCreateLot && <CreateLotsDialog projectId={finalProjectId ?? ""} blockId={blockId} />}
            </div>

            {/* Client Component que maneja los filtros y la interactividad */}
            <Suspense fallback={<div>Cargando lotes...</div>}>
                <LotsClient lots={lots} blockId={blockId} projectId={finalProjectId} />
            </Suspense>
        </div>
    );
}
