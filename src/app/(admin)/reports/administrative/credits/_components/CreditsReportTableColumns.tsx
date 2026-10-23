"use client";

import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import {
  AlertTriangle,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  FileDown,
  Hash,
  Receipt,
  TrendingDown,
} from "lucide-react";

import { formatContractCurrency } from "@/app/(admin)/contracts/_utils/contracts.utils";
import { ClientHoverCard } from "@/components/common/ClientHoverCard";
import { DocumentDownloadDialog } from "@/components/common/DocumentDownloadDialog";
import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDownloadCreditStatementPdf } from "../_hooks/useDownloadCreditStatementPdf";
import { CreditsReportItem } from "../_types/creditsReport";
import { formatReportDate } from "../../../_utils/report-dates";

function MoneyCell({
  amount,
  currency,
  label,
  icon: Icon,
  iconClassName,
  boxClassName,
}: {
  amount: number;
  currency: string;
  label: string;
  icon: typeof DollarSign;
  iconClassName: string;
  boxClassName: string;
}) {
  return (
    <div className="flex items-center gap-2 min-w-36">
      <div className={`flex items-center justify-center w-9 h-9 rounded-lg border ${boxClassName}`}>
        <Icon className={`h-4 w-4 ${iconClassName}`} />
      </div>
      <div className="flex flex-col">
        <span className="font-semibold text-slate-900 dark:text-slate-100">
          {formatContractCurrency(amount, currency)}
        </span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}

export const creditsReportColumns = (): Array<ColumnDef<CreditsReportItem>> => [
  {
    id: "codigo",
    accessorKey: "code",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Código" />,
    cell: ({ row }) => (
      <span
        className="inline-flex items-center gap-2 font-mono text-xs px-2 py-1 rounded
                bg-zinc-100 text-zinc-800 border border-zinc-300
                dark:bg-zinc-900 dark:text-zinc-200 dark:border-zinc-700"
      >
        <Hash className="size-4 text-primary" aria-hidden="true" />
        {row.original.code}
      </span>
    ),
  },
  {
    id: "cliente_info",
    accessorKey: "clientName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cliente / Proyecto" />,
    cell: ({ row }) => (
      <ClientHoverCard
        clientId={row.original.clientId}
        clientName={row.original.clientName || "—"}
        iconColor="text-teal-600 dark:text-teal-400"
        iconBgColor="bg-teal-100 dark:bg-teal-900 border-teal-200 dark:border-teal-800"
        additionalInfo={
          <>
            <span className="text-xs text-muted-foreground">
              {row.original.clientDni ? `DNI/RUC ${row.original.clientDni}` : "Sin documento"}
            </span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Building2 className="h-3 w-3" />
              <span className="truncate">{row.original.projectName}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              Mz {row.original.blockName} · Lt {row.original.lotNumber}
            </span>
          </>
        }
      />
    ),
  },
  {
    id: "fecha_inicio",
    accessorKey: "startDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Fecha de inicio" />,
    cell: ({ row }) => (
      <span className="inline-flex items-center gap-1.5 text-sm">
        <Calendar className="size-3.5 text-muted-foreground" />
        {formatReportDate(row.original.startDate)}
      </span>
    ),
  },
  {
    id: "siguiente_pago",
    accessorKey: "nextPaymentDueDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Siguiente pago" />,
    cell: ({ row }) => {
      const nextPaymentDate = row.original.nextPaymentDueDate;
      if (!nextPaymentDate) {
        return <span className="text-sm text-muted-foreground">Sin cuotas pendientes</span>;
      }

      const paymentDate = parseISO(nextPaymentDate);
      const isOverdue = paymentDate.getTime() < Date.now();
      const daysUntil = Math.ceil((paymentDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

      return (
        <div className="flex items-center gap-2 min-w-36">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-lg border ${
              isOverdue
                ? "bg-red-100 dark:bg-red-900 border-red-200 dark:border-red-800"
                : "bg-green-100 dark:bg-green-900 border-green-200 dark:border-green-800"
            }`}
          >
            {isOverdue ? (
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
            ) : (
              <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
            )}
          </div>
          <div className="flex flex-col">
            <span className={`font-medium ${isOverdue ? "text-red-600" : "text-green-600"}`}>
              {format(paymentDate, "dd/MM/yyyy", { locale: es })}
            </span>
            <span className="text-xs text-muted-foreground">
              {isOverdue ? `Vencido hace ${Math.abs(daysUntil)} días` : "Próximo"}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    id: "cuotas_pendientes",
    accessorKey: "pendingInstallmentCount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cuotas pendientes" />,
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <Badge variant="secondary">{row.original.pendingInstallmentCount} cuotas</Badge>
        <span className="text-xs text-muted-foreground">
          {formatContractCurrency(row.original.remainingAmount, row.original.currency)}
        </span>
      </div>
    ),
  },
  {
    id: "monto_cuota",
    accessorKey: "nextPaymentAmount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Monto cuota" />,
    cell: ({ row }) => (
      <MoneyCell
        amount={row.original.nextPaymentAmount}
        currency={row.original.currency}
        label="Próxima cuota"
        icon={DollarSign}
        iconClassName="text-purple-600 dark:text-purple-400"
        boxClassName="bg-purple-100 dark:bg-purple-900 border-purple-200 dark:border-purple-800"
      />
    ),
  },
  {
    id: "pagado",
    accessorKey: "amountPaid",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Monto pagado" />,
    cell: ({ row }) => (
      <MoneyCell
        amount={row.original.amountPaid}
        currency={row.original.currency}
        label="Pagado a la fecha"
        icon={Receipt}
        iconClassName="text-slate-600 dark:text-slate-400"
        boxClassName="bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
      />
    ),
  },
  {
    id: "monto_restante",
    accessorKey: "remainingAmount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Monto restante" />,
    cell: ({ row }) => (
      <MoneyCell
        amount={row.original.remainingAmount}
        currency={row.original.currency}
        label="Saldo pendiente"
        icon={TrendingDown}
        iconClassName="text-blue-600 dark:text-blue-400"
        boxClassName="bg-blue-100 dark:bg-blue-900 border-blue-200 dark:border-blue-800"
      />
    ),
  },
  {
    id: "actions",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Estado de cuenta" />,
    cell: function Cell({ row }) {
      const credit = row.original;
      const [openStatementDialog, setOpenStatementDialog] = useState(false);
      const downloadStatementPdf = useDownloadCreditStatementPdf();

      return (
        <div>
          {openStatementDialog && (
            <DocumentDownloadDialog
              documentId={credit.id}
              isOpen={openStatementDialog}
              onOpenChange={setOpenStatementDialog}
              title={`Estado de cuenta · ${credit.clientName}`}
              pdfAction={downloadStatementPdf}
              pdfFileName={`estado-cuenta-${credit.code}.pdf`}
            />
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => setOpenStatementDialog(true)}
          >
            <FileDown className="size-3.5" />
            PDF
          </Button>
        </div>
      );
    },
    enablePinning: true,
  },
];
