"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Loader2, Building2} from "lucide-react";
import { usePaginatedActiveProjectsWithSearch } from "@/app/(admin)/admin/projects/_hooks/useProjects";
import { useProjectContext } from "@/context/project-context";
import { ProjectData } from "@/app/(admin)/admin/projects/_types/project";
import { Button } from "@/components/ui/button";
import { LoadingSpinner, FullPageLoader } from "@/components/ui/loading-spinner";
import { Separator } from "@/components/ui/separator";
import ErrorGeneral from "@/components/errors/general-error";
import { toast } from "sonner";
import HomeAllProjectsCard from "./HomeAllProjectsCard";
import HomeProjectCard from "./HomeProjectCard";

export function ProjectSelectionPage() {
    const router = useRouter();
    const {
        allProjects: activeProjects,
        handleScrollEnd,
        isLoading,
        isError,
        hasNextPage,
        isFetchingNextPage
    } = usePaginatedActiveProjectsWithSearch(8); // 8 proyectos por página
    const { setSelectedProject, setIsAllProjectsSelected } = useProjectContext();
    const [selectedProject, setSelectedProjectState] = useState<ProjectData | "all" | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
                rootMargin: "100px", // Cargar cuando esté a 100px del final
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

    if (isError) {
        return (
            <div className="bg-gradient-to-br from-primary/5 via-background to-primary/5 min-h-screen">
                <ErrorGeneral />
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-primary/5 via-background to-primary/5 min-h-screen">
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

                <div className="flex gap-8 min-h-[600px]">
                    {/* Columna izquierda - Proyectos */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

                        {/* Indicador de carga para más proyectos */}
                        {isFetchingNextPage && (
                            <div className="flex justify-center items-center py-8">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span className="text-sm">Cargando más proyectos...</span>
                                </div>
                            </div>
                        )}

                        {/* Elemento invisible para detectar scroll infinito */}
                        {hasNextPage && (
                            <div ref={loadMoreRef} className="h-4" />
                        )}
                    </div>

                    {/* Separador vertical */}
                    <div className="flex items-center">
                        <Separator orientation="vertical" className="h-full min-h-[400px]" />
                    </div>

                    {/* Columna derecha - Información y botón */}
                    <div className="w-80 flex flex-col">
                        <div className="sticky top-8">
                            <div className="bg-background/80 backdrop-blur-sm border rounded-lg p-6">
                                <h3 className="text-lg font-semibold mb-4">Proyecto Seleccionado</h3>

                                {selectedProject ? (
                                    <div className="space-y-4">
                                        {selectedProject === "all" ? (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                        <Building2 className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium">Todos los Proyectos</h4>
                                                        <p className="text-sm text-muted-foreground">Acceso completo</p>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    Tendrás acceso a todos los proyectos activos del sistema.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                        <Building2 className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium">{selectedProject.name}</h4>
                                                        <p className="text-sm text-muted-foreground">Proyecto activo</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <Separator />

                                        <Button
                                            onClick={handleContinue}
                                            disabled={!selectedProject || isSubmitting}
                                            className="w-full"
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
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                                            <Building2 className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Selecciona un proyecto para ver los detalles
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
