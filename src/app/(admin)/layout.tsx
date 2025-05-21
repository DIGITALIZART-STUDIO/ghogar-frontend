"use client";

import AdminLayout from "@/components/layout/admin-layout";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { ProfileDropdown } from "@/components/ui/profile-dropdown";
import { Search } from "@/components/ui/search";
import { ThemeSwitch } from "@/components/ui/theme-switch";
import { backend as api } from "@/types/backend2";
import { AuthorizationContext, Role } from "./_authorization_context";

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
    // NOTE: reject humanity (server actions), return to monke (client fetch)
    const { data, error, isLoading } = api.useQuery("get", "/api/Users", undefined, {
        retry: false,
    });

    if (isLoading) {
        return (
            <div>
                cargando usuario...
            </div>
        );
    }
    if (!!error) {
        console.error("Error cargando usuario", error);
        return (
            <div>
                Error cargando usuario
            </div>
        );
    }
    if (!data) {
        console.error("Error cargando usuario?", error);
        console.error("data?", data);
        return (
            <div>
                Error cargando usuario??
            </div>
        );
    }

    const username = data.user.userName!;
    const initials = username.split(" ").map((n) => n[0].toUpperCase())
        .slice(0, 2)
        .join("");

    return (
        <AdminLayout name={username} email={data.user.email!} initials={initials} >
            <AuthorizationContext roles={data.roles as Array<Role>}>
                {/* ===== Top Heading ===== */}
                <Header>
                    <Search />
                    <div className="ml-auto flex items-center space-x-4">
                        <ThemeSwitch />
                        <ProfileDropdown name={username} email={data.user.email!} initials={initials} />
                    </div>
                </Header>
                {/* ===== Main Content ===== */}
                <Main>
                    {children}
                </Main>
            </AuthorizationContext>
        </AdminLayout>
    );
}
