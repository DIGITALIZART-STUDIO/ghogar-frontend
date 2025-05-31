"use client";

import { HeaderPage } from "@/components/common/HeaderPage";
import { UsersTable } from "./_components/UsersTable";

export default function UsersPage() {
    return (
        <div>
            <HeaderPage title="Usuarios" description="Administración de los usuarios del sistema" />
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <UsersTable />
            </div>
        </div>
    );
}
