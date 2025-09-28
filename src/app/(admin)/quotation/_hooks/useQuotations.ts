import { useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { backend as api, downloadFileWithClient } from "@/types/backend";
import { useAuthContext } from "@/context/auth-provider";
import { useQuotationsByAdvisorPagination } from "@/app/(admin)/quotation/_hooks/useQuotationsByAdvisorPagination";

// Todas las cotizaciones
export function useAllQuotations() {
    const { handleAuthError } = useAuthContext();

    return api.useQuery("get", "/api/Quotations", {
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Cotización por ID
export function useQuotationById(id: string, enabled = true) {
    const { handleAuthError } = useAuthContext();

    return api.useQuery("get", "/api/Quotations/{id}", {
        params: {
            path: { id },
        },
        enabled: !!id && enabled,
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Cotizaciones por ID de reserva
export function useQuotationByReservationId(reservationId: string, enabled = true) {
    const { handleAuthError } = useAuthContext();

    return api.useQuery("get", "/api/Quotations/by-reservation/{reservationId}", {
        params: {
            path: { reservationId },
        },
        enabled: !!reservationId && enabled,
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Cotizaciones por asesor
export function useQuotationsByAdvisor(advisorId: string, enabled = true) {
    const { handleAuthError } = useAuthContext();

    return api.useQuery("get", "/api/Quotations/advisor/{advisorId}", {
        params: {
            path: { advisorId },
        },
        enabled: !!advisorId && enabled,
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Crear cotización
export function useCreateQuotation() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("post", "/api/Quotations", {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["quotations"] });
            queryClient.invalidateQueries({ queryKey: ["quotationsByAdvisorPaginated"] });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Actualizar cotización
export function useUpdateQuotation() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("put", "/api/Quotations/{id}", {
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["quotations"] });
            queryClient.invalidateQueries({ queryKey: ["quotation", variables.params.path.id] });
            queryClient.invalidateQueries({ queryKey: ["quotationsByAdvisorPaginated"] });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Eliminar cotización
export function useDeleteQuotation() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("delete", "/api/Quotations/{id}", {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["quotations"] });
            queryClient.invalidateQueries({ queryKey: ["quotationsByAdvisorPaginated"] });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Cambiar estado de cotización
export function useChangeQuotationStatus() {
    const queryClient = useQueryClient();
    const { handleAuthError } = useAuthContext();

    return api.useMutation("put", "/api/Quotations/{id}/status", {
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["quotations"] });
            queryClient.invalidateQueries({ queryKey: ["quotation", variables.params.path.id] });
            queryClient.invalidateQueries({ queryKey: ["quotationsByAdvisorPaginated"] });
        },
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Enviar OTP a un usuario
export function useSendOtpToUser() {
    const { handleAuthError } = useAuthContext();

    return api.useMutation("post", "/api/Quotations/{userId}/send-otp", {
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Validar OTP de un usuario
export function useValidateOtp() {
    const { handleAuthError } = useAuthContext();

    return api.useMutation("post", "/api/Quotations/{userId}/validate-otp", {
        onError: async (error: unknown) => {
            await handleAuthError(error);
        },
    });
}

// Hook para paginación infinita de cotizaciones aceptadas con búsqueda
export function usePaginatedAcceptedQuotationsWithSearch(pageSize: number = 10, preselectedId?: string) {
    const [search, setSearch] = useState<string | undefined>(undefined);
    const [orderBy, setOrderBy] = useState<string | undefined>(undefined);
    const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
    const { handleAuthError } = useAuthContext();

    const query = api.useInfiniteQuery(
        "get",
        "/api/Quotations/advisor/accepted",
        {
            params: {
                query: {
                    search,
                    page: 1, // Este valor será reemplazado automáticamente por pageParam
                    pageSize,
                    orderBy,
                    orderDirection,
                    preselectedId,
                },
            },
        },
        {
            getNextPageParam: (lastPage) => {
                // Si hay más páginas disponibles, devolver el siguiente número de página
                if (lastPage.meta?.page && lastPage.meta?.totalPages && lastPage.meta.page < lastPage.meta.totalPages) {
                    return lastPage.meta.page + 1;
                }
                return undefined; // No hay más páginas
            },
            getPreviousPageParam: (firstPage) => {
                // Si no estamos en la primera página, devolver la página anterior
                if (firstPage.meta?.page && firstPage.meta.page > 1) {
                    return firstPage.meta.page - 1;
                }
                return undefined; // No hay páginas anteriores
            },
            initialPageParam: 1,
            pageParamName: "page", // Esto le dice a openapi-react-query que use "page" como parámetro de paginación
            onError: async (error: unknown) => {
                await handleAuthError(error);
            },
        }
    );

    // Obtener todas las cotizaciones de todas las páginas de forma plana
    const allQuotations = query.data?.pages.flatMap((page) => page.data ?? []) ?? [];

    const handleScrollEnd = useCallback(() => {
        if (query.hasNextPage && !query.isFetchingNextPage) {
            query.fetchNextPage();
        }
    }, [query]);

    const handleSearchChange = useCallback((value: string) => {
        if (value !== "None" && value !== null && value !== undefined) {
            setSearch(value.trim());
        } else {
            setSearch(undefined);
        }
    }, []);

    const handleOrderChange = useCallback((field: string, direction: "asc" | "desc") => {
        setOrderBy(field);
        setOrderDirection(direction);
    }, []);

    const resetSearch = useCallback(() => {
        setSearch(undefined);
        setOrderBy(undefined);
        setOrderDirection("asc");
    }, []);

    return {
        query,
        allQuotations, // Todas las cotizaciones acumuladas
        fetchNextPage: query.fetchNextPage,
        hasNextPage: query.hasNextPage,
        isFetchingNextPage: query.isFetchingNextPage,
        isLoading: query.isLoading,
        isError: query.isError,
        search,
        setSearch,
        orderBy,
        orderDirection,
        handleScrollEnd,
        handleSearchChange,
        handleOrderChange,
        resetSearch,
        // Información de paginación
        totalCount: query.data?.pages[0]?.meta?.total ?? 0,
        totalPages: query.data?.pages[0]?.meta?.totalPages ?? 0,
        currentPage: query.data?.pages[0]?.meta?.page ?? 1,
    };
}

// Hook para descargar PDF de cotización
export function useDownloadQuotationPDF() {
    const { handleAuthError } = useAuthContext();

    return async (quotationId: string) => {
        try {
            return await downloadFileWithClient(
                "/api/Quotations/{id}/pdf",
                { path: { id: quotationId } }
            );
        } catch (error) {
            await handleAuthError(error);
            throw error;
        }
    };
}

// Hook para descargar PDF de separación
export function useDownloadSeparationPDF() {
    const { handleAuthError } = useAuthContext();

    return async (quotationId: string) => {
        try {
            return await downloadFileWithClient(
                "/api/Quotations/{id}/separation/pdf",
                { path: { id: quotationId } }
            );
        } catch (error) {
            await handleAuthError(error);
            throw error;
        }
    };
}

// Hook para paginación de cotizaciones por asesor con filtros
export function usePaginatedQuotationsByAdvisor(page: number = 1, pageSize: number = 10) {
    return useQuotationsByAdvisorPagination(page, pageSize);
}
