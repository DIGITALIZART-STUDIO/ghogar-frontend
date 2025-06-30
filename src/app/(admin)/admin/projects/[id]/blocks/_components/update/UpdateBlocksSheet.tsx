"use client";

import { useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcw } from "lucide-react";
import { useForm } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { toastWrapper } from "@/types/toasts";
import { UpdateBlock } from "../../_actions/BlockActions";
import { blockSchema, CreateBlockSchema } from "../../_schemas/createBlocksSchema";
import { BlockData } from "../../_types/block";
import UpdateBlocksForm from "./UpdateBlocksForm";

const infoSheet = {
    title: "Actualizar Manzana",
    description: "Actualiza la información de la manzana y guarda los cambios",
};

interface UpdateBlocksSheetProps extends Omit<React.ComponentPropsWithRef<typeof Sheet>, "open" | "onOpenChange"> {
  block: BlockData;
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refetch: () => void;
}

export function UpdateBlocksSheet({ block, projectId, open, onOpenChange, refetch }: UpdateBlocksSheetProps) {
    const [isPending, startTransition] = useTransition();
    const [isSuccess, setIsSuccess] = useState(false);

    const form = useForm<CreateBlockSchema>({
        resolver: zodResolver(blockSchema),
        defaultValues: {
            name: block?.name ?? "",
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                name: block?.name ?? "",
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, block]);

    const onSubmit = async(input: CreateBlockSchema) => {
        startTransition(async() => {
            // Preparar los datos según el tipo de cliente
            const clientData = {
                name: input.name,
                projectId: projectId,
            };

            if (!block?.id) {
                throw new Error("Block ID is required");
            }
            const [, error] = await toastWrapper(UpdateBlock(block.id, clientData), {
                loading: "Actualizando manzana...",
                success: "Manzana actualizada exitosamente",
                error: (e) => `Error al actualizar manzana: ${e.message}`,
            });

            if (!error) {
                setIsSuccess(true);
            }
        });
    };

    useEffect(() => {
        if (isSuccess) {
            form.reset();
            refetch();
            onOpenChange(false);
            setIsSuccess(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess]);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="flex flex-col gap-6 sm:max-w-md h-full overflow-hidden" tabIndex={undefined}>
                <SheetHeader className="text-left pb-0">
                    <SheetTitle className="flex flex-col items-start">
                        {infoSheet.title}
                        <Badge className="bg-emerald-100 capitalize text-emerald-700" variant="secondary">
                            {block?.isActive ? "Activo" : "Inactivo"}
                        </Badge>
                    </SheetTitle>
                    <SheetDescription>
                        {infoSheet.description}
                    </SheetDescription>
                </SheetHeader>
                <ScrollArea className="w-full h-[calc(100vh-150px)] p-0">
                    <UpdateBlocksForm form={form} onSubmit={onSubmit}>
                        <SheetFooter className="gap-2 pt-2 sm:space-x-0">
                            <div className="flex flex-row-reverse gap-2">
                                <Button type="submit" disabled={isPending}>
                                    {isPending && <RefreshCcw className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
                                    Actualizar
                                </Button>
                                <SheetClose asChild>
                                    <Button type="button" variant="outline">
                                        Cancelar
                                    </Button>
                                </SheetClose>
                            </div>
                        </SheetFooter>
                    </UpdateBlocksForm>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
