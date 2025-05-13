"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { format, parse, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowRight, Banknote, CreditCard, DollarSign, FileText, MapPin, RefreshCcw, User } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { SummaryLead } from "@/app/(admin)/leads/_types/lead";
import { InputWithIcon } from "@/components/input-with-icon";
import { AutoComplete } from "@/components/ui/autocomplete";
import { Button } from "@/components/ui/button";
import DatePicker from "@/components/ui/date-time-picker";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CreateQuotationSchema } from "../_schemas/createQuotationsSchema";

interface QuotationFormProps {
  leadsData: Array<SummaryLead>;
  form: UseFormReturn<CreateQuotationSchema>;
  onSubmit: (data: CreateQuotationSchema) => void;
  isPending: boolean;
}

export function QuotationForm({ leadsData, form, onSubmit, isPending }: QuotationFormProps) {
    const router = useRouter();

    const leadsOptions = leadsData.map((lead) => ({
        value: lead.id ?? "",
        label: lead.client?.dni
            ? `${lead.client.dni} - ${lead.client.name}`
            : lead.client?.ruc
                ? `${lead.client.ruc} - ${lead.client.name}`
                : (lead.client?.name ?? ""),
    }));

    // Calcular valores automáticamente
    useEffect(() => {
        const area = Number.parseFloat(form.watch("area") ?? "0");
        const pricePerM2 = Number.parseFloat(form.watch("pricePerM2") ?? "0");
        const discount = Number.parseFloat(form.watch("discount") ?? "0");
        const downPayment = Number.parseFloat(form.watch("downPayment") ?? "0");

        if (area && pricePerM2) {
            const totalPrice = (area * pricePerM2).toString();
            form.setValue("totalPrice", totalPrice);

            const finalPrice = ((area * pricePerM2) - discount).toString();
            form.setValue("finalPrice", finalPrice);

            const amountFinanced = (((area * pricePerM2) - discount) * (1 - (downPayment / 100))).toString();
            form.setValue("amountFinanced", amountFinanced);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.watch("area"), form.watch("pricePerM2"), form.watch("discount"), form.watch("downPayment"), form]);

    // Calcular cuota mensual
    const calculateMonthlyPayment = () => {
        const amountFinanced = Number.parseFloat(form.watch("amountFinanced") ?? "0");
        const monthsFinanced = Number.parseInt(form.watch("monthsFinanced") ?? "0", 10);

        if (amountFinanced && monthsFinanced) {
            return Math.round(amountFinanced / monthsFinanced);
        }
        return 0;
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Columna izquierda - Información principal */}
                    <div className="lg:col-span-2">
                        {/* Sección superior - Información básica */}
                        <div className="rounded-xl overflow-hidden mb-8 border-2 bg-card border-secondary">
                            <div className="flex items-center justify-between p-6 bg-primary/10 dark:bg-primary/90 border-b">
                                <div className="flex items-center">
                                    <FileText className="h-5 w-5 text-gray-600 dark:text-gray-800 mr-3" />
                                    <h2 className="text-lg font-semibold text-gray-800">
                                        Información de Cotización
                                    </h2>
                                </div>
                            </div>

                            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="quotationDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel className="flex items-center">
                                                Fecha
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
                                    name="exchangeRate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center">
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

                        {/* Sección principal - Nuevo diseño innovador sin columnas */}
                        <div className="rounded-xl overflow-hidden mb-8 bg-card border border-secondary">
                            <div className="p-6 bg-primary/10 dark:bg-primary/90 border-b flex items-center">
                                <FileText className="h-5 w-5 text-gray-600 dark:text-gray-800 mr-3" />
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Datos de la Cotización
                                </h2>
                            </div>

                            <div className="p-6">
                                {/* Sección Cliente - Diseño de tarjeta horizontal */}
                                <div className="mb-8 bg-card rounded-xl border-blue-100 border">
                                    <div className="flex items-center bg-blue-500 text-white p-4 rounded-t-xl">
                                        <User className="h-6 w-6 mr-3" />
                                        <h3 className="text-lg font-semibold">
                                            Información del Cliente
                                        </h3>
                                    </div>

                                    <div className="p-5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="leadId"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-blue-700">
                                                            Nombre del Cliente
                                                        </FormLabel>
                                                        <AutoComplete
                                                            options={leadsOptions}
                                                            emptyMessage="No se encontró el cliente."
                                                            placeholder="Seleccione un cliente"
                                                            onValueChange={(selectedOption) => {
                                                                field.onChange(selectedOption?.value ?? "");
                                                            }}
                                                            value={leadsOptions.find((option) => option.value === field.value) ?? undefined}
                                                        />
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="projectName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-blue-700">
                                                            Proyecto
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Residencial Las Palmas"
                                                                {...field}
                                                                className="border-blue-200 focus:border-blue-500"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Sección Lote - Diseño de tarjeta horizontal */}
                                <div className="mb-8 bg-card border-amber-100 border rounded-xl">
                                    <div className="flex items-center bg-amber-500 text-white p-4 rounded-t-xl">
                                        <MapPin className="h-6 w-6 mr-3" />
                                        <h3 className="text-lg font-semibold">
                                            Información del Lote
                                        </h3>
                                    </div>

                                    <div className="p-5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="block"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-amber-700">
                                                            Manzana
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Ingrese la manzana"
                                                                {...field}
                                                                className="border-amber-200 focus:border-amber-500"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="lotNumber"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-amber-700">
                                                            Lote
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Ingrese el lote"
                                                                {...field}
                                                                className="border-amber-200 focus:border-amber-500"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="area"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-amber-700">
                                                            Área (m²)
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Ingrese el área"
                                                                {...field}
                                                                className="border-amber-200 focus:border-amber-500"
                                                                onChange={(e) => {
                                                                    field.onChange(e);
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="pricePerM2"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-amber-700">
                                                            Precio por m²
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Ingrese el precio por m²"
                                                                {...field}
                                                                className="border-amber-200 focus:border-amber-500"
                                                                onChange={(e) => {
                                                                    field.onChange(e);
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

                                {/* Sección Financiamiento - Diseño de tarjeta horizontal */}
                                <div className="mb-6 bg-card border border-emerald-100 rounded-xl">
                                    <div className="flex items-center bg-emerald-500 text-white p-4 rounded-t-xl">
                                        <DollarSign className="h-6 w-6 mr-3" />
                                        <h3 className="text-lg font-semibold">
                                            Información de Financiamiento
                                        </h3>
                                    </div>

                                    <div className="p-5">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="discount"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-emerald-700">
                                                            Descuento
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Ingrese el descuento"
                                                                {...field}
                                                                className="border-emerald-200 focus:border-emerald-500"
                                                                onChange={(e) => {
                                                                    field.onChange(e);
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="downPayment"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-emerald-700">
                                                            Inicial (%)
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Ingrese el porcentaje inicial"
                                                                {...field}
                                                                className="border-emerald-200 focus:border-emerald-500"
                                                                onChange={(e) => {
                                                                    field.onChange(e);
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="monthsFinanced"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-emerald-700">
                                                            Meses a Financiar
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="36"
                                                                {...field}
                                                                className="border-emerald-200 focus:border-emerald-500"
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

                        {/* Sección inferior - Campos calculados */}
                        <div className="mt-8 bg-card rounded-xl overflow-hidden">
                            <div className="p-6 bg-foreground dark:bg-white text-white dark:text-input border-b">
                                <h2 className="text-lg font-semibold text-gray-200 dark:text-gray-800">
                                    Resumen Financiero
                                </h2>
                            </div>

                            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                <FormField
                                    control={form.control}
                                    name="totalPrice"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center text-gray-700 dark:text-gray-200">
                                                <DollarSign className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-200" />
                                                Precio Total
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="75000"
                                                    {...field}
                                                    className="bg-gray-50"
                                                    readOnly={!!(form.watch("area") && form.watch("pricePerM2"))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="finalPrice"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center font-medium text-gray-700 dark:text-gray-200">
                                                <DollarSign className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-200" />
                                                Precio Final
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="70000"
                                                    {...field}
                                                    className="bg-gray-50 font-medium"
                                                    readOnly={!!(form.watch("totalPrice") && form.watch("discount"))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="amountFinanced"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center text-gray-700 dark:text-gray-200">
                                                <CreditCard className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-200" />
                                                Monto a Financiar
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Ingrese el monto a financiar"
                                                    {...field}
                                                    className="bg-gray-50"
                                                    readOnly={!!(form.watch("finalPrice") && form.watch("downPayment"))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Columna derecha - Resumen visual */}
                    <div>
                        <div className="sticky ">
                            <div className="bg-card rounded-xl overflow-hidden">
                                <div className="p-5 bg-foreground dark:bg-white text-white dark:text-input">
                                    <h3 className="text-lg font-semibold">
                                        Resumen de Cotización
                                    </h3>
                                </div>

                                <div className="p-5 space-y-6">
                                    {/* Información básica */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-200 mb-3 flex items-center">
                                            <FileText className="h-4 w-4 mr-2" />
                                            Información Básica
                                        </h4>
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div className="text-gray-500">
                                                    Cliente:
                                                </div>
                                                <div className="font-medium text-right">
                                                    {leadsData.find((c) => c.id === form.watch("leadId"))?.client?.name ?? "—"}
                                                </div>
                                                <div className="text-gray-500">
                                                    Proyecto:
                                                </div>
                                                <div className="font-medium text-right">
                                                    {form.watch("projectName") ?? "—"}
                                                </div>
                                                <div className="text-gray-500">
                                                    Fecha:
                                                </div>
                                                <div className="font-medium text-right">
                                                    {form.watch("quotationDate")
                                                        ? format(parseISO(form.watch("quotationDate")), "dd/MM/yyyy", { locale: es })
                                                        : "—"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Información del lote */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-200 mb-3 flex items-center">
                                            <MapPin className="h-4 w-4 mr-2" />
                                            Información del Lote
                                        </h4>
                                        <div className="bg-amber-50 rounded-lg p-3">
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div className="text-amber-700">
                                                    Ubicación:
                                                </div>
                                                <div className="font-medium text-right">
                                                    {form.watch("block") && form.watch("lotNumber")
                                                        ? `Manzana ${form.watch("block")}, Lote ${form.watch("lotNumber")}`
                                                        : "—"}
                                                </div>
                                                <div className="text-amber-700">
                                                    Área:
                                                </div>
                                                <div className="font-medium text-right">
                                                    {form.watch("area") ? `${form.watch("area")} m²` : "—"}
                                                </div>
                                                <div className="text-amber-700">
                                                    Precio/m²:
                                                </div>
                                                <div className="font-medium text-right">
                                                    {form.watch("pricePerM2") ? `$${form.watch("pricePerM2")}` : "—"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Información financiera */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-200 mb-3 flex items-center">
                                            <DollarSign className="h-4 w-4 mr-2" />
                                            Información Financiera
                                        </h4>
                                        <div className="bg-emerald-50 rounded-lg p-3">
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div className="text-emerald-700">
                                                    Precio Total:
                                                </div>
                                                <div className="font-medium text-right">
                                                    {form.watch("totalPrice") ? `$${form.watch("totalPrice")}` : "—"}
                                                </div>
                                                <div className="text-emerald-700">
                                                    Descuento:
                                                </div>
                                                <div className="font-medium text-right">
                                                    {form.watch("discount") ? `$${form.watch("discount")}` : "—"}
                                                </div>
                                                <div className="text-emerald-700 font-medium">
                                                    Precio Final:
                                                </div>
                                                <div className="font-medium text-right">
                                                    {form.watch("finalPrice") ? `$${form.watch("finalPrice")}` : "—"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Información de financiamiento */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-200 mb-3 flex items-center">
                                            <CreditCard className="h-4 w-4 mr-2" />
                                            Plan de Financiamiento
                                        </h4>
                                        <div className="bg-blue-50 rounded-lg p-3">
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div className="text-blue-700">
                                                    Inicial:
                                                </div>
                                                <div className="font-medium text-right">
                                                    {form.watch("downPayment") ? `${form.watch("downPayment")}%` : "—"}
                                                </div>
                                                <div className="text-blue-700">
                                                    A Financiar:
                                                </div>
                                                <div className="font-medium text-right">
                                                    {form.watch("amountFinanced") ? `$${form.watch("amountFinanced")}` : "—"}
                                                </div>
                                                <div className="text-blue-700">
                                                    Plazo:
                                                </div>
                                                <div className="font-medium text-right">
                                                    {form.watch("monthsFinanced") ? `${form.watch("monthsFinanced")} meses` : "—"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cuota mensual */}
                                    {form.watch("amountFinanced") && form.watch("monthsFinanced") && (
                                        <div className="bg-gray-800 text-white rounded-lg p-4 text-center">
                                            <div className="text-sm mb-1">
                                                Cuota Mensual Estimada
                                            </div>
                                            <div className="text-2xl font-bold">
                                                $
                                                {calculateMonthlyPayment()}
                                            </div>
                                        </div>
                                    )}

                                    {/* Validez */}
                                    {form.watch("quotationDate") && (
                                        <div className="text-xs text-center text-gray-500 pt-2">
                                            Válido hasta:
                                            {" "}
                                            {format(
                                                new Date(new Date(form.watch("quotationDate")).setDate(new Date(form.watch("quotationDate")).getDate() + 5)),
                                                "dd/MM/yyyy",
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Botones de acción */}
                            <div className="mt-6 flex flex-col space-y-2">
                                <Button type="submit" disabled={isPending} className="w-full">
                                    {isPending ? (
                                        <RefreshCcw className="mr-2 size-4 animate-spin" aria-hidden="true" />
                                    ) : (
                                        <ArrowRight className="mr-2 h-4 w-4" />
                                    )}
                                    Guardar Cotización
                                </Button>
                                <Button variant="outline" type="button" onClick={() => router.push("/quotation")} className="w-full">
                                    Cancelar
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    );
}
