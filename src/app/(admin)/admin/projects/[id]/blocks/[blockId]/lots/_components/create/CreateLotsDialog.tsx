"use client";

import { useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, RefreshCcw } from "lucide-react";
import { useForm } from "react-hook-form";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useCreateLot } from "../../_hooks/useLots";
import { CreateLotSchema, lotSchema } from "../../_schemas/createLotsSchema";
import { useActiveBlocks } from "../../../../_hooks/useBlocks";
import { BlockData } from "../../../../_types/block";
import CreateLotsForm from "./CreateLotsForm";

const dataForm = {
  button: "Crear lote",
  title: "Crear Lote",
  description: "Complete los detalles a continuación para crear un nuevo lote.",
};

interface CreateLotsDialogProps {
  projectId: string;
  blockId?: string; // Opcional para preseleccionar un bloque
}

export function CreateLotsDialog({ projectId, blockId }: CreateLotsDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 810px)");
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);

  const createLot = useCreateLot();
  const { data: blocks = [], isLoading: isLoadingBlocks } = useActiveBlocks(projectId);

  const form = useForm<CreateLotSchema>({
    resolver: zodResolver(lotSchema),
    defaultValues: {
      lotNumber: "",
      area: 0,
      price: 0,
      status: "Available",
      blockId: blockId ?? undefined,
    },
  });

  // Si hay un blockId preseleccionado, establecerlo en el form cuando los bloques se cargan
  useEffect(() => {
    if (blockId && blocks.length > 0 && blocks.some((block: BlockData) => block.id === blockId)) {
      form.setValue("blockId", blockId);
    }
  }, [blockId, blocks, form]);

  const onSubmit = async (input: CreateLotSchema) => {
    startTransition(async () => {
      // Preparar los datos para el formato esperado por el backend
      const lotData = {
        lotNumber: input.lotNumber,
        area: input.area,
        price: input.price,
        status: input.status,
        blockId: input.blockId,
        // No incluir projectId aquí si el backend lo obtiene del bloque
      };

      const promise = createLot.mutateAsync({
        body: lotData,
      });

      toast.promise(promise, {
        loading: "Creando lote...",
        success: "Lote creado exitosamente",
        error: (e) => `Error al crear lote: ${e.message}`,
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
        <DialogContent tabIndex={undefined} className="px-0 sm:max-w-[800px]">
          <DialogHeader className="px-4">
            <DialogTitle>{dataForm.title}</DialogTitle>
            <DialogDescription>{dataForm.description}</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-full max-h-[80vh] px-0">
            <div className="px-6">
              {isLoadingBlocks ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                  <span>Cargando manzanas activas...</span>
                </div>
              ) : (
                <CreateLotsForm
                  form={form}
                  onSubmit={onSubmit}
                  blocks={blocks}
                  selectedBlockId={blockId}
                  projectId={projectId}
                >
                  <DialogFooter>
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <DialogClose asChild>
                        <Button onClick={handleClose} type="button" variant="outline" className="w-full">
                          Cancelar
                        </Button>
                      </DialogClose>
                      <Button disabled={isPending || blocks.length === 0} className="w-full">
                        {isPending && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
                        Registrar
                      </Button>
                    </div>
                  </DialogFooter>
                </CreateLotsForm>
              )}
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
              {isLoadingBlocks ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                  <span>Cargando manzanas activas...</span>
                </div>
              ) : (
                <CreateLotsForm
                  form={form}
                  onSubmit={onSubmit}
                  blocks={blocks}
                  selectedBlockId={blockId}
                  projectId={projectId}
                >
                  <DrawerFooter className="px-0 pt-2 flex flex-col-reverse">
                    <Button disabled={isPending || blocks.length === 0} className="w-full">
                      {isPending && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
                      Registrar
                    </Button>
                    <DrawerClose asChild>
                      <Button variant="outline" className="w-full" onClick={handleClose}>
                        Cancelar
                      </Button>
                    </DrawerClose>
                  </DrawerFooter>
                </CreateLotsForm>
              )}
            </div>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
