"use client";

import { useMemo } from "react";
import { toast } from "sonner";
import { MapPin, Building2 } from "lucide-react";

import { usePaginatedActiveProjectsWithSearch } from "../../_hooks/useProjects";
import { AutoComplete, Option } from "@/components/ui/autocomplete";
import { Badge } from "@/components/ui/badge";
import type { components } from "@/types/api";

type Project = components["schemas"]["ProjectDTO"];

interface ProjectSearchProps {
    disabled?: boolean;
    value: string;
    onSelect: (projectId: string, project: Project) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    preselectedId?: string;
}

export function ProjectSearch({
    disabled,
    value,
    onSelect,
    placeholder = "Selecciona un proyecto...",
    searchPlaceholder = "Buscar por nombre, ubicación...",
    emptyMessage = "No se encontraron proyectos",
    preselectedId,
}: ProjectSearchProps) {
    const { allProjects, query, handleScrollEnd, handleSearchChange, search } = usePaginatedActiveProjectsWithSearch(10, preselectedId);

    const projectOptions: Array<Option<Project>> = useMemo(() => allProjects.map((project) => ({
        value: project.id ?? "",
        label: project.name ?? "Sin nombre",
        entity: project,
        component: (
            <div className="flex items-center justify-between w-full" title={project.name ?? "Sin nombre"}>
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <span className="text-sm font-semibold truncate">
                        {project.name ?? "Sin nombre"}
                    </span>
                    {project.location && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{project.location}</span>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    {(project?.totalLots ?? 0) > 0 && (
                        <Badge variant="outline" className="text-xs">
                            <Building2 className="w-3 h-3 mr-1" />
                            {project.totalLots} lotes
                        </Badge>
                    )}
                    {(project?.availableLots ?? 0) > 0 && (
                        <Badge variant="secondary" className="text-xs">
                            {project.availableLots} disponibles
                        </Badge>
                    )}
                </div>
            </div>
        ),
    })), [allProjects]);

    const selectedProject = projectOptions.find((project) => project.value === value);

    const handleSelect = ({ value, entity }: Option<Project>) => {
        if (!entity) {
            toast.error("No se pudo seleccionar el proyecto. Por favor, inténtalo de nuevo.");
            return;
        }
        onSelect(value, entity);
    };

    return (
        <AutoComplete<Project>
            queryState={query}
            options={projectOptions}
            value={selectedProject}
            onValueChange={handleSelect}
            onSearchChange={handleSearchChange}
            onScrollEnd={handleScrollEnd}
            placeholder={placeholder}
            searchPlaceholder={searchPlaceholder}
            emptyMessage={
                search !== "" ? `No se encontraron resultados para "${search}"` : emptyMessage
            }
            debounceMs={400}
            regexInput={/^[a-zA-Z0-9\s\-.@]*$/}
            className="w-full"
            commandContentClassName="min-w-[400px]"
            variant="outline"
            disabled={disabled}
            showComponentOnSelection={false}
        />
    );
}
