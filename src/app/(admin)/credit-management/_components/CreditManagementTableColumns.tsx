"use client";

import { useState } from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import {
  AlertTriangle,
  Building2,
  Clock,
  DollarSign,
  Ellipsis,
  Eye,
  FileText,
  Receipt,
  TrendingDown,
} from "lucide-react";

import { ClientHoverCard } from "@/components/common/ClientHoverCard";
import { DocumentDownloadDialog } from "@/components/common/DocumentDownloadDialog";
import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDownloadContractSchedulePdf } from "../../contracts/_hooks/useContracts";
import { ContractDto } from "../../contracts/_types/contract";
import { ContractStatusLabels, formatContractCurrency } from "../../contracts/_utils/contracts.utils";

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

export const creditManagementColumns = (): Array<ColumnDef<ContractDto>> => [
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
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Building2 className="h-3 w-3" />
              <span className="truncate">{row.original.projectName}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              Mz {row.original.blockName} · Lt {row.original.lotNumber} · {row.original.code}
            </span>
          </>
        }
      />
    ),
  },
  {
    id: "siguiente_pago",
    accessorKey: "nextPaymentDueDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Siguiente pago" />,
    cell: ({ row }) => {
      const nextPaymentDate = row.original.nextPaymentDueDate;
      if (!nextPaymentDate) {
        return <span className="text-sm text-muted-foreground">—</span>;
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
    id: "inicial",
    accessorKey: "downPaymentAmount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Inicial" />,
    cell: ({ row }) => (
      <MoneyCell
        amount={row.original.downPaymentAmount}
        currency={row.original.currency}
        label="Pago inicial"
        icon={DollarSign}
        iconClassName="text-emerald-600 dark:text-emerald-400"
        boxClassName="bg-emerald-100 dark:bg-emerald-900 border-emerald-200 dark:border-emerald-800"
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
    id: "total_venta",
    accessorKey: "totalPrice",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Total venta" />,
    cell: ({ row }) => (
      <MoneyCell
        amount={row.original.totalPrice}
        currency={row.original.currency}
        label="Precio total"
        icon={Receipt}
        iconClassName="text-slate-600 dark:text-slate-400"
        boxClassName="bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
      />
    ),
  },
  {
    id: "estado",
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
    cell: ({ row }) => {
      const config = ContractStatusLabels[row.original.status];
      if (!config) {
        return <span className="text-sm text-muted-foreground">No registrado</span>;
      }
      const Icon = config.icon;
      return (
        <Badge variant="outline" className={config.className}>
          <Icon className="mr-1 h-3.5 w-3.5" />
          {config.label}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: function Cell({ row }) {
      const contract = row.original;
      const [openScheduleDialog, setOpenScheduleDialog] = useState(false);
      const downloadSchedulePDF = useDownloadContractSchedulePdf();

      return (
        <div>
          {openScheduleDialog && (
            <DocumentDownloadDialog
              documentId={contract.id}
              isOpen={openScheduleDialog}
              onOpenChange={setOpenScheduleDialog}
              title="Cronograma de pagos"
              pdfAction={downloadSchedulePDF}
              pdfFileName={`cronograma-${contract.code}.pdf`}
            />
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label="Open menu" variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted">
                <Ellipsis className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem asChild>
                <Link href={`/contracts/${contract.id}`}>
                  Ver contrato y cronograma
                  <DropdownMenuShortcut>
                    <Eye className="size-4" aria-hidden="true" />
                  </DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setOpenScheduleDialog(true)}>
                Cronograma PDF
                <DropdownMenuShortcut>
                  <FileText className="size-4" aria-hidden="true" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    enablePinning: true,
  },
];
