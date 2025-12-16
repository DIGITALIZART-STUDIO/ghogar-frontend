"use client";

import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import {
    Banknote,
    DollarSign,
    FileText,
    User,
    Calendar,
    Wallet,
    Building2,
} from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { InputWithIcon } from "@/components/input-with-icon";
import { Button } from "@/components/ui/button";
import DatePicker from "@/components/ui/date-time-picker";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CurrencyLabels, PaymentMethodLabels } from "../../../_utils/reservations.utils";
import { Quotation } from "@/app/(admin)/quotation/_types/quotation";
import { useClientById } from "@/app/(admin)/clients/_hooks/useClients";
import { CoOwnersSection } from "./CoOwnersSection";
import { CreateReservationSchema } from "../../../create/_schemas/createReservationSchema";

interface EditReservationFormProps {
    quotationData: Quotation;
    form: UseFormReturn<CreateReservationSchema>;
    onSubmit: (data: CreateReservationSchema) => void;
    isPending: boolean;
}

export function EditReservationForm({ quotationData, form, onSubmit, isPending }: EditReservationFormProps) {
    const router = useRouter();

    // Get client data from quotation
    const clientId = quotationData.clientId;
    const { data: clientData } = useClientById(clientId);

    // Calcular el monto sugerido de separación (10% del precio final)
    const suggestedSeparationAmount = Math.round((quotationData.finalPrice ?? 0) * 0.10);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
                <div className="flex flex-row gap-4">
                    {/* Columna izquierda - Información principal */}
                    <div className="space-y-6 flex-1">

                        {/* Card Cotización (Read-only) */}
                        <div className="bg-card rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 overflow-hidden">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                    <h2 className="text-base font-medium text-slate-800 dark:text-slate-200">
                                        Cotización Asociada (No editable)
                                    </h2>
                                </div>
                            </div>

                            <div className="p-4">
                                {quotationData ? (
                                    <div className="bg-amber-50 dark:bg-amber-900/20 border-l-2 border-amber-300 dark:border-amber-600 p-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <User className="h-4 w-4 text-amber-700 dark:text-amber-300" />
                                            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                                {quotationData.leadClientName}
                                            </span>
                                        </div>
                                        <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                                            <div>Cotización: {quotationData.code}</div>
                                            <div>Proyecto: {quotationData.projectName}</div>
                                            <div>Lote: Mz. {quotationData.blockName} Lt. {quotationData.lotNumber}</div>
                                            <div>Precio: $ {quotationData.finalPrice?.toLocaleString()}</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-sm text-slate-500 dark:text-slate-500">
                                        Cotización no encontrada.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Card Fechas */}
                        <div className="bg-card rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                    <h2 className="text-base font-medium text-slate-800 dark:text-slate-200">
                                        Fechas de Separación
                                    </h2>
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="reservationDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-700 dark:text-slate-300">
                                                    Fecha de Separación
                                                </FormLabel>
                                                <FormControl>
                                                    <DatePicker
                                                        value={field.value ? parseISO(field.value) : undefined}
                                                        onChange={(date: Date | undefined) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="expiresAt"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-700 dark:text-slate-300">
                                                    Fecha de Vencimiento
                                                </FormLabel>
                                                <FormControl>
                                                    <DatePicker
                                                        value={field.value ? parseISO(field.value) : undefined}
                                                        onChange={(date: Date | undefined) => field.onChange(date ? date.toISOString() : "")}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Card Pago */}
                        <div className="bg-card rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                                <div className="flex items-center gap-2">
                                    <Wallet className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                    <h2 className="text-base font-medium text-slate-800 dark:text-slate-200">
                                        Información de Pago
                                    </h2>
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="amountPaid"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-700 dark:text-slate-300">
                                                    Monto Pagado
                                                </FormLabel>
                                                <FormControl>
                                                    <InputWithIcon Icon={DollarSign} placeholder="1500.00" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                                    Monto sugerido: {suggestedSeparationAmount.toLocaleString("es-PE", { style: "currency", currency: "PEN" })}
                                                </p>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="currency"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-700 dark:text-slate-300">
                                                    Moneda
                                                </FormLabel>
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Seleccione moneda" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {Object.entries(CurrencyLabels).map(([value, label]) => (
                                                            <SelectItem key={value} value={value}>
                                                                {label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="paymentMethod"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-700 dark:text-slate-300">
                                                    Método de Pago
                                                </FormLabel>
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Seleccione método" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {Object.entries(PaymentMethodLabels).map(([value, { label, icon: Icon, className }]) => (
                                                            <SelectItem key={value} value={value}>
                                                                <span className="flex items-center gap-2">
                                                                    <Icon className={`${className} w-4 h-4`} />
                                                                    <span>{label}</span>
                                                                </span>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="bankName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-700 dark:text-slate-300">
                                                    Banco (Opcional)
                                                </FormLabel>
                                                <FormControl>
                                                    <InputWithIcon Icon={Building2} placeholder="Banco de Crédito del Perú" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="exchangeRate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-slate-700 dark:text-slate-300">
                                                    Tipo de Cambio
                                                </FormLabel>
                                                <FormControl>
                                                    <InputWithIcon Icon={Banknote} placeholder="3.75" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Copropietarios */}
                        {clientId && <CoOwnersSection clientId={clientId} form={form} />}
                    </div>

                    {/* Separador entre columnas */}
                    <div className="hidden lg:block">
                        <Separator orientation="vertical" className="h-full" />
                    </div>

                    {/* Columna derecha - Resumen en Card */}
                    <div className="w-[500px]">
                        <div className="bg-card rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden sticky">
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                                        Resumen
                                    </h3>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                    Detalles de la separación
                                </p>
                            </div>

                            <div className="p-4">
                                <div className="space-y-4">
                                    {/* Información básica */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-600 dark:text-slate-400">Cliente</span>
                                            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                                {clientData?.name ?? "Cargando..."}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-600 dark:text-slate-400">Proyecto</span>
                                            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                                {quotationData.projectName ?? "Sin proyecto"}
                                            </span>
                                        </div>

                                        {clientData && (
                                            <>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-slate-600 dark:text-slate-400">DNI</span>
                                                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                                        {clientData.dni ?? "—"}
                                                    </span>
                                                </div>

                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-slate-600 dark:text-slate-400">Teléfono</span>
                                                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                                        {clientData.phoneNumber ?? "—"}
                                                    </span>
                                                </div>

                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-slate-600 dark:text-slate-400">Email</span>
                                                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                                        {clientData.email ?? "—"}
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <Separator />

                                    {/* Información financiera */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-600 dark:text-slate-400">Precio Final</span>
                                            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                                {(quotationData.finalPrice ?? 0).toLocaleString("es-PE", { style: "currency", currency: "PEN" })}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-600 dark:text-slate-400">Monto Inicial</span>
                                            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                                {(quotationData.downPayment ?? 0).toLocaleString("es-PE", { style: "currency", currency: "PEN" })}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-600 dark:text-slate-400">A Financiar</span>
                                            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                                {(quotationData.amountFinanced ?? 0).toLocaleString("es-PE", { style: "currency", currency: "PEN" })}
                                            </span>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Información de separación */}
                                    <div className="space-y-3">
                                        <div className="text-xs text-slate-500 dark:text-slate-500 mb-2">
                                            Información de la separación
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-600 dark:text-slate-400">Separación sugerida (10%)</span>
                                            <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                                {suggestedSeparationAmount.toLocaleString("es-PE", { style: "currency", currency: "PEN" })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-3">
                                    <Button
                                        type="submit"
                                        disabled={isPending || quotationData.status !== "ACCEPTED"}
                                        className="w-full"
                                    >
                                        {isPending ? "Actualizando..." : "Actualizar Separación"}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.back()}
                                        className="w-full"
                                    >
                                        Cancelar
                                    </Button>
                                </div>

                                {quotationData.status !== "ACCEPTED" && (
                                    <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                            <strong>Nota:</strong> Solo se pueden editar reservas de cotizaciones con estado &quot;ACEPTADA&quot;.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    );
}
