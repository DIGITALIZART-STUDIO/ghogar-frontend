"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import {
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Clock,
  Ellipsis,
  FileText,
  Hash,
  List,
  ListChecks,
  Plus,
} from "lucide-react";

import { ReservationWithPaymentsDto } from "@/app/(admin)/reservations/_types/reservation";
import { PaymentMethodLabels } from "@/app/(admin)/reservations/_utils/reservations.utils";
import { ClientHoverCard } from "@/components/common/ClientHoverCard";
import { DocumentDownloadDialog } from "@/components/common/DocumentDownloadDialog";
import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useDownloadProcessedPaymentsPDF, useDownloadSchedulePDF } from "../../_hooks/usePaymentTransactions";

export const paymentsTransactionColumns = (): Array<ColumnDef<ReservationWithPaymentsDto>> => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="px-2">
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="px-2">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    enablePinning: true,
  },
  {
    id: "código",
    accessorKey: "quotationCode",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Código" />,
    cell: ({ row }) => {
      const code = row.getValue("código") as string;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 min-w-40 cursor-help">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <Hash className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-sm font-medium text-slate-900 dark:text-slate-100">{code}</span>
                  <span className="text-xs text-muted-foreground">Cotización</span>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs p-0 border-0">
              <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <Hash className="h-3 w-3 text-gray-600 dark:text-gray-300" />
                  </div>
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wide">
                    Código de Cotización
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="font-mono text-lg font-bold text-gray-900 dark:text-gray-100">{code}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Identificador único del sistema</p>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    id: "fecha_reserva",
    accessorKey: "reservationDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Fecha Reserva" />,
    cell: ({ row }) => {
      const date = row.getValue("fecha_reserva") as string;
      const formattedDate = date ? format(parseISO(date), "dd/MM/yyyy", { locale: es }) : "—";
      const fullDate = date ? format(parseISO(date), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es }) : "—";

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 min-w-32 cursor-help">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900 border border-indigo-200 dark:border-indigo-800">
                  <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-slate-900 dark:text-slate-100">{formattedDate}</span>
                  <span className="text-xs text-muted-foreground">Fecha Reserva</span>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm p-0 border-0">
              <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                  </div>
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wide">
                    Fecha de Reserva
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">Fecha</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{fullDate}</p>
                  </div>
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Formato corto</p>
                    <p className="text-sm font-mono text-gray-800 dark:text-gray-200">{formattedDate}</p>
                  </div>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    id: "cliente",
    accessorKey: "clientName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cliente" />,
    cell: ({ row }) => {
      const name = row.getValue("cliente") as string;
      const bankName = row.original.bankName;
      const clientId = row.original.clientId;

      return (
        <ClientHoverCard
          clientId={clientId}
          clientName={name}
          iconColor="text-indigo-600 dark:text-indigo-400"
          iconBgColor="bg-indigo-100 dark:bg-indigo-900 border-indigo-200 dark:border-indigo-800"
          additionalInfo={
            bankName ? <span className="text-xs text-muted-foreground truncate">{bankName}</span> : undefined
          }
        />
      );
    },
  },
  {
    id: "fecha proximo pago",
    accessorKey: "nextPaymentDueDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Fecha Próximo Pago" />,
    cell: ({ row }) => {
      const date = row.getValue("fecha proximo pago") as string | null;

      if (!date) {
        return (
          <div className="min-w-32">
            <div className="text-sm text-muted-foreground">—</div>
          </div>
        );
      }

      const today = new Date();
      const paymentDate = new Date(date);
      const isOverdue = paymentDate < today;
      const formattedDate = format(paymentDate, "dd/MM/yyyy", { locale: es });
      const fullDate = format(paymentDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
      const daysUntil = Math.ceil((paymentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={`flex items-center gap-2 min-w-36 cursor-help ${isOverdue ? "text-red-600" : ""}`}>
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-lg border ${
                    isOverdue
                      ? "bg-red-100 dark:bg-red-900 border-red-200 dark:border-red-800"
                      : "bg-green-100 dark:bg-green-900 border-green-200 dark:border-green-800"
                  }`}
                >
                  <Clock
                    className={`h-4 w-4 ${
                      isOverdue ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
                    }`}
                  />
                </div>
                <div className="flex flex-col">
                  <span className={`font-medium ${isOverdue ? "text-red-600" : "text-slate-900 dark:text-slate-100"}`}>
                    {formattedDate}
                  </span>
                  <span className={`text-xs ${isOverdue ? "text-red-500" : "text-muted-foreground"}`}>
                    {isOverdue ? "Vencido" : "Próximo"}
                  </span>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm p-0 border-0">
              <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isOverdue ? "bg-red-100 dark:bg-red-900" : "bg-green-100 dark:bg-green-900"
                    }`}
                  >
                    <Clock
                      className={`h-4 w-4 ${
                        isOverdue ? "text-red-600 dark:text-red-300" : "text-green-600 dark:text-green-300"
                      }`}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wide">
                    Próximo Pago
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">Fecha</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{fullDate}</p>
                  </div>
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Formato corto</p>
                    <p className="text-sm font-mono text-gray-800 dark:text-gray-200">{formattedDate}</p>
                  </div>
                  {isOverdue ? (
                    <div className="bg-red-100 dark:bg-red-900 rounded-lg p-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-300" />
                      <div>
                        <p className="text-xs font-bold text-red-800 dark:text-red-200">PAGO VENCIDO</p>
                        <p className="text-sm font-medium text-red-900 dark:text-red-100">
                          Vencido hace {Math.abs(daysUntil)} días
                        </p>
                      </div>
                    </div>
                  ) : (
                    daysUntil <= 7 && (
                      <div className="bg-amber-100 dark:bg-amber-900 rounded-lg p-2 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-amber-600 dark:text-amber-300" />
                        <div>
                          <p className="text-xs font-bold text-amber-800 dark:text-amber-200">ATENCIÓN REQUERIDA</p>
                          <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                            Vence en {daysUntil} días
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    id: "método de pago",
    accessorKey: "paymentMethod",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Método Pago" />,
    cell: ({ row }) => {
      const paymentMethod = row.getValue("método de pago") as keyof typeof PaymentMethodLabels;
      const config = PaymentMethodLabels[paymentMethod];
      const bankName = row.original?.bankName;

      if (!config) {
        return (
          <div className="min-w-32 text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-gray-500" />
            <span className="text-gray-500">No especificado</span>
          </div>
        );
      }

      const Icon = config.icon;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 min-w-32 cursor-help">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-800">
                  <Icon className={`${config.className} h-4 w-4`} />
                </div>
                <div className="flex flex-col">
                  <span className={`text-sm font-medium ${config.className}`}>{config.label}</span>
                  {bankName && <span className="text-xs text-muted-foreground truncate">{bankName}</span>}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm p-0 border-0">
              <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Icon className={`${config.className} h-4 w-4`} />
                  </div>
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wide">
                    Método de Pago
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">Método</p>
                    <p className={`font-semibold text-gray-900 dark:text-gray-100 ${config.className}`}>
                      {config.label}
                    </p>
                  </div>
                  {bankName && (
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                      <p className="text-xs text-gray-600 dark:text-gray-400">Banco</p>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{bankName}</p>
                    </div>
                  )}
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    id: "pagos realizados",
    accessorKey: "paymentCount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Pagos Realizados" />,
    cell: ({ row }) => {
      const count = row.getValue("pagos realizados") as number | undefined;
      const countValue = count ?? 0;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 min-w-32 cursor-help">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900 border border-emerald-200 dark:border-emerald-800">
                  <ListChecks className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{countValue}</span>
                  <span className="text-xs text-muted-foreground">Pagos Realizados</span>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs p-0 border-0">
              <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <ListChecks className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">Pagos Realizados</span>
                </div>
                <p className="font-bold text-lg text-gray-900 dark:text-gray-100">{countValue} pagos</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Total de transacciones de pago registradas
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
    enableColumnFilter: false,
  },
  {
    id: "expand",
    header: () => null,
    cell: ({ row }) => (
      <Button
        onClick={() => row.toggleExpanded()}
        aria-label="Expand row"
        className="flex items-center justify-center p-2"
        variant="ghost"
        size="sm"
      >
        {row.getIsExpanded() ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>
    ),
    enableSorting: false,
    enableHiding: false,
    enablePinning: true,
  },
  {
    id: "actions",
    cell: function Cell({ row }) {
      const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
      const [processedPaymentsDialogOpen, setProcessedPaymentsDialogOpen] = useState(false);
      const router = useRouter();
      const downloadSchedulePDF = useDownloadSchedulePDF();
      const downloadProcessedPaymentsPDF = useDownloadProcessedPaymentsPDF();

      return (
        <div>
          <div>
            {scheduleDialogOpen && (
              <DocumentDownloadDialog
                documentId={row.original.id!}
                isOpen={scheduleDialogOpen}
                onOpenChange={setScheduleDialogOpen}
                title="Cronograma de Pagos"
                pdfAction={downloadSchedulePDF}
                pdfFileName={`cronograma-${row.original.id}.pdf`}
              />
            )}
            {processedPaymentsDialogOpen && (
              <DocumentDownloadDialog
                documentId={row.original.id!}
                isOpen={processedPaymentsDialogOpen}
                onOpenChange={setProcessedPaymentsDialogOpen}
                title="Pagos Realizados"
                pdfAction={downloadProcessedPaymentsPDF}
                pdfFileName={`pagos-realizados-${row.original.id}.pdf`}
              />
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label="Open menu" variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted">
                <Ellipsis className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onSelect={() => router.push(`/payments-transaction/${row.original.id}/create`)}>
                Crear Transacción
                <DropdownMenuShortcut>
                  <Plus className="size-4" aria-hidden="true" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setScheduleDialogOpen(true)}>
                Cronograma de Pagos
                <DropdownMenuShortcut>
                  <List className="size-4" aria-hidden="true" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setProcessedPaymentsDialogOpen(true)}>
                Pagos Realizados
                <DropdownMenuShortcut>
                  <ListChecks className="size-4" aria-hidden="true" />
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
