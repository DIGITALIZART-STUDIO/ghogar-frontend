"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Key, RefreshCcw } from "lucide-react";
import { useForm } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import UpdateUsersForm from "./UpdateUsersForm";
import { UserUpdateDTO, UserUpdatePasswordDTO, userUpdatePasswordSchema, userUpdateSchema } from "../../_schemas/createUsersSchema";
import { UserGetDTO } from "../../_types/user";
import { Separator } from "@/components/ui/separator";
import UpdateUsersPasswordForm from "./UpdateUsersPasswordForm";
import { useUpdateUser, useUpdateUserPassword } from "../../_hooks/useUser";
import { toast } from "sonner";

const infoSheet = {
    title: "Actualizar Usuario",
    description: "Actualiza la información del usuario y guarda los cambios",
};

interface UpdateUserSheetProps extends Omit<React.ComponentPropsWithRef<typeof Sheet>, "open" | "onOpenChange"> {
  user: UserGetDTO;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateUsersSheet({ user, open, onOpenChange }: UpdateUserSheetProps) {
    const [isSuccess, setIsSuccess] = useState(false);

    const updateUserMutation = useUpdateUser();
    const updateUserPasswordMutation = useUpdateUserPassword();

    const isPending = updateUserMutation.isPending || updateUserPasswordMutation.isPending;

    const form = useForm<UserUpdateDTO>({
        resolver: zodResolver(userUpdateSchema),
        defaultValues: {
            name: user?.user.name ?? "",
            email: user?.user.email ?? "",
            phone: user?.user.phoneNumber ?? "",
            role: user?.roles?.[0] ?? "",
        },
    });

    const formPassword = useForm<UserUpdatePasswordDTO>({
        resolver: zodResolver(userUpdatePasswordSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    });

    useEffect(() => {
        if (open && user) {
            form.reset({
                name: user?.user.name ?? "",
                email: user?.user.email ?? "",
                phone: user?.user.phoneNumber ?? "",
                role: user?.roles?.[0] ?? "",
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, user]);

    const onSubmit = async (input: UserUpdateDTO) => {
        if (!user.user.id) {
            toast.error("User ID is required");
            return;
        }
        const promise = updateUserMutation.mutateAsync({
            userId: user.user.id,
            user: {
                name: input.name,
                phone: input.phone,
                email: input.email,
                role: input.role,
            },
        });

        toast.promise(promise, {
            loading: "Actualizando usuario...",
            success: "Usuario actualizado correctamente.",
            error: (e) => `Error al actualizar usuario: ${e.message ?? e}`,
        });

        promise.then(() => {
            form.reset();
            onOpenChange(false);
            setIsSuccess(false);
        });
    };

    const onSubmitPassword = async (input: UserUpdatePasswordDTO) => {
        if (!user.user.id) {
            toast.error("User ID is required");
            return;
        }
        const promise = updateUserPasswordMutation.mutateAsync({
            userId: user.user.id,
            passwordDto: input,
        });

        toast.promise(promise, {
            loading: "Actualizando contraseña...",
            success: "Contraseña actualizada correctamente.",
            error: (e) => `Error al actualizar contraseña: ${e.message ?? e}`,
        });

        promise.then(() => {
            formPassword.reset();
            onOpenChange(false);
            setIsSuccess(false);
        });
    };
    useEffect(() => {
        if (isSuccess) {
            form.reset();
            formPassword.reset();
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
                        {user && (
                            <Badge className="bg-emerald-100 capitalize text-emerald-700 border-emerald-200" variant="secondary">
                                {user.user.isActive ? "Activo" : "Inactivo"}
                            </Badge>
                        )}
                    </SheetTitle>
                    <SheetDescription>{infoSheet.description}</SheetDescription>
                </SheetHeader>
                <ScrollArea className="w-full h-[calc(100vh-150px)] p-0">
                    <>
                        <UpdateUsersForm form={form} onSubmit={onSubmit} >
                            <div className="gap-2 pt-2 sm:space-x-0">
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
                            </div>
                        </UpdateUsersForm>

                        <Separator />

                        <UpdateUsersPasswordForm form={formPassword} onSubmit={onSubmitPassword}>
                            <div className="gap-2 pt-2 sm:space-x-0">
                                <div className="flex flex-row-reverse gap-2 w-full">
                                    <Button type="submit" disabled={isPending || !form.formState.isValid} className="gap-2">
                                        {isPending && <RefreshCcw className="h-4 w-4 animate-spin" aria-hidden="true" />}
                                        <Key className="size-4" />
                                        Cambiar Contraseña
                                    </Button>
                                    <SheetClose asChild>
                                        <Button type="button" variant="outline">
                                            Cancelar
                                        </Button>
                                    </SheetClose>
                                </div>
                            </div>
                        </UpdateUsersPasswordForm>
                    </>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
