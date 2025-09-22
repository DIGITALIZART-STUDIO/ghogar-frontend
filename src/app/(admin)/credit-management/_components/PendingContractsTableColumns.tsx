"use client";

import React, { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Ellipsis, Eye, Download, RefreshCw, FileText } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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
import { DocumentDownloadDialog } from "./DocumentDownloadDialog";
import { ReservationViewDialog } from "./ReservationViewDialog";
import { ReservationWithPendingPaymentsDto } from "../../reservations/_types/reservation";
import { PaymentMethodLabels } from "../../reservations/_utils/reservations.utils";
import { useDownloadReservationPDF, useDownloadReservationContractPDF, useDownloadReservationContractDOCX } from "../../reservations/_hooks/useReservations";
import { ToggleValidationStatusDialog } from "./ToggleValidationStatusDialog";

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
            const clientName = row.original.client?.name;
            const lotNumber = row.original.lot?.lotNumber;
            const projectName = row.original.project?.name;
            const projectLocation = row.original.project?.location;

            return (
                <div className="min-w-48">
                    <div className="font-medium truncate capitalize text-sm">
                        {clientName ?? "—"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        {projectName} - {projectLocation}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        Lote: {lotNumber ?? "—"}
                    </div>
                </div>
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

            // Encontrar el siguiente pago pendiente
            const nextPendingPayment = row.original.pendingPayments
                ?.filter((payment) => (payment.remainingAmount ?? 0) > 0)
                .sort((a, b) => {
                    const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
                    const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
                    return dateA - dateB;
                })[0];

            return (
                <div className="min-w-32">
                    <div className={`text-sm font-medium ${isOverdue ? "text-red-600" : "text-green-600"}`}>
                        {format(paymentDate, "dd/MM/yyyy", { locale: es })}
                    </div>
                    {nextPendingPayment && (
                        <div className="text-xs text-muted-foreground">
                            {isOverdue ? "Vencido" : "Próximo"}
                        </div>
                    )}
                </div>
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

            return (
                <div className="min-w-28">
                    <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-md font-medium text-sm">
                        {symbol}
                        {" "}
                        {quotaAmount?.toLocaleString("es-PE", { minimumFractionDigits: 2 }) ?? "0.00"}
                    </div>
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
                    {amount?.toLocaleString("es-PE", { minimumFractionDigits: 2 }) ?? "0.00"}
                </div>
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

            return (
                <div className="min-w-32">
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md font-medium text-sm">
                        {symbol}
                        {" "}
                        {remainingAmount?.toLocaleString("es-PE", { minimumFractionDigits: 2 }) ?? "0.00"}
                    </div>
                </div>
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

            return (
                <div className="min-w-32">
                    <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-md font-medium text-sm">
                        {symbol}
                        {" "}
                        {finalPrice?.toLocaleString("es-PE", { minimumFractionDigits: 2 }) ?? "0.00"}
                    </div>
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
