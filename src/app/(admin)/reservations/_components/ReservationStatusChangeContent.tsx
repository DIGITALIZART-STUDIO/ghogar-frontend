import React, { useEffect } from "react";
import { ArrowRight, Building2, CheckCircle, CreditCard, DollarSign, RefreshCw } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import DatePicker from "@/components/ui/date-time-picker";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { PaymentMethod, ReservationDto, ReservationStatus } from "../_types/reservation";
import { PaymentMethodLabels, ReservationStatusLabels } from "../_utils/reservations.utils";
import { ReservationStatusChangeSchema } from "../create/_schemas/createReservationSchema";

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
      // Establecer paymentAmount al totalAmountRequired cuando es pago completo
      if (reservationData.totalAmountRequired) {
        form.setValue("paymentAmount", reservationData.totalAmountRequired);
      }
      if (reservationData.paymentMethod && !form.getValues("paymentMethod")) {
        form.setValue("paymentMethod", reservationData.paymentMethod as PaymentMethod);
      }
      if (reservationData.bankName && !form.getValues("bankName")) {
        form.setValue("bankName", reservationData.bankName);
      }
    } else if (!watchedIsFullPayment) {
      // Limpiar paymentAmount cuando no es pago completo
      form.setValue("paymentAmount", undefined);
    }
  }, [watchedIsFullPayment, reservationData, form]);

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-6">
        <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
        <div className="text-center">
          <h3 className="text-lg font-semibold text-green-700 dark:text-green-300">¡Estado Actualizado!</h3>
          <p className="text-sm text-muted-foreground mt-1">El estado de la reserva se ha actualizado correctamente</p>
        </div>
      </div>
    );
  }

  const statusOptions = Object.values(ReservationStatus).filter((status) => status !== currentStatus);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
        <div className="py-4 space-y-6">
          {/* Estado Selection - Diseño innovador tipo stepper visual */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300" required>
                  Seleccionar Nuevo Estado
                </FormLabel>

                {/* Layout tipo stepper con estado actual y opciones */}
                <div className="space-y-4">
                  {/* Estado Actual - En línea con las opciones */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 flex-1">
                      <div
                        className={cn(
                          "flex items-center justify-center w-8 h-8 rounded-lg shrink-0",
                          ReservationStatusLabels[currentStatus]?.className || "bg-slate-100 dark:bg-slate-800"
                        )}
                      >
                        {React.createElement(ReservationStatusLabels[currentStatus]?.icon || CheckCircle, {
                          className: "h-4 w-4",
                        })}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Estado actual</div>
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {ReservationStatusLabels[currentStatus]?.label}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
                    <div className="text-xs text-slate-400 dark:text-slate-500">Nuevo</div>
                  </div>

                  {/* Separador visual */}
                  <div className="h-px bg-slate-200 dark:bg-slate-700" />

                  {/* Opciones - Diseño tipo lista visual mejorada */}
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
                            "w-full p-3.5 rounded-lg transition-all text-left group",
                            isSelected
                              ? cn(statusConfig?.className, "bg-current/5 dark:bg-current/10")
                              : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            {/* Icono en contenedor cuadrado */}
                            <div
                              className={cn(
                                "flex items-center justify-center w-9 h-9 rounded-md transition-colors shrink-0",
                                isSelected
                                  ? "bg-current/10"
                                  : "bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700"
                              )}
                            >
                              {React.createElement(statusConfig?.icon || CheckCircle, {
                                className: cn(
                                  "h-5 w-5 transition-colors",
                                  isSelected ? "text-current" : "text-slate-600 dark:text-slate-400"
                                ),
                              })}
                            </div>

                            {/* Contenido */}
                            <div className="flex-1 min-w-0">
                              <div
                                className={cn(
                                  "text-sm font-medium transition-colors",
                                  isSelected ? "text-current" : "text-slate-900 dark:text-slate-100"
                                )}
                              >
                                {statusConfig?.label}
                              </div>
                            </div>

                            {/* Checkmark cuando está seleccionado */}
                            {isSelected && <CheckCircle className="h-4 w-4 text-current shrink-0" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Payment Options - Only show if status is CANCELED (Completado) */}
          {watchedStatus === ReservationStatus.CANCELED && (
            <div className="bg-card rounded-lg border border-slate-200 dark:border-slate-700 p-4 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
                <CreditCard className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Opciones de Pago
                </FormLabel>
              </div>

              <FormField
                control={form.control}
                name="isFullPayment"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start gap-3 space-y-0 rounded-md border border-slate-200 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-800/30">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-0.5" />
                    </FormControl>
                    <div className="space-y-1 leading-none flex-1">
                      <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                        Pago completo
                      </FormLabel>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Marcar si el cliente ha pagado el monto completo. Si no está marcado, aparecerá un campo para
                        especificar el monto pagado.
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
                      <FormLabel className="text-sm font-medium text-slate-700 dark:text-slate-300" required>
                        Monto del Pago
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400 pointer-events-none" />
                          <Input
                            {...field}
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="Ingrese el monto del pago"
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                            className="pl-10 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                          />
                        </div>
                      </FormControl>
                      {reservationData?.totalAmountRequired && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                          Monto total requerido: ${reservationData.totalAmountRequired.toLocaleString()}
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          )}

          {/* Detalles del Pago - Solo mostrar si el estado es CANCELED */}
          {watchedStatus === ReservationStatus.CANCELED && (
            <div className="bg-card rounded-lg border border-slate-200 dark:border-slate-700 p-4 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
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
                    <FormItem>
                      <FormLabel className="text-slate-700 dark:text-slate-300" required>
                        Método de Pago
                      </FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccione el método de pago" />
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
              </div>

              {/* Banco (solo si es depósito o transferencia, o si es pago completo) */}
              {(form.watch("paymentMethod") === PaymentMethod.BANK_DEPOSIT ||
                form.watch("paymentMethod") === PaymentMethod.BANK_TRANSFER ||
                watchedIsFullPayment) && (
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
                          <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400 pointer-events-none" />
                          <Input
                            {...field}
                            value={field.value ?? (watchedIsFullPayment ? (reservationData?.bankName ?? "") : "")}
                            placeholder="Ingrese el nombre del banco"
                            className="pl-10 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
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
                        placeholder="Ingrese la referencia del pago (número de operación, voucher, etc.)"
                        className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
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
                        placeholder="Ingrese información adicional sobre el pago"
                        className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="sticky bottom-0 bg-card border-t border-slate-200 dark:border-slate-700 px-6 py-4 flex gap-3">
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
