"use client";

import { ComponentPropsWithoutRef, useTransition } from "react";
import { Row } from "@tanstack/react-table";
import { RefreshCcw, RefreshCcwDot } from "lucide-react";

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
import { ActivateLeads } from "../../_actions/LeadActions";
import { Lead } from "../../_types/lead";

interface ReactivateLeadsDialogProps extends ComponentPropsWithoutRef<typeof AlertDialog> {
  leads: Array<Row<Lead>["original"]>;
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export const ReactivateLeadsDialog = ({
    leads,
    showTrigger = true,
    onSuccess,
    ...props
}: ReactivateLeadsDialogProps) => {
    const [isPending, startTransition] = useTransition();
    const isDesktop = useMediaQuery("(min-width: 640px)");

    const onReactivateLeadsHandler = () => {
        startTransition(async() => {
            // Extraer los IDs de los leads y filtrar los undefined
            const leadIds = leads.map((lead) => lead?.id).filter((id): id is string => id !== undefined);

            // Si no hay IDs válidos, mostrar error y salir
            if (leadIds.length === 0) {
                toastWrapper(Promise.reject(new Error("No hay leads válidas para reactivar")), {
                    error: (e) => e.message,
                });
                return;
            }

            const [, error] = await toastWrapper(ActivateLeads(leadIds), {
                loading: `Reactivando ${leads.length === 1 ? "lead" : "leads"}...`,
                success: `${leads.length} ${leads.length === 1 ? "lead reactivada" : "leads reactivadas"} correctamente`,
                error: (e) => `Error al reactivar: ${e.message}`,
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
                            <RefreshCcwDot className="mr-2 size-4" aria-hidden="true" />
                            Reactivar (
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
                            Esta acción reactivará a
                            {" "}
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
                        <AlertDialogAction
                            aria-label="Reactivate selected rows"
                            onClick={onReactivateLeadsHandler}
                            disabled={isPending}
                        >
                            {isPending && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
                            Reactivar
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
                        <RefreshCcwDot className="mr-2 size-4" aria-hidden="true" />
                        Reactivar (
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
                        Esta acción reactivará a
                        <span className="font-medium">
                            {" "}
                            {leads.length}
                        </span>
                        {leads.length === 1 ? " lead" : " leads"}
                    </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter className="gap-2 sm:space-x-0">
                    <Button aria-label="Reactivate selected rows" onClick={onReactivateLeadsHandler} disabled={isPending}>
                        {isPending && <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />}
                        Reactivar
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
};
