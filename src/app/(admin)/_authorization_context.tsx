"use client";

import { createContext, useContext } from "react";
import { rolePermissions } from "@/components/layout/types";
import { usePathname } from "next/navigation";
import UnauthorizedPage from "../unauthorized";

export type Role = "SuperAdmin" | "Admin" | "Supervisor" | "SalesAdvisor" | "Manager" | "FinanceManager";
export type Module = "Users"
export type Claim = "CREATE" | "READ" | "UPDATE" | "DELETE"

type RolesTypes = Omit<
  {
    [key in Role]: string
  },
  "SuperAdmin"
>

export const roles: RolesTypes = {
    Admin: "Administrador",
    Supervisor: "Supervisor",
    SalesAdvisor: "Asesor",
    Manager: "Gerente",
    FinanceManager: "Gerente de Finanzas",
};

const AuthContext = createContext<Array<Role> | null>(null);

const Permissions: Readonly<Record<Module, Record<Claim, Array<Role>>>> = Object.freeze({
    Users: {
        CREATE: ["SuperAdmin"],
        READ: ["SuperAdmin"],
        UPDATE: ["SuperAdmin"],
        DELETE: ["SuperAdmin"],
    },
});

/**
 * Obtiene los Claims del usuario actualmente logueado
 */
export const useClaims = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("Attempted to use unmounted AuthorizationContext");
    }
    return context;
};

function normalizeRoute(route: string): string {
    return route.endsWith("/") && route.length > 1 ? route.slice(0, -1) : route;
}

/**
 * Verifica si el usuario tiene permiso para acceder a una ruta
 */
export const useRouteAuthorization = (route: string): boolean => {
    const context = useContext(AuthContext);
    if (!context || context.length === 0) {
        throw new Error("Attempted to use unmounted AuthorizationContext");
    }

    const role = context[0];
    const allowedRoutes = rolePermissions[role] || [];
    const normalizedRoute = normalizeRoute(route);

    // Permite acceso si la ruta actual empieza con alguna ruta permitida
    return allowedRoutes.some((allowed) => normalizedRoute === allowed || normalizedRoute.startsWith(`${allowed}/`)
    );
};
/**
 * Returns whether or not the currently logged in user has a role
 */
export const useAuthorization = (module: Module, claim: Claim): boolean => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("Attempted to use umounted AuthorizationContext");
    }

    const authorizedRoles = Permissions[module][claim];
    return !!authorizedRoles.find((authorizedRole) => context.includes(authorizedRole));
};

export function AuthorizationContext({
    roles,
    children,
}: {
  roles: Array<Role>
  children: React.ReactNode
}) {
    return <AuthContext.Provider value={roles}>{children}</AuthContext.Provider>;
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthorized = useRouteAuthorization(pathname);

    if (!isAuthorized) {
    // Renderizamos directamente la página de unauthorized
        return <UnauthorizedPage />;
    }

    return children;
}
