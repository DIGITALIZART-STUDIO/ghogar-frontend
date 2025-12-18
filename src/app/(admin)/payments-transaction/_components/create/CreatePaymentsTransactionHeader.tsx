import {  formatISO } from "date-fns";
import {
    Calendar,
    DollarSign,
    CreditCard,
    Hash,
    CheckCircle2,
    AlertTriangle,
    Zap,
} from "lucide-react";

import {  FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { PaymentMethodLabels } from "@/app/(admin)/reservations/_utils/reservations.utils";
import DatePicker from "@/components/ui/date-time-picker";
import { PaymentTransactionCreateFormData } from "../../_schemas/createPaymentTransactionSchema";
import { UseFormReturn } from "react-hook-form";

interface CreatePaymentsTransactionFormProps {
   form: UseFormReturn<PaymentTransactionCreateFormData>;
   totalSelectedAmount: number;
   selectedPayments: Array<string>;
   progressPercentage: number;
}

export default function CreatePaymentsTransactionHeader({ form, totalSelectedAmount, selectedPayments, progressPercentage }: CreatePaymentsTransactionFormProps) {
    return (
        <Card className="border overflow-hidden pt-0 bg-white dark:bg-gray-900">
            <CardHeader className="pb-4 bg-slate-100 dark:bg-gray-800 text-slate-800 dark:text-gray-100 pt-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-slate-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <Zap className="h-5 w-5 text-slate-500 dark:text-yellow-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">Configuración de Transacción</h3>
                        <p className="text-slate-500 dark:text-gray-400 text-sm">Define los parámetros del pago</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                    <FormField
                        control={form.control}
                        name="paymentDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2 text-slate-700 dark:text-gray-200 font-medium">
                                    <Calendar className="h-4 w-4" />
                                    Fecha y Hora del Pago
                                </FormLabel>
                                <FormControl>
                                    <DatePicker
                                        value={
                                            field.value
                                                ? typeof field.value === "string"
                                                    ? new Date(field.value)
                                                    : field.value
                                                : undefined
                                        }
                                        withTime
                                        onChange={(date) => {
                                            if (date) {
                                                // Convierte a string ISO antes de guardar en el formulario
                                                field.onChange(formatISO(date));
                                            } else {
                                                field.onChange(undefined);
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
                        name="paymentMethod"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2 text-slate-700 dark:text-gray-200 font-medium">
                                    <CreditCard className="h-4 w-4 " />
                                    Método de Pago
                                </FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            {field.value ? (
                                                <div className="flex items-center gap-2">
                                                    <span>
                                                        {
                                                            (() => {
                                                                const Icon = PaymentMethodLabels[field.value as keyof typeof PaymentMethodLabels].icon;
                                                                const iconClass = PaymentMethodLabels[field.value as keyof typeof PaymentMethodLabels].iconClass;
                                                                return <Icon className={`h-4 w-4 ${iconClass}`} />;
                                                            })()
                                                        }
                                                    </span>
                                                    <span className="font-medium">
                                                        {PaymentMethodLabels[field.value as keyof typeof PaymentMethodLabels].label}
                                                    </span>
                                                </div>
                                            ) : (
                                                <SelectValue placeholder="Seleccionar método" />
                                            )}
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {Object.entries(PaymentMethodLabels).map(([key, option]) => (
                                            <SelectItem key={key} value={key}>
                                                <div className="flex items-center gap-3">
                                                    <div className={"rounded-lg flex items-center justify-center"}>
                                                        <option.icon className={`h-4 w-4 ${option.iconClass}`} />
                                                    </div>
                                                    <div>
                                                        <span className="font-medium flex items-start">{option.label}</span>
                                                        <p className="text-xs text-slate-500 dark:text-gray-400">{option.description}</p>
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Separator className="my-6" />

                <div className="grid grid-cols-1 gap-4">
                    <FormField
                        control={form.control}
                        name="amountPaid"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2 text-slate-700 dark:text-gray-200 font-medium">
                                    <DollarSign className="h-4 w-4" />
                                    Monto del Pago
                                    {totalSelectedAmount > 0 && (
                                        <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                                            Sugerido: ${totalSelectedAmount.toLocaleString()}
                                        </Badge>
                                    )}
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            className="pl-4 pr-4 font-mono text-xl"
                                            {...field}
                                            onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                                        />
                                        {field.value > 0 && (
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                <Badge variant="secondary" className="text-xs">
                                                    {field.value === totalSelectedAmount ? "Exacto" : "Personalizado"}
                                                </Badge>
                                            </div>
                                        )}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {/* Mensaje de validación del monto */}
                    {selectedPayments.length > 0 && form.watch("amountPaid") > 0 && (
                        <div className="mt-2">
                            {form.watch("amountPaid") > totalSelectedAmount ? (
                                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
                                    <AlertTriangle className="h-4 w-4" />
                                    <span className="text-sm font-medium">
                                        Se está pagando ${(form.watch("amountPaid") - totalSelectedAmount).toLocaleString()} más de
                                        las cuotas seleccionadas
                                    </span>
                                </div>
                            ) : form.watch("amountPaid") < totalSelectedAmount ? (
                                <div className="flex items-center gap-2 text-blue-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <AlertTriangle className="h-4 w-4" />
                                    <span className="text-sm font-medium">
                                        Se está pagando ${(totalSelectedAmount - form.watch("amountPaid")).toLocaleString()} menos
                                        de las cuotas seleccionadas
                                    </span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span className="text-sm font-medium">
                                        El monto coincide exactamente con las cuotas seleccionadas
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    <FormField
                        control={form.control}
                        name="referenceNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2 text-slate-700 dark:text-gray-200 font-medium">
                                    <Hash className="h-4 w-4" />
                                    Número de Referencia
                                    <Badge variant="outline" className="text-xs">
                                        Opcional
                                    </Badge>
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                                        <Input
                                            placeholder="REF-2025-001"
                                            className="pl-10 font-mono "
                                            {...field}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Separator className="my-6" />
                {selectedPayments.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-700 dark:text-gray-200">Progreso de Selección</span>
                            <span className="text-sm text-slate-500 dark:text-gray-400">{progressPercentage.toFixed(1)}%</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
