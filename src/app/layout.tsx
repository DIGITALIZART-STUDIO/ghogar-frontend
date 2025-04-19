import type { Metadata } from "next/types";
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
                    }}
                />
            </body>
        </html>
    );
}
