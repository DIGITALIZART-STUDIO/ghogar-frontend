"use client";

import { useCallback, useState } from "react";
import { HeaderPage } from "@/components/common/HeaderPage";
import { DataTableSkeleton } from "@/components/datatable/data-table-skeleton";
import ErrorGeneral from "@/components/errors/general-error";
import { usePaginatedUsers } from "./_hooks/useUser";
import { UsersTable } from "./_components/UsersTable";

export default function UsersPage() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const {
        data: paginatedUsers,
        isLoading,
        error,
        search,
        setSearch,
        isActive,
        setIsActive,
        roleName,
        setRoleName,
    } = usePaginatedUsers(page, pageSize);

    const handlePaginationChange = useCallback((newPage: number, newPageSize: number) => {
        setPage(newPage);
        setPageSize(newPageSize);
    }, []);

    // Solo mostrar skeleton completo en la carga inicial (cuando no hay datos)
    if (isLoading && !paginatedUsers) {
        return (
            <div>
                <HeaderPage title="Usuarios" description="Cargando usuarios..." />
                <DataTableSkeleton columns={7} numFilters={3} />
            </div>
        );
    }

    if (error || !paginatedUsers) {
        return (
            <div>
                <HeaderPage title="Usuarios" description="Usuarios registrados en el sistema." />
                <ErrorGeneral />
            </div>
        );
    }

    return (
        <div>
            <HeaderPage title="Usuarios" description="Usuarios registrados en el sistema." />
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <UsersTable
                    data={paginatedUsers.data ?? []}
                    pagination={{
                        page: paginatedUsers.meta?.page ?? 1,
                        pageSize: paginatedUsers.meta?.pageSize ?? 10,
                        total: paginatedUsers.meta?.total ?? 0,
                        totalPages: paginatedUsers.meta?.totalPages ?? 1,
                    }}
                    onPaginationChange={handlePaginationChange}
                    search={search}
                    onSearchChange={setSearch}
                    isActive={isActive}
                    onIsActiveChange={setIsActive}
                    roleName={roleName}
                    onRoleNameChange={setRoleName}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}
