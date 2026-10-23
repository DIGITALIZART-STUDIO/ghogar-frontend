"use client";

import { AlertCircle, AlertTriangle, Calendar, CheckCircle, Clock, DollarSign, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ContractPaymentDto, PaymentType } from "../_types/contract";
import { formatContractCurrency, getContractPaymentRowStatus, PaymentTypeLabels } from "../_utils/contracts.utils";

interface ContractPaymentScheduleTableProps {
  data: Array<ContractPaymentDto>;
  currency: string;
}

export function ContractPaymentScheduleTable({ data, currency }: ContractPaymentScheduleTableProps) {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("es-PE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatCurrency = (amount: number) => formatContractCurrency(amount, currency);

  if (data.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-muted-foreground">No hay cronograma de pagos para este contrato.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Las cuotas se generan al crear el contrato (o al migrar una separación pagada).
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-card overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
            <TrendingUp className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Cronograma de pagos</h3>
            <p className="text-sm text-muted-foreground mt-1">Enganche y cuotas del contrato</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Tipo</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Vence</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Monto</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Pagado</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Pendiente</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.map((payment) => {
                const rowStatus = getContractPaymentRowStatus(payment);
                const label =
                  payment.type === PaymentType.Installment
                    ? `${PaymentTypeLabels[payment.type]} ${payment.sequence}`
                    : PaymentTypeLabels[payment.type];

                return (
                  <tr key={payment.id}>
                    <td className="px-4 py-3 text-sm font-medium">{label}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="inline-flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {payment.dueDate ? formatDate(payment.dueDate) : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{formatCurrency(payment.amountDue ?? 0)}</td>
                    <td className="px-4 py-3 text-sm text-green-600 dark:text-green-400">
                      {formatCurrency(payment.amountPaid ?? 0)}
                    </td>
                    <td className="px-4 py-3 text-sm text-amber-600 dark:text-amber-400">
                      {formatCurrency(payment.remainingAmount ?? 0)}
                    </td>
                    <td className="px-4 py-3">
                      {rowStatus === "paid" ? (
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Pagado
                        </Badge>
                      ) : rowStatus === "partial" ? (
                        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                          <TrendingUp className="mr-1 h-3 w-3" />
                          Parcial
                        </Badge>
                      ) : rowStatus === "overdue" ? (
                        <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200">
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          Vencido
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200">
                          <Clock className="mr-1 h-3 w-3" />
                          Pendiente
                        </Badge>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg border p-3">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              Total
            </p>
            <p className="text-lg font-semibold">
              {formatCurrency(data.reduce((sum, p) => sum + (p.amountDue ?? 0), 0))}
            </p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              Pagado
            </p>
            <p className="text-lg font-semibold text-green-700 dark:text-green-400">
              {formatCurrency(data.reduce((sum, p) => sum + (p.amountPaid ?? 0), 0))}
            </p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="flex items-center gap-2 text-sm text-amber-600">
              <AlertCircle className="h-4 w-4" />
              Pendiente
            </p>
            <p className="text-lg font-semibold text-amber-700 dark:text-amber-400">
              {formatCurrency(data.reduce((sum, p) => sum + (p.remainingAmount ?? 0), 0))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
