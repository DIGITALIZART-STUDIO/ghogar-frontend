import {
    BookUser,
    ClipboardList,
    FileCheck,
    FileText,
    LayoutDashboard,
    LineChart,
    ListChecks,
    Users,
    DollarSign,
    FileSignature
} from "lucide-react";

import { rolePermissions, type SidebarData } from "../types";

export const sidebarData: SidebarData = {
    user: {
        name: "Nombre Usuario",
        email: "usuario@empresa.com",
        avatar: "/avatars/default.jpg",
    },
    navGroups: [
        {
            title: "General",
            items: [
                {
                    title: "Dashboard",
                    url: "/dashboard",
                    icon: LayoutDashboard,
                },
            ],
        },
        {
            title: "Clientes y Leads",
            items: [
                {
                    title: "Clientes",
                    url: "/clients",
                    icon: BookUser,
                },
                {
                    title: "Leads",
                    url: "/leads",
                    icon: Users,
                },
                {
                    title: "Tareas",
                    url: "/tasks",
                    icon: ListChecks,
                },
            ],
        },
        {
            title: "Ventas",
            items: [
                {
                    title: "Cotizaciones",
                    url: "/quotation",
                    icon: FileText,
                },
                {
                    title: "Separaciones",
                    url: "/reservations",
                    icon: FileCheck,
                },
            ],
        },
        {
            title: "Cobranza",
            items: [
                {
                    title: "Contratos Pendientes",
                    url: "/pending-contracts",
                    icon: FileSignature,
                },
                {
                    title: "Gestión de Pagos",
                    url: "/payments-transaction",
                    icon: DollarSign,
                },
            ],
        },
        {
            title: "Gestión de Actividades",
            items: [
                {
                    title: "Mis Leads",
                    url: "/assignments",
                    icon: ClipboardList,
                },
            ],
        },
        {
            title: "Reportes",
            items: [
                {
                    title: "Reportes",
                    url: "/reports",
                    icon: LineChart,
                },
            ],
        },
        {
            title: "Administración",
            items: [
                {
                    title: "Usuarios",
                    url: "/admin/users",
                    icon: Users,
                },
                {
                    title: "Proyectos",
                    url: "/admin/projects",
                    icon: BookUser,
                },
            ],
        },
    ],
};

// Personaliza los títulos y grupos para SalesAdvisor
function getPersonalizedSidebarForSalesAdvisor(): SidebarData {
    return {
        ...sidebarData,
        navGroups: [
            {
                title: "Inicio",
                items: [
                    {
                        title: "Dashboard",
                        url: "/dashboard",
                        icon: LayoutDashboard,
                    },
                ],
            },
            {
                title: "Leads Asignados",
                items: [
                    {
                        title: "Mis Leads",
                        url: "/assignments",
                        icon: ClipboardList,
                    },
                ],
            },
            {
                title: "Cotizaciones Propias",
                items: [
                    {
                        title: "Mis Cotizaciones",
                        url: "/quotation",
                        icon: FileText,
                    },
                ],
            },
            {
                title: "Separaciones Realizadas",
                items: [
                    {
                        title: "Mis Separaciones",
                        url: "/reservations",
                        icon: FileCheck,
                    },
                ],
            },
        ],
    };
}

export function getSidebarDataForRole(role: string): SidebarData {
    if (role === "SalesAdvisor") {
        return getPersonalizedSidebarForSalesAdvisor();
    }
    const allowedUrls = rolePermissions[role] || [];
    return {
        ...sidebarData,
        navGroups: sidebarData.navGroups
            .map((group) => ({
                ...group,
                items: group.items.filter((item) => allowedUrls.includes(item.url as string)),
            }))
            .filter((group) => group.items.length > 0)
    };
}
