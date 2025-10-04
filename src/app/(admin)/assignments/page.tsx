"use client";

import { useCallback, useState, useEffect } from "react";
import { HeaderPage } from "@/components/common/HeaderPage";
import ErrorGeneral from "@/components/errors/general-error";
import { useUsers } from "@/app/(admin)/admin/users/_hooks/useUser";
import { usePaginatedLeadsByAssignedTo } from "../leads/_hooks/useLeads";
import { AssignmentsTable } from "./_components/table/AssignmentsTable";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import { useClientStore } from "./_store/useClientStore";

export default function AssignmentsPage() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Obtener usuario actual
    const { data: userData, isLoading: isLoadingUser, error: errorUser } = useUsers();

    // Esperar a tener el usuario antes de pedir los leads
    const userId = userData?.user?.id ?? "";

    // Obtener el cliente seleccionado del store
    const { selectedClientId, clients } = useClientStore();

    const {
        data: paginatedLeads,
        isLoading,
        error,
        search,
        setSearch,
        status,
        setStatus,
        captureSource,
        setCaptureSource,
        completionReason,
        setCompletionReason,
        clientId,
        setClientId,
        handleOrderChange,
        resetFilters
    } = usePaginatedLeadsByAssignedTo(userId, page, pageSize);

    // Sincronizar el cliente seleccionado con el filtro de leads
    useEffect(() => {
        if (selectedClientId !== clientId) {
            setClientId(selectedClientId);
        }
    }, [selectedClientId, clientId, setClientId]);

    const handlePaginationChange = useCallback(async (newPage: number, newPageSize: number) => {
        setPage(newPage);
        setPageSize(newPageSize);
    }, []);

    // Obtener información del cliente seleccionado
    const selectedClient = clients.find((client) => client.id === selectedClientId);

    if (isLoadingUser) {
        return (
            <div>
                <HeaderPage title="Mis Leads Asignados" description="Cargando usuario..." />
                <DataTableSkeleton columns={7} numFilters={3} />
            </div>
        );
    }

    if (errorUser || !userId) {
        return (
            <div>
                <HeaderPage title="Mis Leads Asignados" description="Gestión de prospectos comerciales asignados a tu usuario." />
                <ErrorGeneral />
            </div>
        );
    }

    if (isLoading && !paginatedLeads) {
        return (
            <div>
                <HeaderPage title="Mis Leads Asignados" description="Cargando leads asignados..." />
                <DataTableSkeleton columns={7} numFilters={3} />
            </div>
        );
    }

    if (error || !paginatedLeads) {
        return (
            <div>
                <HeaderPage title="Mis Leads Asignados" description="Gestión de prospectos comerciales asignados a tu usuario." />
                <ErrorGeneral />
            </div>
        );
    }

    return (
        <div>
            <HeaderPage
                title="Mis Leads Asignados"
                description={
                    selectedClient
                        ? `Leads asignados a ti - Filtrado por: ${selectedClient.name}`
                        : "Gestión de prospectos comerciales asignados a tu usuario."
                }
            />

            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <AssignmentsTable
                    data={paginatedLeads.data ?? []}
                    pagination={{
                        page: paginatedLeads.meta?.page ?? 1,
                        pageSize: paginatedLeads.meta?.pageSize ?? 10,
                        total: paginatedLeads.meta?.total ?? 0,
                        totalPages: paginatedLeads.meta?.totalPages ?? 1,
                    }}
                    onPaginationChange={handlePaginationChange}
                    search={search}
                    setSearch={setSearch}
                    status={status}
                    setStatus={setStatus}
                    captureSource={captureSource}
                    setCaptureSource={setCaptureSource}
                    completionReason={completionReason}
                    setCompletionReason={setCompletionReason}
                    handleOrderChange={handleOrderChange}
                    resetFilters={resetFilters}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}
