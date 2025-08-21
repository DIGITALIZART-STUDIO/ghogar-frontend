"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, RefreshCcw } from "lucide-react";
import { useForm } from "react-hook-form";

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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/use-media-query";
import { toast } from "sonner";
import { useCreateLead } from "../../_hooks/useLeads";
import { CreateLeadSchema, leadSchema } from "../../_schemas/createLeadsSchema";
import { LeadStatus } from "../../_types/lead";
import CreateLeadsForm from "./CreateLeadsForm";

const dataForm = {
    button: "Crear lead",
    title: "Crear Lead",
    description: "Complete los detalles a continuación para crear un nuevo lead.",
};

export function CreateLeadsDialog() {
    const isDesktop = useMediaQuery("(min-width: 810px)");
    const [open, setOpen] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const form = useForm<CreateLeadSchema>({
        resolver: zodResolver(leadSchema),
        defaultValues: {
            clientId: "",
            assignedToId: "",
            projectId: "",
            captureSource: undefined,
        },
    });

    // Hook para crear lead
    const createLead = useCreateLead();

    const onSubmit = async (input: CreateLeadSchema) => {
        const payload = {
            clientId: input.clientId,
            assignedToId: input.assignedToId,
            captureSource: input.captureSource,
            projectId: input.projectId,
            status: LeadStatus.Registered,
        };

        const promise = createLead.mutateAsync(payload);

        toast.promise(promise, {
            loading: "Creando lead...",
            success: "Lead creada exitosamente",
            error: (e) => `Error al crear lead: ${e.message ?? e}`,
        });

        promise.then(() => {
            setIsSuccess(true);
        }).catch((error) => {
            // Manejar errores específicos si es necesario
            if (error?.message?.includes("cliente")) {
                form.setError("clientId", {
                    type: "manual",
                    message: "Error con el cliente seleccionado",
                });
            }
            if (error?.message?.includes("asesor")) {
                form.setError("assignedToId", {
                    type: "manual",
                    message: "Error con el asesor seleccionado",
                });
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
                <DialogContent tabIndex={undefined} className="px-0">
                    <DialogHeader className="px-4">
                        <DialogTitle>{dataForm.title}</DialogTitle>
                        <DialogDescription>{dataForm.description}</DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-full max-h-[80vh] px-0">
                        <div className="px-6">
                            <CreateLeadsForm form={form} onSubmit={onSubmit}>
                                <DialogFooter>
                                    <div className="grid grid-cols-2 gap-2 w-full">
                                        <DialogClose asChild>
                                            <Button onClick={handleClose} type="button" variant="outline" className="w-full">
                                                Cancelar
                                            </Button>
                                        </DialogClose>
                                        <Button disabled={createLead.isPending} className="w-full">
                                            {createLead.isPending && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
                                            Registrar
                                        </Button>
                                    </div>
                                </DialogFooter>
                            </CreateLeadsForm>
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

            <DrawerContent>
                <DrawerHeader className="pb-2">
                    <DrawerTitle>{dataForm.title}</DrawerTitle>
                    <DrawerDescription>{dataForm.description}</DrawerDescription>
                </DrawerHeader>
                <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-[40vh] px-0">
                        <div className="px-4">
                            <CreateLeadsForm form={form} onSubmit={onSubmit}>
                                <DrawerFooter className="px-0 pt-2 flex flex-col-reverse">
                                    <Button disabled={createLead.isPending} className="w-full">
                                        {createLead.isPending && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
                                        Registrar
                                    </Button>
                                    <DrawerClose asChild>
                                        <Button variant="outline" className="w-full" onClick={handleClose}>
                                            Cancelar
                                        </Button>
                                    </DrawerClose>
                                </DrawerFooter>
                            </CreateLeadsForm>
                        </div>
                    </ScrollArea>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
