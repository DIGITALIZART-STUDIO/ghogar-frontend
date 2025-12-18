"use client";

import Link from "next/link";

import { useProject } from "@/app/(admin)/admin/projects/_hooks/useProjects";
import ErrorGeneral from "@/components/errors/general-error";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useBlock } from "../../../_hooks/useBlocks";
import LotsServerComponent from "./LotsServerComponent";

interface LotsPageProviderProps {
  projectId: string;
  blockId: string;
}

export default function LotsPageProvider({ projectId, blockId }: LotsPageProviderProps) {
  // Obtener datos del proyecto
  const projectQuery = useProject(projectId);
  const projectData = projectQuery.data;

  // Obtener datos del bloque
  const blockQuery = useBlock(blockId);
  const blockData = blockQuery.data;

  // Mostrar loading si estamos cargando datos de proyecto o bloque
  if (projectQuery.isLoading || blockQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  // Mostrar error si hay alguno
  if (projectQuery.error || blockQuery.error) {
    return <ErrorGeneral />;
  }

  // Determinar título y descripción
  let title = "Lotes - Manzana";
  let description = "Administra los lotes de la manzana";

  if (blockData) {
    title = `Lotes - Manzana ${blockData.name ?? "Sin nombre"}`;
    description = `Administra los lotes de la manzana ${blockData.name ?? "Sin nombre"}`;
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
            {blockData && projectData && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem className="capitalize">
                  <Link href={`/admin/projects/${projectData.id}/blocks`}>Manzanas</Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem className="capitalize">
                  <Link href={`/admin/projects/${projectId}/blocks/${blockId}/lots`}>{blockData.name}</Link>
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
        projectId={projectId}
        title={title}
        description={description}
        canCreateLot
      />
    </div>
  );
}
