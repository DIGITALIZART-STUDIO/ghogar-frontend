"use client";

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "../ui/sidebar";
import { getSidebarDataForRole } from "./data/sidebar-data";
import { NavGroup } from "./nav-group";
import { NavLogo } from "./nav-logo";
import { NavUser } from "./nav-user";

export function AppSidebar({ name, email, initials,roles, ...props }: React.ComponentProps<typeof Sidebar> & {
    name: string
    email: string
    initials: string
    roles: Array<string>
}) {
    const role = roles[0]; // Solo tomamos el primer rol
    const sidebarData = getSidebarDataForRole(role);
    return (
        <Sidebar collapsible="icon" variant="inset" {...props}>
            <SidebarHeader>
                <NavLogo />
            </SidebarHeader>
            <SidebarContent>
                {sidebarData.navGroups.map((props) => (
                    <NavGroup key={props.title} {...props} />
                ))}
            </SidebarContent>
            <SidebarFooter>
                <NavUser name={name} email={email} initials={initials} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
