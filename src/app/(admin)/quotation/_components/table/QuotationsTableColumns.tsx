"use client";

import React, { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import {
  AlertTriangle,
  ArrowRightLeft,
  Building2,
  Clock,
  DollarSign,
  Download,
  Ellipsis,
  Eye,
  Hash,
  MapPin,
  Pencil,
  Ruler,
} from "lucide-react";

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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { QuotationStatus, SummaryQuotation } from "../../_types/quotation";
import { getStatusDetails } from "../../_utils/quotations.filter.utils";
import { formatCurrency, formatDate, getDaysUntilExpiry, isQuotationExpiringSoon } from "../../_utils/quotations.utils";
import { QuotationDownloadDialog } from "../managements-status/QuotationDownloadDialog";
import { QuotationStatusChangeDialog } from "../managements-status/QuotationStatusChangeDialog";
import { QuotationViewDialog } from "../view/QuotationViewDialog";

/**
 * Generar las columnas de la tabla de cotizaciones
 * @param handleEditInterface Función para manejar la edición
 * @returns Columnas de la tabla de cotizaciones
 */
export const quotationsColumns = (handleEditInterface: (id: string) => void): Array<ColumnDef<SummaryQuotation>> => [
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
    accessorKey: "code",
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
    id: "cliente",
    accessorKey: "clientName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cliente" />,
    cell: ({ row }) => {
      const clientName = row.getValue("cliente") as string;
      const clientId = row.original?.clientId;
      const type = row.original?.clientIdentificationType;
      const clientIdentification = row.original?.clientIdentification;

      return (
        <ClientHoverCard
          clientId={clientId}
          clientName={clientName}
          iconColor="text-blue-600 dark:text-blue-400"
          iconBgColor="bg-blue-100 dark:bg-blue-900 border-blue-200 dark:border-blue-800"
          additionalInfo={
            clientIdentification ? (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono">{type}</span>
                <span className="font-mono">{clientIdentification}</span>
              </div>
            ) : undefined
          }
        />
      );
    },
    enableColumnFilter: true,
  },
  {
    id: "proyecto",
    accessorKey: "projectName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Proyecto" />,
    cell: ({ row }) => {
      const projectName = row.getValue("proyecto") as string;
      const blockName = row.original?.blockName;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-3 min-w-44 cursor-help">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900 border border-emerald-200 dark:border-emerald-800">
                  <Building2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-medium text-slate-900 dark:text-slate-100 truncate capitalize">
                    {projectName}
                  </span>
                  {blockName && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Manzana {blockName}
                    </span>
                  )}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm p-0 border-0">
              <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
                  </div>
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wide">
                    Proyecto Inmobiliario
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      Nombre del Proyecto
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 capitalize">{projectName}</p>
                  </div>
                  {blockName && (
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                      <MapPin className="h-3 w-3 text-gray-600 dark:text-gray-300" />
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Ubicación</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Manzana {blockName}</p>
                      </div>
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
    id: "lote",
    accessorKey: "lotNumber",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Lote" />,
    cell: ({ row }) => {
      const lotNumber = row.getValue("lote") as string;
      const area = row.original?.areaAtQuotation;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 min-w-32 cursor-help">
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-orange-100 dark:bg-orange-900 border border-orange-200 dark:border-orange-800">
                  <MapPin className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-slate-900 dark:text-slate-100">Lote {lotNumber}</span>
                  {area && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Ruler className="h-3 w-3" />
                      {area} m²
                    </span>
                  )}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm p-0 border-0">
              <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-orange-600 dark:text-orange-300" />
                  </div>
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wide">
                    Información del Lote
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">Número de Lote</p>
                    <p className="font-bold text-xl text-gray-900 dark:text-gray-100">{lotNumber}</p>
                  </div>
                  {area && (
                    <div className="flex items-center gap-3 pt-2 border-t border-gray-200 dark:border-gray-600">
                      <div className="w-6 h-6 rounded bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                        <Ruler className="h-3 w-3 text-orange-600 dark:text-orange-300" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Área Total</p>
                        <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{area} m²</p>
                      </div>
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
    id: "precios",
    accessorKey: "finalPrice",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Precio" />,
    cell: ({ row }) => {
      const finalPrice = row.original?.finalPrice;
      const totalPrice = row.original?.totalPrice;
      const currency = row.original?.currency || "PEN";
      const hasDiscount = totalPrice && finalPrice && totalPrice !== finalPrice;

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
                    {formatCurrency(finalPrice || 0, currency)}
                  </span>
                  {hasDiscount && (
                    <span className="text-xs text-muted-foreground line-through">
                      {formatCurrency(totalPrice || 0, currency)}
                    </span>
                  )}
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
                    Detalles de Precio
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">Precio Final</p>
                    <p className="font-bold text-lg text-gray-900 dark:text-gray-100">
                      {formatCurrency(finalPrice || 0, currency)}
                    </p>
                  </div>
                  {totalPrice && totalPrice !== finalPrice && (
                    <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600 dark:text-gray-400">Precio Original:</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 line-through">
                          {formatCurrency(totalPrice, currency)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600 dark:text-gray-400">Descuento:</span>
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                          -{formatCurrency((totalPrice || 0) - (finalPrice || 0), currency)}
                        </span>
                      </div>
                      <div className="bg-green-100 dark:bg-green-900 rounded px-2 py-1 text-center">
                        <span className="text-xs font-bold text-green-800 dark:text-green-200">
                          Ahorro: {Math.round(((totalPrice - (finalPrice || 0)) / totalPrice) * 100)}%
                        </span>
                      </div>
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
    id: "estado",
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
    cell: ({ row }) => {
      const quotationStatus = row.getValue("estado") as QuotationStatus;
      const validUntil = row.original?.validUntil;
      const quotationDate = row.original?.quotationDate;
      const isExpiringSoon = isQuotationExpiringSoon(validUntil);
      const statusDetails = getStatusDetails(quotationStatus);

      if (!quotationStatus) {
        return (
          <div className="flex items-center gap-2 min-w-32">
            <AlertTriangle className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">No registrado</span>
          </div>
        );
      }

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 min-w-36 cursor-help">
                <Badge variant="outline" className={`${statusDetails.color} border-0 px-3 py-1.5 font-medium`}>
                  {statusDetails.icon}
                  <span className="ml-2">{statusDetails.label}</span>
                </Badge>
                {isExpiringSoon && quotationStatus === QuotationStatus.ISSUED && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-amber-500 dark:text-amber-400" />
                    <span className="text-xs text-amber-600 dark:text-amber-500 font-medium">Vence pronto</span>
                  </div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-md p-0 border-0">
              <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      quotationStatus === QuotationStatus.ACCEPTED
                        ? "bg-green-100 dark:bg-green-900"
                        : quotationStatus === QuotationStatus.CANCELED
                          ? "bg-red-100 dark:bg-red-900"
                          : "bg-blue-100 dark:bg-blue-900"
                    }`}
                  >
                    {statusDetails.icon}
                  </div>
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wide">
                    Estado de Cotización
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      Estado Actual
                    </span>
                    <Badge className={`${statusDetails.color} border-0 font-medium`}>{statusDetails.label}</Badge>
                  </div>

                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {statusDetails.description}
                  </p>

                  {(quotationDate || validUntil) && (
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200 dark:border-gray-600">
                      {quotationDate && (
                        <div className="text-center">
                          <p className="text-xs text-gray-600 dark:text-gray-400">Emitida</p>
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            {formatDate(quotationDate)}
                          </p>
                        </div>
                      )}
                      {validUntil && (
                        <div className="text-center">
                          <p className="text-xs text-gray-600 dark:text-gray-400">Válida hasta</p>
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            {formatDate(validUntil)}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {isExpiringSoon && (
                    <div className="bg-amber-100 dark:bg-amber-900 rounded-lg p-2 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-600 dark:text-amber-300" />
                      <div>
                        <p className="text-xs font-bold text-amber-800 dark:text-amber-200">ATENCIÓN REQUERIDA</p>
                        <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                          Vence en {getDaysUntilExpiry(validUntil)} días
                        </p>
                      </div>
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
    header: () => <span className="sr-only">Acciones</span>,
    cell: function Cell({ row }) {
      const { id, status, code } = row.original;
      const [openViewDialog, setOpenViewDialog] = useState(false);
      const [openDownloadDialog, setOpenDownloadDialog] = useState(false);
      const [openChangeStatusDialog, setOpenChangeStatusDialog] = useState(false);

      const handleCloseStatusChange = () => {
        setOpenChangeStatusDialog(false);
      };

      return (
        <div className="flex items-center justify-end">
          {openViewDialog && (
            <QuotationViewDialog open={openViewDialog} onOpenChange={setOpenViewDialog} quotation={row.original} />
          )}
          {openChangeStatusDialog && (
            <QuotationStatusChangeDialog
              isOpen={openChangeStatusDialog}
              onClose={handleCloseStatusChange}
              currentStatus={status as QuotationStatus}
              quotationCode={code as string}
              quotationId={id as string}
            />
          )}
          {openDownloadDialog && (
            <QuotationDownloadDialog
              quotationId={row.original.id!}
              isOpen={openDownloadDialog}
              onOpenChange={setOpenDownloadDialog}
            />
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Abrir menú de acciones"
                variant="ghost"
                className="flex size-9 p-0 data-[state=open]:bg-muted hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Ellipsis className="size-4 text-slate-600 dark:text-slate-400" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                onClick={() => setOpenViewDialog(true)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Eye className="size-4" />
                <span>Ver detalles</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => handleEditInterface(id as string)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Pencil className="size-4" />
                <span>Editar cotización</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => setOpenDownloadDialog(true)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Download className="size-4" />
                <span>Descargar PDF</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setOpenChangeStatusDialog(true)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <ArrowRightLeft className="size-4" />
                <span>Cambiar estado</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
    enablePinning: true,
  },
];
