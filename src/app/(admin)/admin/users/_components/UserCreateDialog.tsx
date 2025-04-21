"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateUser } from "../actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { roles } from "@/app/(admin)/_authorization_context";
import { toastWrapper } from "@/types/toasts";

export const userCreateSchema = z.object({
    name: z.string({ message: "El nombre es obligatorio" }).min(1, { message: "El nombre es obligatorio" })
        .max(250, { message: "El nombre no puede tener más de 250 caracteres" }),
    email: z.string().email("El correo electrónico no es válido"),
    phone: z.string().min(1, { message: "El teléfono es obligatorio" })
        .max(250),
    role: z.string({ message: "El rol de usuario es obligatorio" }).min(1),
});

export type UserCreateDTO = z.infer<typeof userCreateSchema>;

const dataForm = {
    button: "Crear usuario",
    title: "Crear usuario",
    description: "Complete los detalles a continuación para crear un nuevo usuario del sistema",
};

export function UserCreateDialog() {
    const [open, setOpen] = useState(false);

    const form = useForm<UserCreateDTO>({
        resolver: zodResolver(userCreateSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            role: "",
        },
    });

    async function onSubmit(values: UserCreateDTO) {
        const [, error] = await toastWrapper(CreateUser(values), {
            loading: "Creando usuario...",
            success: "Usuario creado correctamente",
        });
        if (error) {
            console.error("Error creating user:", error);
            return;
        }
        form.reset();
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Plus className="mr-2 size-4" aria-hidden="true" />
                    {dataForm.button}
                </Button>
            </DialogTrigger>
            <DialogContent tabIndex={undefined} className="sm:max-w-[800px] px-0">
                <DialogHeader className="px-4">
                    <DialogTitle>
                        {dataForm.title}
                    </DialogTitle>
                    <DialogDescription>
                        {dataForm.description}
                    </DialogDescription>
                </DialogHeader>
                <div className="px-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Nombre
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nombre" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Nombre del nuevo usuario
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Correo electrónico
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="usuario@gestionhogar.com" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Correo electrónico del nuevo usuario
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Teléfono
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nro de teléfono" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Rol de usuario
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} >
                                            <FormControl>
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Rol" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.entries(roles).map(([role, name]) => (
                                                    <SelectItem key={role} value={role}>
                                                        {name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit">
                                Submit
                            </Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
