"use client";

import { useRouter } from "next/navigation";
import { format, parse, parseISO } from "date-fns";
import {
    Banknote,
    DollarSign,
    User,
    Calendar,
    Wallet,
    Building2,
    FileText,
} from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { InputWithIcon } from "@/components/input-with-icon";
import { Button } from "@/components/ui/button";
import DatePicker from "@/components/ui/date-time-picker";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CurrencyLabels, PaymentMethodLabels } from "../../_utils/reservations.utils";
import { QuotationSearch } from "@/app/(admin)/quotation/_components/search/QuotationSearch";
import { useClientById } from "@/app/(admin)/clients/_hooks/useClients";
import { useEffect } from "react";
import { SummaryQuotation } from "@/app/(admin)/quotation/_types/quotation";
import { CreateReservationSchema } from "../_schemas/createReservationSchema";
import { CoOwnersSection } from "../../[reservationId]/edit/_components/CoOwnersSection";

interface ReservationFormProps {
    quotationsData: Array<SummaryQuotation>;
    form: UseFormReturn<CreateReservationSchema>;
    onSubmit: (data: CreateReservationSchema) => void;
    isPending: boolean;
}

export function ReservationForm({ quotationsData, form, onSubmit, isPending }: ReservationFormProps) {
    const router = useRouter();

    // Get selected quotation for displaying client info
    const selectedQuotationId = form.watch("quotationId");
    const selectedQuotation = quotationsData.find((q) => q.id === selectedQuotationId);

    // Get client data when quotation is selected
    const clientId = selectedQuotation?.clientId;
    const { data: clientData } = useClientById(clientId);

    // Auto-populate form fields when a quotation is selected
    useEffect(() => {
        if (!selectedQuotation) {
            // Clear fields if no quotation is selected
            // @ts-expect-error those damn uncontrolled inputs
            form.setValue("currency", "");
            form.setValue("amountPaid", "");
            form.setValue("exchangeRate", "");
            form.setValue("coOwners", []);
            return;
        }

        // Set currency based on quotation currency
        if (selectedQuotation.currency === "PEN") {
            form.setValue("currency", "SOLES");
        } else if (selectedQuotation.currency === "USD") {
            form.setValue("currency", "DOLARES");
        }

        // Set exchange rate from quotation
        if (selectedQuotation.exchangeRate) {
            form.setValue("exchangeRate", selectedQuotation.exchangeRate.toString());
        }

        // Suggest a default amount (10% of final price as common practice for reservations)
        if (selectedQuotation.finalPrice) {
            // Usar 10% del precio final como monto sugerido de separación
            const suggestedAmount = Math.round(selectedQuotation.finalPrice * 0.10);
            if (!form.getValues("amountPaid")) { // Only set if user hasn't entered an amount
                form.setValue("amountPaid", suggestedAmount.toString());
            }
        }

        // Set default expiration date (30 days from today)
        if (!form.getValues("expiresAt")) { // Only set if user hasn't set an expiration
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + 30); // 30 days from now
            form.setValue("expiresAt", expirationDate.toISOString());
        }

        // Set default reservation date to today if not set
        if (!form.getValues("reservationDate")) {
            const today = new Date();
            const todayString = format(today, "yyyy-MM-dd");
            form.setValue("reservationDate", todayString);
        }
    }, [selectedQuotation, form]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
                <div className="flex flex-row gap-4">
                    {/* Columna izquierda - Información principal */}
                    <div className="space-y-6 flex-1">

                        {/* Card Cotización */}
                        <div className="bg-card rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 overflow-hidden">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                    <h2 className="text-base font-medium text-slate-800 dark:text-slate-200">
                                        Selección de Cotización
                                    </h2>
                                </div>
                            </div>

                            <div className="p-4">
                                <FormField
                                    control={form.control}
                                    name="quotationId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-slate-700 dark:text-slate-300">
                                                Cotización
                                            </FormLabel>
                                            <QuotationSearch
                                                value={field.value}
                                                onSelect={(quotationId) => {
                                                    field.onChange(quotationId);
                                                }}
                                                placeholder="Seleccione una cotización"
                                                searchPlaceholder="Buscar por cliente, proyecto, lote..."
                                                emptyMessage="No se encontraron cotizaciones"
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Información del cliente seleccionado */}
                                {selectedQuotation && (
                                    <div className="mt-4 space-y-2">
                                        {/* Información del cliente */}
                                        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border-l-2 border-amber-300 dark:border-amber-600">
                                            <div className="flex items-center gap-2 mb-1">
                                                <User className="h-4 w-4 text-amber-700 dark:text-amber-300" />
                                                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                                    {selectedQuotation.clientName}
                                                </span>
                                            </div>
                                            <div className="text-xs text-slate-600 dark:text-slate-400">
                                                {selectedQuotation.projectName}
                                            </div>
                                        </div>

                                        {/* Validaciones de estado */}
                                        {selectedQuotation.status !== "ACCEPTED" && (
                                            <div className="p-3 bg-red-50 dark:bg-red-900/20 border-l-2 border-red-300 dark:border-red-600">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <FileText className="h-4 w-4 text-red-700 dark:text-red-300" />
                                                    <span className="text-sm font-medium text-red-800 dark:text-red-200">
                                                        Cotización no aceptada
                                                    </span>
                                                </div>
                                                <div className="text-xs text-red-600 dark:text-red-400">
                                                    Solo se pueden crear separaciones de cotizaciones aceptadas
                                                </div>
                                            </div>
                                        )}

                                        {selectedQuotation.status === "ACCEPTED" && (
                                            <div className="p-3 bg-green-50 dark:bg-green-900/20 border-l-2 border-green-300 dark:border-green-600">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <FileText className="h-4 w-4 text-green-700 dark:text-green-300" />
                                                    <span className="text-sm font-medium text-green-800 dark:text-green-200">
                                                        Cotización aceptada
                                                    </span>
                                                </div>
                                                <div className="text-xs text-green-600 dark:text-green-400">
                                                    Lista para crear separación
                                                </div>
                                            </div>
                                        )}
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
                                                        value={field.value ? parse(field.value, "yyyy-MM-dd", new Date()) : undefined}
                                                        onChange={(date) => {
                                                            if (date) {
                                                                const formattedDate = format(date, "yyyy-MM-dd");
                                                                field.onChange(formattedDate);
                                                            } else {
                                                                field.onChange("");
                                                            }
                                                        }}
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
                                                        onChange={(date) => {
                                                            if (date) {
                                                                field.onChange(date.toISOString());
                                                            } else {
                                                                field.onChange("");
                                                            }
                                                        }}
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

                                {selectedQuotation ? (
                                    <div className="space-y-4">
                                        {/* Información básica */}
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-slate-600 dark:text-slate-400">Cotización</span>
                                                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                                    {selectedQuotation.code}
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-slate-600 dark:text-slate-400">Cliente</span>
                                                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                                    {selectedQuotation.clientName}
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

                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-slate-600 dark:text-slate-400">Proyecto</span>
                                                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                                    {selectedQuotation.projectName}
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-slate-600 dark:text-slate-400">Lote</span>
                                                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                                    {selectedQuotation.blockName && `Mz. ${selectedQuotation.blockName}`}
                                                    {selectedQuotation.lotNumber && ` Lt. ${selectedQuotation.lotNumber}`}
                                                </span>
                                            </div>
                                        </div>

                                        <Separator />

                                        {/* Información financiera */}
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-slate-600 dark:text-slate-400">Precio Total</span>
                                                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                                    {selectedQuotation.currency === "PEN" ? "S/" : "$"}
                                                    {selectedQuotation.totalPrice?.toLocaleString()}
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Precio Final</span>
                                                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                                    {selectedQuotation.currency === "PEN" ? "S/" : "$"}
                                                    {selectedQuotation.finalPrice?.toLocaleString()}
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-slate-600 dark:text-slate-400">A Financiar</span>
                                                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                                    {selectedQuotation.currency === "PEN" ? "S/" : "$"}
                                                    {selectedQuotation.amountFinanced?.toLocaleString()}
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-slate-600 dark:text-slate-400">Área</span>
                                                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                                    {selectedQuotation.areaAtQuotation} m²
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-slate-600 dark:text-slate-400">T.C.</span>
                                                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                                    {selectedQuotation.exchangeRate}
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
                                                <span className="text-sm text-slate-600 dark:text-slate-400">Moneda</span>
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    {selectedQuotation.currency === "PEN" ? "Soles" : "Dólares"}
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-slate-600 dark:text-slate-400">Separación sugerida (10%)</span>
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    {selectedQuotation.currency === "PEN" ? "S/" : "$"}
                                                    {Math.round(selectedQuotation.finalPrice * 0.10).toLocaleString()}
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-slate-600 dark:text-slate-400">Monto a financiar</span>
                                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    {selectedQuotation.currency === "PEN" ? "S/" : "$"}
                                                    {selectedQuotation.amountFinanced?.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <Calendar className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                                        <p className="text-sm text-slate-500 dark:text-slate-500">
                                            Seleccione una cotización para ver el resumen
                                        </p>
                                    </div>
                                )}

                                <div className="mt-6 space-y-3">
                                    <Button
                                        type="submit"
                                        disabled={isPending || (selectedQuotation && selectedQuotation.status !== "ACCEPTED")}
                                        className="w-full"
                                    >
                                        {isPending ? "Creando..." : "Crear Separación"}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.push("/reservations")}
                                        className="w-full"
                                    >
                                        Cancelar
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    );
}
