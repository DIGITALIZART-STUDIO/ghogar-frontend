import { useQueryClient } from "@tanstack/react-query";
import { backend as api, downloadFileWithClient } from "@/types/backend";
import { useAuthContext } from "@/context/auth-provider";
import { useSelectedProject } from "@/hooks/use-selected-project";

// Hook para reservas canceladas (no paginado)
export function useCanceledReservations() {
    const { handleAuthError } = useAuthContext();

    return api.useQuery("get", "/api/Reservations/canceled", {
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para reservas canceladas pendientes de validación paginadas
export function usePaginatedCanceledPendingValidationReservations(page: number = 1, pageSize: number = 10) {
    const { selectedProject, isAllProjectsSelected } = useSelectedProject();
    const { handleAuthError } = useAuthContext();

    // Determinar el projectId a enviar: si es "Todos los proyectos" no se envía nada
    const projectIdToSend = isAllProjectsSelected ? null : selectedProject?.id;

    return api.useQuery("get", "/api/Reservations/canceled/pending-validation/paginated", {
        params: {
            query: {
                page,
                pageSize,
                ...(projectIdToSend && { projectId: projectIdToSend }),
            },
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para reservas canceladas paginadas (retorna la query completa)
export function usePaginatedCanceledReservations(page: number = 1, pageSize: number = 10) {
    const { selectedProject, isAllProjectsSelected } = useSelectedProject();
    const { handleAuthError } = useAuthContext();

    // Determinar el projectId a enviar: si es "Todos los proyectos" no se envía nada
    const projectIdToSend = isAllProjectsSelected ? null : selectedProject?.id;

    return api.useQuery("get", "/api/Reservations/canceled/paginated", {
        params: {
            query: {
                page,
                pageSize,
                ...(projectIdToSend && { projectId: projectIdToSend }),
            },
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para reservas con pagos pendientes paginadas
export function usePaginatedReservationsWithPendingPayments(page: number = 1, pageSize: number = 10) {
    const { selectedProject, isAllProjectsSelected } = useSelectedProject();
    const { handleAuthError } = useAuthContext();

    // Determinar el projectId a enviar: si es "Todos los proyectos" no se envía nada
    const projectIdToSend = isAllProjectsSelected ? null : selectedProject?.id;

    return api.useQuery("get", "/api/Reservations/pending-payments/paginated", {
        params: {
            query: {
                page,
                pageSize,
                ...(projectIdToSend && { projectId: projectIdToSend }),
            },
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para obtener una reserva por ID
export function useReservationById(reservationId: string, enabled = true) {
    const { handleAuthError } = useAuthContext();

    return api.useQuery("get", "/api/Reservations/{id}", {
        params: {
            path: { id: reservationId },
        },
        enabled: !!reservationId && enabled,
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para obtener todas las reservas
export function useAllReservations() {
    const { handleAuthError } = useAuthContext();

    return api.useQuery("get", "/api/Reservations", {
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para obtener reservas por ID de cliente
export function useReservationsByClientId(clientId: string) {
    const { handleAuthError } = useAuthContext();

    return api.useQuery("get", "/api/Reservations/client/{clientId}", {
        params: {
            path: { clientId },
        },
        enabled: !!clientId,
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para obtener reservas por ID de cotización
export function useReservationsByQuotationId(quotationId: string) {
    const { handleAuthError } = useAuthContext();

    return api.useQuery("get", "/api/Reservations/quotation/{quotationId}", {
        params: {
            path: { quotationId },
        },
        enabled: !!quotationId,
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para crear una nueva reserva
export function useCreateReservation() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("post", "/api/Reservations", {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reservations"] });
            queryClient.invalidateQueries({ queryKey: ["canceledReservations"] });
            queryClient.invalidateQueries({ queryKey: ["canceledReservationsPaginated"] });
            queryClient.invalidateQueries({ queryKey: ["canceledPendingValidationReservationsPaginated"] });
            queryClient.invalidateQueries({ queryKey: ["reservationsWithPendingPaymentsPaginated"] });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para actualizar una reserva existente
export function useUpdateReservation() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("patch", "/api/Reservations/{id}", {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reservations"] });
            queryClient.invalidateQueries({ queryKey: ["reservation"] });
            queryClient.invalidateQueries({ queryKey: ["canceledReservations"] });
            queryClient.invalidateQueries({ queryKey: ["canceledReservationsPaginated"] });
            queryClient.invalidateQueries({ queryKey: ["canceledPendingValidationReservationsPaginated"] });
            queryClient.invalidateQueries({ queryKey: ["reservationsWithPendingPaymentsPaginated"] });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para eliminar una reserva
export function useDeleteReservation() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("delete", "/api/Reservations/{id}", {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reservations"] });
            queryClient.invalidateQueries({ queryKey: ["reservation"] });
            queryClient.invalidateQueries({ queryKey: ["canceledReservations"] });
            queryClient.invalidateQueries({ queryKey: ["canceledReservationsPaginated"] });
            queryClient.invalidateQueries({ queryKey: ["canceledPendingValidationReservationsPaginated"] });
            queryClient.invalidateQueries({ queryKey: ["reservationsWithPendingPaymentsPaginated"] });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para cambiar el estado de una reserva
export function useChangeReservationStatus() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("put", "/api/Reservations/{id}/status", {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reservations"] });
            queryClient.invalidateQueries({ queryKey: ["reservation"] });
            queryClient.invalidateQueries({ queryKey: ["canceledReservations"] });
            queryClient.invalidateQueries({ queryKey: ["canceledReservationsPaginated"] });
            queryClient.invalidateQueries({ queryKey: ["canceledPendingValidationReservationsPaginated"] });
            queryClient.invalidateQueries({ queryKey: ["reservationsWithPendingPaymentsPaginated"] });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para cambiar el estado de validación del contrato
export function useToggleContractValidationStatus() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("put", "/api/Reservations/{id}/toggle-validation-status", {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reservations"] });
            queryClient.invalidateQueries({ queryKey: ["reservation"] });
            queryClient.invalidateQueries({ queryKey: ["canceledReservations"] });
            queryClient.invalidateQueries({ queryKey: ["canceledReservationsPaginated"] });
            queryClient.invalidateQueries({ queryKey: ["canceledPendingValidationReservationsPaginated"] });
            queryClient.invalidateQueries({ queryKey: ["reservationsWithPendingPaymentsPaginated"] });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para descargar PDF de reserva
export function useDownloadReservationPDF() {
    const { handleAuthError } = useAuthContext();

    return async (id: string) => {
        try {
            return await downloadFileWithClient(
                "/api/Reservations/{id}/pdf",
                { path: { id } }
            );
        } catch (error) {
            await handleAuthError(error);
            throw error;
        }
    };
}

// Hook para descargar PDF de contrato de reserva
export function useDownloadReservationContractPDF() {
    const { handleAuthError } = useAuthContext();

    return async (id: string) => {
        try {
            return await downloadFileWithClient(
                "/api/Reservations/{id}/contract/pdf",
                { path: { id } }
            );
        } catch (error) {
            await handleAuthError(error);
            throw error;
        }
    };
}

// Hook para descargar DOCX de contrato de reserva
export function useDownloadReservationContractDOCX() {
    const { handleAuthError } = useAuthContext();

    return async (id: string) => {
        try {
            return await downloadFileWithClient(
                "/api/Reservations/{id}/contract/docx",
                { path: { id } }
            );
        } catch (error) {
            await handleAuthError(error);
            throw error;
        }
    };
}

// Hook para descargar PDF de cronograma de reserva
export function useDownloadReservationSchedulePDF() {
    const { handleAuthError } = useAuthContext();

    return async (id: string) => {
        try {
            return await downloadFileWithClient(
                "/api/Reservations/{id}/schedule/pdf",
                { path: { id } }
            );
        } catch (error) {
            await handleAuthError(error);
            throw error;
        }
    };
}

// Hook para descargar PDF de contrato de documento
export function useDownloadContractPDF() {
    const { handleAuthError } = useAuthContext();

    return async (contractId: string) => {
        try {
            return await downloadFileWithClient(
                "/api/Documents/{contractId}/pdf",
                { path: { contractId } }
            );
        } catch (error) {
            await handleAuthError(error);
            throw error;
        }
    };
}
