"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  AlertTriangle,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  Edit,
  Ellipsis,
  FileText,
  Receipt,
  TrendingDown,
  User,
} from "lucide-react";

import { UpdateClientSheet } from "@/app/(admin)/clients/_components/update/UpdateClientsSheet";
import { Client } from "@/app/(admin)/clients/_types/client";
import { ClientHoverCard } from "@/components/common/ClientHoverCard";
import { DocumentDownloadDialog } from "@/components/common/DocumentDownloadDialog";
import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { Badge } from "@/components/ui/badge";
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
import { useDownloadReservationSchedulePDF } from "../../reservations/_hooks/useReservations";
import {
  ContractValidationStatus,
  ReservationStatus,
  ReservationWithPendingPaymentsDto,
} from "../../reservations/_types/reservation";
import {
  ContractValidationStatusLabels,
  PaymentMethodLabels,
  ReservationStatusLabels,
} from "../../reservations/_utils/reservations.utils";

/**
 * Generar las columnas de la tabla de reservas
 * @param handleEditInterface Función para editar una reserva
 * @returns Columnas de la tabla de reservas
 */
export const creditManagementColumns = (): Array<ColumnDef<ReservationWithPendingPaymentsDto>> => [
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
    id: "cliente_info",
    accessorKey: "client.name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cliente / Proyecto" />,
    cell: ({ row }) => {
      const clientName = row.original.client?.name ?? "—";
      const clientId = row.original.client?.id;
      const lotNumber = row.original.lot?.lotNumber;
      const projectName = row.original.project?.name;
      const projectLocation = row.original.project?.location;

      return (
        <ClientHoverCard
          clientId={clientId}
          clientName={clientName}
          iconColor="text-teal-600 dark:text-teal-400"
          iconBgColor="bg-teal-100 dark:bg-teal-900 border-teal-200 dark:border-teal-800"
          additionalInfo={
            <>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Building2 className="h-3 w-3" />
                <span className="truncate">
                  {projectName} - {projectLocation}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">Lote: {lotNumber ?? "—"}</span>
            </>
          }
        />
      );
    },
  },
  {
    id: "siguiente_pago",
    accessorKey: "nextPaymentDueDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Siguiente Pago" />,
    cell: ({ row }) => {
      const nextPaymentDate = row.original.nextPaymentDueDate;
      if (!nextPaymentDate) {
        return (
          <div className="min-w-32">
            <div className="text-sm text-muted-foreground">—</div>
          </div>
        );
      }

      const today = new Date();
      const paymentDate = new Date(nextPaymentDate);
      const isOverdue = paymentDate < today;
      const formattedDate = format(paymentDate, "dd/MM/yyyy", { locale: es });
      const fullDate = format(paymentDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
      const daysUntil = Math.ceil((paymentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      // Encontrar el siguiente pago pendiente
      const nextPendingPayment = row.original.pendingPayments
        ?.filter((payment) => (payment.remainingAmount ?? 0) > 0)
        .sort((a, b) => {
          const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
          const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
          return dateA - dateB;
        })[0];

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={"flex items-center gap-2 min-w-36 cursor-help"}>
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
                  <span className={`font-medium ${isOverdue ? "text-red-600" : "text-green-600"}`}>
                    {formattedDate}
                  </span>
                  {nextPendingPayment && (
                    <span className="text-xs text-muted-foreground">{isOverdue ? "Vencido" : "Próximo"}</span>
                  )}
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
                    Siguiente Pago
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
    id: "monto_cuota",
    accessorKey: "quotation.quotaAmount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Monto Cuota" />,
    cell: ({ row }) => {
      const quotaAmount = row.original.quotation?.quotaAmount;
      const currency = row.original?.currency;
      const symbol = currency === "SOLES" ? "S/" : "$";
      const exchangeRate = row.original?.exchangeRate;
      const formattedAmount = quotaAmount?.toLocaleString("es-PE", { minimumFractionDigits: 2 }) ?? "0.00";

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 min-w-36 cursor-help">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-900 border border-purple-200 dark:border-purple-800">
                  <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {symbol}
                    {formattedAmount}
                  </span>
                  <span className="text-xs text-muted-foreground">Cuota Mensual</span>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm p-0 border-0">
              <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-300" />
                  </div>
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wide">
                    Monto de Cuota
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">Cuota Mensual</p>
                    <p className="font-bold text-2xl text-gray-900 dark:text-gray-100">
                      {symbol}
                      {formattedAmount}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Moneda:</span>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {currency === "SOLES" ? "Soles Peruanos" : "Dólares Americanos"}
                      </span>
                    </div>
                    {exchangeRate && (
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-600 dark:text-gray-400">Tipo de Cambio:</span>
                        <span className="text-sm font-mono text-gray-800 dark:text-gray-200">S/ {exchangeRate}</span>
                      </div>
                    )}
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
    id: "monto",
    accessorKey: "amountPaid",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Inicial" />,
    cell: ({ row }) => {
      const amount = row.getValue("monto") as number;
      const currency = row.original?.currency;
      const symbol = currency === "SOLES" ? "S/" : "$";
      const formattedAmount = amount?.toLocaleString("es-PE", { minimumFractionDigits: 2 }) ?? "0.00";

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 min-w-36 cursor-help">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900 border border-emerald-200 dark:border-emerald-800">
                  <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {symbol}
                    {formattedAmount}
                  </span>
                  <span className="text-xs text-muted-foreground">Pago Inicial</span>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm p-0 border-0">
              <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
                  </div>
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wide">
                    Pago Inicial
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">Monto Inicial</p>
                    <p className="font-bold text-2xl text-gray-900 dark:text-gray-100">
                      {symbol}
                      {formattedAmount}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Moneda:</span>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {currency === "SOLES" ? "Soles Peruanos" : "Dólares Americanos"}
                      </span>
                    </div>
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
    id: "monto_restante",
    accessorKey: "totalRemainingAmount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Monto Restante" />,
    cell: ({ row }) => {
      const remainingAmount = row.original.totalRemainingAmount;
      const currency = row.original?.currency;
      const symbol = currency === "SOLES" ? "S/" : "$";
      const formattedAmount = remainingAmount?.toLocaleString("es-PE", { minimumFractionDigits: 2 }) ?? "0.00";

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 min-w-36 cursor-help">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900 border border-blue-200 dark:border-blue-800">
                  <TrendingDown className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {symbol}
                    {formattedAmount}
                  </span>
                  <span className="text-xs text-muted-foreground">Saldo Pendiente</span>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm p-0 border-0">
              <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <TrendingDown className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                  </div>
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wide">
                    Saldo Pendiente
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">Monto Restante</p>
                    <p className="font-bold text-2xl text-gray-900 dark:text-gray-100">
                      {symbol}
                      {formattedAmount}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Monto total restante por pagar</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Moneda:</span>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {currency === "SOLES" ? "Soles Peruanos" : "Dólares Americanos"}
                      </span>
                    </div>
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
    id: "total_venta",
    accessorKey: "quotation.finalPrice",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Total Venta" />,
    cell: ({ row }) => {
      const finalPrice = row.original.quotation?.finalPrice;
      const currency = row.original?.currency;
      const symbol = currency === "SOLES" ? "S/" : "$";
      const formattedAmount = finalPrice?.toLocaleString("es-PE", { minimumFractionDigits: 2 }) ?? "0.00";

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 min-w-36 cursor-help">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <Receipt className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {symbol}
                    {formattedAmount}
                  </span>
                  <span className="text-xs text-muted-foreground">Precio Total</span>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm p-0 border-0">
              <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <Receipt className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                  </div>
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wide">
                    Precio Total de Venta
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">Precio Final</p>
                    <p className="font-bold text-2xl text-gray-900 dark:text-gray-100">
                      {symbol}
                      {formattedAmount}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Precio final de venta del lote</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Moneda:</span>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {currency === "SOLES" ? "Soles Peruanos" : "Dólares Americanos"}
                      </span>
                    </div>
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
    id: "estado",
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
    cell: ({ row }) => {
      const status = row.getValue("estado") as ReservationStatus;
      const statusConfig = ReservationStatusLabels[status];

      if (!statusConfig) {
        return (
          <div className="flex items-center gap-2 min-w-32">
            <AlertTriangle className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">No registrado</span>
          </div>
        );
      }

      const Icon = statusConfig.icon;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 min-w-36 cursor-help">
                <Badge variant="outline" className={`${statusConfig.className} border-0 px-3 py-1.5 font-medium`}>
                  <Icon className="size-4 flex-shrink-0 mr-1" aria-hidden="true" />
                  {statusConfig.label}
                </Badge>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-md p-0 border-0">
              <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      status === ReservationStatus.ISSUED
                        ? "bg-green-100 dark:bg-green-900"
                        : status === ReservationStatus.CANCELED
                          ? "bg-red-100 dark:bg-red-900"
                          : "bg-gray-100 dark:bg-gray-900"
                    }`}
                  >
                    <Icon className="size-4" />
                  </div>
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wide">
                    Estado de Reserva
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      Estado Actual
                    </span>
                    <Badge variant="outline" className={`${statusConfig.className} font-medium`}>
                      {statusConfig.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {status === ReservationStatus.ISSUED && "La reserva está activa y vigente."}
                    {status === ReservationStatus.CANCELED && "La reserva ha sido cancelada."}
                    {status === ReservationStatus.ANULATED && "La reserva ha sido anulada."}
                  </p>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
    filterFn: (row, id, value) => {
      const rowValue = row.getValue(id);

      if (Array.isArray(value)) {
        if (value.length === 0) {
          return true;
        }
        return value.includes(rowValue);
      }

      return rowValue === value;
    },
    enableColumnFilter: true,
  },
  {
    id: "método pago",
    accessorKey: "paymentMethod",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Método Pago" />,
    cell: ({ row }) => {
      const paymentMethod = row.getValue("método pago") as keyof typeof PaymentMethodLabels;
      const config = PaymentMethodLabels[paymentMethod];

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
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
    filterFn: (row, id, value) => {
      const rowValue = row.getValue(id);

      if (Array.isArray(value)) {
        if (value.length === 0) {
          return true;
        }
        return value.includes(rowValue);
      }

      return rowValue === value;
    },
    enableColumnFilter: true,
  },
  {
    id: "validación contrato",
    accessorKey: "contractValidationStatus",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Validación Contrato" />,
    cell: ({ row }) => {
      const contractValidationStatus = row.getValue("validación contrato") as ContractValidationStatus;
      const contractValidationStatusConfig = ContractValidationStatusLabels[contractValidationStatus];

      if (!contractValidationStatusConfig) {
        return (
          <div className="flex items-center gap-2 min-w-32">
            <AlertTriangle className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">No registrado</span>
          </div>
        );
      }

      const Icon = contractValidationStatusConfig.icon;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 min-w-36 cursor-help">
                <Badge
                  variant="outline"
                  className={`${contractValidationStatusConfig.className} border-0 px-3 py-1.5 font-medium`}
                >
                  <Icon className="size-4 flex-shrink-0 mr-1" aria-hidden="true" />
                  {contractValidationStatusConfig.label}
                </Badge>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-md p-0 border-0">
              <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      contractValidationStatus === ContractValidationStatus.Validated
                        ? "bg-green-100 dark:bg-green-900"
                        : contractValidationStatus === ContractValidationStatus.PendingValidation
                          ? "bg-yellow-100 dark:bg-yellow-900"
                          : "bg-red-100 dark:bg-red-900"
                    }`}
                  >
                    <Icon className="size-4" />
                  </div>
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wide">
                    Estado de Validación
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      Estado Actual
                    </span>
                    <Badge variant="outline" className={`${contractValidationStatusConfig.className} font-medium`}>
                      {contractValidationStatusConfig.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {contractValidationStatus === ContractValidationStatus.Validated &&
                      "El contrato ha sido validado y aprobado."}
                    {contractValidationStatus === ContractValidationStatus.PendingValidation &&
                      "El contrato está pendiente de validación."}
                    {contractValidationStatus === ContractValidationStatus.None && "El contrato ha sido rechazado."}
                  </p>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
    filterFn: (row, id, value) => {
      const rowValue = row.getValue(id);

      if (Array.isArray(value)) {
        if (value.length === 0) {
          return true;
        }
        return value.includes(rowValue);
      }

      return rowValue === value;
    },
    enableColumnFilter: true,
  },
  {
    id: "actions",
    cell: function Cell({ row }) {
      const { id } = row.original;
      const client = row.original.client;
      const router = useRouter();
      const [openEditClientDialog, setOpenEditClientDialog] = useState(false);
      const [openScheduleDocumentDialog, setOpenScheduleDocumentDialog] = useState(false);

      // Hook para descargar cronograma de pagos
      const downloadSchedulePDF = useDownloadReservationSchedulePDF();

      const handleEditReservation = () => {
        if (id) {
          router.push(`/reservations/${id}/edit`);
        }
      };

      const handleEditClient = () => {
        if (client) {
          setOpenEditClientDialog(true);
        }
      };

      const handleViewSchedule = () => {
        if (id) {
          router.push(`/reservations/${id}/payments`);
        }
      };

      return (
        <div>
          {openEditClientDialog && client && (
            <UpdateClientSheet
              open={openEditClientDialog}
              onOpenChange={setOpenEditClientDialog}
              client={client as Client}
            />
          )}
          {openScheduleDocumentDialog && (
            <DocumentDownloadDialog
              documentId={id!}
              isOpen={openScheduleDocumentDialog}
              onOpenChange={setOpenScheduleDocumentDialog}
              title="Cronograma de Pagos"
              pdfAction={downloadSchedulePDF}
              pdfFileName={`cronograma-${id}.pdf`}
            />
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label="Open menu" variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted">
                <Ellipsis className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onSelect={handleEditReservation}>
                Editar Reserva
                <DropdownMenuShortcut>
                  <Edit className="size-4" aria-hidden="true" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleEditClient} disabled={!client}>
                Editar Cliente
                <DropdownMenuShortcut>
                  <User className="size-4" aria-hidden="true" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setOpenScheduleDocumentDialog(true)}>
                Cronograma de Pagos PDF
                <DropdownMenuShortcut>
                  <FileText className="size-4" aria-hidden="true" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleViewSchedule}>
                Ver Cronograma de Pagos
                <DropdownMenuShortcut>
                  <Calendar className="size-4" aria-hidden="true" />
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
