"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronRight, Calendar, DollarSign, Ellipsis, Plus, ListChecks, List } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ReservationWithPaymentsDto } from "@/app/(admin)/reservations/_types/reservation";
import { PaymentMethodLabels } from "@/app/(admin)/reservations/_utils/reservations.utils";
import { useState } from "react";
import { CreatePaymentTransactionDialog } from "../create/CreatePaymentsTransactionDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const getCurrencyIcon = (currency: string) => (currency === "DOLARES" ? "$" : "S/");

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
                <div className="flex items-center gap-2">

                    <span className="font-mono text-sm font-medium">{code}</span>
                </div>
            );
        },
    },
    {
        id: "cliente",
        accessorKey: "clientName",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Cliente" />,
        cell: ({ row }) => {
            const name = row.getValue("cliente") as string;
            return (
                <div className="min-w-40">
                    <div className="font-medium">{name}</div>
                    <div className="text-sm text-muted-foreground">{row.original.bankName}</div>
                </div>
            );
        },
    },
    {
        id: "fecha proximo pago",
        accessorKey: "nextPaymentDueDate",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Fecha Próximo Pago" />,
        cell: ({ row }) => {
            const date = row.getValue("fecha proximo pago") as string;
            return (
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{format(new Date(date), "dd MMM yyyy", { locale: es })}</span>
                </div>
            );
        },
    },
    {
        id: "Monto Pagado",
        accessorKey: "amountPaid",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Monto Pagado" />,
        cell: ({ row }) => {
            const amount = row.getValue("Monto Pagado") as number;
            const currency = row.original.currency;
            const symbol = getCurrencyIcon(currency ?? "DOLARES");

            return (
                <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                    <span className="font-medium">
                        {symbol}
                        {amount.toLocaleString()}
                    </span>
                </div>
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
    },
    {
        id: "pagos realizados",
        accessorKey: "paymentCount",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Pagos Realizados" />,
        cell: ({ row }) => {
            // paymentCount debe estar en el DTO, si no, puedes calcularlo con row.original.payments?.length
            const count = row.getValue("pagos realizados") as number | undefined;
            return (
                <div className="min-w-24 text-xs font-semibold text-emerald-700 flex items-center gap-2">
                    {count}
                    <span className="ml-1 text-xs text-gray-500">pagos</span>
                </div>
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
            const [createDialogOpen, setCreateDialogOpen] = useState(false);

            return (
                <div>
                    <div>
                        {createDialogOpen && (
                            <CreatePaymentTransactionDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} reservation={row.original} />
                        )}
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button aria-label="Open menu" variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted">
                                <Ellipsis className="size-4" aria-hidden="true" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">

                            <DropdownMenuItem onSelect={() => setCreateDialogOpen(true)}>
                                Crear Transacción
                                <DropdownMenuShortcut>
                                    <Plus className="size-4" aria-hidden="true" />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onSelect={() => {
                                    // FIXME:
                                }}
                            >
                                Cronograma de Pagos
                                <DropdownMenuShortcut>
                                    <List className="size-4" aria-hidden="true" />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onSelect={() => {
                                    // FIXME:
                                }}
                            >
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
