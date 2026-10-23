"use client";

import { format, parse } from "date-fns";
import { AlertTriangle, Calendar, CheckCircle, Clock, Lock, TrendingUp } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UpdateContractFormData } from "../../../_schemas/updateContractSchema";
import { formatContractCurrency, getContractPaymentRowStatus } from "../../../_utils/contracts.utils";

interface EditContractScheduleTableProps {
  form: UseFormReturn<UpdateContractFormData>;
  currency: string;
  isPreview: boolean;
}

export function EditContractScheduleTable({ form, currency, isPreview }: EditContractScheduleTableProps) {
  const installments = form.watch("installments");

  if (installments.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <p className="text-sm text-muted-foreground">No hay cuotas para editar en este contrato.</p>
      </div>
    );
  }

  return (
    <section className="rounded-xl border bg-card p-6 space-y-4">
      <div>
        <h2 className="font-semibold">Cuotas</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Solo puedes cambiar la fecha de las cuotas pendientes. Las pagadas o con recibo quedan bloqueadas.
        </p>
      </div>
      {isPreview ? (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          Vista previa — aún no guardado. Revisa las fechas y guarda el cronograma para registrarlo.
        </p>
      ) : null}
      <div className="space-y-3">
        {installments.map((installment, index) => {
          const rowStatus = getContractPaymentRowStatus(installment);
          return (
            <div
              key={installment.sequence}
              className="grid gap-3 rounded-lg border p-3 sm:grid-cols-[7rem_minmax(0,1fr)_auto_auto] sm:items-center"
            >
              <p className="inline-flex items-center gap-2 text-sm font-medium">
                Cuota {installment.sequence}
                {installment.locked ? <Lock className="h-3.5 w-3.5 text-muted-foreground" /> : null}
              </p>
              {installment.locked ? (
                <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {formatDisplayDate(installment.dueDate)}
                </p>
              ) : (
                <FormField
                  control={form.control}
                  name={`installments.${index}.dueDate`}
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormControl>
                        <Input type="date" className="max-w-[11.5rem]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <p className="text-sm">{formatContractCurrency(installment.amountDue, currency)}</p>
              <InstallmentStatusBadge status={rowStatus} />
            </div>
          );
        })}
      </div>
      {form.formState.errors.installments?.root?.message || form.formState.errors.installments?.message ? (
        <p className="text-sm text-destructive">
          {form.formState.errors.installments?.root?.message ?? form.formState.errors.installments?.message}
        </p>
      ) : null}
    </section>
  );
}

function formatDisplayDate(value: string) {
  if (!value) {
    return "—";
  }
  const parsed = parse(value, "yyyy-MM-dd", new Date());
  return format(parsed, "dd/MM/yyyy");
}

function InstallmentStatusBadge({ status }: { status: ReturnType<typeof getContractPaymentRowStatus> }) {
  if (status === "paid") {
    return (
      <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200">
        <CheckCircle className="mr-1 h-3 w-3" />
        Pagado
      </Badge>
    );
  }
  if (status === "partial") {
    return (
      <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
        <TrendingUp className="mr-1 h-3 w-3" />
        Parcial
      </Badge>
    );
  }
  if (status === "overdue") {
    return (
      <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200">
        <AlertTriangle className="mr-1 h-3 w-3" />
        Vencido
      </Badge>
    );
  }
  return (
    <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200">
      <Clock className="mr-1 h-3 w-3" />
      Pendiente
    </Badge>
  );
}
