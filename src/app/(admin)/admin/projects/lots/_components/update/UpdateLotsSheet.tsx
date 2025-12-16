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
import { toast } from "sonner";
import { useUpdateLot } from "../../_hooks/useLots";
import { CreateLotSchema, lotSchema } from "../../_schemas/createLotsSchema";
import { LotData, LotStatus } from "../../_types/lot";
import { useActiveBlocks } from "../../../[id]/blocks/_hooks/useBlocks";
import UpdateLotsForm from "./UpdateLotsForm";

const infoSheet = {
    title: "Actualizar Lote",
    description: "Actualiza la información del lote y guarda los cambios",
};

interface UpdateLotsSheetProps extends Omit<React.ComponentPropsWithRef<typeof Sheet>, "open" | "onOpenChange"> {
  lot: LotData;
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateLotsSheet({ lot, projectId, open, onOpenChange }: UpdateLotsSheetProps) {
    const [isPending, startTransition] = useTransition();
    const [isSuccess, setIsSuccess] = useState(false);

    const updateLot = useUpdateLot();
    const { data: blocks = [], isLoading: isLoadingBlocks } = useActiveBlocks(projectId);

    const form = useForm<CreateLotSchema>({
        resolver: zodResolver(lotSchema),
        defaultValues: {
            lotNumber: lot?.lotNumber ?? "",
            area: lot?.area ?? 0,
            price: lot?.price ?? 0,
            status: lot?.status ?? "Available",
            blockId: lot?.blockId ?? "",
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                lotNumber: lot?.lotNumber ?? "",
                area: lot?.area ?? 0,
                price: lot?.price ?? 0,
                status: lot?.status ?? LotStatus.Available,
                blockId: lot?.blockId ?? "",
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, lot]);

    const onSubmit = async(input: CreateLotSchema) => {
        startTransition(async() => {
            if (!lot?.id) {
                toast.error("Lot ID is required");
                return;
            }

            // Preparar los datos según el tipo de cliente
            const lotData = {
                lotNumber: input.lotNumber,
                area: input.area,
                price: input.price,
                status: input.status,
                blockId: input.blockId,
            };

            const promise = updateLot.mutateAsync({
                params: {
                    path: { id: lot.id },
                },
                body: lotData,
            });

            toast.promise(promise, {
                loading: "Actualizando lote...",
                success: "Lote actualizado exitosamente",
                error: (e) => `Error al actualizar lote: ${e.message}`,
            });

            try {
                await promise;
                setIsSuccess(true);
            } catch (error) {
                // Manejar errores específicos si es necesario
                console.error("Error updating lot:", error);
            }
        });
    };

    useEffect(() => {
        if (isSuccess) {
            form.reset();
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
                            {lot?.isActive ? "Activo" : "Inactivo"}
                        </Badge>
                    </SheetTitle>
                    <SheetDescription>
                        {infoSheet.description}
                    </SheetDescription>
                </SheetHeader>
                <ScrollArea className="w-full h-[calc(100vh-150px)] p-0">
                    {isLoadingBlocks ? (
                        <div className="flex items-center justify-center py-8">
                            <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                            <span>
                                Cargando manzanas activas...
                            </span>
                        </div>
                    ) : (
                        <UpdateLotsForm form={form} onSubmit={onSubmit} blocks={blocks} projectId={projectId}>
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
                        </UpdateLotsForm>
                    )}
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
