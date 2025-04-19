import type { Metadata } from "next/types";
import { AlertCircle, AlertTriangle, CheckCircle, Info, Loader2 } from "lucide-react";
import { Toaster } from "sonner";

import "./globals.css";

export const metadata: Metadata = {
    title: "Gestión Hogar CRM",
    description: "Sistema de gestión para el hogar",
};

export default function RootLayout({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <html lang="es" suppressHydrationWarning>
            <body
                suppressHydrationWarning
                className="font-montserrat text-base leading-normal antialiased bg-background text-foreground"
            >
                {children}
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
                        success: {
                            icon: <CheckCircle className="text-green-500 size-5" />,
                            style: {
                                background: "var(--primary)",
                                color: "var(--primary-foreground)",
                                border: "1px solid var(--primary)",
                                borderLeft: "6px solid rgb(34, 197, 94)",
                            },
                        },
                        error: {
                            icon: <AlertCircle className="text-red-500 size-5" />,
                            style: {
                                background: "var(--destructive)",
                                color: "var(--destructive-foreground)",
                                border: "1px solid var(--destructive)",
                                borderLeft: "6px solid rgb(239, 68, 68)",
                            },
                        },
                        warning: {
                            icon: <AlertTriangle className="text-amber-500 size-5" />,
                            style: {
                                background: "oklch(0.9 0.15 85)",
                                color: "oklch(0.3 0.01 85)",
                                border: "1px solid oklch(0.8 0.15 85)",
                                borderLeft: "6px solid rgb(234, 179, 8)",
                            },
                        },
                        info: {
                            icon: <Info className="text-blue-500 size-5" />,
                            style: {
                                background: "oklch(0.9 0.1 230)",
                                color: "oklch(0.2 0.01 230)",
                                border: "1px solid oklch(0.8 0.1 230)",
                                borderLeft: "6px solid rgb(59, 130, 246)",
                            },
                        },
                        loading: {
                            icon: <Loader2 className="text-purple-500 size-5 animate-spin" />,
                            style: {
                                background: "oklch(0.9 0.05 270)",
                                color: "oklch(0.3 0.01 270)",
                                border: "1px solid oklch(0.8 0.05 270)",
                                borderLeft: "6px solid rgb(139, 92, 246)",
                            },
                        },
                    }}
                />
            </body>
        </html>
    );
}
