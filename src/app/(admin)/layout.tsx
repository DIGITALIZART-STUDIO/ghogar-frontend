import AdminLayout from "@/components/layout/admin-layout";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { ProfileDropdown } from "@/components/ui/profile-dropdown";
import { Search } from "@/components/ui/search";
import { ThemeSwitch } from "@/components/ui/theme-switch";

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
    return (
        <AdminLayout>
            {/* ===== Top Heading ===== */}
            <Header>
                <Search />
                <div className="ml-auto flex items-center space-x-4">
                    <ThemeSwitch />
                    <ProfileDropdown />
                </div>
            </Header>
            {/* ===== Main Content ===== */}
            <Main>
                {children}
            </Main>
        </AdminLayout>
    );
}
