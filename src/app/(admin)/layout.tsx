"use client";

import { useEffect } from "react";

import ErrorGeneral from "@/components/errors/general-error";
import AdminLayout from "@/components/layout/admin-layout";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { FullPageLoader } from "@/components/ui/loading-spinner";
import { ProfileDropdown } from "@/components/ui/profile-dropdown";
import { Search } from "@/components/ui/search";
import { ThemeSwitch } from "@/components/ui/theme-switch";
import { AuthorizationContext, ProtectedRoute, Role } from "./_authorization_context";
import { useUsers } from "./admin/users/_hooks/useUser";
import { useAuthContext } from "@/context/auth-provider";

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
    const { handleAuthError } = useAuthContext();
    const { data, error, isLoading } = useUsers();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e = error as any;

    useEffect(() => {
        if (!isLoading && !!e && (e.statusCode === 401 || e.statusCode === 403)) {
            handleAuthError(e);
        }
    }, [e, isLoading, handleAuthError]);

    if (isLoading) {
        return <FullPageLoader text="Cargando aplicación..." />;
    }

    // Si hay error de autenticación, no mostrar nada (redirige en useEffect)
    if (!!e && (e.statusCode === 401 || e.statusCode === 403)) {
        return null;
    }

    // Si hay error y NO es de autenticación, muestra error general
    if (!!e && e.statusCode !== 401 && e.statusCode !== 403) {
        return <ErrorGeneral />;
    }

    if (!data) {
        return <ErrorGeneral />;
    }

    const username = data.user.name!;
    const initials = username
        .split(" ")
        .map((n) => n[0].toUpperCase())
        .slice(0, 2)
        .join("");

    return (
        <AdminLayout name={username} email={data.user.email!} initials={initials} roles={data.roles as Array<string>}>
            <AuthorizationContext roles={data.roles as Array<Role>}>
                <ProtectedRoute>
                    {/* ===== Top Heading ===== */}
                    <Header>
                        <Search />
                        <div className="ml-auto flex items-center space-x-4">
                            <ThemeSwitch />
                            <ProfileDropdown name={username} email={data.user.email!} initials={initials} />
                        </div>
                    </Header>
                    {/* ===== Main Content ===== */}
                    <Main>{children}</Main>
                </ProtectedRoute>
            </AuthorizationContext>
        </AdminLayout>
    );
}
