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
import { toast } from "sonner";
import { useCreateBlock } from "../../_hooks/useBlocks";
import { blockSchema, CreateBlockSchema } from "../../_schemas/createBlocksSchema";
import CreateBlocksForm from "./CreateBlocksForm";

const dataForm = {
    button: "Crear manzana",
    title: "Crear Manzana",
    description: "Complete los detalles a continuación para crear una nueva manzana.",
};

interface CreateBlocksDialogProps {
  projectId: string;
  refetch: () => void;
}

export function CreateBlocksDialog({ projectId, refetch }: CreateBlocksDialogProps) {
    const isDesktop = useMediaQuery("(min-width: 810px)");
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [isSuccess, setIsSuccess] = useState(false);

    const createBlock = useCreateBlock();

    const form = useForm<CreateBlockSchema>({
        resolver: zodResolver(blockSchema),
        defaultValues: {
            name: "",
        },
    });

    const onSubmit = async(input: CreateBlockSchema) => {
        startTransition(async() => {
            // Preparar los datos para el formato esperado por el backend
            const blockData = {
                name: input.name,
                projectId: projectId,
            };

            const promise = createBlock.mutateAsync({
                body: blockData,
            });

            toast.promise(promise, {
                loading: "Creando manzana...",
                success: "Manzana creada exitosamente",
                error: (e) => `Error al crear manzana: ${e.message}`,
            });

            const result = await promise;

            if (result) {
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
            refetch();
            setOpen(false);
            setIsSuccess(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                        <DialogTitle>
                            {dataForm.title}
                        </DialogTitle>
                        <DialogDescription>
                            {dataForm.description}
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-full max-h-[80vh] px-0">
                        <div className="px-6">
                            <CreateBlocksForm form={form} onSubmit={onSubmit}>
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
                            </CreateBlocksForm>
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
                            <CreateBlocksForm form={form} onSubmit={onSubmit}>
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
                            </CreateBlocksForm>
                        </div>
                    </ScrollArea>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
