"use client";

import React, { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Ellipsis, Pencil, Eye, Download } from "lucide-react";
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
import { ReservationDto, ReservationStatus } from "../_types/reservation";
import { ReservationStatusLabels, PaymentMethodLabels } from "../_utils/reservations.utils";
import { ReservationDownloadDialog } from "./ReservationDownloadDialog";
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
        cell: ({ row }) => (
            <div className="min-w-32">
                <div className="truncate capitalize">
                    {row.getValue("cliente")}
                </div>
            </div>
        ),
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
        header: ({ column }) => <DataTableColumnHeader column={column} title="Monto Pagado" />,
        cell: ({ row }) => {
            const amount = row.getValue("monto") as number;
            const currency = row.original?.currency;
            const symbol = currency === "SOLES" ? "S/" : "$";

            return (
                <div className="min-w-24 text-right font-medium">
                    {symbol}
                    {" "}
                    {amount?.toLocaleString("es-PE", { minimumFractionDigits: 2 }) || "0.00"}
                </div>
            );
        },
    },
    {
        id: "método_pago",
        accessorKey: "paymentMethod",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Método Pago" />,
        cell: ({ row }) => {
            const paymentMethod = row.getValue("método_pago") as keyof typeof PaymentMethodLabels;
            return (
                <div className="min-w-32 text-sm">
                    {PaymentMethodLabels[paymentMethod] || paymentMethod}
                </div>
            );
        },
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
        id: "estado",
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
        cell: ({ row }) => {
            const reservationStatus = row.getValue("estado") as ReservationStatus;
            const reservationStatusConfig = ReservationStatusLabels[reservationStatus];

            if (!reservationStatusConfig) {
                return <div>
                    No registrado
                </div>;
            }

            const Icon = reservationStatusConfig.icon;

            return (
                <div className="text-xs min-w-24">
                    <Badge variant="outline" className={reservationStatusConfig.className}>
                        <Icon className="size-4 flex-shrink-0 mr-1" aria-hidden="true" />
                        {reservationStatusConfig.label}
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
            const [openDownloadDialog, setOpenDownloadDialog] = useState(false);

            return (
                <div>
                    {openViewDialog && (
                        <ReservationViewDialog
                            open={openViewDialog}
                            onOpenChange={setOpenViewDialog}
                            reservation={row.original}
                        />
                    )}
                    {openDownloadDialog && (
                        <ReservationDownloadDialog
                            reservationId={id!}
                            isOpen={openDownloadDialog}
                            onOpenChange={setOpenDownloadDialog}
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
                            <DropdownMenuItem onSelect={() => id && handleEditInterface(id)}>
                                Editar
                                <DropdownMenuShortcut>
                                    <Pencil className="size-4" aria-hidden="true" />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => setOpenDownloadDialog(true)}>
                                Descargar Documento
                                <DropdownMenuShortcut>
                                    <Download className="size-4" aria-hidden="true" />
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
