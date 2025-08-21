"use client";

import { useAllLots, useLots, useLotsByProject } from "../_hooks/useLots";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import ErrorGeneral from "@/components/errors/general-error";
import { LotsClient } from "./LotsClient";
import { CreateLotsDialog } from "./create/CreateLotsDialog";
import { LotData } from "../_types/lot";

interface LotsServerComponentProps {
  blockId?: string;
  projectId?: string;
  title: string;
  description: string;
  canCreateLot: boolean;
}

export default function LotsServerComponent({
    blockId,
    projectId,
    title,
    description,
    canCreateLot
}: LotsServerComponentProps) {
    // Llamar todos los hooks siempre (React Hook rules)
    const allLotsQuery = useAllLots();
    const lotsByBlockQuery = useLots(blockId ?? "");
    const lotsByProjectQuery = useLotsByProject(projectId ?? "");

    // Determinar qué datos usar basado en los parámetros
    let isLoading = false;
    let error: Error | null = null;
    let lots: Array<LotData> = [];

    if (blockId) {
        // Si hay blockId, usar lotes del bloque específico
        isLoading = lotsByBlockQuery.isLoading;
        error = lotsByBlockQuery.error as Error;
        lots = (lotsByBlockQuery.data ?? []) as Array<LotData>;
    } else if (projectId) {
        // Si hay projectId, usar lotes del proyecto específico
        isLoading = lotsByProjectQuery.isLoading;
        error = lotsByProjectQuery.error as Error;
        lots = (lotsByProjectQuery.data ?? []) as Array<LotData>;
    } else {
        // Si no hay parámetros, usar todos los lotes
        isLoading = allLotsQuery.isLoading;
        error = allLotsQuery.error as Error;
        lots = (allLotsQuery.data ?? []) as Array<LotData>;
    }

    // Mostrar loading spinner mientras se cargan los datos
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <LoadingSpinner />
            </div>
        );
    }

    // Mostrar error si ocurre alguno
    if (error) {
        return <ErrorGeneral />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                    <p className="text-muted-foreground">{description}</p>
                </div>
                {canCreateLot && projectId && (
                    <CreateLotsDialog
                        projectId={projectId}
                        blockId={blockId && blockId.trim() !== "" ? blockId : undefined}
                    />
                )}
            </div>

            {/* Client Component que maneja los filtros y la interactividad */}
            <LotsClient lots={lots} blockId={blockId} projectId={projectId} />
        </div>
    );
}
