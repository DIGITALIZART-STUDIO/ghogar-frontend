"use client";

import { ComponentPropsWithoutRef, useTransition } from "react";
import { RefreshCcw } from "lucide-react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
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
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { toastWrapper } from "@/types/toasts";
import { toast } from "sonner";
import { UserGetDTO } from "../../_types/user";
import { DeactivateUser } from "../../actions";

interface DeleteUsersDialogProps extends ComponentPropsWithoutRef<typeof AlertDialog> {
    user: UserGetDTO;
    onSuccess?: () => void;
}

export function DeleteUsersDialog({ user, onSuccess, ...props }: DeleteUsersDialogProps) {
    const [isPending, startTransition] = useTransition();
    const isDesktop = useMediaQuery("(min-width: 640px)");

    const onDeleteUsersHandler = () => {
        startTransition(async() => {

            // Si no hay IDs válidos, mostrar error y salir
            if (!user.user.id) {
                toast.error("No hay usuario seleccionado para eliminar.");
                return;
            }

            const [, error] = await toastWrapper(DeactivateUser(user.user.id), {
                loading: "Eliminando usuario...",
                success: "Usuario eliminando correctamente",
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
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            ¿Estás absolutamente seguro?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará a
                            <span className="font-medium">
                                {" "}
                                un usuario Esta acción no se puede deshacer.
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2 sm:space-x-0">
                        <AlertDialogCancel asChild>
                            <Button variant="outline">
                                Cancelar
                            </Button>
                        </AlertDialogCancel>
                        <AlertDialogAction aria-label="Delete selected rows" onClick={onDeleteUsersHandler} disabled={isPending}>
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
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>
                        ¿Estás absolutamente seguro?
                    </DrawerTitle>
                    <DrawerDescription>
                        Esta acción eliminará a
                        <span className="font-medium">
                            {" "}
                            un usuario. Esta acción no se puede deshacer.
                        </span>
                    </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter className="gap-2 sm:space-x-0">
                    <Button aria-label="Delete selected rows" onClick={onDeleteUsersHandler} disabled={isPending}>
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
