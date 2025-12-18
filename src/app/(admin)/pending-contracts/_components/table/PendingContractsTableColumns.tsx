"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { type ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import {
  AlertTriangle,
  Calendar,
  Clock,
  DollarSign,
  Download,
  Edit,
  Ellipsis,
  Eye,
  FileText,
  Hash,
  RefreshCw,
  User,
} from "lucide-react";

import { UpdateClientSheet } from "@/app/(admin)/clients/_components/update/UpdateClientsSheet";
import { useClientById } from "@/app/(admin)/clients/_hooks/useClients";
import { ClientHoverCard } from "@/components/common/ClientHoverCard";
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
import {
  useDownloadReservationContractDOCX,
  useDownloadReservationContractPDF,
  useDownloadReservationPDF,
} from "../../../reservations/_hooks/useReservations";
import {
  ContractValidationStatus,
  ReservationPendingValidationDto,
  ReservationStatus,
} from "../../../reservations/_types/reservation";
import {
  ContractValidationStatusLabels,
  PaymentMethodLabels,
  ReservationStatusLabels,
} from "../../../reservations/_utils/reservations.utils";
import { DocumentDownloadDialog } from "../document/DocumentDownloadDialog";
import { ReservationViewDialog } from "../reservation/ReservationViewDialog";
import { ToggleValidationStatusDialog } from "../reservation/ToggleValidationStatusDialog";

/**
 * Generar las columnas de la tabla de reservas
 * @param handleEditInterface Función para editar una reserva
 * @returns Columnas de la tabla de reservas
 */
export const pendingContractsColumns = (): Array<ColumnDef<ReservationPendingValidationDto>> => [
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
    id: "cliente",
    accessorKey: "clientName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cliente" />,
    cell: ({ row }) => {
      const clientName = row.getValue("cliente") as string;
      const clientId = row.original.clientId;

      return (
        <ClientHoverCard
          clientId={clientId}
          clientName={clientName}
          iconColor="text-purple-600 dark:text-purple-400"
          iconBgColor="bg-purple-100 dark:bg-purple-900 border-purple-200 dark:border-purple-800"
        />
      );
    },
  },
  {
    id: "cotización",
    accessorKey: "quotationCode",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cotización" />,
    cell: ({ row }) => {
      const code = row.getValue("cotización") as string;
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
                  <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
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
                    <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
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
    id: "monto",
    accessorKey: "amountPaid",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Inicial" />,
    cell: ({ row }) => {
      const amount = row.getValue("monto") as number;
      const currency = row.original?.currency;
      const symbol = currency === "SOLES" ? "S/" : "$";
      const formattedAmount = amount?.toLocaleString("es-PE", { minimumFractionDigits: 2 }) || "0.00";
      const exchangeRate = row.original?.exchangeRate;

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
                  <span className="text-xs text-muted-foreground">Inicial</span>
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
                <div className="space-y-3">
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
    id: "método pago",
    accessorKey: "paymentMethod",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Método Pago" />,
    cell: ({ row }) => {
      const paymentMethod = row.getValue("método pago") as keyof typeof PaymentMethodLabels;
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
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900 border border-cyan-200 dark:border-cyan-800">
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
                  <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center">
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
    id: "vencimiento",
    accessorKey: "expiresAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Vencimiento" />,
    cell: ({ row }) => {
      const expiresAt = row.getValue("vencimiento") as string;
      const today = new Date();
      const expiryDate = new Date(expiresAt);
      const isExpired = expiryDate < today;
      const formattedDate = expiresAt ? format(expiryDate, "dd/MM/yyyy", { locale: es }) : "—";
      const fullDate = expiresAt ? format(expiryDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es }) : "—";
      const daysUntilExpiry = expiresAt
        ? Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={`flex items-center gap-2 min-w-32 cursor-help ${isExpired ? "text-red-600" : ""}`}>
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-lg border ${
                    isExpired
                      ? "bg-red-100 dark:bg-red-900 border-red-200 dark:border-red-800"
                      : "bg-amber-100 dark:bg-amber-900 border-amber-200 dark:border-amber-800"
                  }`}
                >
                  <Clock
                    className={`h-4 w-4 ${
                      isExpired ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400"
                    }`}
                  />
                </div>
                <div className="flex flex-col">
                  <span className={`font-medium ${isExpired ? "text-red-600" : "text-slate-900 dark:text-slate-100"}`}>
                    {formattedDate}
                  </span>
                  <span className={`text-xs ${isExpired ? "text-red-500" : "text-muted-foreground"}`}>
                    {isExpired ? "Vencida" : "Vencimiento"}
                  </span>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm p-0 border-0">
              <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isExpired ? "bg-red-100 dark:bg-red-900" : "bg-amber-100 dark:bg-amber-900"
                    }`}
                  >
                    <Clock
                      className={`h-4 w-4 ${
                        isExpired ? "text-red-600 dark:text-red-300" : "text-amber-600 dark:text-amber-300"
                      }`}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wide">
                    Fecha de Vencimiento
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
                  {isExpired ? (
                    <div className="bg-red-100 dark:bg-red-900 rounded-lg p-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-300" />
                      <div>
                        <p className="text-xs font-bold text-red-800 dark:text-red-200">CONTRATO VENCIDO</p>
                        <p className="text-sm font-medium text-red-900 dark:text-red-100">
                          Vencida hace {Math.abs(daysUntilExpiry)} días
                        </p>
                      </div>
                    </div>
                  ) : (
                    daysUntilExpiry <= 7 && (
                      <div className="bg-amber-100 dark:bg-amber-900 rounded-lg p-2 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-amber-600 dark:text-amber-300" />
                        <div>
                          <p className="text-xs font-bold text-amber-800 dark:text-amber-200">ATENCIÓN REQUERIDA</p>
                          <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                            Vence en {daysUntilExpiry} días
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
    id: "estado_reserva",
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Estado Reserva" />,
    cell: ({ row }) => {
      const status = row.getValue("estado_reserva") as ReservationStatus;
      const statusConfig = ReservationStatusLabels[status];
      const reservationDate = row.original?.reservationDate;

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

                  {reservationDate && (
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                      <p className="text-xs text-gray-600 dark:text-gray-400">Fecha de Reserva</p>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {format(parseISO(reservationDate), "dd/MM/yyyy", { locale: es })}
                      </p>
                    </div>
                  )}
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
    id: "estado_validacion",
    accessorKey: "contractValidationStatus",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Estado Validación" />,
    cell: ({ row }) => {
      const contractValidationStatus = row.getValue("estado_validacion") as ContractValidationStatus;
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
      const { id, clientId } = row.original;
      const router = useRouter();
      const [openViewDialog, setOpenViewDialog] = useState(false);
      const [openReservationDocumentDialog, setOpenReservationDocumentDialog] = useState(false);
      const [openContractDocumentDialog, setOpenContractDocumentDialog] = useState(false);
      const [openToggleValidationDialog, setOpenToggleValidationDialog] = useState(false);
      const [openEditClientDialog, setOpenEditClientDialog] = useState(false);

      // Hook para obtener el cliente cuando se abre el diálogo
      const { data: clientData } = useClientById(openEditClientDialog ? clientId : undefined);

      // Hooks para descargas
      const downloadReservationPDF = useDownloadReservationPDF();
      const downloadContractPDF = useDownloadReservationContractPDF();
      const downloadContractDOCX = useDownloadReservationContractDOCX();

      const handleEditReservation = () => {
        if (id) {
          router.push(`/reservations/${id}/edit`);
        }
      };

      const handleEditClient = () => {
        if (clientId) {
          setOpenEditClientDialog(true);
        }
      };

      return (
        <div>
          {openViewDialog && (
            <ReservationViewDialog open={openViewDialog} onOpenChange={setOpenViewDialog} reservation={row.original} />
          )}
          {openReservationDocumentDialog && (
            <DocumentDownloadDialog
              documentId={id!}
              isOpen={openReservationDocumentDialog}
              onOpenChange={setOpenReservationDocumentDialog}
              title="Documento de Separación"
              pdfAction={downloadReservationPDF}
              pdfFileName={`separacion-${id}.pdf`}
            />
          )}
          {openContractDocumentDialog && (
            <DocumentDownloadDialog
              documentId={id!}
              isOpen={openContractDocumentDialog}
              onOpenChange={setOpenContractDocumentDialog}
              title="Contrato"
              pdfAction={downloadContractPDF}
              wordAction={downloadContractDOCX}
              pdfFileName={`contrato-${id}.pdf`}
              wordFileName={`contrato-${id}.docx`}
            />
          )}
          {openToggleValidationDialog && (
            <ToggleValidationStatusDialog
              reservation={row.original}
              open={openToggleValidationDialog}
              onOpenChange={setOpenToggleValidationDialog}
            />
          )}
          {openEditClientDialog && clientData && (
            <UpdateClientSheet open={openEditClientDialog} onOpenChange={setOpenEditClientDialog} client={clientData} />
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label="Open menu" variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted">
                <Ellipsis className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onSelect={() => setOpenViewDialog(true)}>
                Ver
                <DropdownMenuShortcut>
                  <Eye className="size-4" aria-hidden="true" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleEditReservation}>
                Editar Reserva
                <DropdownMenuShortcut>
                  <Edit className="size-4" aria-hidden="true" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleEditClient}>
                Editar Cliente
                <DropdownMenuShortcut>
                  <User className="size-4" aria-hidden="true" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setOpenToggleValidationDialog(true)}>
                Cambiar estado de validación
                <DropdownMenuShortcut>
                  <RefreshCw className="size-4" aria-hidden="true" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setOpenReservationDocumentDialog(true)}>
                Documento de Separación
                <DropdownMenuShortcut>
                  <Download className="size-4" aria-hidden="true" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setOpenContractDocumentDialog(true)}>
                Contrato
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
