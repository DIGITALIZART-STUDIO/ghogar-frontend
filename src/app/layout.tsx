import ClientProviders from "./client-providers";
import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Gestión Hogar",
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
                <ClientProviders>
                    {children}
                </ClientProviders>
            </body>
        </html>
    );
}
