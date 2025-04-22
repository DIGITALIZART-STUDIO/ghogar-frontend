"use client";

import { useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcw } from "lucide-react";
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
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/use-media-query";
import { toastWrapper } from "@/types/toasts";
import { CreateTask } from "../../_actions/LeadTaskActions";
import { CreateLeadTasksSchema, leadTaskSchema } from "../../_schemas/createLeadTasksSchema";
import CreateLeadTasksForm from "./CreateLeadTasksForm";

const dataForm = {
    title: "Crear Tarea",
    description: "Complete los detalles a continuación para crear una nueva tarea.",
};

interface CreateLeadTasksDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  assignedToId: string;
  leadId: string;
}

export function CreateLeadTasksDialog({ open, setOpen, assignedToId, leadId }: CreateLeadTasksDialogProps) {
    const isDesktop = useMediaQuery("(min-width: 810px)");
    const [isPending, startTransition] = useTransition();
    const [isSuccess, setIsSuccess] = useState(false);

    const form = useForm<CreateLeadTasksSchema>({
        resolver: zodResolver(leadTaskSchema),
        defaultValues: {
            type: undefined,
            description: "",
            scheduledDate: "",
        },
    });

    const onSubmit = async(input: CreateLeadTasksSchema) => {
        startTransition(async() => {
            // Preparar los datos para el formato esperado por el backend
            const leadData = {
                type: input.type,
                description: input.description,
                scheduledDate: input.scheduledDate,
                assignedToId: assignedToId,
                leadId: leadId,
            };

            const [, error] = await toastWrapper(CreateTask(leadData), {
                loading: "Creando tarea...",
                success: "Tarea creada exitosamente",
                error: (e) => `Error al crear lead: ${e.message}`,
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
                <DialogContent tabIndex={undefined} className="px-0">
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
                            <CreateLeadTasksForm form={form} onSubmit={onSubmit}>
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
                            </CreateLeadTasksForm>
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent>
                <DrawerHeader className="pb-2">
                    <DrawerTitle>
                        {dataForm.title}
                    </DrawerTitle>
                    <DrawerDescription>
                        {dataForm.description}
                    </DrawerDescription>
                </DrawerHeader>

                {/* The key fix is in this ScrollArea configuration */}
                <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-[40vh] px-0">
                        <div className="px-4">
                            <CreateLeadTasksForm form={form} onSubmit={onSubmit}>
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
                            </CreateLeadTasksForm>
                        </div>
                    </ScrollArea>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
