import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    GetAllProjects,
    GetActiveProjects,
    GetProject,
    CreateProject,
    UpdateProject,
    DeleteProject,
    ActivateProject,
    DeactivateProject,
} from "../_actions/ProjectActions";
import { CreateProjectSchema } from "../_schemas/createProjectsSchema";

// Hook para obtener todos los proyectos
export function useAllProjects() {
    return useQuery({
        queryKey: ["allProjects"],
        queryFn: async () => {
            const [data, error] = await GetAllProjects();
            if (error) {
                throw new Error(error.message);
            }
            return data ?? [];
        },
    });
}

// Hook para obtener proyectos activos
export function useActiveProjects() {
    return useQuery({
        queryKey: ["activeProjects"],
        queryFn: async () => {
            const [data, error] = await GetActiveProjects();
            if (error) {
                throw new Error(error.message);
            }
            return data ?? [];
        },
    });
}

// Hook para obtener un proyecto específico
export function useProject(id: string) {
    return useQuery({
        queryKey: ["project", id],
        queryFn: async () => {
            const [data, error] = await GetProject(id);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        enabled: !!id,
    });
}

// Hook para crear un proyecto
export function useCreateProject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (project: CreateProjectSchema) => {
            const [data, error] = await CreateProject(project);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allProjects"] });
            queryClient.invalidateQueries({ queryKey: ["activeProjects"] });
        },
    });
}

// Hook para actualizar un proyecto
export function useUpdateProject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, project }: { id: string; project: CreateProjectSchema }) => {
            const [data, error] = await UpdateProject(id, project);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["allProjects"] });
            queryClient.invalidateQueries({ queryKey: ["activeProjects"] });
            queryClient.invalidateQueries({ queryKey: ["project", id] });
        },
    });
}

// Hook para eliminar un proyecto
export function useDeleteProject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const [data, error] = await DeleteProject(id);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["allProjects"] });
            queryClient.invalidateQueries({ queryKey: ["activeProjects"] });
        },
    });
}

// Hook para activar un proyecto
export function useActivateProject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const [data, error] = await ActivateProject(id);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ["allProjects"] });
            queryClient.invalidateQueries({ queryKey: ["activeProjects"] });
            queryClient.invalidateQueries({ queryKey: ["project", id] });
        },
    });
}

// Hook para desactivar un proyecto
export function useDeactivateProject() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const [data, error] = await DeactivateProject(id);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ["allProjects"] });
            queryClient.invalidateQueries({ queryKey: ["activeProjects"] });
            queryClient.invalidateQueries({ queryKey: ["project", id] });
        },
    });
}
