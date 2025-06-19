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
import { UpdateLot } from "../../_actions/LotActions";
import { CreateLotSchema, lotSchema } from "../../_schemas/createLotsSchema";
import { LotData, LotStatus } from "../../_types/lot";
import { GetActiveBlocksByProject } from "../../../[id]/blocks/_actions/BlockActions";
import { BlockData } from "../../../[id]/blocks/_types/block";
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
    const [blocks, setBlocks] = useState<Array<BlockData>>([]);
    const [isLoadingBlocks, setIsLoadingBlocks] = useState(false);

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

    const loadActiveBlocks = async() => {
        setIsLoadingBlocks(true);
        try {
            const [result, error] = await GetActiveBlocksByProject(projectId);

            if (error) {
                console.error("Error loading active blocks:", error);
                setBlocks([]);
                return;
            }

            setBlocks(result || []);
        } catch (error) {
            console.error("Error loading active blocks:", error);
            setBlocks([]);
        } finally {
            setIsLoadingBlocks(false);
        }
    };

    // Cargar bloques activos cuando se abre el dialog
    useEffect(() => {
        if (open && projectId) {
            loadActiveBlocks();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, projectId]);

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
            // Preparar los datos según el tipo de cliente
            const lotData = {
                lotNumber: input.lotNumber,
                area: input.area,
                price: input.price,
                status: input.status,
                blockId: input.blockId,
            };

            if (!lot?.id) {
                throw new Error("Block ID is required");
            }
            const [, error] = await toastWrapper(UpdateLot(lot.id, lotData), {
                loading: "Actualizando lote...",
                success: "Lote actualizada exitosamente",
                error: (e) => `Error al actualizar lote: ${e.message}`,
            });

            if (!error) {
                setIsSuccess(true);
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
                        <UpdateLotsForm form={form} onSubmit={onSubmit} blocks={blocks}>
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
