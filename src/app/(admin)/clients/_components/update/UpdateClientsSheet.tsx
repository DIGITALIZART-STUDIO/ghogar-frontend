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
import { useUpdateClient } from "../../_hooks/useClients";
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

    const parsedCoOwners = parseCoOwners(client?.coOwners as string);

    const form = useForm<CreateClientsSchema>({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            name: client?.name ?? "",
            dni: client?.dni ?? "",
            ruc: client?.ruc ?? "",
            companyName: client?.companyName ?? "",
            phoneNumber: client?.phoneNumber ?? "",
            email: client?.email ?? "",
            address: client?.address ?? "",
            country: client?.country ?? "",
            type: (client?.type as ClientTypes) ?? ClientTypes.Natural,
            coOwners: parsedCoOwners,
            separateProperty: client?.separateProperty ?? false,
            separatePropertyData: client?.separatePropertyData
                ? JSON.parse(client.separatePropertyData as string)
                : undefined,
        },
    });

    useEffect(() => {
        if (open && client) {
            const parsedCoOwners = parseCoOwners(client?.coOwners as string);
            const parsedSeparatePropertyData = client?.separatePropertyData
                ? JSON.parse(client.separatePropertyData as string)
                : undefined;

            form.reset({
                name: client.name ?? "",
                dni: client.dni ?? "",
                ruc: client.ruc ?? "",
                companyName: client.companyName ?? "",
                phoneNumber: client.phoneNumber ?? "",
                email: client.email ?? "",
                address: client.address ?? "",
                country: client.country ?? "",
                type: client.type as ClientTypes,
                coOwners: parsedCoOwners,
                separateProperty: client.separateProperty ?? false,
                separatePropertyData: parsedSeparatePropertyData,
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, client]);

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

            if (!client.id) {
                toast.error("Client ID is required");
                return;
            }

            const promise = updateClient.mutateAsync({
                params: {
                    path: { id: client.id },
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

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="flex flex-col gap-6 sm:max-w-md h-full overflow-hidden" tabIndex={undefined}>
                <SheetHeader className="text-left pb-0">
                    <SheetTitle className="flex flex-col items-start">
                        {infoSheet.title}
                        {client && (
                            <Badge className="bg-emerald-100 capitalize text-emerald-700 border-emerald-200" variant="secondary">
                                {client.dni ?? client.ruc}
                            </Badge>
                        )}
                    </SheetTitle>
                    <SheetDescription>{infoSheet.description}</SheetDescription>
                </SheetHeader>
                <ScrollArea className="w-full h-[calc(100vh-150px)] p-0">
                    <UpdateCustomersForm form={form} onSubmit={onSubmit}>
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
                    </UpdateCustomersForm>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
