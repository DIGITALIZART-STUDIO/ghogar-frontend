"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";

import { GlobalErrorHandler } from "@/components/GlobalErrorHandler";
import { AuthProvider } from "@/context/auth-provider";
import { ProjectProvider } from "@/context/project-context";
import { ThemeProvider } from "@/context/theme-context";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  // Crear una nueva instancia de QueryClient para cada sesión de usuario
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (failureCount, error: unknown) => {
              // No retry en errores de autenticación
              const e = error as { statusCode?: number };
              if (e?.statusCode === 401 || e?.statusCode === 403) {
                return false;
              }
              // Retry máximo 1 vez para otros errores (reducir para evitar bucles)
              return failureCount < 1;
            },
            staleTime: 5 * 60 * 1000, // 5 minutos
            refetchOnWindowFocus: false, // Evitar refetch automático
          },
          mutations: {
            retry: (failureCount, error: unknown) => {
              // No retry en errores de autenticación
              const e = error as { statusCode?: number };
              if (e?.statusCode === 401 || e?.statusCode === 403) {
                return false;
              }
              // Retry máximo 1 vez para mutations
              return failureCount < 1;
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <NextTopLoader color="var(--primary)" showSpinner={false} />
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <AuthProvider>
          <GlobalErrorHandler />
          <ProjectProvider>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
          </ProjectProvider>
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
