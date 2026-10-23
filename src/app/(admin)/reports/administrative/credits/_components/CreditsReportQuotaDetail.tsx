"use client";

import { AlertTriangle, Calendar, CheckCircle, Clock, Loader2, Receipt, TrendingUp } from "lucide-react";

import { useContractSchedule } from "@/app/(admin)/contracts/_hooks/useContracts";
import { PaymentType } from "@/app/(admin)/contracts/_types/contract";
import {
  formatContractCurrency,
  getContractPaymentRowStatus,
  PaymentTypeLabels,
} from "@/app/(admin)/contracts/_utils/contracts.utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditsReportItem } from "../_types/creditsReport";
import { formatReportDate } from "../../../_utils/report-dates";

interface CreditsReportQuotaDetailProps {
  row: CreditsReportItem;
}

export function CreditsReportQuotaDetail({ row }: CreditsReportQuotaDetailProps) {
  const { data: schedule, isLoading, isError } = useContractSchedule(row.id);
  const payments = schedule ?? [];

  return (
    <div className="flex flex-col gap-3 p-2">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Receipt className="size-4 text-primary" />
        Cuotas de {row.code} · {row.clientName}
      </div>
      <Separator />

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
          <Loader2 className="size-4 animate-spin" />
          Cargando cronograma...
        </div>
      )}

      {isError && <p className="text-sm text-destructive py-4">No se pudo cargar el detalle de cuotas.</p>}

      {!isLoading && !isError && payments.length === 0 && (
        <p className="text-sm text-muted-foreground py-4">Este crédito no tiene cuotas registradas.</p>
      )}

      {!isLoading && !isError && payments.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-muted-foreground">
                <th className="py-2 pr-4 font-medium">Cuota</th>
                <th className="py-2 pr-4 font-medium">Vence</th>
                <th className="py-2 pr-4 font-medium">Monto</th>
                <th className="py-2 pr-4 font-medium">Pagado</th>
                <th className="py-2 pr-4 font-medium">Pendiente</th>
                <th className="py-2 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {payments.map((payment) => {
                const rowStatus = getContractPaymentRowStatus(payment);
                const label =
                  payment.type === PaymentType.Installment
                    ? `${PaymentTypeLabels[payment.type]} ${payment.sequence}`
                    : PaymentTypeLabels[payment.type];

                return (
                  <tr key={payment.id}>
                    <td className="py-2 pr-4 font-medium">{label}</td>
                    <td className="py-2 pr-4">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="size-3.5 text-muted-foreground" />
                        {formatReportDate(payment.dueDate)}
                      </span>
                    </td>
                    <td className="py-2 pr-4">{formatContractCurrency(payment.amountDue, row.currency)}</td>
                    <td className="py-2 pr-4 text-green-700 dark:text-green-400">
                      {formatContractCurrency(payment.amountPaid, row.currency)}
                    </td>
                    <td className="py-2 pr-4 text-amber-700 dark:text-amber-400">
                      {formatContractCurrency(payment.remainingAmount, row.currency)}
                    </td>
                    <td className="py-2">
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
      )}
    </div>
  );
}
