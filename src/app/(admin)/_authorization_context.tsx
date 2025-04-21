"use client";

import { createContext, useContext } from "react";

export type Role = "SuperAdmin"
export type Module = "Users"
export type Claim = "CREATE" | "READ" | "UPDATE" | "DELETE"

const AuthContext = createContext<Array<Role> | null>(null);
const Permissions: Readonly<Record<Module, Record<Claim, Array<Role>>>> = Object.freeze({
    "Users": {
        "CREATE": ["SuperAdmin"],
        "READ": ["SuperAdmin"],
        "UPDATE": ["SuperAdmin"],
        "DELETE": ["SuperAdmin"],
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

/**
 * Returns whether or not the currently logged in user has a role
 *
 * Example:
 *
 * ```tsx
 * function Proyectos() {
 *   const isAuthorized = useAuthorization("Users", "CREATE");
 *   if (!isAuthorized) {
 *      return <p>No autorizado</p>
 *   }
 * }
 * ```
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
    roles: Array<Role>;
    children: React.ReactNode;
}) {
    return (
        <AuthContext.Provider value={roles}>
            {children}
        </AuthContext.Provider>
    );
}
