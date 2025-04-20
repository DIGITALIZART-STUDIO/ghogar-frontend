"use client";

import { ComponentPropsWithoutRef, useTransition } from "react";
import { type Row } from "@tanstack/react-table";
import { RefreshCcw, Trash } from "lucide-react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
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
import { useMediaQuery } from "@/hooks/use-media-query";
import { toastWrapper } from "@/types/toasts";
import { DeleteClients } from "../../_actions/ClientActions";
import { Client } from "../../_types/client";
import { toast } from "sonner";

interface DeleteClientsDialogProps extends ComponentPropsWithoutRef<typeof AlertDialog> {
    clients: Array<Row<Client>["original"]>;
    showTrigger?: boolean;
    onSuccess?: () => void;
}

export function DeleteClientsDialog({ clients, showTrigger = true, onSuccess, ...props }: DeleteClientsDialogProps) {
    const [isPending, startTransition] = useTransition();
    const isDesktop = useMediaQuery("(min-width: 640px)");

    const onDeleteClientsHandler = () => {
        startTransition(async() => {
            // Extraer los IDs de los clientes y filtrar los undefined
            const clientIds = clients.map((client) => client.id).filter((id): id is string => id !== undefined);

            // Si no hay IDs válidos, mostrar error y salir
            if (clientIds.length === 0) {
                toast.error("No hay clientes válidos para eliminar");
                return;
            }

            const [, error] = await toastWrapper(DeleteClients(clientIds), {
                loading: `Eliminando ${clients.length === 1 ? "cliente" : "clientes"}...`,
                success: `${clients.length} ${clients.length === 1 ? "cliente eliminado" : "clientes eliminados"} correctamente`,
                error: (e) => `Error al eliminar: ${e.message}`,
            });

            if (!error) {
                props.onOpenChange?.(false);
                onSuccess?.();
            }
        });
    };

    if (isDesktop) {
        return (
            <AlertDialog {...props}>
                {showTrigger ? (
                    <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Trash className="mr-2 size-4" aria-hidden="true" />
                            Eliminar (
                            {clients.length}
                            )
                        </Button>
                    </AlertDialogTrigger>
                ) : null}
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            ¿Estás absolutamente seguro?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará a
                            <span className="font-medium">
                                {" "}
                                {clients.length}
                            </span>
                            {clients.length === 1 ? " cliente" : " clientes"}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2 sm:space-x-0">
                        <AlertDialogCancel asChild>
                            <Button variant="outline">
                                Cancelar
                            </Button>
                        </AlertDialogCancel>
                        <AlertDialogAction aria-label="Delete selected rows" onClick={onDeleteClientsHandler} disabled={isPending}>
                            {isPending && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
    }

    return (
        <Drawer {...props}>
            {showTrigger ? (
                <DrawerTrigger asChild>
                    <Button variant="outline" size="sm">
                        <Trash className="mr-2 size-4" aria-hidden="true" />
                        Eliminar (
                        {clients.length}
                        )
                    </Button>
                </DrawerTrigger>
            ) : null}
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>
                        ¿Estás absolutamente seguro?
                    </DrawerTitle>
                    <DrawerDescription>
                        Esta acción eliminará a
                        <span className="font-medium">
                            {" "}
                            {clients.length}
                        </span>
                        {clients.length === 1 ? " cliente" : " clientes"}
                    </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter className="gap-2 sm:space-x-0">
                    <Button aria-label="Delete selected rows" onClick={onDeleteClientsHandler} disabled={isPending}>
                        {isPending && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
                        Eliminar
                    </Button>
                    <DrawerClose asChild>
                        <Button variant="outline">
                            Cancelar
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
