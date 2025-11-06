import React, { useEffect } from "react";
import { ArrowRight, CheckCircle, RefreshCw, DollarSign, CreditCard, Building2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ReservationStatus, PaymentMethod, ReservationDto } from "../_types/reservation";
import { ReservationStatusLabels, PaymentMethodLabels } from "../_utils/reservations.utils";
import { ReservationStatusChangeSchema } from "../create/_schemas/createReservationSchema";
import DatePicker from "@/components/ui/date-time-picker";

interface ReservationStatusChangeContentProps {
  showSuccess: boolean;
  currentStatus: ReservationStatus;
  form: UseFormReturn<ReservationStatusChangeSchema>;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (data: ReservationStatusChangeSchema) => void;
  reservationData?: ReservationDto;
}

const ReservationStatusChangeContent: React.FC<ReservationStatusChangeContentProps> = ({
    showSuccess,
    currentStatus,
    form,
    isPending,
    onClose,
    onSubmit,
    reservationData,
}) => {
    const watchedStatus = form.watch("status");
    const watchedIsFullPayment = form.watch("isFullPayment");

    // Inicializar campos con datos de la reserva cuando es pago completo
    useEffect(() => {
        if (watchedIsFullPayment && reservationData) {
            if (reservationData.paymentMethod && !form.getValues("paymentMethod")) {
                form.setValue("paymentMethod", reservationData.paymentMethod as PaymentMethod);
            }
            if (reservationData.bankName && !form.getValues("bankName")) {
                form.setValue("bankName", reservationData.bankName);
            }
        }
    }, [watchedIsFullPayment, reservationData, form]);

    if (showSuccess) {
        return (
            <div className="flex flex-col items-center justify-center space-y-4 p-6">
                <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-green-700 dark:text-green-300">
                        ¡Estado Actualizado!
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        El estado de la reserva se ha actualizado correctamente
                    </p>
                </div>
            </div>
        );
    }

    const statusOptions = Object.values(ReservationStatus).filter((status) => status !== currentStatus);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Current Status */}
                <div className="space-y-2">
                    <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Estado Actual
                    </FormLabel>
                    <div className={cn(
                        "flex items-center space-x-2 p-3 border rounded-lg",
                        ReservationStatusLabels[currentStatus]?.className || "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
                    )}
                    >
                        {React.createElement(ReservationStatusLabels[currentStatus]?.icon || CheckCircle, {
                            className: "h-4 w-4"
                        })}
                        <span className="text-sm font-medium">
                            {ReservationStatusLabels[currentStatus]?.label}
                        </span>
                    </div>
                </div>

                <Separator className="bg-slate-200 dark:bg-slate-700" />

                {/* New Status Selection */}
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Nuevo Estado
                            </FormLabel>
                            <div className="space-y-2">
                                {statusOptions.map((status) => {
                                    const statusConfig = ReservationStatusLabels[status];
                                    const isSelected = field.value === status;

                                    return (
                                        <button
                                            key={status}
                                            type="button"
                                            onClick={() => field.onChange(status)}
                                            className={cn(
                                                "w-full flex items-center space-x-3 p-3 border rounded-lg text-left transition-colors",
                                                isSelected
                                                    ? cn(statusConfig?.className, "ring-2 ring-opacity-50")
                                                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                            )}
                                        >
                                            {React.createElement(statusConfig?.icon || CheckCircle, {
                                                className: "h-4 w-4"
                                            })}
                                            <span className="text-sm font-medium">
                                                {statusConfig?.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Payment Options - Only show if status is CANCELED (Completado) */}
                {watchedStatus === ReservationStatus.CANCELED && (
                    <>
                        <Separator className="bg-slate-200 dark:bg-slate-700" />

                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <CreditCard className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Opciones de Pago
                                </FormLabel>
                            </div>

                            <FormField
                                control={form.control}
                                name="isFullPayment"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className="mt-1"
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                Pago completo
                                            </FormLabel>
                                            <p className="text-xs text-muted-foreground">
                                                Marcar si el cliente ha pagado el monto completo. Si no está marcado, aparecerá un campo para especificar el monto pagado.
                                            </p>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            {!watchedIsFullPayment && (
                                <FormField
                                    control={form.control}
                                    name="paymentAmount"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                Monto del Pago
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400" />
                                                    <Input
                                                        {...field}
                                                        type="number"
                                                        step="0.01"
                                                        placeholder="0.00"
                                                        value={field.value ?? ""}
                                                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                                        className="pl-10 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                                                    />
                                                </div>
                                            </FormControl>
                                            {reservationData?.totalAmountRequired && (
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    Monto total requerido: ${reservationData.totalAmountRequired.toLocaleString()}
                                                </p>
                                            )}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>
                    </>
                )}

                {/* Detalles del Pago - Solo mostrar si el estado es CANCELED */}
                {watchedStatus === ReservationStatus.CANCELED && (
                    <>
                        <Separator className="bg-slate-200 dark:bg-slate-700" />

                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <CreditCard className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Detalles del Pago
                                </FormLabel>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {/* Fecha del Pago */}
                                <FormField
                                    control={form.control}
                                    name="paymentDate"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                Fecha del Pago
                                            </FormLabel>
                                            <FormControl>
                                                <DatePicker
                                                    value={field.value ? new Date(field.value) : undefined}
                                                    onChange={(date) => field.onChange(date?.toISOString())}
                                                    iconColor="text-slate-500 dark:text-slate-400"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Método de Pago */}
                                <FormField
                                    control={form.control}
                                    name="paymentMethod"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                Método de Pago
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value ?? (watchedIsFullPayment ? reservationData?.paymentMethod : undefined)}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="border-slate-200 dark:border-slate-700 w-full">
                                                        <SelectValue placeholder="Seleccionar método" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {Object.entries(PaymentMethodLabels).map(([key, config]) => (
                                                        <SelectItem key={key} value={key}>
                                                            <div className="flex items-center space-x-2">
                                                                <config.icon className="h-4 w-4" />
                                                                <span>{config.label}</span>
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

                            {/* Banco (solo si es depósito o transferencia) */}
                            {(form.watch("paymentMethod") === PaymentMethod.BANK_DEPOSIT ||
                                form.watch("paymentMethod") === PaymentMethod.BANK_TRANSFER) && (
                                <FormField
                                    control={form.control}
                                    name="bankName"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                Nombre del Banco
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400" />
                                                    <Input
                                                        {...field}
                                                        value={field.value ?? (watchedIsFullPayment ? (reservationData?.bankName ?? "") : "")}
                                                        placeholder="Ej: BCP, BBVA, Interbank..."
                                                        className="pl-10 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            {/* Referencia del Pago */}
                            <FormField
                                control={form.control}
                                name="paymentReference"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Referencia del Pago
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Número de operación, voucher, etc."
                                                className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Notas del Pago */}
                            <FormField
                                control={form.control}
                                name="paymentNotes"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Notas del Pago
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                placeholder="Información adicional sobre el pago..."
                                                className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                                                rows={3}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </>
                )}

                {/* Preview */}
                {watchedStatus && (
                    <>
                        <Separator className="bg-slate-200 dark:bg-slate-700" />

                        <div className="space-y-2">
                            <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Vista Previa del Cambio
                            </FormLabel>
                            <div className="flex items-center justify-center space-x-4 p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                <div className="flex items-center space-x-2">
                                    {React.createElement(ReservationStatusLabels[currentStatus]?.icon || CheckCircle, {
                                        className: "h-4 w-4"
                                    })}
                                    <span className="text-sm">
                                        {ReservationStatusLabels[currentStatus]?.label}
                                    </span>
                                </div>
                                <ArrowRight className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                <div className="flex items-center space-x-2">
                                    {React.createElement(ReservationStatusLabels[watchedStatus]?.icon || CheckCircle, {
                                        className: "h-4 w-4"
                                    })}
                                    <span className="text-sm font-medium">
                                        {ReservationStatusLabels[watchedStatus]?.label}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="flex-1 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        disabled={isPending}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        className="flex-1"
                        disabled={!watchedStatus || watchedStatus === currentStatus || isPending}
                    >
                        {isPending && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                        Confirmar Cambio
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default ReservationStatusChangeContent;
