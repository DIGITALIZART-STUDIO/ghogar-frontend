import { HeaderPage } from "@/components/common/HeaderPage";
import { UsersTable } from "./_components/UsersTable";
import { backend, wrapper } from "@/types/backend";
import ErrorGeneral from "@/components/errors/general-error";

export default async function UsersPage() {
    const [users, error] = await wrapper((auth) => backend.GET("/api/Users/all", {
        ...auth,
        params: {
            query: {
                page: 1,
                pageSize: 10,
            },
        },
    }));
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
