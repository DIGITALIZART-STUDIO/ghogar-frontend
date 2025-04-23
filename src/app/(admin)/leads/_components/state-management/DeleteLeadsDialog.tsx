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
import { DeleteLeads } from "../../_actions/LeadActions";
import { Lead } from "../../_types/lead";
import { toast } from "sonner";

interface DeleteLeadsDialogProps extends ComponentPropsWithoutRef<typeof AlertDialog> {
    leads: Array<Row<Lead>["original"]>;
    showTrigger?: boolean;
    onSuccess?: () => void;
}

export function DeleteLeadsDialog({ leads, showTrigger = true, onSuccess, ...props }: DeleteLeadsDialogProps) {
    const [isPending, startTransition] = useTransition();
    const isDesktop = useMediaQuery("(min-width: 640px)");

    const onDeleteLeadsHandler = () => {
        startTransition(async() => {
            // Extraer los IDs de los leads y filtrar los undefined
            const leadIds = leads.map((lead) => lead?.id).filter((id): id is string => id !== undefined);

            // Si no hay IDs válidos, mostrar error y salir
            if (leadIds.length === 0) {
                toast.error("No hay leads válidas para eliminar");
                return;
            }

            const [, error] = await toastWrapper(DeleteLeads(leadIds), {
                loading: `Eliminando ${leads.length === 1 ? "lead" : "leads"}...`,
                success: `${leads.length} ${leads.length === 1 ? "lead eliminada" : "leads eliminadas"} correctamente`,
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
                            {leads.length}
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
                                {leads.length}
                            </span>
                            {leads.length === 1 ? " lead" : " leads"}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2 sm:space-x-0">
                        <AlertDialogCancel asChild>
                            <Button variant="outline">
                                Cancelar
                            </Button>
                        </AlertDialogCancel>
                        <AlertDialogAction aria-label="Delete selected rows" onClick={onDeleteLeadsHandler} disabled={isPending}>
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
                        {leads.length}
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
                            {leads.length}
                        </span>
                        {leads.length === 1 ? " lead" : " leads"}
                    </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter className="gap-2 sm:space-x-0">
                    <Button aria-label="Delete selected rows" onClick={onDeleteLeadsHandler} disabled={isPending}>
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
