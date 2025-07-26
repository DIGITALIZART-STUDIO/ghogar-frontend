
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
    User,
    Phone,
    Lock,
    Save,
    Mail,
    AlertTriangle,
} from "lucide-react";
import {  UserInfoForm } from "../_schemas/updateProfileSchema";
import { PhoneInput } from "@/components/ui/phone-input";
import { UseFormReturn } from "react-hook-form";

interface ProfileInformationProps {
    userData: {
        email: string | undefined | null;
        role: string;
        name: string;
        userName: string;
        phone: string | undefined | null;
    };
    roleConfig: {
      label: string;
      icon: React.ElementType;
      className: string;
    };
    isEditing: boolean;
    userForm: UseFormReturn<UserInfoForm>;
    onUserInfoSubmit: (data: UserInfoForm) => void;
}

export default function ProfileInformation({ userData, roleConfig, isEditing, userForm, onUserInfoSubmit }: ProfileInformationProps) {
    return (
        <div className="lg:col-span-2">
            <Card className=" border-gray-200 rounded-lg overflow-hidden">
                <CardHeader className="border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-900 rounded-xl flex items-center justify-center">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <CardTitle className="text-xl text-gray-900 dark:text-gray-100">Información Personal</CardTitle>
                            <CardDescription className="text-gray-500 dark:text-gray-400">Gestiona tu información de contacto</CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Email */}
                        <div className="space-y-3">
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                Correo Electrónico
                            </Label>
                            <div className="relative">
                                <Input
                                    value={userData.email ?? ""}
                                    disabled
                                    className="bg-gray-50 border-gray-200 text-gray-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300"
                                />
                                <div className="absolute right-2.5 top-2.5">
                                    <Lock className="w-4 h-4 text-gray-400" />
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                Campo protegido por el sistema
                            </p>
                        </div>

                        {/* Rol */}
                        <div className="space-y-3">
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <roleConfig.icon className="w-4 h-4" />
                                {roleConfig.label}
                            </Label>
                            <div className="relative">
                                <Input
                                    value={roleConfig.label}
                                    disabled
                                    className="bg-gray-50 border-gray-200 text-gray-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300"
                                />
                                <div className="absolute right-2.5 top-2.5">
                                    <Lock className="w-4 h-4 text-gray-400" />
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                Asignado por administrador
                            </p>
                        </div>
                    </div>

                    <Separator className="my-8" />

                    <Form {...userForm}>
                        <form onSubmit={userForm.handleSubmit(onUserInfoSubmit)} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Nombre */}
                                <FormField
                                    control={userForm.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                Nombre Completo <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={!isEditing}
                                                    className={`${
                                                        isEditing
                                                            ? "focus:ring-2"
                                                            : "bg-gray-50 border-gray-200 dark:bg-gray-900 dark:border-gray-700"
                                                    }`}
                                                    placeholder="Ingresa tu nombre completo"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Teléfono */}
                                <FormField
                                    control={userForm.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                <Phone className="w-4 h-4" />
                                                Número de Teléfono <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <PhoneInput
                                                    {...field}
                                                    disabled={!isEditing}
                                                    className={`${
                                                        isEditing
                                                            ? "focus:ring-2"
                                                            : "bg-gray-50 border-gray-200 dark:bg-gray-900 dark:border-gray-700"
                                                    }`}
                                                    placeholder="Ingresa tu número de teléfono"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {isEditing && (
                                <div className="pt-6 border-t border-gray-100">
                                    <Button
                                        type="submit"
                                        size="lg"
                                        value={"default"}
                                        className="w-full md:w-auto"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        Guardar Cambios
                                    </Button>
                                </div>
                            )}
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
