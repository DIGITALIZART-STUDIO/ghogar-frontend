"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import { useState } from "react";
import { ThemeProvider } from "@/context/theme-context";
import { AuthProvider } from "@/context/auth-provider";

export default function ClientProviders({
    children
}: {
    children: React.ReactNode
}) {
    // Crear una nueva instancia de QueryClient para cada sesión de usuario
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <AuthProvider>
                    {children}
                    <ReactQueryDevtools initialIsOpen={false} />
                </AuthProvider>
            </ThemeProvider>
            <Toaster
                position="top-right"
                richColors
                expand
                closeButton
                offset={16}
                duration={4000}
                className="toaster-container"
                toastOptions={{
                    className: "toast-item font-montserrat",
                    descriptionClassName: "toast-description",
                    style: {
                        background: "var(--background)",
                        color: "var(--foreground)",
                        border: "1px solid var(--border)",
                        borderRadius: "0.75rem",
                        fontWeight: 500,
                        padding: "0.75rem 1rem",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08), 0 0 1px rgba(0, 0, 0, 0.1)",
                    },
                }}
            />
        </QueryClientProvider>
    );
}
