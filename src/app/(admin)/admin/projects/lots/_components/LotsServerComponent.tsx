"use client";

import { useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";

import { usePaginatedLotsByBlockWithSearch } from "../_hooks/useLots";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import ErrorGeneral from "@/components/errors/general-error";
import { LotsClient } from "./LotsClient";
import { CreateLotsDialog } from "./create/CreateLotsDialog";

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
    // Usar el hook de paginación infinita con búsqueda y filtros
    const {
        allLots: lots,
        handleScrollEnd,
        isLoading,
        isError,
        hasNextPage,
        isFetchingNextPage,
        search,
        status,
        handleSearchChange,
        handleStatusChange,
        resetSearch
    } = usePaginatedLotsByBlockWithSearch(blockId ?? "", 9); // 9 lotes por página

    // Ref para el elemento que detectará cuando hacer scroll infinito
    const loadMoreRef = useRef<HTMLDivElement>(null);

    // Intersection Observer para detectar cuando el usuario llega al final
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const target = entries[0];
                if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
                    handleScrollEnd();
                }
            },
            {
                threshold: 0.1,
                rootMargin: "100px",
            }
        );

        const currentRef = loadMoreRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [hasNextPage, isFetchingNextPage, handleScrollEnd]);

    // Mostrar loading spinner mientras se cargan los datos
    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                        <p className="text-muted-foreground">{description}</p>
                    </div>
                </div>
                <div className="flex items-center justify-center py-12">
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    // Mostrar error si ocurre alguno
    if (isError) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                        <p className="text-muted-foreground">{description}</p>
                    </div>
                </div>
                <ErrorGeneral />
            </div>
        );
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
            <LotsClient
                lots={lots}
                blockId={blockId}
                projectId={projectId}
                onSearchChange={handleSearchChange}
                onStatusChange={handleStatusChange}
                search={search}
                status={status}
                onResetSearch={resetSearch}
            />

            {/* Indicador de carga para más lotes */}
            {isFetchingNextPage && (
                <div className="flex justify-center items-center py-8">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Cargando más lotes...</span>
                    </div>
                </div>
            )}

            {/* Elemento invisible para detectar scroll infinito */}
            {hasNextPage && (
                <div ref={loadMoreRef} className="h-4" />
            )}
        </div>
    );
}
