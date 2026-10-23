"use client";

import { Banknote, Receipt, Wallet } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { IncomeReportSummary } from "../_types/incomeReport";
import { formatIncomeTotals } from "../_utils/incomeReport.utils";

interface IncomeReportSummaryCardsProps {
  summary?: IncomeReportSummary;
}

const EMPTY_SUMMARY: IncomeReportSummary = {
  paymentCount: 0,
  totalAmount: 0,
  reservationPaymentCount: 0,
  reservationPaymentAmount: 0,
  totalsByCurrency: [],
};

export function IncomeReportSummaryCards({ summary }: IncomeReportSummaryCardsProps) {
  const data = summary ?? EMPTY_SUMMARY;
  const totals = data.totalsByCurrency ?? [];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card className="border-l-4 border-l-slate-400">
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
              <Receipt className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Pagos registrados</p>
              <p className="text-2xl font-bold">{data.paymentCount}</p>
              <p className="text-xs text-muted-foreground mt-1">Vouchers en el periodo</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-emerald-500">
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
              <Wallet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total ingresado</p>
              <p className="text-2xl font-bold">{formatIncomeTotals(totals, data.totalAmount)}</p>
              <p className="text-xs text-muted-foreground mt-1">Suma de todos los vouchers</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-amber-500">
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
              <Banknote className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Pagos de separaciones</p>
              <p className="text-2xl font-bold">{data.reservationPaymentCount}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatIncomeTotals(totals, data.reservationPaymentAmount, (total) => total.reservationPaymentAmount)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
