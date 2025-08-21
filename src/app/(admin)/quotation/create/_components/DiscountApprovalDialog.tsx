"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPSlot, InputOTPGroup } from "@/components/ui/input-otp";
import { AutoComplete, Option } from "@/components/ui/autocomplete";
import { ResponsiveDialog } from "@/components/common/ResponsiveDialog";
import { useUsersWithHigherRank } from "@/app/(admin)/admin/users/_hooks/useUser";
import { getUserRoleLabel } from "@/app/(admin)/admin/users/_utils/user.utils";
import { useSendOtpToUser, useValidateOtp } from "../../_hooks/useQuotations";
import { useMediaQuery } from "@/hooks/use-media-query";
import { toast } from "sonner";
import { Clock, RefreshCw, Shield, CheckCircle, AlertCircle, User, Lock, Unlock } from "lucide-react";
import { UserHigherRankDTO, UserGetDTO } from "@/app/(admin)/admin/users/_types/user";
import { OtpFormData, otpSchema, SupervisorFormData, supervisorSchema } from "../_schemas/sendOtpSchema";

interface DiscountApprovalDialogProps {
    userData: UserGetDTO;
    isDiscountApproved: boolean;
    onDiscountApproved: () => void;
}

export function DiscountApprovalDialog({ userData, isDiscountApproved, onDiscountApproved }: DiscountApprovalDialogProps) {
    const [open, setOpen] = useState(false);
    const [selectedSupervisor, setSelectedSupervisor] = useState<UserHigherRankDTO | null>(null);
    const [otpExpiresAt, setOtpExpiresAt] = useState<Date | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [canResendOtp, setCanResendOtp] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    // Hooks para OTP
    const sendOtpMutation = useSendOtpToUser();
    const validateOtpMutation = useValidateOtp();

    // Hook para búsqueda de usuarios con mayor rango usando el hook existente
    const useSearchHook = (searchTerm: string) => {
        const { data: users, isLoading } = useUsersWithHigherRank(
            searchTerm || undefined,
            20
        );

        // Actualizar el estado con los usuarios actuales
        useEffect(() => {
            if (users) {
                setCurrentSearchUsers(users);
            }
        }, [users]);

        // Convertir a formato Option para el AutoComplete incluyendo todos los datos
        const options: Array<Option> = (users ?? []).map((user) => ({
            value: user.id ?? "",
            label: user.name ?? "Usuario sin nombre",
            // Agregar datos completos del usuario para el render usando las propiedades estándar
            email: user.email ?? "",
            roles: JSON.stringify(user.roles ?? []),
        }));

        return {
            data: options,
            isLoading,
        };
    };

    // Obtener usuarios iniciales (sin filtro) y mantenerlos en estado
    const { data: initialUsers, isLoading: isLoadingInitial } = useUsersWithHigherRank();
    const [allUsers, setAllUsers] = useState<Array<UserHigherRankDTO>>([]);
    const [currentSearchUsers, setCurrentSearchUsers] = useState<Array<UserHigherRankDTO>>([]);

    // Actualizar el estado cuando cambien los datos iniciales
    useEffect(() => {
        if (initialUsers) {
            setAllUsers(initialUsers);
            setCurrentSearchUsers(initialUsers);
        }
    }, [initialUsers]);

    const supervisorForm = useForm<SupervisorFormData>({
        resolver: zodResolver(supervisorSchema),
        defaultValues: {
            supervisorId: "",
        },
    });

    const otpForm = useForm<OtpFormData>({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            otpCode: "",
        },
    });

    // Timer para el OTP
    useEffect(() => {
        if (!otpExpiresAt) {
            return;
        }

        const interval = setInterval(() => {
            const now = new Date();
            const timeRemaining = Math.max(0, Math.floor((otpExpiresAt.getTime() - now.getTime()) / 1000));

            setTimeLeft(timeRemaining);

            if (timeRemaining === 0) {
                setCanResendOtp(true);
                setOtpExpiresAt(null);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [otpExpiresAt]);

    // Convertir usuarios a opciones para el AutoComplete
    const supervisorOptions: Array<Option> = allUsers.map((user) => ({
        value: user.id ?? "",
        label: user.name ?? "Usuario sin nombre",
        // Agregar datos completos del usuario para el render
        email: user.email ?? "",
        roles: JSON.stringify(user.roles ?? []),
    }));

    const handleSendOtp = async () => {
        const supervisorId = supervisorForm.getValues("supervisorId");
        if (!supervisorId) {
            toast.error("Debe seleccionar un supervisor primero");
            return;
        }

        // Buscar el supervisor en los datos actuales del hook de búsqueda
        const supervisor = currentSearchUsers.find((s) => s.id === supervisorId);

        if (!supervisor) {
            toast.error("Supervisor no encontrado");
            return;
        }

        try {
            const [data, error] = await sendOtpMutation.mutateAsync(supervisor.id!);

            if (error) {
                toast.error("Error al enviar el código de verificación");
                return;
            }

            if (data) {
                setSelectedSupervisor(supervisor);
                setOtpExpiresAt(new Date(data.expiresAt));
                setCanResendOtp(false);
                setOtpSent(true);
                toast.success("Código de verificación enviado exitosamente");
            }
        } catch (error) {
            toast.error("Error al enviar el código de verificación");
            console.error("Error sending OTP:", error);
        }
    };

    const handleResendOtp = async () => {
        if (!selectedSupervisor) {
            return;
        }

        try {
            const [data, error] = await sendOtpMutation.mutateAsync(selectedSupervisor.id!);

            if (error) {
                toast.error("Error al reenviar el código");
                return;
            }

            if (data) {
                setOtpExpiresAt(new Date(data.expiresAt));
                setCanResendOtp(false);
                otpForm.setValue("otpCode", "");
                toast.success("Nuevo código enviado");
            }
        } catch (error) {
            toast.error("Error al reenviar el código");
            console.error("Error resending OTP:", error);
        }
    };

    const onSubmit = async (data: OtpFormData) => {
        if (!selectedSupervisor) {
            toast.error("Supervisor no seleccionado");
            return;
        }

        if (!data.otpCode || data.otpCode.length !== 6) {
            toast.error("Debe ingresar un código de 6 dígitos");
            return;
        }

        try {
            const [response, error] = await validateOtpMutation.mutateAsync({
                userId: selectedSupervisor.id!,
                otpCode: data.otpCode,
            });

            if (error) {
                toast.error("Código de verificación inválido");
                return;
            }

            if (response) {
                setIsSuccess(true);
                toast.success("Descuento aprobado exitosamente");

                // Llamar a la función para desbloquear el descuento
                onDiscountApproved();

                // Auto cerrar después de 3 segundos
                setTimeout(() => {
                    setOpen(false);
                    resetDialog();
                }, 3000);
            }
        } catch (error) {
            toast.error("Error al validar el código");
            console.error("Error validating OTP:", error);
        }
    };

    const resetDialog = () => {
        setSelectedSupervisor(null);
        setOtpExpiresAt(null);
        setTimeLeft(0);
        setCanResendOtp(false);
        setOtpSent(false);
        setIsSuccess(false);
        supervisorForm.reset();
        otpForm.reset();
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            resetDialog();
        }
    };

    // Renderizar opción del AutoComplete
    const renderSupervisorOption = (option: Option) => {
        // Usar datos del option directamente
        const email = option.email || "";
        const roles = option.roles ? JSON.parse(option.roles) : [];
        const role = roles[0];
        const roleInfo = role ? getUserRoleLabel(role) : getUserRoleLabel("Other");

        return (
            <div className="flex flex-col gap-2">
                <div className="flex flex-col">
                    <span className="font-medium">{option.label}</span>
                    <span className="text-sm text-muted-foreground lowercase">{email}</span>
                </div>
                <Badge variant="outline" className={roleInfo.className}>
                    <roleInfo.icon className="w-3 h-3 mr-1" />
                    {roleInfo.label}
                </Badge>
            </div>
        );
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    // Verificar si el usuario es SalesAdvisor
    const isSalesAdvisor = userData?.roles?.[0] === "SalesAdvisor";

    // Si no es SalesAdvisor o el descuento ya está aprobado, no mostrar el botón
    if (!isSalesAdvisor || isDiscountApproved) {
        return null;
    }

    if (isSuccess) {
        return (
            <ResponsiveDialog
                open={open}
                onOpenChange={handleOpenChange}
                isDesktop={isDesktop}
                title="¡Descuento Aprobado!"
                description="El descuento ha sido autorizado exitosamente"
                trigger={
                    <Button
                        type="button"
                        size="icon"
                        className="!bg-transparent !border !border-emerald-200 hover:border-emerald-600 relative group transition-all duration-300 text-emerald-500"
                    >
                        <Lock className="h-4 w-4 group-hover:opacity-0 transition-opacity duration-300" />
                        <Unlock className="h-4 w-4 absolute inset-0 m-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Button>
                }
            >
                <div className="text-center space-y-6 py-6">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2">¡Descuento Aprobado!</h3>
                        <p className="text-muted-foreground text-sm">
                            El descuento ha sido autorizado exitosamente por {selectedSupervisor?.name}
                        </p>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-xs text-muted-foreground">
                            Este diálogo se cerrará automáticamente en unos segundos...
                        </p>
                    </div>
                </div>
            </ResponsiveDialog>
        );
    }

    return (
        <ResponsiveDialog
            open={open}
            onOpenChange={handleOpenChange}
            isDesktop={isDesktop}
            title="Solicitar Aprobación de Descuento"
            disableOverflow
            description="Completa la información y solicita la aprobación del supervisor"
            trigger={
                <Button
                    type="button"
                    size="icon"
                    className="!bg-transparent !border !border-emerald-200 hover:border-emerald-600 relative group transition-all duration-300 text-emerald-500"
                >
                    <Lock className="h-4 w-4 group-hover:opacity-0 transition-opacity duration-300" />
                    <Unlock className="h-4 w-4 absolute inset-0 m-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
            }
        >
            <div className="space-y-6">
                {/* Formulario de Supervisor */}
                <Form {...supervisorForm}>
                    <form className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Supervisor Autorizado
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={supervisorForm.control}
                                    name="supervisorId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Seleccionar Supervisor</FormLabel>
                                            <FormControl>
                                                <AutoComplete
                                                    options={supervisorOptions}
                                                    value={supervisorOptions.find((option) => option.value === field.value)}
                                                    onValueChange={(option) => {
                                                        field.onChange(option.value);
                                                    }}
                                                    useSearchHook={useSearchHook}
                                                    placeholder="Buscar supervisor autorizado..."
                                                    emptyMessage="No se encontraron supervisores"
                                                    isLoading={isLoadingInitial}
                                                    renderOption={renderSupervisorOption}
                                                    debounceMs={300}
                                                    minSearchLength={2}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {!otpSent && (
                                    <Button
                                        type="button"
                                        onClick={handleSendOtp}
                                        disabled={sendOtpMutation.isPending}
                                        className="w-full"
                                    >
                                        {sendOtpMutation.isPending ? (
                                            <div className="flex items-center gap-2">
                                                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                Enviando Código...
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Shield className="h-4 w-4" />
                                                Enviar Código de Aprobación
                                            </div>
                                        )}
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </form>
                </Form>

                {/* Formulario de OTP */}
                {otpSent && selectedSupervisor && (
                    <Form {...otpForm}>
                        <form onSubmit={otpForm.handleSubmit(onSubmit)} className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm flex items-center gap-2">
                                        <Shield className="h-4 w-4" />
                                        Verificación de Seguridad
                                    </CardTitle>
                                    <CardDescription>
                                        Código enviado a: <span className="font-medium">{selectedSupervisor.name}</span>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Timer del OTP */}
                                    {timeLeft > 0 && (
                                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                            <Clock className="h-4 w-4" />
                                            <span>El código expira en: {formatTime(timeLeft)}</span>
                                        </div>
                                    )}

                                    {canResendOtp && (
                                        <div className="flex items-center justify-center gap-2 text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
                                            <AlertCircle className="h-4 w-4" />
                                            <span>El código ha expirado</span>
                                        </div>
                                    )}

                                    <FormField
                                        control={otpForm.control}
                                        name="otpCode"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Código de Verificación</FormLabel>
                                                <FormControl>
                                                    <div className="flex justify-center">
                                                        <InputOTP
                                                            maxLength={6}
                                                            value={field.value ?? ""}
                                                            onChange={field.onChange}
                                                            disabled={validateOtpMutation.isPending}
                                                        >
                                                            <InputOTPGroup>
                                                                <InputOTPSlot index={0} />
                                                                <InputOTPSlot index={1} />
                                                                <InputOTPSlot index={2} />
                                                                <InputOTPSlot index={3} />
                                                                <InputOTPSlot index={4} />
                                                                <InputOTPSlot index={5} />
                                                            </InputOTPGroup>
                                                        </InputOTP>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Botón de reenvío */}
                                    {canResendOtp && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleResendOtp}
                                            disabled={sendOtpMutation.isPending}
                                            className="w-full"
                                        >
                                            {sendOtpMutation.isPending ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                    Reenviando...
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <RefreshCw className="h-4 w-4" />
                                                    Reenviar Código
                                                </div>
                                            )}
                                        </Button>
                                    )}

                                    <Button
                                        type="button"
                                        className="w-full"
                                        disabled={validateOtpMutation.isPending || timeLeft === 0}
                                        onClick={() => {
                                            onSubmit(otpForm.getValues());
                                        }}
                                    >
                                        {validateOtpMutation.isPending ? (
                                            <div className="flex items-center gap-2">
                                                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                Verificando...
                                            </div>
                                        ) : (
                                            "Aprobar Descuento"
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        </form>
                    </Form>
                )}
            </div>
        </ResponsiveDialog>
    );
}
