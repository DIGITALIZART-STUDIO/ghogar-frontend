"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight } from "lucide-react";
import { useActiveProjects } from "@/app/(admin)/admin/projects/_hooks/useProjects";
import { useProjectContext } from "@/context/project-context";
import { ProjectData } from "@/app/(admin)/admin/projects/_types/project";
import { Button } from "@/components/ui/button";
import { LoadingSpinner, FullPageLoader } from "@/components/ui/loading-spinner";
import ErrorGeneral from "@/components/errors/general-error";
import { toast } from "sonner";
import HomeAllProjectsCard from "./HomeAllProjectsCard";
import HomeProjectCard from "./HomeProjectCard";

export function ProjectSelectionPage() {
    const router = useRouter();
    const { data: activeProjects = [], isLoading, error } = useActiveProjects();
    const { setSelectedProject, setIsAllProjectsSelected } = useProjectContext();
    const [selectedProject, setSelectedProjectState] = useState<ProjectData | "all" | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSelectProject = (project: ProjectData | "all") => {
        setSelectedProjectState(project);
    };

    const handleContinue = async () => {
        if (!selectedProject) {
            toast.error("Por favor selecciona un proyecto");
            return;
        }

        setIsSubmitting(true);

        try {
            if (selectedProject === "all") {
                // Para "Todos los proyectos", establecemos el estado correspondiente
                setIsAllProjectsSelected(true);
                setSelectedProject(null);
            } else {
                setSelectedProject(selectedProject);
                setIsAllProjectsSelected(false);
            }

            toast.success("Proyecto seleccionado correctamente");

            // Pequeña animación antes de redirigir
            setTimeout(() => {
                router.push("/");
            }, 500);
        } catch {
            toast.error("Error al seleccionar el proyecto");
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-gradient-to-br from-primary/5 via-background to-primary/5">
                <FullPageLoader text="Cargando proyectos..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gradient-to-br from-primary/5 via-background to-primary/5 min-h-screen">
                <ErrorGeneral />
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-primary/5 via-background to-primary/5">
            <div className="px-4 py-8">
                <div className="text-center mb-8 animate-in fade-in-50 duration-500">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Sparkles className="size-6 text-primary" />
                        <h1 className="text-xl font-semibold">¡Bienvenido!</h1>
                        <Sparkles className="size-6 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Selecciona el proyecto con el que deseas trabajar o elige acceder a todos los proyectos
                    </p>
                </div>

                <div className="w-full">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                        {/* Opción "Todos los proyectos" */}
                        <HomeAllProjectsCard
                            isSelected={selectedProject === "all"}
                            onSelect={() => handleSelectProject("all")}
                        />

                        {/* Proyectos individuales */}
                        {activeProjects.map((project) => (
                            <HomeProjectCard
                                key={project.id}
                                project={project}
                                isSelected={selectedProject !== "all" && selectedProject?.id === project.id}
                                onSelect={() => handleSelectProject(project)}
                            />
                        ))}
                    </div>

                    {/* Botón en la parte superior derecha */}
                    <div className="flex justify-end mb-6">
                        <Button
                            onClick={handleContinue}
                            disabled={!selectedProject || isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <LoadingSpinner size="sm" className="mr-2 border-white/20 border-t-white" />
                                    Configurando...
                                </>
                            ) : (
                                <>
                                    Continuar
                                    <ArrowRight className="ml-2 size-4" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
