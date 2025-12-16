"use client";

import { Eye, Download } from "lucide-react";
import { ResponsiveDialog } from "@/components/common/ResponsiveDialog";
import { useState, useEffect } from "react";

interface ComprobanteViewerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    comprobanteUrl: string;
    isDesktop: boolean;
}

export function ComprobanteViewerDialog({
    open,
    onOpenChange,
    comprobanteUrl,
    isDesktop,
}: ComprobanteViewerDialogProps) {
    const [isImageLoading, setIsImageLoading] = useState(true);

    const handleDownload = () => {
        // Crear un enlace temporal para descargar la imagen
        const link = document.createElement("a");
        link.href = comprobanteUrl;
        link.download = `comprobante-${Date.now()}.jpg`;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Reset loading state when URL changes
    useEffect(() => {
        setIsImageLoading(true);
    }, [comprobanteUrl]);

    return (
        <ResponsiveDialog
            open={open}
            onOpenChange={onOpenChange}
            isDesktop={isDesktop}
            title="Comprobante de Pago"
            description="Visualización del documento"
            dialogContentClassName="sm:max-w-[900px] w-full px-0"
            dialogScrollAreaClassName="h-full max-h-[80vh] px-0"
            drawerScrollAreaClassName="h-[60vh]"
        >
            <div className="px-1 space-y-4">
                <div className="space-y-4">
                    {/* Loading state */}
                    {isImageLoading && (
                        <div className="absolute inset-0 bg-muted flex items-center justify-center z-10">
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
                                    <div className="w-12 h-12 border-4 border-muted-foreground/20 border-t-primary rounded-full animate-spin" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-foreground">Procesando documento</p>
                                    <p className="text-xs text-muted-foreground">Preparando visualización...</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Imagen del comprobante */}
                    <div className="w-full">
                        <div className="min-h-full flex items-center justify-center">
                            <div className="w-full">
                                {/* Contenedor principal limpio */}
                                <div className="bg-card rounded-2xl overflow-hidden">
                                    {/* Header del documento */}
                                    <div className="px-6 py-4 bg-accent">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                                                <Eye className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-card-foreground">Vista Previa del Comprobante</h4>
                                                <p className="text-xs text-muted-foreground">Documento de pago procesado</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contenido de la imagen */}
                                    <div className="p-6 bg-card">
                                        <div className="flex items-center justify-center">
                                            <img
                                                src={comprobanteUrl}
                                                alt="Comprobante de pago"
                                                className="max-w-full object-contain rounded-lg"
                                                onLoad={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.opacity = "1";
                                                    setIsImageLoading(false);
                                                }}
                                                onError={() => {
                                                    console.error("Error loading comprobante image");
                                                }}
                                            />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer con información */}
                <div className="p-4 bg-muted rounded-xl">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                                <Eye className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium text-card-foreground">Vista Previa</p>
                                <p className="text-xs text-muted-foreground">Documento visualizado</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center cursor-pointer hover:bg-primary/30" onClick={handleDownload}>
                                <Download className="h-4 w-4 text-primary hover:text-primary/80" />
                            </div>
                            <div>
                                <p className="font-medium text-card-foreground">Descargar</p>
                                <p className="text-xs text-muted-foreground">Guardar en dispositivo</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </ResponsiveDialog>
    );
}
