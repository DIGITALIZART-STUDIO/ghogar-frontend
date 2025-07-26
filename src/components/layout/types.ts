import type { LinkProps } from "next/dist/client/link";

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface BaseNavItem {
  title: string;
  badge?: string;
  icon?: React.ElementType;
}

type NavLink = BaseNavItem & {
  url: LinkProps["href"];
  items?: never;
};

type NavCollapsible = BaseNavItem & {
  items: Array<BaseNavItem & { url: LinkProps["href"] }>;
  url?: never;
};

type NavItem = NavCollapsible | NavLink;

interface NavGroup {
  title: string;
  items: Array<NavItem>;
}

interface SidebarData {
  user: User;
  navGroups: Array<NavGroup>;
}

export type { NavCollapsible, NavGroup, NavItem, NavLink, SidebarData };

export const rolePermissions: Record<string, Array<string>> = {
    SuperAdmin: [
        "/",
        "/profile",
        "/dashboard",
        "/clients",
        "/leads",
        "/tasks",
        "/quotation",
        "/reservations",
        "/assignments",
        "/reports",
        "/admin/users",
        "/admin/projects",
        "/payments-transaction",
    ],
    Admin: [
        "/",
        "/dashboard",
        "/profile",
        "/clients",
        "/leads",
        "/tasks",
        "/quotation",
        "/reservations",
        "/assignments",
        "/reports",
        "/admin/users",
        "/admin/projects",
        "/payments-transaction",
    ],
    Supervisor: [
        "/",
        "/dashboard",
        "/profile",
        "/clients",
        "/leads",
        "/tasks",
        "/assignments",
        "/reports",
        "/payments-transaction",
    ],
    SalesAdvisor: [
        "/",
        "/profile",
        "/dashboard",
        "/assignments",
        "/quotation",
        "/reservations",
    ],
    Manager: [
        "/",
        "/profile",
        "/dashboard",
        "/clients",
        "/leads",
        "/tasks",
        "/reports",
        "/payments-transaction",
    ]
};
