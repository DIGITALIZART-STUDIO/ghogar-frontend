"use client";

import { useCallback, useState } from "react";
import { HeaderPage } from "@/components/common/HeaderPage";
import ErrorGeneral from "@/components/errors/general-error";
import { useUsers } from "@/app/(admin)/admin/users/_hooks/useUser";
import { usePaginatedLeadsByAssignedTo } from "../leads/_hooks/useLeads";
import { AssignmentsTable } from "./_components/table/AssignmentsTable";

export default function AssignmentsPage() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Obtener usuario actual
    const { data: userData, isLoading: isLoadingUser, error: errorUser } = useUsers();

    // Esperar a tener el usuario antes de pedir los leads
    const userId = userData?.user?.id ?? "";

    const { data: paginatedLeads, isLoading, error } = usePaginatedLeadsByAssignedTo(userId, page, pageSize);

    const handlePaginationChange = useCallback(async (newPage: number, newPageSize: number) => {
        setPage(newPage);
        setPageSize(newPageSize);
    }, []);

    if (isLoadingUser) {
        return (
            <div>
                <HeaderPage title="Mis Leads Asignados" description="Cargando usuario..." />
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

    if (isLoading) {
        return (
            <div>
                <HeaderPage title="Mis Leads Asignados" description="Cargando leads asignados..." />
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
            <HeaderPage title="Mis Leads Asignados" description="Gestión de prospectos comerciales asignados a tu usuario." />
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <AssignmentsTable
                    data={paginatedLeads.data}
                    pagination={{
                        page: paginatedLeads.meta.page ?? 1,
                        pageSize: paginatedLeads.meta.pageSize ?? 10,
                        total: paginatedLeads.meta.total ?? 0,
                        totalPages: paginatedLeads.meta.totalPages ?? 1,
                    }}
                    onPaginationChange={handlePaginationChange}
                />
            </div>
        </div>
    );
}
