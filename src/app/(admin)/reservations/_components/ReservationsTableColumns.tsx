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
  Ellipsis,
  Eye,
  FileText,
  Hash,
  Pencil,
  RefreshCw,
} from "lucide-react";

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
import { useDownloadReservationPDF, useDownloadReservationSchedulePDF } from "../_hooks/useReservations";
import { ReservationDto, ReservationStatus } from "../_types/reservation";
import { PaymentMethodLabels, ReservationStatusLabels } from "../_utils/reservations.utils";
import { ReservationStatusChangeDialog } from "./ReservationStatusChangeDialog";
import { ReservationViewDialog } from "./ReservationViewDialog";

/**
 * Generar las columnas de la tabla de reservas
 * @param handleEditInterface Función para editar una reserva
 * @returns Columnas de la tabla de reservas
 */
export const reservationsColumns = (handleEditInterface: (id: string) => void): Array<ColumnDef<ReservationDto>> => [
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
          iconColor="text-blue-600 dark:text-blue-400"
          iconBgColor="bg-blue-100 dark:bg-blue-900 border-blue-200 dark:border-blue-800"
        />
      );
    },
    enableColumnFilter: true,
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
    id: "fecha de reserva",
    accessorKey: "reservationDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Fecha Reserva" />,
    cell: ({ row }) => {
      const date = row.getValue("fecha de reserva") as string;
      const formattedDate = date ? format(parseISO(date), "dd/MM/yyyy", { locale: es }) : "—";
      const fullDate = date ? format(parseISO(date), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es }) : "—";

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 min-w-32 cursor-help">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-800">
                  <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
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
                  <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-green-600 dark:text-green-300" />
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
    header: ({ column }) => <DataTableColumnHeader column={column} title="Separación" />,
    cell: ({ row }) => {
      const amount = row.getValue("monto") as number;
      const currency = row.original?.currency;
      const symbol = currency === "SOLES" ? "S/" : "$";
      const formattedAmount = amount?.toLocaleString("es-PE", { minimumFractionDigits: 2 }) || "0.00";
      const exchangeRate = row.original?.exchangeRate;

      // Para el hover card, usar totalAmountRequired si está disponible
      const totalAmountRequired = row.original?.totalAmountRequired;
      const remainingAmount = row.original?.remainingAmount;
      const amountPaid = row.original?.amountPaid;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 min-w-36 cursor-help">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-800">
                  <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {symbol}
                    {formattedAmount}
                  </span>
                  <span className="text-xs text-muted-foreground">Separación</span>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm p-0 border-0">
              <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-green-600 dark:text-green-300" />
                  </div>
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wide">
                    Detalles de Separación
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      Monto de Separación
                    </p>
                    <p className="font-bold text-2xl text-gray-900 dark:text-gray-100">
                      {symbol}
                      {totalAmountRequired?.toLocaleString("es-PE", { minimumFractionDigits: 2 }) ?? formattedAmount}
                    </p>
                  </div>

                  {totalAmountRequired && amountPaid !== undefined && remainingAmount !== undefined && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600 dark:text-gray-400">Pagado:</span>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          {symbol}
                          {amountPaid.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600 dark:text-gray-400">Pendiente:</span>
                        <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                          {symbol}
                          {remainingAmount.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  )}

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
                      : "bg-orange-100 dark:bg-orange-900 border-orange-200 dark:border-orange-800"
                  }`}
                >
                  <Clock
                    className={`h-4 w-4 ${
                      isExpired ? "text-red-600 dark:text-red-400" : "text-orange-600 dark:text-orange-400"
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
                      isExpired ? "bg-red-100 dark:bg-red-900" : "bg-orange-100 dark:bg-orange-900"
                    }`}
                  >
                    <Clock
                      className={`h-4 w-4 ${
                        isExpired ? "text-red-600 dark:text-red-300" : "text-orange-600 dark:text-orange-300"
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
                        <p className="text-xs font-bold text-red-800 dark:text-red-200">RESERVA VENCIDA</p>
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
    id: "estado",
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
    cell: ({ row }) => {
      const reservationStatus = row.getValue("estado") as ReservationStatus;
      const reservationStatusConfig = ReservationStatusLabels[reservationStatus];
      const reservationDate = row.original?.reservationDate;

      if (!reservationStatusConfig) {
        return (
          <div className="flex items-center gap-2 min-w-32">
            <AlertTriangle className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">No registrado</span>
          </div>
        );
      }

      const Icon = reservationStatusConfig.icon;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 min-w-36 cursor-help">
                <Badge
                  variant="outline"
                  className={`${reservationStatusConfig.className} border-0 px-3 py-1.5 font-medium`}
                >
                  <Icon className="size-4 flex-shrink-0 mr-1" aria-hidden="true" />
                  {reservationStatusConfig.label}
                </Badge>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-md p-0 border-0">
              <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      reservationStatus === ReservationStatus.ISSUED
                        ? "bg-green-100 dark:bg-green-900"
                        : reservationStatus === ReservationStatus.CANCELED
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
                    <Badge variant="outline" className={`${reservationStatusConfig.className} font-medium`}>
                      {reservationStatusConfig.label}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {reservationStatus === ReservationStatus.ISSUED && "La reserva está activa y vigente."}
                    {reservationStatus === ReservationStatus.CANCELED && "La reserva ha sido cancelada."}
                    {reservationStatus === ReservationStatus.ANULATED && "La reserva ha sido anulada."}
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
    id: "actions",
    cell: function Cell({ row }) {
      const { id, status } = row.original;
      const [openViewDialog, setOpenViewDialog] = useState(false);
      const [openReservationDocumentDialog, setOpenReservationDocumentDialog] = useState(false);
      const [openScheduleDocumentDialog, setOpenScheduleDocumentDialog] = useState(false);
      const [openStatusChangeDialog, setOpenStatusChangeDialog] = useState(false);
      const navigate = useRouter();

      // Hooks para descargas
      const downloadReservationPDF = useDownloadReservationPDF();
      const downloadSchedulePDF = useDownloadReservationSchedulePDF();

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
          {openStatusChangeDialog && (
            <ReservationStatusChangeDialog
              isOpen={openStatusChangeDialog}
              onClose={() => setOpenStatusChangeDialog(false)}
              currentStatus={status! as ReservationStatus}
              reservationId={id!}
              reservationData={row.original}
            />
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
              <DropdownMenuItem onSelect={() => setOpenStatusChangeDialog(true)}>
                Cambiar Estado
                <DropdownMenuShortcut>
                  <RefreshCw className="size-4" aria-hidden="true" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => id && handleEditInterface(id)}>
                Editar
                <DropdownMenuShortcut>
                  <Pencil className="size-4" aria-hidden="true" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setOpenReservationDocumentDialog(true)}>
                Documento de Separación
                <DropdownMenuShortcut>
                  <Download className="size-4" aria-hidden="true" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setOpenScheduleDocumentDialog(true)}>
                Cronograma de Pagos PDF
                <DropdownMenuShortcut>
                  <FileText className="size-4" aria-hidden="true" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  navigate.push(`/reservations/${id}/payments`);
                }}
              >
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
