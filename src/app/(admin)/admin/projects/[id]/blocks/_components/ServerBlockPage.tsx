
"use client";

import { Building2 } from "lucide-react";
import { HeaderPage } from "@/components/common/HeaderPage";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useProject } from "../../../_hooks/useProjects";
import { BlocksClient } from "./BlocksClient";

export default function BlocksServerComponent({ id }: { id: string }) {
    // Usar el hook para obtener el proyecto
    const { data: project, isLoading, error } = useProject(id);

    // Mostrar loading spinner mientras carga
    if (isLoading) {
        return (
            <div className="space-y-6">
                <HeaderPage title="Manzanas" description="Cargando proyecto..." />
                <LoadingSpinner text="Cargando proyecto..." />
            </div>
        );
    }

    // Mostrar error si hay algún problema
    if (error || !project) {
        return (
            <div className="space-y-6">
                <HeaderPage title="Manzanas" description="Sin ubicación" />
                <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                    <Building2 className="w-12 h-12 text-red-400 mb-2" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                        Error al cargar proyecto
                    </h3>
                    <p className="text-gray-500">
                        {error?.message ?? "Ha ocurrido un error al cargar el proyecto. Inténtalo de nuevo."}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <BlocksClient projectId={id} project={project} />
        </div>
    );
}
