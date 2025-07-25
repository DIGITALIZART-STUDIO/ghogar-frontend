
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
    Shield,
    CheckCircle,
    XCircle,
    Settings,
    Key,
} from "lucide-react";
import { PasswordInput } from "@/components/ui/password-input";
import { UserGetDTO } from "../../admin/users/_types/user";
import {  getPasswordStrength, getProgressColor, getStrengthText, getTimeAgo } from "../_utils/profile.utils";
import { PasswordRequirement } from "../_types/password";
import { PasswordForm,  } from "../_schemas/updateProfileSchema";

interface SecurityFormProps {
    data: UserGetDTO;
    passwordForm: UseFormReturn<PasswordForm>;
    onPasswordSubmit: (data: PasswordForm) => void;
    newPassword: string;
    confirmPassword: string;
    passwordRequirements: Array<PasswordRequirement>;
    passwordsMatch: boolean;
}

export default function SecurityForm({ data, passwordForm, onPasswordSubmit, newPassword, confirmPassword, passwordRequirements, passwordsMatch }: SecurityFormProps) {
    return (
        <div className="space-y-6">
            <Card className=" border-gray-200 rounded-lg overflow-hidden">
                <CardHeader className="border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-900 rounded-xl flex items-center justify-center">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <CardTitle className="text-xl text-gray-900 dark:text-gray-100">Seguridad</CardTitle>
                            <CardDescription className="text-gray-500 dark:text-gray-400">Cambiar contraseña</CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    <Form {...passwordForm}>
                        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                            {/* Contraseña Actual */}
                            <FormField
                                control={passwordForm.control}
                                name="current"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña Actual</FormLabel>
                                        <FormControl>
                                            <PasswordInput
                                                {...field}
                                                placeholder="Contraseña actual"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Separator />

                            {/* Nueva Contraseña */}
                            <FormField
                                control={passwordForm.control}
                                name="new"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Nueva Contraseña</FormLabel>
                                        <FormControl>
                                            <PasswordInput
                                                {...field}
                                                placeholder="Nueva contraseña"
                                            />
                                        </FormControl>
                                        <FormMessage />

                                        {/* Indicador de Fortaleza */}
                                        {newPassword && (
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">Fortaleza:</span>
                                                    <span
                                                        className={`text-xs font-medium ${
                                                            getPasswordStrength(passwordRequirements) < 40
                                                                ? "text-red-600 dark:text-red-500"
                                                                : getPasswordStrength(passwordRequirements) < 80
                                                                    ? "text-yellow-600 dark:text-yellow-500"
                                                                    : "text-emerald-600 dark:text-emerald-500"
                                                        }`}
                                                    >
                                                        {getStrengthText(passwordRequirements)}
                                                    </span>
                                                </div>
                                                <Progress
                                                    value={getPasswordStrength(passwordRequirements)}
                                                    className="h-2"
                                                    indicatorClassName={getProgressColor(passwordRequirements)}
                                                />
                                            </div>
                                        )}
                                    </FormItem>
                                )}
                            />

                            {/* Confirmar Contraseña */}
                            <FormField
                                control={passwordForm.control}
                                name="confirm"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirmar Contraseña</FormLabel>
                                        <FormControl>
                                            <PasswordInput
                                                {...field}
                                                className={` ${
                                                    confirmPassword && passwordsMatch
                                                        ? "border-green-400 focus:border-green-400 focus:ring-green-100"
                                                        : confirmPassword && !passwordsMatch
                                                            ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                                                            : "focus:border-blue-400 focus:ring-blue-100"
                                                }`}
                                                placeholder="Confirmar contraseña"
                                            />
                                        </FormControl>
                                        <FormMessage />

                                        {/* Validación de Coincidencia */}
                                        {confirmPassword && (
                                            <div
                                                className={`flex items-center gap-2 text-xs ${
                                                    passwordsMatch ? "text-emerald-600" : "text-red-600"
                                                }`}
                                            >
                                                {passwordsMatch ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                                {passwordsMatch ? "Las contraseñas coinciden" : "Las contraseñas no coinciden"}
                                            </div>
                                        )}
                                    </FormItem>
                                )}
                            />

                            {/* Requisitos de Contraseña */}
                            {newPassword && (
                                <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-4">
                                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                        <Key className="w-4 h-4" />
                                        Requisitos de Contraseña
                                    </h4>
                                    <div className="space-y-3">
                                        {passwordRequirements.map((req) => (
                                            <div
                                                key={req.id}
                                                className={`flex items-start gap-3 text-sm transition-all duration-200 ${
                                                    req.met ? "text-green-700" : "text-slate-600"
                                                }`}
                                            >
                                                <div className="mt-0.5">
                                                    {req.met ? (
                                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                                    ) : (
                                                        <div className="w-4 h-4 border-2 border-slate-300 rounded-full" />
                                                    )}
                                                </div>
                                                <span className={`leading-relaxed ${req.met ? "line-through opacity-75" : ""}`}>
                                                    {req.text}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-3 border-t border-slate-200">
                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                            <strong>Caracteres especiales permitidos:</strong> ! @ # $ % ^ & * ( ) _ , . ? &quot; : {"{}"} |{" "}
                                            {"<"} {">"}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <Button
                                type="submit"
                                variant="default"
                                size={"lg"}
                                className="w-full"
                                disabled={!passwordForm.formState.isValid || getPasswordStrength(passwordRequirements) < 100}
                            >
                                <Shield className="w-4 h-4 mr-2" />
                                Actualizar Contraseña
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {/* Panel de Estado */}
            <Card className=" border-gray-200 rounded-lg overflow-hidden">
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center">
                                <Settings className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Estado de la Cuenta</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Última actualización: {getTimeAgo(data.user.modifiedAt ?? "")}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-600 dark:text-gray-300">Última sesión</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">Ahora</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
