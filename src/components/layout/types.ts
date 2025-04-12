import { LinkProps } from "next/link";

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
