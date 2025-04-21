import AdminLayout from "@/components/layout/admin-layout";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { ProfileDropdown } from "@/components/ui/profile-dropdown";
import { Search } from "@/components/ui/search";
import { ThemeSwitch } from "@/components/ui/theme-switch";
import { backend, wrapper } from "@/types/backend";
import { redirect } from "next/navigation";
import { AuthorizationContext, Role } from "./_authorization_context";

export default async function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
    // Get logged user info
    const [userData, error] = await wrapper((auth) => backend.GET("/api/Users", auth));
    if (error !== null) {
        if (error.statusCode === 401 || error.statusCode === 403) {
            console.error("layout, redirecting due to 401/403");
            redirect("/logout");
        }

        return (
            <p>
                Error cargando la aplicación:
                {" "}
                {error.message}
                <br />
                <br />
                Por favor, recargue la página o inicie sesión nuevamente.
                <br />
                <br />
                Si el problema persiste, contacte al administrador del sistema.
            </p>
        );
    }

    const username = userData.user.userName!;
    const initials = username.split(" ").map((n) => n[0].toUpperCase())
        .slice(0, 2)
        .join("");

    return (
        <AdminLayout name={username} email={userData.user.email!} initials={initials} >
            <AuthorizationContext roles={userData.roles as Array<Role>}>
                {/* ===== Top Heading ===== */}
                <Header>
                    <Search />
                    <div className="ml-auto flex items-center space-x-4">
                        <ThemeSwitch />
                        <ProfileDropdown name={username} email={userData.user.email!} initials={initials} />
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
