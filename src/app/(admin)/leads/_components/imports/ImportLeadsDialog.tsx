"use client";

import { useState } from "react";
import { Download, Import, Upload, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/use-media-query";
// Importamos las acciones del servidor directamente
import { DownloadImportTemplate } from "../../../clients/_actions/ClientActions";
import { useImportClients } from "@/app/(admin)/clients/_hooks/useClients";

interface ImportLeadsDialogProps {
  onSuccess?: () => void;
}

export function ImportLeadsDialog({ onSuccess }: ImportLeadsDialogProps) {
    const isDesktop = useMediaQuery("(min-width: 630px)");
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [open, setOpen] = useState(false);

    // Estados para manejar los loadings
    const [isLoadingImport, setIsLoadingImport] = useState(false);
    const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);

    const importClientsMutation = useImportClients();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            setFile(selectedFile);
        } else {
            toast.error("Por favor selecciona un archivo Excel (.xlsx)");
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            setFile(droppedFile);
        } else {
            toast.error("Por favor suelta un archivo Excel (.xlsx)");
        }
    };

    const handleDownloadTemplate = async() => {
        try {
            setIsLoadingTemplate(true);
            const [blob, error] = await DownloadImportTemplate();

            if (error === null) {
                // Crear un enlace de descarga para el blob
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "template_clientes.xlsx";
                document.body.appendChild(a);
                a.click();
                URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                toast.error(`Error al descargar la plantilla: ${error.message || "Error desconocido"}`);
            }
        } catch (error) {
            toast.error("Error al descargar la plantilla");
            console.error("Error downloading template:", error);
        } finally {
            setIsLoadingTemplate(false);
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
    };

    const handleImport = async () => {
        if (!file) {
            return;
        }

        try {
            setIsLoadingImport(true);
            // Usa el hook en vez de la acción directa
            const data = await importClientsMutation.mutateAsync(file);

            if (data?.successCount && data.successCount > 0 && data.errors?.length === 0) {
                toast.success(`Importación exitosa: ${data.successCount} registros procesados`);
                setOpen(false);
                setFile(null);
                if (onSuccess) {
                    onSuccess();
                }
                return;
            }

            if (data?.clientsCreated && data?.clientsExisting && data.clientsCreated > 0 && data.clientsExisting > 0) {
                toast.success(`Importación exitosa: ${data.clientsCreated} clientes nuevos creados, ${data.clientsExisting} clientes actualizados`);
                setOpen(false);
                setFile(null);
                if (onSuccess) {
                    onSuccess();
                }
                return;
            }

            if (data.leadsCreated && data.leadsCreated > 0) {
                toast.success(`Importación exitosa: ${data.clientsCreated ?? 0} clientes creados, ${data.leadsCreated} leads creados`);
                setOpen(false);
                setFile(null);
                if (onSuccess) {
                    onSuccess();
                }
                return;
            }

            if (data.errors && data.errors.length > 0) {
                toast.warning(`Importación con errores: ${data.successCount} registros procesados con ${data.errors.length} errores.`);
                console.error("Errores de importación:", data.errors);
            }
        } catch (error: unknown) {
            let errorMessage = "Error desconocido";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            toast.error(`Error al importar clientes: ${errorMessage}`);
        } finally {
            setIsLoadingImport(false);
        }
    };

    const handleClose = () => {
        setFile(null);
    };

    // Componente del contenido del formulario para reutilizar en Dialog y Drawer
    const ImportContent = () => (
        <div className="grid gap-4 py-4">
            <div
                className={`border-2 border-dashed rounded-lg p-6 text-center ${
                    isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {!file ? (
                    <div className="flex flex-col items-center gap-2">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <div className="flex flex-col items-center">
                            <p className="text-sm font-medium">
                                Arrastra y suelta tu archivo Excel aquí o
                            </p>
                            <Label
                                htmlFor="file-upload"
                                className="relative cursor-pointer text-sm font-medium text-primary underline"
                            >
                                selecciona un archivo
                                <Input id="file-upload" type="file" accept=".xlsx" className="sr-only" onChange={handleFileChange} />
                            </Label>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Solo se permite un archivo Excel (.xlsx)
                        </p>
                    </div>
                ) : (
                    <div className="flex items-center justify-between bg-muted/50 p-3 rounded-md">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary/10 p-2 rounded">
                                <Upload className="h-4 w-4 text-primary" />
                            </div>
                            <div className="text-sm text-left">
                                <p className="font-medium">
                                    {file.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {(file.size / 1024).toFixed(2)}
                                    {" "}
                                    KB
                                </p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={handleRemoveFile} className="h-8 w-8">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>

            <div className="flex justify-between items-center">
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={handleDownloadTemplate}
                    disabled={isLoadingTemplate}
                >
                    <Download className="h-4 w-4" />
                    {isLoadingTemplate ? "Descargando..." : "Descargar Plantilla"}
                </Button>
                <p className="text-xs text-muted-foreground">
                    Máximo 1 archivo
                </p>
            </div>
        </div>
    );

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                        <Import className="mr-2 size-4" aria-hidden="true" />
                        Importar Leads
                    </Button>
                </DialogTrigger>
                <DialogContent tabIndex={undefined} className="px-0 sm:max-w-[500px]">
                    <DialogHeader className="px-4">
                        <DialogTitle>
                            Importar Leads
                        </DialogTitle>
                        <DialogDescription>
                            Sube un archivo Excel con la información de los leads que deseas importar.
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-full max-h-[40vh] px-0">
                        <div className="px-6">
                            <ImportContent />
                            <DialogFooter className="pt-4">
                                <div className="grid grid-cols-2 gap-2 w-full">
                                    <DialogClose asChild>
                                        <Button onClick={handleClose} type="button" variant="outline" className="w-full">
                                            Cancelar
                                        </Button>
                                    </DialogClose>
                                    <Button onClick={handleImport} disabled={!file || isLoadingImport} className="w-full">
                                        {isLoadingImport ? "Importando..." : "Importar"}
                                    </Button>
                                </div>
                            </DialogFooter>
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="outline" size="sm">
                    <Import className="mr-2 size-4" aria-hidden="true" />
                    Importar Leads
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="pb-2">
                    <DrawerTitle>
                        Importar Leads
                    </DrawerTitle>
                    <DrawerDescription>
                        Sube un archivo Excel con la información de los leads que deseas importar.
                    </DrawerDescription>
                </DrawerHeader>
                <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-[40vh] px-0">
                        <div className="px-4">
                            <ImportContent />
                            <DrawerFooter className="px-0 pt-4 flex flex-col-reverse">
                                <Button onClick={handleImport} disabled={!file || isLoadingImport} className="w-full">
                                    {isLoadingImport ? "Importando..." : "Importar"}
                                </Button>
                                <DrawerClose asChild>
                                    <Button variant="outline" className="w-full" onClick={handleClose}>
                                        Cancelar
                                    </Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </div>
                    </ScrollArea>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
