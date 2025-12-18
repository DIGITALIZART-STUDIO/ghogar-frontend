"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Plus,RefreshCcw,Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { UserCreateDTO, userCreateSchema } from "../../_schemas/createUsersSchema";
import {  generateSecurePassword } from "../../_utils/user.utils";
import UserCreateForm from "./UserCreateForm";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCreateUser } from "../../_hooks/useUser";

const dataForm = {
    button: "Crear usuario",
    title: "Crear usuario",
    description: "Complete los detalles a continuación para crear un nuevo usuario del sistema",
};

export function UserCreateDialog() {
    const [open, setOpen] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 800px)");
    const [isSuccess, setIsSuccess] = useState(false);

    const [isGenerating, setIsGenerating] = useState(false);
    const [passwordCopied, setPasswordCopied] = useState(false);

    const createUserMutation = useCreateUser();

    const isPending = createUserMutation.isPending;

    const form = useForm<UserCreateDTO>({
        resolver: zodResolver(userCreateSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            role: "",
            password: "",
        },
    });

    const handleGeneratePassword = async () => {
        setIsGenerating(true);

        // Simulate generation delay for better UX
        await new Promise((resolve) => setTimeout(resolve, 500));

        const newPassword = generateSecurePassword(16);
        form.setValue("password", newPassword);

        setIsGenerating(false);

        toast.success("Contraseña generada exitosamente", {
            description: "Se ha generado una contraseña segura automáticamente.",
        });
    };

    const handleCopyPassword = async (password: string) => {
        try {
            await navigator.clipboard.writeText(password);
            setPasswordCopied(true);
            toast.success("Contraseña copiada", {
                description: "La contraseña ha sido copiada al portapapeles.",
            });

            setTimeout(() => setPasswordCopied(false), 2000);
        } catch {
            toast.error("Error al copiar", {
                description: "No se pudo copiar la contraseña al portapapeles.",
            });
        }
    };

    const onSubmit = async (values: UserCreateDTO) => {
        const promise = createUserMutation.mutateAsync({
            name: values.name,
            phone: values.phone,
            email: values.email,
            role: values.role,
            password: values.password,
        });

        toast.promise(promise, {
            loading: "Creando usuario...",
            success: "Usuario creado exitosamente",
            error: (e) => `Error al crear usuario: ${e.message ?? e}`,
        });

        promise.then(() => {
            form.reset();
            setOpen(false);
            setIsSuccess(false);
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
                <DialogContent tabIndex={undefined} className="sm:max-w-[900px] px-0">
                    <DialogHeader className="px-4">
                        <DialogTitle className="flex items-center gap-2">
                            <Shield className="size-5 text-primary" />
                            {dataForm.title}
                        </DialogTitle>
                        <DialogDescription>{dataForm.description}</DialogDescription>
                    </DialogHeader>

                    <Separator />
                    <ScrollArea className="h-full max-h-[80vh] px-0">
                        <div className="px-6">
                            <UserCreateForm form={form} onSubmit={onSubmit} handleCopyPassword={handleCopyPassword} handleGeneratePassword={handleGeneratePassword} isGenerating={isGenerating} passwordCopied={passwordCopied}>
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
                            </UserCreateForm>
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

            <DrawerContent className="h-[80vh]">
                <DrawerHeader className="pb-2">
                    <DrawerTitle className="flex items-center gap-2">
                        <Shield className="size-5 text-primary" />{dataForm.title}</DrawerTitle>
                    <DrawerDescription>{dataForm.description}</DrawerDescription>
                </DrawerHeader>

                <div className="flex-1 overflow-hidden">
                    <ScrollArea className="h-full px-0">
                        <div className="px-4">
                            <UserCreateForm form={form} onSubmit={onSubmit} handleCopyPassword={handleCopyPassword} handleGeneratePassword={handleGeneratePassword} isGenerating={isGenerating} passwordCopied={passwordCopied}>
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
                            </UserCreateForm>
                        </div>
                    </ScrollArea>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
