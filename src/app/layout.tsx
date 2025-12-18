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
      <head>
        {/* OpenCV.js para funcionalidad de recorte inteligente */}
        <script async src="https://docs.opencv.org/4.x/opencv.js" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
                            window.onOpenCvReady = function() {
                                window.dispatchEvent(new CustomEvent('opencv-ready'));
                            };
                            
                            // Verificar si ya está cargado
                            if (typeof cv !== 'undefined' && cv.Mat) {
                                window.dispatchEvent(new CustomEvent('opencv-ready'));
                            }
                        `,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="font-montserrat text-base leading-normal antialiased bg-background text-foreground"
      >
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
