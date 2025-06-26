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
import { ReactivateUser } from "../../actions";
import { UserGetDTO } from "../../_types/user";

interface ReactivateUsersDialogProps extends ComponentPropsWithoutRef<typeof AlertDialog> {
    user: UserGetDTO
    onSuccess?: () => void;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ReactivateUsersDialog = ({
    user,
    onSuccess,
    open,
    onOpenChange,
}: ReactivateUsersDialogProps) => {
    const [isPending, startTransition] = useTransition();
    const isDesktop = useMediaQuery("(min-width: 640px)");

    const onReactivateUsersHandler = () => {
        startTransition(async() => {
            // Si no hay IDs válidos, mostrar error y salir
            if (!user.user.id) {
                toast.error("No hay usuarios válidos para reactivar");
                return;
            }

            try {
                const [, error] = await toastWrapper(ReactivateUser(user.user.id), {
                    loading: "Reactivando usuarios...",
                    success: "Usuario reactivado correctamente",
                    error: (e) => `Error al reactivar: ${e.message}`,
                });

                if (!error) {
                    onSuccess?.();
                }
            } finally {
                // Cierra el diálogo aunque haya error
                onOpenChange(false);
            }
        });
    };

    if (isDesktop) {
        return (
            <AlertDialog open={open} onOpenChange={onOpenChange}>
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
                                un usuario.
                            </span>
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
                            onClick={onReactivateUsersHandler}
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
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>
                        ¿Estás absolutamente seguro?
                    </DrawerTitle>
                    <DrawerDescription>
                        Esta acción reactivará a
                        <span className="font-medium">
                            {" "}
                            un usuario.
                        </span>
                    </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter className="gap-2 sm:space-x-0">
                    <Button aria-label="Reactivate selected rows" onClick={onReactivateUsersHandler} disabled={isPending}>
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
