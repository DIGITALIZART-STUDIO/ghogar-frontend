import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    GetPaginatedClients,
    DeleteClients,
    ActivateClients,
    CreateClient,
    UpdateClient,
    GetClientsSummary,
    ImportClients,
    DownloadClientsExcel,
    DownloadImportTemplate,
} from "../_actions/ClientActions";
import type { components } from "@/types/api";

// Hook para paginación de clientes
export function usePaginatedClients(page: number = 1, pageSize: number = 10) {
    return useQuery({
        queryKey: ["paginatedClients", page, pageSize],
        queryFn: async () => {
            const [data, error] = await GetPaginatedClients(page, pageSize);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
    });
}

// Hook para eliminar múltiples clientes
export function useDeleteClients() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (ids: Array<string>) => {
            const [data, error] = await DeleteClients(ids);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["paginatedClients"] });
        },
    });
}

// Hook para activar múltiples clientes
export function useActivateClients() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (ids: Array<string>) => {
            const [data, error] = await ActivateClients(ids);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["paginatedClients"] });
        },
    });
}

// Hook para crear un cliente
export function useCreateClient() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (client: components["schemas"]["ClientCreateDto"]) => {
            const [data, error] = await CreateClient(client);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["paginatedClients"] });
        },
    });
}

export function useUpdateClient() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, client }: { id: string; client: components["schemas"]["ClientUpdateDto"] }) => {
            const [data, error] = await UpdateClient(id, client);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["paginatedClients"] });
            queryClient.invalidateQueries({ queryKey: ["paginatedLeads"] });
            queryClient.invalidateQueries({ queryKey: ["paginatedLeadsByAssignedTo"] });
        },
    });
}

// Hook para obtener resumen de clientes
export function useClientsSummary() {
    return useQuery({
        queryKey: ["clientsSummary"],
        queryFn: async () => {
            const [data, error] = await GetClientsSummary();
            if (error) {
                throw new Error(error.message);
            }
            return data ?? [];
        },
    });
}

// Hook para importar clientes desde archivo
export function useImportClients() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (file: File) => {
            const [data, error] = await ImportClients(file);
            if (error) {
                throw new Error(error.message);
            }
            return data!;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["paginatedClients"] });
            queryClient.invalidateQueries({ queryKey: ["paginatedLeads"] });
            queryClient.invalidateQueries({ queryKey: ["paginatedLeadsByAssignedTo"] });
        },
    });
}

// Hook para descargar el Excel de clientes
export function useDownloadClientsExcel() {
    return useMutation({
        mutationFn: async () => {
            const [blob, error] = await DownloadClientsExcel();
            if (error) {
                throw new Error(error.message);
            }
            return blob!;
        },
    });
}

// Hook para descargar la plantilla de importación de clientes
export function useDownloadImportTemplate() {
    return useMutation({
        mutationFn: async () => {
            const [blob, error] = await DownloadImportTemplate();
            if (error) {
                throw new Error(error.message);
            }
            return blob!;
        },
    });
}

