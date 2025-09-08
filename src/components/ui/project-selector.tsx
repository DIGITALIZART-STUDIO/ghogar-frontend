"use client";

import { Check, Building2, ChevronDown } from "lucide-react";
import { useProjectContext } from "@/context/project-context";
import { useActiveProjects } from "@/app/(admin)/admin/projects/_hooks/useProjects";
import { useEffect } from "react";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";

export function ProjectSelector() {
    const {
        selectedProject,
        setSelectedProject,
        setProjects,
        isAllProjectsSelected,
        setIsAllProjectsSelected
    } = useProjectContext();
    const { data: activeProjects = [], isLoading, error } = useActiveProjects();

    // Actualizar la lista de proyectos en el contexto cuando se carguen
    useEffect(() => {
        if (activeProjects.length > 0) {
            setProjects(activeProjects);

            // Si no hay proyecto seleccionado ni "todos los proyectos" seleccionado,
            // y hay proyectos disponibles, seleccionar el primero
            if (!selectedProject && !isAllProjectsSelected && activeProjects.length > 0) {
                setSelectedProject(activeProjects[0]);
            }
        }
    }, [activeProjects, selectedProject, isAllProjectsSelected, setProjects, setSelectedProject]);

    if (isLoading) {
        return (
            <Button variant="outline" size="sm" disabled className="min-w-[200px]">
                <Building2 className="size-4 mr-2" />
                Cargando proyectos...
            </Button>
        );
    }

    if (error) {
        return (
            <Button variant="outline" size="sm" disabled className="min-w-[200px]">
                <Building2 className="size-4 mr-2" />
                Error al cargar proyectos
            </Button>
        );
    }

    if (activeProjects.length === 0) {
        return (
            <Button variant="outline" size="sm" disabled className="min-w-[200px]">
                <Building2 className="size-4 mr-2" />
                No hay proyectos activos
            </Button>
        );
    }

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="min-w-[200px] justify-between">
                    <div className="flex items-center">
                        <Building2 className="size-4 mr-2" />
                        <span className="truncate">
                            {isAllProjectsSelected
                                ? "Todos los proyectos"
                                : selectedProject?.name ?? "Seleccionar proyecto"
                            }
                        </span>
                    </div>
                    <ChevronDown className="size-4 ml-2" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[250px]">
                {/* Opción "Todos los proyectos" */}
                <DropdownMenuItem
                    onClick={() => {
                        setIsAllProjectsSelected(true);
                        setSelectedProject(null);
                    }}
                    className="flex items-center justify-between"
                >
                    <div className="flex flex-col items-start">
                        <span className="font-medium">Todos los proyectos</span>
                        <span className="text-xs text-muted-foreground">
                            Acceso completo
                        </span>
                    </div>
                    <Check
                        size={14}
                        className={cn(
                            "ml-auto",
                            !isAllProjectsSelected && "hidden"
                        )}
                    />
                </DropdownMenuItem>

                {/* Proyectos individuales */}
                {activeProjects.map((project) => (
                    <DropdownMenuItem
                        key={project.id}
                        onClick={() => {
                            setSelectedProject(project);
                            setIsAllProjectsSelected(false);
                        }}
                        className="flex items-center justify-between"
                    >
                        <div className="flex flex-col items-start">
                            <span className="font-medium">{project.name}</span>
                            <span className="text-xs text-muted-foreground">
                                {project.location}
                            </span>
                        </div>
                        <Check
                            size={14}
                            className={cn(
                                "ml-auto",
                                selectedProject?.id !== project.id && "hidden"
                            )}
                        />
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
