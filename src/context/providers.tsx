"use client";

import { StrictMode } from "react";

import { ThemeProvider } from "@/context/theme-context";
import { AuthProvider } from "@/context/auth-provider";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <StrictMode>
            <ThemeProvider defaultTheme="light" storageKey="next-ui-theme">
                <AuthProvider>
                    {children}
                </AuthProvider>
            </ThemeProvider>
        </StrictMode>
    );
}
