
import { UseFormReturn } from "react-hook-form";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Sheet } from "@/components/ui/sheet";
import { UserUpdatePasswordDTO } from "../../_schemas/createUsersSchema";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Check, Copy, Eye, EyeOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { calculatePasswordStrength, generateSecurePassword } from "../../_utils/user.utils";

interface UpdateUsersPasswordFormProps extends Omit<React.ComponentPropsWithRef<typeof Sheet>, "open" | "onOpenChange"> {
  children: React.ReactNode;
  form: UseFormReturn<UserUpdatePasswordDTO>;
  onSubmit: (data: UserUpdatePasswordDTO) => void;
}

export default function UpdateUsersPasswordForm({ children, form, onSubmit }: UpdateUsersPasswordFormProps) {
    const [showPasswords, setShowPasswords] = useState({
        new: false,
        confirm: false,
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [passwordCopied, setPasswordCopied] = useState(false);
    const watchedNewPassword = form.watch("newPassword");

    const passwordStrength = calculatePasswordStrength(watchedNewPassword || "");
    const handleGeneratePassword = async () => {
        setIsGenerating(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        const newPassword = generateSecurePassword(16);
        form.setValue("newPassword", newPassword);
        form.setValue("confirmPassword", newPassword);
        setIsGenerating(false);
    };

    const handleCopyPassword = async (password: string) => {
        try {
            await navigator.clipboard.writeText(password);
            setPasswordCopied(true);
            setTimeout(() => setPasswordCopied(false), 2000);
        } catch (error) {
            console.error("Error copying password:", error);
        }
    };

    const togglePasswordVisibility = (field: "new" | "confirm") => {
        setShowPasswords((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 px-6 pt-4">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold">Nueva Contraseña</h3>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleGeneratePassword}
                            disabled={isGenerating}
                            className="gap-2"
                        >
                            <RefreshCw className={`size-4 ${isGenerating ? "animate-spin" : ""}`} />
                            {isGenerating ? "Generando..." : "Generar"}
                        </Button>
                    </div>

                    <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nueva Contraseña</FormLabel>
                                <div className="space-y-3">
                                    <div className="relative">
                                        <FormControl>
                                            <Input
                                                type={showPasswords.new ? "text" : "password"}
                                                placeholder="Ingrese la nueva contraseña"
                                                {...field}
                                                className="pr-20 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                            />
                                        </FormControl>
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                            {field.value && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleCopyPassword(field.value)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    {passwordCopied ? (
                                                        <Check className="size-4 text-green-600" />
                                                    ) : (
                                                        <Copy className="size-4" />
                                                    )}
                                                </Button>
                                            )}
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => togglePasswordVisibility("new")}
                                                className="h-8 w-8 p-0"
                                            >
                                                {showPasswords.new ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                            </Button>
                                        </div>
                                    </div>

                                    {field.value && (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">Fortaleza:</span>
                                                <Badge
                                                    variant="outline"
                                                    className={`${passwordStrength.color} text-white border-transparent`}
                                                >
                                                    {passwordStrength.label}
                                                </Badge>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                                                    style={{ width: `${(passwordStrength.score / 7) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirmar Nueva Contraseña</FormLabel>
                                <div className="relative">
                                    <FormControl>
                                        <Input
                                            type={showPasswords.confirm ? "text" : "password"}
                                            placeholder="Confirme la nueva contraseña"
                                            {...field}
                                            className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                        />
                                    </FormControl>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => togglePasswordVisibility("confirm")}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                                    >
                                        {showPasswords.confirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                    </Button>
                                </div>
                                <FormDescription>Repita la nueva contraseña para confirmar</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <AlertTriangle className="size-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-amber-800">
                            <p className="font-medium">Requisitos de seguridad:</p>
                            <ul className="mt-1 space-y-1 text-xs">
                                <li>• Mínimo 8 caracteres</li>
                                <li>• Al menos 1 mayúscula y 1 minúscula</li>
                                <li>• Al menos 1 número</li>
                                <li>• Al menos 1 carácter especial (@$!%*?&)</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <Separator />

                {children}
            </form>
        </Form>
    );
}
