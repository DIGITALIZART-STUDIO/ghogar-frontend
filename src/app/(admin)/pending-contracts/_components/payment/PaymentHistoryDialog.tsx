"use client";

import { startTransition, useCallback, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, CheckCircle, Clock, DollarSign, FileText, Info } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ResponsiveDialog } from "@/components/common/ResponsiveDialog";
import { InputWithIcon } from "@/components/input-with-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DatePicker from "@/components/ui/date-time-picker";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useAddPaymentToHistory, useUpdatePaymentInHistory } from "../../_hooks/usePaymentHistory";
import { PaymentHistoryFormData, paymentHistorySchema } from "../../_schemas/createPaymentHistorySchema";
import { PaymentHistoryDto, ReservationPendingValidationDto } from "../../../reservations/_types/reservation";
import { PaymentMethodLabels } from "../../../reservations/_utils/reservations.utils";

interface PaymentHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reservationId: string;
  payment?: PaymentHistoryDto | null;
  reservationData?: ReservationPendingValidationDto;
}

export function PaymentHistoryDialog({
  isOpen,
  onClose,
  reservationId,
  payment,
  reservationData,
}: PaymentHistoryDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const isEditing = !!payment;
  const [isSuccess, setIsSuccess] = useState(false);

  const addPayment = useAddPaymentToHistory();
  const updatePayment = useUpdatePaymentInHistory();

  const formatAmount = (amount: number | undefined) => {
    if (amount === undefined || amount === null) {
      return "N/A";
    }
    const symbol = reservationData?.currency === "DOLARES" ? "$" : "S/";
    return `${symbol}${amount.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`;
  };

  const handleAmountChange = (fieldOnChange: (value: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;

    // Validar si excede el monto máximo
    if (reservationData?.remainingAmount && value > reservationData.remainingAmount) {
      toast.warning("Monto excedido", {
        description: `El monto máximo permitido es ${formatAmount(reservationData.remainingAmount)}. Estás intentando ingresar ${formatAmount(value)}.`,
        duration: 4000,
      });
    }

    fieldOnChange(value);
  };

  const form = useForm<PaymentHistoryFormData>({
    resolver: zodResolver(paymentHistorySchema),
    defaultValues: {
      date: "",
      amount: 0,
      method: undefined,
      bankName: "",
      reference: "",
      notes: "",
    },
    mode: "onChange",
  });

  // Pre-llenar formulario si estamos editando
  useEffect(() => {
    if (isOpen && payment) {
      form.reset({
        date: payment.date,
        amount: payment.amount,
        method: payment.method,
        bankName: payment.bankName ?? "",
        reference: payment.reference ?? "",
        notes: payment.notes ?? "",
      });
    } else if (isOpen && !payment) {
      // Resetear para nuevo pago
      form.reset({
        date: new Date().toISOString().split("T")[0],
        amount: 0,
        method: undefined,
        bankName: "",
        reference: "",
        notes: "",
      });
    }
  }, [isOpen, payment, form]);

  // Manejar el éxito de la operación
  useEffect(() => {
    if (isSuccess) {
      form.reset();
      onClose();
      setIsSuccess(false);
    }
  }, [isSuccess, form, onClose]);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const onSubmit = useCallback(
    async (data: PaymentHistoryFormData) => {
      // Preparar los datos para el formato esperado por el backend
      const paymentData = {
        ...data,
        date: new Date(data.date).toISOString(),
        ...(isEditing && payment?.id && { id: payment.id }),
      };

      const promise =
        isEditing && payment?.id
          ? updatePayment.mutateAsync({
              params: { path: { id: reservationId } },
              body: paymentData,
            })
          : addPayment.mutateAsync({
              params: { path: { id: reservationId } },
              body: paymentData,
            });

      startTransition(() => {
        toast.promise(promise, {
          loading: isEditing ? "Actualizando pago..." : "Agregando pago...",
          success: () => {
            setIsSuccess(true);
            return isEditing ? "Pago actualizado exitosamente" : "Pago agregado exitosamente";
          },
          error: (e) => `Error al ${isEditing ? "actualizar" : "agregar"} pago: ${e.message}`,
        });
      });
    },
    [isEditing, payment?.id, updatePayment, addPayment, reservationId]
  );

  return (
    <ResponsiveDialog
      open={isOpen}
      onOpenChange={handleClose}
      isDesktop={isDesktop}
      title={isEditing ? "Editar Pago" : "Agregar Pago"}
      description={isEditing ? "Modifica los datos del pago" : "Registra un nuevo pago"}
      dialogContentClassName="sm:max-w-lg px-0"
      showTrigger={false}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Sección: Información del Pago */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2 dark:text-gray-100 flex items-center gap-2">
              <DollarSign className="size-5 text-primary" />
              Información del Pago
            </h3>

            {/* Fecha del Pago */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel required>Fecha del Pago</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={(date) => {
                        if (date) {
                          field.onChange(date.toISOString().split("T")[0]);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Monto */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel required>
                    Monto del Pago{" "}
                    {reservationData?.remainingAmount ? `(Máx: ${formatAmount(reservationData.remainingAmount)})` : ""}
                  </FormLabel>
                  <div className="flex items-center gap-2 w-full">
                    <FormControl>
                      <div className="flex-1">
                        <InputWithIcon
                          {...field}
                          Icon={DollarSign}
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="Ingrese el monto del pago"
                          onChange={handleAmountChange(field.onChange)}
                        />
                      </div>
                    </FormControl>
                    {reservationData && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button type="button" variant="outline" size="icon" className="shrink-0">
                            <Info className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80" align="end">
                          <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                              <Info className="h-5 w-5 text-blue-500" />
                              <h4 className="font-semibold text-slate-900 dark:text-slate-100">Información de Pagos</h4>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                <div className="flex items-center space-x-2">
                                  <DollarSign className="h-4 w-4 text-blue-500" />
                                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Total requerido
                                  </span>
                                </div>
                                <Badge variant="outline" className="font-mono">
                                  {formatAmount(reservationData.totalAmountRequired)}
                                </Badge>
                              </div>

                              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <div className="flex items-center space-x-2">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Ya pagado
                                  </span>
                                </div>
                                <Badge
                                  variant="outline"
                                  className="bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400 font-mono"
                                >
                                  {formatAmount(reservationData.amountPaid)}
                                </Badge>
                              </div>

                              <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-2 border-orange-200 dark:border-orange-800">
                                <div className="flex items-center space-x-2">
                                  <Clock className="h-4 w-4 text-orange-500" />
                                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Pendiente por pagar
                                  </span>
                                </div>
                                <Badge
                                  variant="outline"
                                  className="bg-orange-50 border-orange-300 text-orange-700 dark:bg-orange-900/20 dark:border-orange-700 dark:text-orange-400 font-mono font-semibold"
                                >
                                  {formatAmount(reservationData.remainingAmount)}
                                </Badge>
                              </div>
                            </div>

                            <div className="text-xs text-slate-500 dark:text-slate-400 text-center pt-2 border-t border-slate-200 dark:border-slate-700">
                              Ingresa el monto que deseas registrar en este pago
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Método de Pago */}
            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel required>Método de Pago</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione el método de pago">
                          {field.value && PaymentMethodLabels[field.value as keyof typeof PaymentMethodLabels] && (
                            <div className="flex items-center space-x-2">
                              {(() => {
                                const methodData = PaymentMethodLabels[field.value as keyof typeof PaymentMethodLabels];
                                const IconComponent = methodData.icon;
                                return <IconComponent className={`h-4 w-4 ${methodData.iconClass}`} />;
                              })()}
                              <span>{PaymentMethodLabels[field.value as keyof typeof PaymentMethodLabels].label}</span>
                            </div>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PaymentMethodLabels).map(([key, label]) => {
                          const IconComponent = label.icon;
                          return (
                            <SelectItem key={key} value={key}>
                              <div className="flex items-center space-x-2">
                                <IconComponent className={`h-4 w-4 ${label.iconClass}`} />
                                <span>{label.label}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Sección: Detalles Adicionales */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2 dark:text-gray-100 flex items-center gap-2">
              <FileText className="size-5 text-primary" />
              Detalles Adicionales
            </h3>

            {/* Nombre del Banco (condicional) */}
            {form.watch("method") && form.watch("method") !== "CASH" && (
              <FormField
                control={form.control}
                name="bankName"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Nombre del Banco</FormLabel>
                    <FormControl>
                      <InputWithIcon {...field} Icon={Building2} placeholder="Ingrese el nombre del banco" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Referencia del Pago */}
            <FormField
              control={form.control}
              name="reference"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Referencia del Pago</FormLabel>
                  <FormControl>
                    <InputWithIcon {...field} Icon={FileText} placeholder="Ingrese el número de operación o voucher" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notas */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Notas Adicionales</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Ingrese información adicional sobre el pago" rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={addPayment.isPending || updatePayment.isPending}>
              {addPayment.isPending || updatePayment.isPending
                ? "Guardando..."
                : isEditing
                  ? "Actualizar Pago"
                  : "Agregar Pago"}
            </Button>
          </div>
        </form>
      </Form>
    </ResponsiveDialog>
  );
}
