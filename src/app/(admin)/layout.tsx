"use client";

import { useEffect, useMemo } from "react";

import ErrorGeneral from "@/components/errors/general-error";
import AdminLayout from "@/components/layout/admin-layout";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { FullPageLoader } from "@/components/ui/loading-spinner";
import { ProfileDropdown } from "@/components/ui/profile-dropdown";
import { Search } from "@/components/ui/search";
import { ThemeSwitch } from "@/components/ui/theme-switch";
import { ProjectSelector } from "@/components/ui/project-selector";
import { AuthorizationContext, ProtectedRoute, Role } from "./_authorization_context";
import { useUsers } from "./admin/users/_hooks/useUser";
import { useAuthContext } from "@/context/auth-provider";

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
    const { handleAuthError, isLoggingOut } = useAuthContext();
    const { data, error, isLoading } = useUsers();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e = error as any;

    // Normalizar el status del error (401/403) desde distintas formas que puede venir
    const normalizedStatus = useMemo(() => {
        if (!e) {
            return undefined;
        }

        // Si estamos haciendo logout, ignorar todos los errores para prevenir el ErrorGeneral
        if (isLoggingOut) {
            return undefined;
        }

        const s = e?.statusCode ?? e?.status ?? e?.response?.status ?? e?.error?.statusCode ?? e?.error?.status;
        if (s) {
            return s as number;
        }
        const raw = e?.error?.rawText as string | undefined;
        if (raw && /unauthorized/i.test(raw)) {
            return 401;
        }
        return undefined;
    }, [e, isLoggingOut]);

    useEffect(() => {
        if (!isLoading && !!e && (normalizedStatus === 401 || normalizedStatus === 403) && !isLoggingOut) {
            handleAuthError(e);
        }
    }, [e, isLoading, handleAuthError, isLoggingOut, normalizedStatus]);

    // Prioridad 1: Si estamos haciendo logout, mostrar loader inmediatamente y detener todo lo demás.
    if (isLoggingOut) {
        return <FullPageLoader text="Cerrando sesión..." />;
    }

    if (isLoading) {
        return <FullPageLoader text="Cargando aplicación..." />;
    }

    // Si hay error de autenticación, mostrar loading mientras se procesa (sin romper el refresh)
    if (!!e && (normalizedStatus === 401 || normalizedStatus === 403)) {
        return <FullPageLoader text="Verificando sesión..." />;
    }

    // Si hay error y NO es de autenticación, muestra error general
    if (!!e && normalizedStatus !== 401 && normalizedStatus !== 403) {
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
                            <ProjectSelector />
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
