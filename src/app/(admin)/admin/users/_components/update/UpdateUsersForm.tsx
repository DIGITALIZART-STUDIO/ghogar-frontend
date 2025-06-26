
import { UseFormReturn } from "react-hook-form";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PhoneInput } from "@/components/ui/phone-input";
import { Select, SelectContent,  SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Sheet } from "@/components/ui/sheet";
import { UserUpdateDTO } from "../../_schemas/createUsersSchema";
import { Input } from "@/components/ui/input";
import { roles } from "@/app/(admin)/_authorization_context";

interface UpdateUsersFormProps extends Omit<React.ComponentPropsWithRef<typeof Sheet>, "open" | "onOpenChange"> {
  children: React.ReactNode;
  form: UseFormReturn<UserUpdateDTO>;
  onSubmit: (data: UserUpdateDTO) => void;
}

export default function UpdateUsersForm({ children, form, onSubmit }: UpdateUsersFormProps) {

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 px-6 pb-4">
                {/* Información Básica */}

                <div className="flex items-center gap-2">
                    <h3 className="font-semibold">Información del Usuario</h3>
                </div>
                <div className="grid grid-cols-1 gap-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre completo</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Ingrese el nombre completo"
                                        {...field}
                                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                    />
                                </FormControl>
                                <FormDescription>Nombre completo del nuevo usuario</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Correo electrónico</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="usuario@gestionhogar.com"
                                        type="email"
                                        {...field}
                                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                        disabled
                                    />
                                </FormControl>
                                <FormDescription>Dirección de correo electrónico única</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Número de teléfono</FormLabel>
                                <FormControl>
                                    <PhoneInput
                                        defaultCountry={"PE"}
                                        placeholder="999 888 777"
                                        value={field.value}
                                        onChange={(value) => field.onChange(value)}
                                    />
                                </FormControl>
                                <FormDescription>Número de contacto del usuario</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Rol de usuario</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                                            <SelectValue placeholder="Seleccionar rol" />
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
                                <FormDescription>Nivel de acceso y permisos del usuario</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {children}
            </form>

        </Form>
    );
}
