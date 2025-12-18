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
import { useCreateProject } from "../../_hooks/useProjects";
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

  const createProject = useCreateProject();

  const form = useForm<CreateProjectSchema>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      location: "",
      maxDiscountPercentage: 0,
      currency: "",
      defaultDownPayment: 0,
      defaultFinancingMonths: 0,
      projectImage: undefined,
    },
  });

  const onSubmit = async (input: CreateProjectSchema) => {
    startTransition(async () => {
      try {
        // Construir el body asegurando que projectImage esté incluido solo si es un File real
        const body: Record<string, unknown> = {
          name: input.name,
          location: input.location,
          currency: input.currency,
          defaultDownPayment: input.defaultDownPayment,
          defaultFinancingMonths: input.defaultFinancingMonths,
          maxDiscountPercentage: input.maxDiscountPercentage,
        };

        // Incluir projectImage solo si es un File real (no objetos con path/relativePath)
        if (input.projectImage && input.projectImage instanceof File) {
          body.projectImage = input.projectImage;
        }

        const promise = createProject.mutateAsync({
          body,
        });

        toast.promise(promise, {
          loading: "Creando proyecto...",
          success: "Proyecto creado exitosamente",
          error: (e: unknown) => {
            // Intentar obtener el mensaje de error del servidor
            const error = e as { message?: string; error?: string };
            const errorMessage = error?.message ?? error?.error ?? "Error desconocido al crear el proyecto";
            return errorMessage;
          },
        });

        const result = await promise;

        if (result) {
          setIsSuccess(true);
        }
      } catch {}
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
                      <Button onClick={handleClose} type="button" variant="outline" className="w-full bg-transparent">
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
                    <Button variant="outline" className="w-full bg-transparent" onClick={handleClose}>
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
