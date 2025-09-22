"use client";

import { useMemo } from "react";
import { useProjectContext } from "@/context/project-context";
import { usePaginatedActiveProjectsWithSearch } from "@/app/(admin)/admin/projects/_hooks/useProjects";
import { AutoComplete, Option } from "@/components/ui/autocomplete";
import { ProjectData } from "@/app/(admin)/admin/projects/_types/project";

export function ProjectSelector() {
    const {
        selectedProject,
        setSelectedProject,
        isAllProjectsSelected,
        setIsAllProjectsSelected
    } = useProjectContext();

    // Usar el hook con paginación infinita y búsqueda
    const { allProjects, query, handleScrollEnd, handleSearchChange } =
        usePaginatedActiveProjectsWithSearch(10, selectedProject?.id);

    // Crear opciones para el AutoComplete
    const projectOptions: Array<Option<ProjectData>> = useMemo(() => {
        // Opción "Todos los proyectos"
        const allProjectsOption: Option<ProjectData> = {
            value: "all",
            label: "Todos los proyectos",
            entity: undefined,
        };

        // Opciones de proyectos individuales
        const individualProjectOptions: Array<Option<ProjectData>> = allProjects.map((project) => ({
            value: project.id ?? "",
            label: project.name ?? "Sin nombre",
            entity: project,
        }));

        return [allProjectsOption, ...individualProjectOptions];
    }, [allProjects]);

    // Determinar el valor seleccionado
    const selectedOption = useMemo(() => {
        if (isAllProjectsSelected) {
            return projectOptions.find((option) => option.value === "all");
        }
        if (selectedProject) {
            return projectOptions.find((option) => option.value === selectedProject.id);
        }
        return undefined;
    }, [isAllProjectsSelected, selectedProject, projectOptions]);

    // Manejar selección
    const handleSelect = ({ value, entity }: Option<ProjectData>) => {
        if (value === "all") {
            setIsAllProjectsSelected(true);
            setSelectedProject(null);
        } else {
            setIsAllProjectsSelected(false);
            setSelectedProject(entity ?? null);
        }
    };

    // Mostrar loading o error
    if (query.isLoading || query.isError) {
        return (
            <AutoComplete<ProjectData>
                queryState={query}
                options={[]}
                value={undefined}
                onValueChange={() => {}}
                onSearchChange={() => {}}
                onScrollEnd={() => {}}
                placeholder={query.isLoading ? "Cargando..." : "Error al cargar"}
                searchPlaceholder="Buscar proyectos..."
                emptyMessage={query.isLoading ? "Cargando..." : "Error al cargar"}
                debounceMs={400}
                className="w-full min-w-[200px]"
                variant="outline"
                disabled
                showComponentOnSelection={false}
            />
        );
    }

    return (
        <AutoComplete<ProjectData>
            queryState={query}
            options={projectOptions}
            value={selectedOption}
            onValueChange={handleSelect}
            onSearchChange={handleSearchChange}
            onScrollEnd={handleScrollEnd}
            placeholder="Seleccionar proyecto..."
            searchPlaceholder="Buscar proyectos..."
            emptyMessage="No hay proyectos disponibles"
            debounceMs={400}
            className="w-full min-w-[200px]"
            variant="outline"
            showComponentOnSelection={false}
        />
    );
}
