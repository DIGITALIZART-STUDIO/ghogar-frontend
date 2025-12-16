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
import NotificationBell from "@/components/ui/notification-bell";
import { AuthorizationContext, ProtectedRoute, Role } from "./_authorization_context";
import { useUsers } from "./admin/users/_hooks/useUser";
import { useAuthContext } from "@/context/auth-provider";

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
    const { handleAuthError, isLoggingOut } = useAuthContext();
    const { data, error, isLoading } = useUsers();
    // El GlobalErrorHandler se movió a client-providers.tsx para evitar múltiples inicializaciones

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

        // Detectar error 401 por el mensaje "Unauthorized"
        if (e?.error === "Unauthorized") {
            return 401;
        }

        const raw = e?.error?.rawText as string | undefined;
        if (raw && /unauthorized/i.test(raw)) {
            return 401;
        }
        return undefined;
    }, [e, isLoggingOut]);

    // Manejar errores 401/403 directamente aquí ya que onError de useUser.ts no se ejecuta
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
                        <div className="flex items-center w-full gap-4">
                            {/* Left Section - Search */}
                            <div className="flex-1 max-w-sm">
                                <Search />
                            </div>

                            {/* Right Section - Actions */}
                            <div className="flex items-center space-x-3 ml-auto">
                                {/* ProjectSelector - visible on lg and above */}
                                <div className="hidden lg:block">
                                    <ProjectSelector />
                                </div>
                                {/* Notification Bell */}
                                <NotificationBell />
                                <ThemeSwitch />
                                <ProfileDropdown name={username} email={data.user.email!} initials={initials} />
                            </div>
                        </div>
                    </Header>

                    {/* Mobile ProjectSelector */}
                    <div className="lg:hidden sticky top-16 z-30 border-b pb-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 w-full">
                        <div className="flex h-12 items-center w-full px-4 justify-center">
                            <ProjectSelector />
                        </div>
                    </div>
                    {/* ===== Main Content ===== */}
                    <Main>{children}</Main>
                </ProtectedRoute>
            </AuthorizationContext>
        </AdminLayout>
    );
}
