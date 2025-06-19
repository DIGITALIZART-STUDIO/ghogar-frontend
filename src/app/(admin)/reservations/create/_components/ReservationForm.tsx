"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { format, parse, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { 
    Banknote, 
    CreditCard, 
    DollarSign, 
    FileText, 
    User, 
    Calendar,
    Wallet,
    Building2
} from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { components } from "@/types/api";
import { InputWithIcon } from "@/components/input-with-icon";
import { AutoComplete } from "@/components/ui/autocomplete";
import { Button } from "@/components/ui/button";
import DatePicker from "@/components/ui/date-time-picker";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CreateReservationSchema } from "../_schemas/createReservationSchema";
import { CurrencyLabels, PaymentMethodLabels } from "../../_utils/reservations.utils";

type QuotationDTO = components["schemas"]["QuotationDTO"];

interface ReservationFormProps {
  quotationsData: Array<QuotationDTO>;
  form: UseFormReturn<CreateReservationSchema>;
  onSubmit: (data: CreateReservationSchema) => void;
  isPending: boolean;
}

export function ReservationForm({ quotationsData, form, onSubmit, isPending }: ReservationFormProps) {
    const router = useRouter();

    // Prepare quotation options for dropdown
    const quotationOptions = quotationsData.map((quotation) => ({
        value: quotation.id ?? "",
        label: `${quotation.code} - ${quotation.leadClientName} (${quotation.projectName})`,
        quotation: quotation,
    }));

    // Get selected quotation for displaying client info
    const selectedQuotationId = form.watch("quotationId");
    const selectedQuotation = quotationsData.find(q => q.id === selectedQuotationId);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Columna izquierda - Información principal */}
                    <div className="lg:col-span-2">
                        {/* Sección superior - Selección de cotización */}
                        <div className="rounded-xl overflow-hidden mb-8 border-2 bg-card border-secondary">
                            <div className="flex items-center justify-between p-6 bg-primary/10 dark:bg-primary/90 border-b">
                                <div className="flex items-center">
                                    <FileText className="h-5 w-5 text-gray-600 dark:text-gray-800 mr-3" />
                                    <h2 className="text-lg font-semibold text-gray-800">
                                        Selección de Cotización
                                    </h2>
                                </div>
                            </div>

                            <div className="p-6">
                                <FormField
                                    control={form.control}
                                    name="quotationId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Cotización</FormLabel>
                                            <AutoComplete
                                                options={quotationOptions}
                                                emptyMessage="No se encontró la cotización."
                                                placeholder="Seleccione una cotización"
                                                onValueChange={(selectedOption) => {
                                                    field.onChange(selectedOption?.value ?? "");
                                                }}
                                                value={quotationOptions.find((option) => option.value === field.value) ?? undefined}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Display selected quotation info */}
                                {selectedQuotation && (
                                    <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-200">
                                        <div className="flex items-center mb-2">
                                            <User className="h-4 w-4 text-blue-600 mr-2" />
                                            <span className="text-sm font-medium text-blue-800">Cliente seleccionado:</span>
                                        </div>
                                        <div className="text-sm text-blue-700">
                                            {selectedQuotation.leadClientName}
                                        </div>
                                        <div className="text-xs text-blue-600 mt-1">
                                            Proyecto: {selectedQuotation.projectName}
                                        </div>
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
                                                <FormLabel>Fecha de Separación</FormLabel>
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
                                                <FormLabel>Fecha de Vencimiento</FormLabel>
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
                                                <FormLabel>Monto Pagado</FormLabel>
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
                                                <FormLabel>Moneda</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
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
                                                <FormLabel>Método de Pago</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Seleccione método" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {Object.entries(PaymentMethodLabels).map(([value, label]) => (
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
                                        name="bankName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Banco (Opcional)</FormLabel>
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
                                                <FormLabel>Tipo de Cambio</FormLabel>
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
                                                    <FormLabel>Cronograma de Pagos (Opcional)</FormLabel>
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
                            <h3 className="text-lg font-semibold mb-4">Resumen de Separación</h3>
                            
                            {selectedQuotation ? (
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span>Cotización:</span>
                                        <span className="font-medium">{selectedQuotation.code}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Cliente:</span>
                                        <span className="font-medium">{selectedQuotation.leadClientName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Proyecto:</span>
                                        <span className="font-medium">{selectedQuotation.projectName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Lote:</span>
                                        <span className="font-medium">Mz. {selectedQuotation.block} Lt. {selectedQuotation.lotNumber}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Precio Final:</span>
                                        <span className="font-medium">S/ {selectedQuotation.finalPrice?.toLocaleString()}</span>
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