"use client";

import type React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Key, Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { backend } from "@/types/backend";
import loginImage from "../assets/images/ImageLogin.webp";
import { PasswordInput } from "./ui/password-input";
import { Role } from "@/app/(admin)/_authorization_context";

// Roles que van directamente al dashboard sin pasar por la página de selección de proyecto
const DIRECT_DASHBOARD_ROLES: Array<Role> = ["Supervisor", "SalesAdvisor"];

/**
 * Determina la ruta de redirección basada en los roles del usuario
 * @param roles - Array de roles del usuario
 * @returns La ruta a la que debe redirigir después del login
 */
function getRedirectPath(roles: Array<string>): string {

    // Verificar si el usuario tiene alguno de los roles que van directo al dashboard
    const hasDirectDashboardRole = roles.some((role) => {
        const isDirectRole = DIRECT_DASHBOARD_ROLES.includes(role as Role);
        return isDirectRole;
    });

    // Si tiene un rol que va directo al dashboard, redirigir a "/"
    // Si no, ir a la página de selección de proyecto
    const result = hasDirectDashboardRole ? "/" : "/select-project";
    return result;
}

const loginSchema = z.object({
    email: z
        .string()
        .email({ message: "Correo inválido" })
        .min(3, { message: "El correo debe tener al menos 3 caracteres" })
        .max(50, { message: "El correo debe tener como máximo 50 caracteres" }),
    password: z
        .string()
        .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
        .max(64, { message: "La contraseña debe tener como máximo 64 caracteres" }),
});
type LoginSchema = z.infer<typeof loginSchema>;

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
    const router = useRouter();
    const { mutateAsync: loginMutation } = backend.useMutation("post", "/api/Auth/login");
    const { mutateAsync: getUserMutation } = backend.useMutation("get", "/api/Users");

    async function login(values: LoginSchema) {
        const loginPromise = loginMutation({
            body: values,
        });

        toast.promise(loginPromise, {
            loading: "Iniciando sesión...",
            error: (error) => {
                // Intenta extraer el mensaje personalizado del backend
                if (error?.error?.rawText) {
                    return error.error.rawText;
                }
                if (error instanceof Error) {
                    return error.message;
                }
                return "Error al iniciar sesión";
            },
            success: "Sesión iniciada, redirigiendo...",
        });

        try {
            await loginPromise;
            // Los tokens se establecen automáticamente en las cookies por el backend

            // Obtener información del usuario para determinar la redirección
            try {
                const userData = await getUserMutation({});

                const redirectPath = getRedirectPath(userData.roles);

                router.push(redirectPath);
            } catch (userError) {
                // Si falla obtener datos del usuario, redirigir por defecto a select-project
                console.warn("No se pudieron obtener los roles del usuario, redirigiendo a select-project:", userError);
                router.push("/select-project");
            }
        } catch {
            // El error ya se maneja en el toast.promise
        }
    }

    const form = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden shadow-lg border-primary/10 py-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <div className="relative hidden md:flex flex-col justify-center items-center p-8 text-white">
                        {/* Gradient overlay instead of flat black */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-black/70 z-10" />

                        {/* Improved image styling */}
                        <img
                            src={loginImage.src || "/placeholder.svg"}
                            alt="Gestión Hogar Inmobiliaria"
                            className="absolute inset-0 h-full w-full object-cover z-0 opacity-80"
                        />
                    </div>

                    <Form {...form}>
                        <form className="p-6 md:p-8 flex flex-col h-full justify-center" onSubmit={form.handleSubmit(login)}>
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col items-center text-center mb-4">
                                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                                        <User className="h-8 w-8 text-primary" />
                                    </div>
                                    <h1 className="text-2xl font-bold">
                                        Bienvenido al CRM
                                    </h1>
                                    <p className="text-muted-foreground text-balance mt-2">
                                        Accede a tu portal de gestión inmobiliaria
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel htmlFor="email" className="flex items-center gap-2">
                                                    Correo electrónico
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            id="email"
                                                            type="email"
                                                            placeholder="ejemplo@gestionhogar.com"
                                                            required
                                                            className="pl-10 bg-muted/30 border-muted focus:border-primary"
                                                            {...field}
                                                        />
                                                        <Mail className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="flex items-center justify-between">
                                                    <FormLabel htmlFor="password" className="flex items-center gap-2">
                                                        Contraseña
                                                    </FormLabel>
                                                </div>
                                                <FormControl>
                                                    <div className="relative">
                                                        <PasswordInput
                                                            id="password"
                                                            required
                                                            className="pl-10 bg-muted/30 border-muted focus:border-primary"
                                                            placeholder="********"
                                                            {...field}
                                                        />
                                                        <Key className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full mt-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2"
                                >
                                    Iniciar sesión
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <div className="text-center text-sm text-muted-foreground">
                <p>
                    ©
                    {new Date().getFullYear()}
                    {" "}
                    Gestión Hogar Inmobiliaria. Todos los derechos reservados.
                </p>
            </div>
        </div>
    );
}
