"use client";

import { useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, RefreshCcw } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/use-media-query";
import { CreateClient } from "../../_actions/ClientActions";
import { clientSchema, CreateClientsSchema } from "../../_schemas/createClientsSchema";
import { ClientTypes } from "../../_types/client";
import CreateClientsForm from "./CreateClientsForm";
import { toastWrapper } from "@/types/toasts";

const dataForm = {
    button: "Crear cliente",
    title: "Crear Cliente",
    description: "Complete los detalles a continuación para crear nuevos clientes.",
};

export function CreateClientsDialog() {
    const isDesktop = useMediaQuery("(min-width: 800px)");
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [isSuccess, setIsSuccess] = useState(false);

    const form = useForm<CreateClientsSchema>({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            name: "",
            coOwner: "", // Cambiado de null a string vacío
            dni: "", // Cambiado de null a string vacío
            ruc: "", // Cambiado de null a string vacío
            companyName: "", // Cambiado de null a string vacío
            phoneNumber: "",
            email: "",
            address: "",
            type: undefined,
        },
    });

    const onSubmit = async(input: CreateClientsSchema) => {
        startTransition(async() => {
            // Preparar los datos para el formato esperado por el backend
            const clientData = {
                name: input.name,
                phoneNumber: input.phoneNumber,
                email: input.email,
                address: input.address,
                type: input.type,
                // Campos condicionales según el tipo de cliente
                ...(input.type === ClientTypes.Natural && {
                    dni: input.dni,
                    coOwner: input.coOwner,
                }),
                ...(input.type === ClientTypes.Juridico && {
                    ruc: input.ruc,
                    companyName: input.companyName,
                }),
            };

            const [, error] = await toastWrapper(CreateClient(clientData), {
                loading: "Creando cliente...",
                success: "Cliente creado exitosamente",
                error: (e) => `Error al crear cliente: ${e.message}`,
            });

            // Con toastWrapper ya se muestra la notificación, pero aún necesitamos
            // manejar la lógica específica para errores en campos y cerrar el modal en caso de éxito
            if (!error) {
                setIsSuccess(true);
            } else {
                // Agregar validación visual para campos con error
                if (error.message.includes("DNI")) {
                    form.setError("dni", {
                        type: "manual",
                        message: "Este DNI ya está registrado para otro cliente",
                    });
                }

                if (error.message.includes("RUC")) {
                    form.setError("ruc", {
                        type: "manual",
                        message: "Este RUC ya está registrado para otro cliente",
                    });
                }
            }
        });
    };

    const handleClose = () => {
        form.reset();
    };

    useEffect(() => {
        if (isSuccess) {
            form.reset();
            setOpen(false);
            setIsSuccess(false);
        }
    }, [isSuccess, form]);

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                        <Plus className="mr-2 size-4" aria-hidden="true" />
                        {dataForm.button}
                    </Button>
                </DialogTrigger>
                <DialogContent tabIndex={undefined} className="sm:max-w-[800px] px-0">
                    <DialogHeader className="px-4">
                        <DialogTitle>
                            {dataForm.title}
                        </DialogTitle>
                        <DialogDescription>
                            {dataForm.description}
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-full max-h-[80vh] px-0">
                        <div className="px-6">
                            <CreateClientsForm form={form} onSubmit={onSubmit}>
                                <DialogFooter className="w-full">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                                        <DialogClose asChild>
                                            <Button onClick={handleClose} type="button" variant="outline" className="w-full">
                                                Cancelar
                                            </Button>
                                        </DialogClose>
                                        <Button disabled={isPending} className="w-full">
                                            {isPending && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
                                            Registrar
                                        </Button>
                                    </div>
                                </DialogFooter>
                            </CreateClientsForm>
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
                    <Plus className="mr-2 size-4" aria-hidden="true" />
                    {dataForm.button}
                </Button>
            </DrawerTrigger>

            <DrawerContent className="h-[80vh]">
                <DrawerHeader className="pb-2">
                    <DrawerTitle>
                        {dataForm.title}
                    </DrawerTitle>
                    <DrawerDescription>
                        {dataForm.description}
                    </DrawerDescription>
                </DrawerHeader>

                <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full px-0">
                        <div className="px-4">
                            <CreateClientsForm form={form} onSubmit={onSubmit}>
                                <DrawerFooter className="px-0 pt-2">
                                    <Button disabled={isPending} className="w-full">
                                        {isPending && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
                                        Registrar
                                    </Button>
                                    <DrawerClose asChild>
                                        <Button variant="outline" className="w-full" onClick={handleClose}>
                                            Cancelar
                                        </Button>
                                    </DrawerClose>
                                </DrawerFooter>
                            </CreateClientsForm>
                        </div>
                    </ScrollArea>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
