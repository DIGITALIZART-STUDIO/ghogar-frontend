"use client";

import * as React from "react";
import { ProjectData } from "@/app/(admin)/admin/projects/_types/project";

interface ProjectContextType {
    selectedProject: ProjectData | null;
    setSelectedProject: (project: ProjectData | null) => void;
    projects: Array<ProjectData>;
    setProjects: (projects: Array<ProjectData>) => void;
    isAllProjectsSelected: boolean;
    setIsAllProjectsSelected: (isAll: boolean) => void;
}

const ProjectContext = React.createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
    const [selectedProject, setSelectedProject] = React.useState<ProjectData | null>(null);
    const [projects, setProjects] = React.useState<Array<ProjectData>>([]);
    const [isAllProjectsSelected, setIsAllProjectsSelected] = React.useState<boolean>(false);

    // Persistir el proyecto seleccionado en localStorage
    React.useEffect(() => {
        const savedProject = localStorage.getItem("selectedProject");
        const savedAllProjects = localStorage.getItem("isAllProjectsSelected");
        if (savedProject) {
            try {
                setSelectedProject(JSON.parse(savedProject));
            } catch (error) {
                console.error("Error parsing saved project:", error);
                localStorage.removeItem("selectedProject");
            }
        }
        if (savedAllProjects) {
            try {
                setIsAllProjectsSelected(JSON.parse(savedAllProjects));
            } catch (error) {
                console.error("Error parsing saved all projects state:", error);
                localStorage.removeItem("isAllProjectsSelected");
            }
        }
    }, []);

    // Guardar en localStorage cuando cambie el proyecto seleccionado
    React.useEffect(() => {
        if (selectedProject) {
            localStorage.setItem("selectedProject", JSON.stringify(selectedProject));
            localStorage.setItem("isAllProjectsSelected", "false");
        } else {
            localStorage.removeItem("selectedProject");
        }
    }, [selectedProject]);

    // Guardar en localStorage cuando cambie el estado de "todos los proyectos"
    React.useEffect(() => {
        localStorage.setItem("isAllProjectsSelected", JSON.stringify(isAllProjectsSelected));
        if (isAllProjectsSelected) {
            localStorage.removeItem("selectedProject");
        }
    }, [isAllProjectsSelected]);

    const value = React.useMemo(
        () => ({
            selectedProject,
            setSelectedProject,
            projects,
            setProjects,
            isAllProjectsSelected,
            setIsAllProjectsSelected,
        }),
        [selectedProject, projects, isAllProjectsSelected]
    );

    return (
        <ProjectContext.Provider value={value}>
            {children}
        </ProjectContext.Provider>
    );
}

export function useProjectContext() {
    const context = React.useContext(ProjectContext);
    if (context === undefined) {
        throw new Error("useProjectContext must be used within a ProjectProvider");
    }
    return context;
}
