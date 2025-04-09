import Cookies from "js-cookie";

import { SearchProvider } from "@/context/search-context";
import { ThemeProvider } from "@/context/theme-context";
import { cn } from "@/lib/utils";
import { SidebarProvider } from "../ui/sidebar";
import SkipToMain from "../ui/skip-to-main";
import { AppSidebar } from "./app-sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const defaultOpen = Cookies.get("sidebar:state") !== "false";
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SearchProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <SkipToMain />
          <AppSidebar />
          <div
            id="content"
            className={cn(
              "ml-auto w-full max-w-full",
              "peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]",
              "peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]",
              "transition-[width] duration-200 ease-linear",
              "flex h-svh flex-col",
              "group-data-[scroll-locked=1]/body:h-full",
              "group-data-[scroll-locked=1]/body:has-[main.fixed-main]:h-svh"
            )}
          >
            {children}
          </div>
        </SidebarProvider>
      </SearchProvider>
    </ThemeProvider>
  );
}
