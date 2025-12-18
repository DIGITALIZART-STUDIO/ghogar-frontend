"use client";

import { useRouter } from "next/navigation";
import { format, parse, parseISO } from "date-fns";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { EditReservationSchema } from "../_schemas/editReservationSchema";
import { CurrencyLabels, PaymentMethodLabels, ReservationStatusLabels } from "../../../_utils/reservations.utils";
import { Quotation } from "@/app/(admin)/quotation/_types/quotation";

interface EditReservationFormProps {
    quotationData: Quotation;
    form: UseFormReturn<EditReservationSchema>;
    onSubmit: (data: EditReservationSchema) => void;
    isPending: boolean;
}

export function EditReservationForm({ quotationData, form, onSubmit, isPending }: EditReservationFormProps) {
    const router = useRouter();

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Columna izquierda - Información principal */}
                    <div className="lg:col-span-2">
                        {/* Sección superior - Información de cotización (read-only) */}
                        <div className="rounded-xl overflow-hidden mb-8 border-2 bg-card border-secondary">
                            <div className="flex items-center justify-between p-6 bg-gray-100 dark:bg-gray-800 border-b">
                                <div className="flex items-center">
                                    <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-3" />
                                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                        Cotización Asociada (No editable)
                                    </h2>
                                </div>
                            </div>

                            <div className="p-6">
                                {quotationData ? (
                                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border">
                                        <div className="flex items-center mb-3">
                                            <User className="h-4 w-4 text-gray-600 mr-2" />
                                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                                Cotización: {quotationData.code}
                                            </span>
                                        </div>
                                        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                            <div>Cliente: {quotationData.leadClientName}</div>
                                            <div>Proyecto: {quotationData.projectName}</div>
                                            <div>Lote: Mz. {quotationData.blockName} Lt. {quotationData.lotNumber}</div>
                                            <div>Precio: $ {quotationData.finalPrice?.toLocaleString()}</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-sm text-muted-foreground">
                                        Cotización no encontrada.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sección principal - Datos de reserva */}
                        <div className="rounded-xl overflow-hidden mb-8 bg-card border border-secondary">
                            <div className="p-6 bg-primary/10 dark:bg-primary/90 border-b flex items-center">
                                <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-800 mr-3" />
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Datos de la Separación
                                </h2>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Estado
                                                </FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Seleccione estado" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {Object.entries(ReservationStatusLabels).map(([value, { label }]) => (
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
                                        name="notified"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormLabel>
                                                        Cliente Notificado
                                                    </FormLabel>
                                                </div>
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
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                Editar Separación
                            </h3>

                            {quotationData ? (
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span>
                                            Cotización:
                                        </span>
                                        <span className="font-medium">
                                            {quotationData.code}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>
                                            Cliente:
                                        </span>
                                        <span className="font-medium">
                                            {quotationData.leadClientName}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>
                                            Proyecto:
                                        </span>
                                        <span className="font-medium">
                                            {quotationData.projectName}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>
                                            Lote:
                                        </span>
                                        <span className="font-medium">
                                            Mz.
                                            {quotationData.blockName}
                                            {" "}
                                            Lt.
                                            {quotationData.lotNumber}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>
                                            Precio Final:
                                        </span>
                                        <span className="font-medium">
                                            $
                                            {quotationData.finalPrice?.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    Información de la cotización no disponible.
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
                                    {isPending ? "Actualizando..." : "Actualizar"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    );
}
