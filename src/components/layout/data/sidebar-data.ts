import {
    BookUser,
    CalendarCheck,
    ClipboardList,
    FileCheck,
    FileText,
    LayoutDashboard,
    LineChart,
    ListChecks,
    Users,
} from "lucide-react";

import { type SidebarData } from "../types";

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
            ],
        },
        {
            title: "Ventas",
            items: [
                {
                    title: "Cotizaciones",
                    url: "/quotes",
                    icon: FileText,
                },
                {
                    title: "Separaciones",
                    url: "/reservations",
                    icon: FileCheck,
                },
                {
                    title: "Cronogramas",
                    url: "/schedules",
                    icon: CalendarCheck,
                },
            ],
        },
        {
            title: "Gestión de Actividades",
            items: [
                {
                    title: "Asignaciones",
                    url: "/assignments",
                    icon: ClipboardList,
                },
                {
                    title: "Mis Tareas",
                    url: "/tasks",
                    icon: ListChecks,
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
            ],
        },
    ],
};
