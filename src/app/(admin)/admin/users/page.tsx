"use client";

import { HeaderPage } from "@/components/common/HeaderPage";
import { UsersTable } from "./_components/UsersTable";
import { backend } from "@/types/backend2";
import ErrorGeneral from "@/components/errors/general-error";

export default function UsersPage() {
    const { data: users, error, isLoading } = backend.useQuery("get", "/api/Users/all", {
        params: {
            query: {
                page: 1,
                pageSize: 10,
            },
        },
    });

    if (isLoading) {
        return (
            <div>
                <HeaderPage title="Usuarios" description="Administración de los usuarios del sistema" />
                <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                    Cargando
                </div>
            </div>
        );
    }
    if (error) {
        return (
            <div>
                <HeaderPage title="Usuarios" description="Administración de los usuarios del sistema" />
                <ErrorGeneral />
            </div>
        );
    }

    return (
        <div>
            <HeaderPage title="Usuarios" description="Administración de los usuarios del sistema" />
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <UsersTable
                    data={users.items}
                    totalItems={users.totalCount}
                    pageCount={users.totalPages}
                    pageSize={users.pageSize}
                    pageIndex={users.page - 1}
                />
            </div>
        </div>
    );
}
