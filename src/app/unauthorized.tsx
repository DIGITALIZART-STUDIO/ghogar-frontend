"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, ArrowLeft, Lock, User, AlertCircle } from "lucide-react";
import { rolePermissions } from "@/components/layout/types";
import { usePathname } from "next/navigation";
import { useClaims } from "./(admin)/_authorization_context";

// Mapeo de roles a nombres en español
const roleNames = {
    SuperAdmin: "Super Administrador",
    Admin: "Administrador",
    Supervisor: "Supervisor",
    SalesAdvisor: "Asesor de Ventas",
    Manager: "Gerente",
};

// Niveles de acceso visual
const roleLevel = {
    SuperAdmin: { level: 5, color: "bg-primary" },
    Admin: { level: 4, color: "bg-primary" },
    Supervisor: { level: 3, color: "bg-amber-200 dark:bg-slate-50" },
    Manager: { level: 3, color: "bg-amber-200 dark:bg-slate-50" },
    SalesAdvisor: { level: 2, color: "bg-amber-200 dark:bg-slate-50" },
};

// Mapeo de rutas a nombres legibles
const routeNames: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/admin": "Administración",
    "/profile/": "Perfil",
    "/clients": "Clientes",
    "/leads/": "Leads",
    "/tasks": "Tareas",
    "/quotation": "Cotizaciones",
    "/reservations": "Reservas",
    "/assignments": "Asignaciones",
    "/reports": "Reportes",
    "/admin/users": "Gestión de Usuarios",
    "/admin/projects": "Gestión de Proyectos",
};

export default function UnauthorizedPage() {
    const userRoles = useClaims();
    const pathname = usePathname();

    const currentRole = userRoles[0]; // Primer rol del usuario
    const currentRoleInfo = roleLevel[currentRole as keyof typeof roleLevel];
    const userPermissions = rolePermissions[currentRole] || [];

    // Determinar qué rol se necesita para esta ruta
    const getRequiredRole = (route: string) => {
        for (const [role, permissions] of Object.entries(rolePermissions)) {
            if (permissions.includes(route)) {
                return role;
            }
        }
        return "SuperAdmin"; // Por defecto
    };

    const requiredRole = getRequiredRole(pathname);
    const requiredRoleInfo = roleLevel[requiredRole as keyof typeof roleLevel];
    const currentRouteName = routeNames[pathname] || "Esta sección";

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-primary/5 flex items-center justify-center p-4">
            <Card className="w-full max-w-lg border-2 border-secondary/30 shadow-xl">
                <CardHeader className="text-center">
                    <div className="mx-auto w-24 h-24 bg-secondary/20 rounded-full flex items-center justify-center mb-4 relative">
                        <Shield className="w-12 h-12" />
                        <div className="absolute -top-2 -right-2 w-10 h-10 bg-destructive rounded-full flex items-center justify-center border-2 border-background">
                            <Lock className="w-5 h-5 text-destructive-foreground" />
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Error Display */}
                    <div className="text-center space-y-3">
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-5xl font-bold">4</span>
                            <AlertCircle className="w-10 h-10" />
                            <span className="text-5xl font-bold">1</span>
                        </div>
                        <h2 className="text-xl font-semibold text-foreground">Acceso Restringido</h2>
                        <p className="text-muted-foreground text-sm">
                            No tienes permisos para acceder a <strong>{currentRouteName}</strong>
                        </p>
                    </div>

                    {/* Role Comparison */}
                    <div className="space-y-4">
                        {/* Current Role */}
                        <div className="bg-secondary/30 rounded-lg p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    <span className="text-sm font-medium">Tu rol actual:</span>
                                </div>
                                <Badge variant="secondary" className="bg-secondary/20">
                                    {roleNames[currentRole as keyof typeof roleNames]}
                                </Badge>
                            </div>

                            {/* Access Level Indicator */}
                            <div className="space-y-2">
                                <div className="text-xs text-muted-foreground">Nivel de acceso:</div>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((level) => (
                                        <div
                                            key={level}
                                            className={`w-6 h-2 rounded-full ${
                                                level <= currentRoleInfo.level ? currentRoleInfo.color : "bg-secondary/90 dark:bg-primary-foreground"
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Required Role */}
                        <div className="bg-primary/10 rounded-lg p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-primary" />
                                    <span className="text-sm font-medium text-primary">Rol requerido:</span>
                                </div>
                                <Badge variant="outline" className="border-primary text-primary">
                                    {roleNames[requiredRole as keyof typeof roleNames]}
                                </Badge>
                            </div>

                            {/* Required Level Indicator */}
                            <div className="space-y-2">
                                <div className="text-xs text-muted-foreground">Nivel requerido:</div>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((level) => (
                                        <div
                                            key={level}
                                            className={`w-6 h-2 rounded-full ${
                                                level <= requiredRoleInfo.level ? "bg-primary" : "bg-primary/20"
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Available Modules */}
                    <div className="bg-muted/50 rounded-lg p-4">
                        <div className="text-center space-y-3">
                            <div className="text-sm font-medium text-foreground">Módulos disponibles para ti:</div>
                            <div className="flex flex-wrap gap-1 justify-center">
                                {userPermissions.slice(0, 6).map((route) => (
                                    <Badge key={route} variant="outline" className="text-xs">
                                        {routeNames[route] || route}
                                    </Badge>
                                ))}
                                {userPermissions.length > 6 && (
                                    <Badge variant="outline" className="text-xs">
                                        +{userPermissions.length - 6} más
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <Button asChild className="w-full h-12">
                            <Link href="/dashboard">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Volver al Dashboard
                            </Link>
                        </Button>

                        <div className="grid grid-cols-2 gap-3">
                            {userPermissions.slice(1, 3).map((route) => (
                                <Button key={route} variant="secondary" asChild>
                                    <Link href={route}>{routeNames[route]?.split(" ")[0] || route.split("/").pop()}</Link>
                                </Button>
                            ))}
                        </div>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}
