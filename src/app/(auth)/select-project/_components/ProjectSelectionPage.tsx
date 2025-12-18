"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Building2, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { usePaginatedActiveProjectsWithSearch } from "@/app/(admin)/admin/projects/_hooks/useProjects";
import { ProjectData } from "@/app/(admin)/admin/projects/_types/project";
import ErrorGeneral from "@/components/errors/general-error";
import { Button } from "@/components/ui/button";
import { FullPageLoader, LoadingSpinner } from "@/components/ui/loading-spinner";
import { Separator } from "@/components/ui/separator";
import { useProjectContext } from "@/context/project-context";
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
    isFetchingNextPage,
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
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="text-center mb-6 sm:mb-8 animate-in fade-in-50 duration-500">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="size-5 sm:size-6 text-primary" />
            <h1 className="text-lg sm:text-xl font-semibold">¡Bienvenido!</h1>
            <Sparkles className="size-5 sm:size-6 text-primary" />
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground px-4">
            Selecciona el proyecto con el que deseas trabajar o elige acceder a todos los proyectos
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 min-h-[400px] lg:min-h-[600px]">
          {/* Columna izquierda - Proyectos */}
          <div className="flex-1 order-2 lg:order-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Opción "Todos los proyectos" */}
              <HomeAllProjectsCard isSelected={selectedProject === "all"} onSelect={() => handleSelectProject("all")} />

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
              <div className="flex justify-center items-center py-6 sm:py-8">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-xs sm:text-sm">Cargando más proyectos...</span>
                </div>
              </div>
            )}

            {/* Elemento invisible para detectar scroll infinito */}
            {hasNextPage && <div ref={loadMoreRef} className="h-4" />}
          </div>

          {/* Separador - Vertical en desktop, horizontal en móvil */}
          <div className="flex items-center order-1 lg:order-2">
            <Separator orientation="vertical" className="hidden lg:block h-full min-h-[400px]" />
            <Separator orientation="horizontal" className="lg:hidden w-full" />
          </div>

          {/* Columna derecha - Información y botón */}
          <div className="w-full lg:w-80 flex flex-col order-3">
            <div className="sticky top-4 sm:top-8">
              <div className="bg-background/80 backdrop-blur-sm border rounded-lg p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Proyecto Seleccionado</h3>

                {selectedProject ? (
                  <div className="space-y-3 sm:space-y-4">
                    {selectedProject === "all" ? (
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-medium text-sm sm:text-base">Todos los Proyectos</h4>
                            <p className="text-xs sm:text-sm text-muted-foreground">Acceso completo</p>
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Tendrás acceso a todos los proyectos activos del sistema.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-medium text-sm sm:text-base truncate">{selectedProject.name}</h4>
                            <p className="text-xs sm:text-sm text-muted-foreground">Proyecto activo</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <Separator />

                    <Button
                      onClick={handleContinue}
                      disabled={!selectedProject || isSubmitting}
                      className="w-full text-sm sm:text-base"
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
                  <div className="text-center py-6 sm:py-8">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground px-2">
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
