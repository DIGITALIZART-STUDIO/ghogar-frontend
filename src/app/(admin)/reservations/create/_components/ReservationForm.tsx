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
} from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { InputWithIcon } from "@/components/input-with-icon";
import { Button } from "@/components/ui/button";
import DatePicker from "@/components/ui/date-time-picker";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CreateReservationSchema } from "../_schemas/createReservationSchema";
import { CurrencyLabels, PaymentMethodLabels } from "../../_utils/reservations.utils";
import { QuotationSearch } from "@/app/(admin)/quotation/_components/search/QuotationSearch";
import type { components } from "@/types/api";
import { useEffect } from "react";

type QuotationSummary = components["schemas"]["QuotationSummaryDTO"];

interface ReservationFormProps {
    quotationsData: Array<QuotationSummary>;
    form: UseFormReturn<CreateReservationSchema>;
    onSubmit: (data: CreateReservationSchema) => void;
    isPending: boolean;
}

export function ReservationForm({ quotationsData, form, onSubmit, isPending }: ReservationFormProps) {
    const router = useRouter();

    // Get selected quotation for displaying client info
    const selectedQuotationId = form.watch("quotationId");
    const selectedQuotation = quotationsData.find((q) => q.id === selectedQuotationId);

    // Auto-populate form fields when a quotation is selected
    useEffect(() => {
        if (!selectedQuotation) {
            // Clear fields if no quotation is selected
            // @ts-expect-error those damn uncontrolled inputs
            form.setValue("currency", "");
            form.setValue("amountPaid", "");
            form.setValue("exchangeRate", "");
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
            const suggestedAmount = Math.round(selectedQuotation.finalPrice * 0.1); // 10% as initial payment
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Columna izquierda - Información principal */}
                    <div className="lg:col-span-2">

                        {/* Sección principal - Datos de reserva */}
                        <div className="rounded-xl mb-8 bg-card border border-secondary">
                            <div className="p-6 bg-primary/10 dark:bg-primary/90 border-b flex items-center rounded-tl-xl rounded-tr-xl">
                                <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-800 mr-3" />
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Datos de la Separación
                                </h2>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="quotationId"
                                        render={({ field }) => (
                                            <FormItem className="sm:col-span-2">
                                                <FormLabel>
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

                                    {/* Display selected quotation info */}
                                    {selectedQuotation && (
                                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 col-span-2">
                                            <div className="flex items-center mb-2">
                                                <User className="h-4 w-4 text-blue-600 mr-2" />
                                                <span className="text-sm font-medium text-blue-800">
                                                    Cliente seleccionado:
                                                </span>
                                            </div>
                                            <div className="text-sm text-blue-700">
                                                {selectedQuotation.clientName}
                                            </div>
                                            <div className="text-xs text-blue-600 mt-1">
                                                Proyecto:
                                                {" "}
                                                {selectedQuotation.projectName}
                                            </div>
                                        </div>
                                    )}
                                    <FormField
                                        control={form.control}
                                        name="reservationDate"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>
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
                                            <FormItem className="flex flex-col">
                                                <FormLabel>
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

                        {/* Sección de pago */}
                        <div className="rounded-xl overflow-hidden mb-8 bg-card border border-secondary">
                            <div className="p-6 bg-green-100 dark:bg-green-900 border-b flex items-center">
                                <Wallet className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
                                <h2 className="text-lg font-semibold text-green-800 dark:text-green-200">
                                    Información de Pago
                                </h2>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="amountPaid"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
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
                                                <FormLabel>
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
                                                <FormLabel>
                                                    Método de Pago
                                                </FormLabel>
                                                <Select value={field.value} onValueChange={field.onChange} >
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
                                                                    <span className={className}>{label}</span>
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
                                                <FormLabel>
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
                                                <FormLabel>
                                                    Tipo de Cambio
                                                </FormLabel>
                                                <FormControl>
                                                    <InputWithIcon Icon={Banknote} placeholder="3.75" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="md:col-span-2">
                                        <FormField
                                            control={form.control}
                                            name="schedule"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Cronograma de Pagos (Opcional)
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Describe el cronograma de pagos si aplica..."
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Columna derecha - Resumen */}
                    <div>
                        <div className="bg-card rounded-lg border p-6 sticky top-6">
                            <h3 className="text-lg font-semibold mb-4">
                                Resumen de Separación
                            </h3>

                            {selectedQuotation ? (
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span>
                                            Cotización:
                                        </span>
                                        <span className="font-medium">
                                            {selectedQuotation.code}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>
                                            Cliente:
                                        </span>
                                        <span className="font-medium">
                                            {selectedQuotation.clientName}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>
                                            Proyecto:
                                        </span>
                                        <span className="font-medium">
                                            {selectedQuotation.projectName}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>
                                            Lote:
                                        </span>
                                        <span className="font-medium">
                                            {selectedQuotation.blockName && `Mz. ${selectedQuotation.blockName}`}
                                            {selectedQuotation.lotNumber && ` Lt. ${selectedQuotation.lotNumber}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>
                                            Precio Final:
                                        </span>
                                        <span className="font-medium">
                                            {selectedQuotation.currency === "PEN" ? "S/" : "$"}
                                            {selectedQuotation.finalPrice?.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>
                                            Área:
                                        </span>
                                        <span className="font-medium">
                                            {selectedQuotation.areaAtQuotation} m²
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>
                                            T.C.:
                                        </span>
                                        <span className="font-medium">
                                            {selectedQuotation.exchangeRate}
                                        </span>
                                    </div>

                                    <div className="pt-3 border-t border-border">
                                        <div className="text-xs text-muted-foreground mb-2">
                                            💡 Campos completados automáticamente
                                        </div>
                                        <div className="space-y-1 text-xs">
                                            <div className="flex justify-between">
                                                <span>Moneda:</span>
                                                <span className="text-green-600">
                                                    {selectedQuotation.currency === "PEN" ? "Soles" : "Dólares"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Separación sugerida (10%):</span>
                                                <span className="text-green-600">
                                                    {selectedQuotation.currency === "PEN" ? "S/" : "$"}
                                                    {Math.round(selectedQuotation.finalPrice * 0.1).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    Seleccione una cotización para ver el resumen.
                                </p>
                            )}

                            <div className="flex gap-2 mt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.push("/reservations")}
                                    className="flex-1"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="flex-1"
                                >
                                    {isPending ? "Creando..." : "Crear Separación"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    );
}
