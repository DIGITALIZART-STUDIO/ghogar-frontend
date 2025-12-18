"use client";

import { useEffect, useState, useTransition } from "react";
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
import { toastWrapper } from "@/types/toasts";
import { CreateProject } from "../../_actions/ProjectActions";
import { CreateProjectSchema, projectSchema } from "../../_schemas/createProjectsSchema";
import CreateProjectsForm from "./CreateProjectsForm";

const dataForm = {
    button: "Crear proyecto",
    title: "Crear Proyecto",
    description: "Complete los detalles a continuación para crear un nuevo proyecto.",
};

export function CreateProjectsDialog() {
    const isDesktop = useMediaQuery("(min-width: 810px)");
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [isSuccess, setIsSuccess] = useState(false);

    const form = useForm<CreateProjectSchema>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            name: "",
            location: "",
            maxDiscountPercentage: 0,
            currency: "",
            defaultDownPayment: 0,
            defaultFinancingMonths: 0,
        },
    });

    const onSubmit = async (input: CreateProjectSchema) => {
        startTransition(async () => {
            // Preparar los datos para el formato esperado por el backend
            const leadData = {
                name: input.name,
                location: input.location,
                maxDiscountPercentage: input.maxDiscountPercentage,
                currency: input.currency,
                defaultDownPayment: input.defaultDownPayment,
                defaultFinancingMonths: input.defaultFinancingMonths,
            };

            const [, error] = await toastWrapper(CreateProject(leadData), {
                loading: "Creando proyecto...",
                success: "Proyecto creado exitosamente",
                error: (e) => `Error al crear proyecto: ${e.message}`,
            });

            if (!error) {
                setIsSuccess(true);
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
                <DialogContent tabIndex={undefined} className="px-0 sm:max-w-[600px]">
                    <DialogHeader className="px-4">
                        <DialogTitle>{dataForm.title}</DialogTitle>
                        <DialogDescription>{dataForm.description}</DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-full max-h-[80vh] px-0">
                        <div className="px-6">
                            <CreateProjectsForm form={form} onSubmit={onSubmit}>
                                <DialogFooter>
                                    <div className="grid grid-cols-2 gap-2 w-full">
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
                            </CreateProjectsForm>
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

                {/* The key fix is in this ScrollArea configuration */}
                <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-[40vh] px-0">
                        <div className="px-4">
                            <CreateProjectsForm form={form} onSubmit={onSubmit}>
                                <DrawerFooter className="px-0 pt-2 flex flex-col-reverse">
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
                            </CreateProjectsForm>
                        </div>
                    </ScrollArea>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
