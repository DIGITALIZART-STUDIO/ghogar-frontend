"use client";

import { StrictMode } from "react";

import { AuthProvider } from "@/context/auth-provider";
import { ProjectProvider } from "@/context/project-context";
import { ThemeProvider } from "@/context/theme-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StrictMode>
      <ThemeProvider defaultTheme="light" storageKey="next-ui-theme">
        <AuthProvider>
          <ProjectProvider>{children}</ProjectProvider>
        </AuthProvider>
      </ThemeProvider>
    </StrictMode>
  );
}
