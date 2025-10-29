"use client";

import React, { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Ellipsis, Eye, Download, RefreshCw, FileText } from "lucide-react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

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
import { DocumentDownloadDialog } from "./DocumentDownloadDialog";
import { ReservationViewDialog } from "./ReservationViewDialog";
import { ContractValidationStatus, ReservationStatus, ReservationPendingValidationDto } from "../../reservations/_types/reservation";
import { ContractValidationStatusLabels, PaymentMethodLabels, ReservationStatusLabels } from "../../reservations/_utils/reservations.utils";
import { useDownloadReservationPDF, useDownloadReservationContractPDF, useDownloadReservationContractDOCX } from "../../reservations/_hooks/useReservations";
import { ToggleValidationStatusDialog } from "./ToggleValidationStatusDialog";

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
            return (
                <div className="min-w-32">
                    <div className="truncate capitalize">{clientName}</div>
                </div>
            );
        },
    },
    {
        id: "cotización",
        accessorKey: "quotationCode",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Cotización" />,
        cell: ({ row }) => (
            <div className="min-w-24 truncate font-mono text-sm">
                {row.getValue("cotización")}
            </div>
        ),
    },
    {
        id: "fecha_reserva",
        accessorKey: "reservationDate",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Fecha Reserva" />,
        cell: ({ row }) => {
            const date = row.getValue("fecha_reserva") as string;
            return (
                <div className="min-w-28">
                    {date ? format(parseISO(date), "dd/MM/yyyy", { locale: es }) : "—"}
                </div>
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

            return (
                <div className="min-w-24 font-medium">
                    {symbol}
                    {" "}
                    {amount?.toLocaleString("es-PE", { minimumFractionDigits: 2 }) || "0.00"}
                </div>
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

            if (!config) {
                return <div className="min-w-32 text-sm">No especificado</div>;
            }

            const Icon = config.icon;

            return (
                <div className="min-w-32 text-sm flex items-center gap-2">
                    <Icon className={`${config.className} w-4 h-4`} />
                    <span className={config.className}>{config.label}</span>
                </div>
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

            return (
                <div className={`min-w-28 ${isExpired ? "text-red-600" : ""}`}>
                    {expiresAt ? format(expiryDate, "dd/MM/yyyy", { locale: es }) : "—"}
                    {isExpired && (
                        <div className="text-xs text-red-500">
                            Vencida
                        </div>
                    )}
                </div>
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

            if (!statusConfig) {
                return <div className="min-w-24 text-sm">No especificado</div>;
            }

            const Icon = statusConfig.icon;

            return (
                <div className="text-xs min-w-24">
                    <Badge variant="outline" className={statusConfig.className}>
                        <Icon className="size-4 flex-shrink-0 mr-1" aria-hidden="true" />
                        {statusConfig.label}
                    </Badge>
                </div>
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
                return <div className="min-w-24 text-sm">No registrado</div>;
            }

            const Icon = contractValidationStatusConfig.icon;

            return (
                <div className="text-xs min-w-24">
                    <Badge variant="outline" className={contractValidationStatusConfig.className}>
                        <Icon className="size-4 flex-shrink-0 mr-1" aria-hidden="true" />
                        {contractValidationStatusConfig.label}
                    </Badge>
                </div>
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
            const [openViewDialog, setOpenViewDialog] = useState(false);
            const [openReservationDocumentDialog, setOpenReservationDocumentDialog] = useState(false);
            const [openContractDocumentDialog, setOpenContractDocumentDialog] = useState(false);
            // Nuevo estado para el toggle
            const [openToggleValidationDialog, setOpenToggleValidationDialog] = useState(false);

            // Hooks para descargas
            const downloadReservationPDF = useDownloadReservationPDF();
            const downloadContractPDF = useDownloadReservationContractPDF();
            const downloadContractDOCX = useDownloadReservationContractDOCX();

            return (
                <div>
                    {openViewDialog && (
                        <ReservationViewDialog
                            open={openViewDialog}
                            onOpenChange={setOpenViewDialog}
                            reservation={row.original}
                        />
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
                    {/* Nuevo: Diálogo para toggle de validación */}
                    {openToggleValidationDialog && (
                        <ToggleValidationStatusDialog
                            reservation={row.original}
                            open={openToggleValidationDialog}
                            onOpenChange={setOpenToggleValidationDialog}
                        />
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                aria-label="Open menu"
                                variant="ghost"
                                className="flex size-8 p-0 data-[state=open]:bg-muted"
                            >
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
                            {/* Nuevo: opción para cambiar estado de validación */}
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
