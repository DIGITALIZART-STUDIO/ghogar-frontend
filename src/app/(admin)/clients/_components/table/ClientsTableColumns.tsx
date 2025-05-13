"use client";

import React, { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronRight, Ellipsis, RefreshCcwDot, Trash } from "lucide-react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

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
import { Client, ClientTypes } from "../../_types/client";
import { ClientTypesLabels } from "../../_utils/clients.utils";
import { DeleteClientsDialog } from "../state-management/DeleteClientsDialog";
import { ReactivateClientsDialog } from "../state-management/ReactivateClientsDialog";
import { UpdateClientSheet } from "../update/UpdateClientsSheet";

/**
 * Generar las columnas de la tabla de usuarios
 * @param isSuperAdmin Valor si el usuario es super administrador
 * @returns Columnas de la tabla de usuarios
 */
export const clientsColumns = (): Array<ColumnDef<Client>> => [
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
        id: "nombre",
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nombre" />,
        cell: ({ row }) => <div className="min-w-40 truncate capitalize">
            {row.getValue("nombre")}
        </div>,
    },
    {
        id: "correo",
        accessorKey: "email",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Correo" />,
        cell: ({ row }) => {
            if (!row.getValue("correo")) {
                return <div className="text-muted-foreground text-sm italic">
                    No registrado
                </div>;
            }

            return <div>
                {row.getValue("correo")}
            </div>;
        },
    },
    {
        id: "teléfono",
        accessorKey: "phoneNumber",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Teléfono" />,
        cell: ({ row }) => {
            const phone = row.getValue("teléfono") as string;
            if (!phone) {
                return <div>
                    -
                </div>;
            }

            try {
                // Obtener el país del número de teléfono
                const country = RPNInput.parsePhoneNumber(phone)?.country;

                // Formatear el número para mejor legibilidad
                const formattedPhone = RPNInput.formatPhoneNumberIntl(phone);

                return (
                    <div className="flex items-center gap-2">
                        {country && (
                            <span className="flex h-4 w-6 overflow-hidden rounded-sm">
                                {flags[country] && React.createElement(flags[country], { title: country })}
                            </span>
                        )}
                        <span>
                            {formattedPhone || phone}
                        </span>
                    </div>
                );
            } catch {
                // Si hay algún error al parsear el número, mostramos el número original
                return <div>
                    {phone}
                </div>;
            }
        },
    },

    {
        id: "tipo",
        accessorKey: "type",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tipo" />,
        cell: ({ row }) => {
            const documentType = row.getValue("tipo") as ClientTypes;
            const documentTypeConfig = ClientTypesLabels[documentType];

            if (!documentTypeConfig) {
                return <div>
                    No registrado
                </div>;
            }

            const Icon = documentTypeConfig.icon;

            return (
                <div className="text-xs min-w-32">
                    <Badge variant="outline" className={documentTypeConfig.className}>
                        <Icon className="size-4 flex-shrink-0 mr-1" aria-hidden="true" />
                        {documentTypeConfig.label}
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
        id: "N° Doc.",
        accessorKey: "dni",
        header: ({ column }) => <DataTableColumnHeader column={column} title="N° Doc." />,
        cell: ({ row }) => {
            const dni = row.getValue("N° Doc.") as string;
            const client = row.original;
            let documentNumber = dni;
            let documentType = "DNI";

            // Si no hay DNI pero hay RUC, usamos el RUC
            if (!documentNumber && client.ruc) {
                documentNumber = client.ruc;
                documentType = "RUC";
            }

            if (!documentNumber) {
                return <div className="text-muted-foreground text-sm italic">
                    No disponible
                </div>;
            }

            return (
                <div className="font-mono text-sm py-1 px-2 mx-auto bg-slate-50 rounded-md border border-slate-200 inline-block dark:bg-slate-800 dark:border-slate-700">
                    <span className="text-xs text-muted-foreground mr-1">
                        {documentType}
                        :
                    </span>
                    {documentNumber}
                </div>
            );
        },
    },

    {
        id: "estado",
        accessorKey: "isActive",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
        cell: ({ row }) => (
            <div>
                {row.getValue("estado") ? (
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-500 border-emerald-200">
                        Activo
                    </Badge>
                ) : (
                    <Badge variant="secondary" className="bg-red-100 text-red-500 border-red-200">
                        Inactivo
                    </Badge>
                )}
            </div>
        ),
        filterFn: (row, id, value) => {
            const rowValue = row.getValue(id);

            // Si value es un array, comprobamos si contiene el valor de la fila
            if (Array.isArray(value)) {
                // Si el array está vacío, no filtramos
                if (value.length === 0) {
                    return true;
                }

                // Convertimos cada elemento del array según sea necesario
                return value.some((v) => {
                    // Si es string "true"/"false", convertimos a booleano
                    if (typeof v === "string") {
                        return v === String(rowValue);
                    }
                    // Si ya es booleano, comparamos directamente
                    return v === rowValue;
                });
            }

            // Si es un valor único, hacemos la comparación directa
            return rowValue === value;
        },
        enableColumnFilter: true,
    },

    {
        id: "expand", // Nueva columna para expansión
        header: () => null, // No mostrar un título en el header
        cell: ({ row }) => (
            <Button
                onClick={() => row.toggleExpanded()} // Alternar la expansión de la fila
                aria-label="Expand row"
                className="flex items-center justify-center p-2"
                variant={"ghost"}
            >
                {row.getIsExpanded() ? (
                    <ChevronDown className="size-4" /> // Ícono cuando la fila está expandida
                ) : (
                    <ChevronRight className="size-4" /> // Ícono cuando la fila está colapsada
                )}
            </Button>
        ),
        enableSorting: false,
        enableHiding: false,
        enablePinning: true,
    },

    {
        id: "actions",
        cell: function Cell({ row }) {
            const [showDeleteDialog, setShowDeleteDialog] = useState(false);
            const [showReactivateDialog, setShowReactivateDialog] = useState(false);
            const [showEditDialog, setShowEditDialog] = useState(false);

            const { isActive } = row.original;
            return (
                <div>
                    <div>
                        {showEditDialog && (
                            <UpdateClientSheet open={showEditDialog} onOpenChange={setShowEditDialog} client={row?.original} />
                        )}

                        {showDeleteDialog && (
                            <DeleteClientsDialog
                                open={showDeleteDialog}
                                onOpenChange={setShowDeleteDialog}
                                clients={[row?.original]}
                                showTrigger={false}
                                onSuccess={() => {
                                    row.toggleSelected(false);
                                }}
                            />
                        )}

                        {showReactivateDialog && (
                            <ReactivateClientsDialog
                                open={showReactivateDialog}
                                onOpenChange={setShowReactivateDialog}
                                clients={[row?.original]}
                                showTrigger={false}
                                onSuccess={() => {
                                    row.toggleSelected(false);
                                }}
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
                            <DropdownMenuItem onSelect={() => setShowEditDialog(true)} disabled={!isActive}>
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {/*             {isSuperAdmin && ( */}
                            <DropdownMenuItem onSelect={() => setShowReactivateDialog(true)} disabled={isActive}>
                                Reactivar
                                <DropdownMenuShortcut>
                                    <RefreshCcwDot className="size-4" aria-hidden="true" />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                            {/*       )} */}
                            <DropdownMenuItem
                                onSelect={() => setShowDeleteDialog(true)}
                                disabled={!isActive}
                                className="text-red-700"
                            >
                                Eliminar
                                <DropdownMenuShortcut>
                                    <Trash className="size-4 text-red-700" aria-hidden="true" />
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
