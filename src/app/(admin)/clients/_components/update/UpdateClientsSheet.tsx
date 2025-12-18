"use client";

import { useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCcw } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
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
import { useClientById, useUpdateClient } from "../../_hooks/useClients";
import { clientSchema, CreateClientsSchema } from "../../_schemas/createClientsSchema";
import { Client, ClientTypes } from "../../_types/client";
import UpdateCustomersForm from "./UpdateClientsForm";

const infoSheet = {
  title: "Actualizar Cliente",
  description: "Actualiza la información del cliente y guarda los cambios",
};

interface UpdateClientSheetProps extends Omit<React.ComponentPropsWithRef<typeof Sheet>, "open" | "onOpenChange"> {
  client: Client;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateClientSheet({ client, open, onOpenChange }: UpdateClientSheetProps) {
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);

  const updateClient = useUpdateClient();

  // Obtener cliente actualizado usando el hook (siempre hacer la consulta)
  const { data: clientData, isLoading: isLoadingClient } = useClientById(open && client?.id ? client.id : undefined);

  // Usar los datos del hook si están disponibles, sino usar el prop como fallback
  const currentClient = clientData ?? client;

  // Parseamos coOwners si existe y es una cadena
  const parseCoOwners = (coOwnersString?: string) => {
    if (!coOwnersString) {
      return [];
    }
    try {
      return JSON.parse(coOwnersString);
    } catch (error) {
      console.error("Error parsing coOwners:", error);
      return [];
    }
  };

  const parsedCoOwners = parseCoOwners(currentClient?.coOwners as string);

  const form = useForm<CreateClientsSchema>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: currentClient?.name ?? "",
      dni: currentClient?.dni ?? "",
      ruc: currentClient?.ruc ?? "",
      companyName: currentClient?.companyName ?? "",
      phoneNumber: currentClient?.phoneNumber ?? "",
      email: currentClient?.email ?? "",
      address: currentClient?.address ?? "",
      country: currentClient?.country ?? "",
      type: (currentClient?.type as ClientTypes) ?? ClientTypes.Natural,
      coOwners: parsedCoOwners,
      separateProperty: currentClient?.separateProperty ?? false,
      separatePropertyData: currentClient?.separatePropertyData
        ? JSON.parse(currentClient.separatePropertyData as string)
        : undefined,
    },
  });

  useEffect(() => {
    if (open && currentClient) {
      const parsedCoOwners = parseCoOwners(currentClient?.coOwners as string);
      const parsedSeparatePropertyData = currentClient?.separatePropertyData
        ? JSON.parse(currentClient.separatePropertyData as string)
        : undefined;

      form.reset({
        name: currentClient.name ?? "",
        dni: currentClient.dni ?? "",
        ruc: currentClient.ruc ?? "",
        companyName: currentClient.companyName ?? "",
        phoneNumber: currentClient.phoneNumber ?? "",
        email: currentClient.email ?? "",
        address: currentClient.address ?? "",
        country: currentClient.country ?? "",
        type: currentClient.type as ClientTypes,
        coOwners: parsedCoOwners,
        separateProperty: currentClient.separateProperty ?? false,
        separatePropertyData: parsedSeparatePropertyData,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, currentClient]);

  const onSubmit = async (input: CreateClientsSchema) => {
    startTransition(async () => {
      const clientData = {
        name: input.name,
        phoneNumber: input.phoneNumber,
        email: input.email,
        address: input.address,
        type: input.type,
        country: input.country,
        coOwners: JSON.stringify(input.coOwners),
        separateProperty: input.separateProperty,
        separatePropertyData: input.separatePropertyData ? JSON.stringify(input.separatePropertyData) : null,
        dni: input.type === ClientTypes.Natural ? input.dni : null,
        ruc: input.type === ClientTypes.Juridico ? input.ruc : null,
        companyName: input.type === ClientTypes.Juridico ? (input.companyName ?? input.name) : null,
      };

      if (!currentClient?.id) {
        toast.error("Client ID is required");
        return;
      }

      const promise = updateClient.mutateAsync({
        params: {
          path: { id: currentClient.id },
        },
        body: clientData,
      });

      toast.promise(promise, {
        loading: "Actualizando cliente...",
        success: "Cliente actualizado exitosamente",
        error: (e) => `Error al actualizar cliente: ${e.message}`,
      });

      try {
        await promise;
        setIsSuccess(true);
      } catch (error: unknown) {
        // Manejar errores específicos para campos
        if (
          typeof error === "object" &&
          error !== null &&
          "message" in error &&
          typeof (error as { message?: unknown }).message === "string"
        ) {
          const message = (error as { message: string }).message;
          if (message.includes("DNI")) {
            form.setError("dni", {
              type: "manual",
              message: "Este DNI ya está registrado para otro cliente",
            });
          }
          if (message.includes("RUC")) {
            form.setError("ruc", {
              type: "manual",
              message: "Este RUC ya está registrado para otro cliente",
            });
          }
        }
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

  // Mostrar loading mientras se carga el cliente
  if (isLoadingClient && !currentClient) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="flex flex-col gap-6 sm:max-w-md h-full overflow-hidden" tabIndex={undefined}>
          <SheetHeader className="text-left pb-0">
            <SheetTitle>{infoSheet.title}</SheetTitle>
            <SheetDescription>{infoSheet.description}</SheetDescription>
          </SheetHeader>
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner text="Cargando información del cliente..." />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col gap-6 sm:max-w-md h-full overflow-hidden" tabIndex={undefined}>
        <SheetHeader className="text-left pb-0">
          <SheetTitle className="flex flex-col items-start">
            {infoSheet.title}
            {currentClient && (
              <Badge className="bg-emerald-100 capitalize text-emerald-700 border-emerald-200" variant="secondary">
                {currentClient.dni ?? currentClient.ruc}
              </Badge>
            )}
          </SheetTitle>
          <SheetDescription>{infoSheet.description}</SheetDescription>
        </SheetHeader>
        <ScrollArea className="w-full h-[calc(100vh-150px)] p-0">
          <UpdateCustomersForm form={form} onSubmit={onSubmit}>
            <SheetFooter className="gap-2 pt-2 sm:space-x-0">
              <div className="flex flex-row-reverse gap-2">
                <Button type="submit" disabled={isPending || isLoadingClient}>
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
          </UpdateCustomersForm>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
