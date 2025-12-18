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
import { useCreateClient } from "../../_hooks/useClients";
import { clientSchema, type CreateClientsSchema } from "../../_schemas/createClientsSchema";
import { ClientTypes } from "../../_types/client";
import CreateClientsForm from "./CreateClientsForm";

const dataForm = {
  button: "Crear cliente",
  title: "Crear Cliente",
  description: "Complete los detalles a continuación para crear nuevos clientes.",
};

interface CreateClientsDialogProps {
  trigger?: React.ReactNode;
  onClientCreated?: (clientId: string) => void;
}

export function CreateClientsDialog({ trigger, onClientCreated }: CreateClientsDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 800px)");
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);

  const createClient = useCreateClient();

  const form = useForm<CreateClientsSchema>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      dni: "",
      ruc: "",
      companyName: "",
      phoneNumber: "",
      email: "",
      address: "",
      type: undefined,
      coOwners: [],
      separateProperty: false,
      separatePropertyData: undefined,
    },
  });

  const onSubmit = async (input: CreateClientsSchema) => {
    startTransition(async () => {
      const clientData: {
        name: string;
        phoneNumber: string;
        email: string;
        address: string;
        type: typeof input.type;
        separateProperty: boolean;
        coOwners?: string;
        country?: string;
        separatePropertyData?: string;
        dni?: string;
        ruc?: string;
        companyName?: string;
      } = {
        name: input.name.trim(),
        phoneNumber: input.phoneNumber.trim(),
        email: input.email.trim(),
        address: input.address.trim(),
        type: input.type,
        separateProperty: input.separateProperty ?? false,
      };

      if (input.coOwners && input.coOwners.length > 0) {
        clientData.coOwners = JSON.stringify(input.coOwners);
      }

      if (input.country?.trim()) {
        clientData.country = input.country.trim();
      }

      if (input.separatePropertyData) {
        clientData.separatePropertyData = JSON.stringify(input.separatePropertyData);
      }

      if (input.type === ClientTypes.Natural && input.dni?.trim()) {
        clientData.dni = input.dni.trim();
      }

      if (input.type === ClientTypes.Juridico) {
        if (input.ruc?.trim()) {
          clientData.ruc = input.ruc.trim();
        }
        if (input.companyName?.trim()) {
          clientData.companyName = input.companyName.trim();
        }
      }

      const promise = createClient.mutateAsync({
        body: clientData,
      });

      toast.promise(promise, {
        loading: "Creando cliente...",
        success: "Cliente creado exitosamente",
        error: (e: unknown) => {
          const error = e as { message?: string; error?: string };
          return error?.message ?? error?.error ?? "Error al crear cliente";
        },
      });

      try {
        const result = await promise;
        if (result?.id && typeof result.id === "string" && onClientCreated) {
          onClientCreated(result.id);
        }
        setIsSuccess(true);
      } catch {
        // El error ya se maneja en el toast.promise
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

  // Trigger por defecto
  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <Plus className="mr-2 size-4" aria-hidden="true" />
      {dataForm.button}
    </Button>
  );

  // Usar el trigger personalizado o el por defecto
  const dialogTrigger = trigger ?? defaultTrigger;

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>
        <DialogContent tabIndex={undefined} className="sm:max-w-[900px] px-0">
          <DialogHeader className="px-4">
            <DialogTitle>{dataForm.title}</DialogTitle>
            <DialogDescription>{dataForm.description}</DialogDescription>
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
      <DrawerTrigger asChild>{dialogTrigger}</DrawerTrigger>

      <DrawerContent className="h-[80vh]">
        <DrawerHeader className="pb-2">
          <DrawerTitle>{dataForm.title}</DrawerTitle>
          <DrawerDescription>{dataForm.description}</DrawerDescription>
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
