"use client";

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "../ui/sidebar";
import { sidebarData } from "./data/sidebar-data";
import { NavGroup } from "./nav-group";
import { NavLogo } from "./nav-logo";
import { NavUser } from "./nav-user";

export function AppSidebar({ name, email, initials, ...props }: React.ComponentProps<typeof Sidebar> & {
    name: string
    email: string
    initials: string
}) {
    return (
        <Sidebar collapsible="icon" variant="inset" {...props} className="bg-sidebar">
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
