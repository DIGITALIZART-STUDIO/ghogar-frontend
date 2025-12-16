import { useProjectContext } from "@/context/project-context";
import { ProjectData } from "@/app/(admin)/admin/projects/_types/project";

/**
 * Hook personalizado para acceder al proyecto seleccionado y sus métodos
 * @returns Objeto con el proyecto seleccionado y métodos para manejarlo
 */
export function useSelectedProject() {
    const {
        selectedProject,
        setSelectedProject,
        projects,
        isAllProjectsSelected,
        setIsAllProjectsSelected
    } = useProjectContext();

    /**
     * Obtiene el ID del proyecto seleccionado
     */
    const getSelectedProjectId = (): string | null => selectedProject?.id ?? null;

    /**
     * Verifica si hay un proyecto seleccionado o si está seleccionado "Todos los proyectos"
     */
    const hasSelectedProject = (): boolean => selectedProject !== null || isAllProjectsSelected;

    /**
     * Obtiene el nombre del proyecto seleccionado
     */
    const getSelectedProjectName = (): string => {
        if (isAllProjectsSelected) {
            return "Todos los proyectos";
        }
        return selectedProject?.name ?? "Sin proyecto seleccionado";
    };

    /**
     * Obtiene la ubicación del proyecto seleccionado
     */
    const getSelectedProjectLocation = (): string => selectedProject?.location ?? "";

    /**
     * Obtiene la moneda del proyecto seleccionado
     */
    const getSelectedProjectCurrency = (): string => selectedProject?.currency ?? "";

    /**
     * Busca un proyecto por ID en la lista de proyectos
     */
    const findProjectById = (id: string): ProjectData | undefined => projects.find((project) => project.id === id);

    /**
     * Verifica si un proyecto específico está seleccionado
     */
    const isProjectSelected = (projectId: string): boolean => selectedProject?.id === projectId;

    /**
     * Selecciona "Todos los proyectos"
     */
    const selectAllProjects = (): void => {
        setIsAllProjectsSelected(true);
        setSelectedProject(null);
    };

    /**
     * Selecciona un proyecto específico
     */
    const selectProject = (project: ProjectData): void => {
        setSelectedProject(project);
        setIsAllProjectsSelected(false);
    };

    return {
        // Estado
        selectedProject,
        projects,
        isAllProjectsSelected,

        // Métodos de selección
        setSelectedProject,
        setIsAllProjectsSelected,
        selectAllProjects,
        selectProject,

        // Métodos de utilidad
        getSelectedProjectId,
        hasSelectedProject,
        getSelectedProjectName,
        getSelectedProjectLocation,
        getSelectedProjectCurrency,
        findProjectById,
        isProjectSelected,
    };
}
