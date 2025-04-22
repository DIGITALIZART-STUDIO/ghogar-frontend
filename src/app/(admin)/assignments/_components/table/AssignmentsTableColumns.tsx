"use client";

import React, { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { ChevronDown, ChevronRight, Ellipsis, NotebookPen } from "lucide-react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

import { Lead, LeadStatus } from "@/app/(admin)/leads/_types/lead";
import { LeadStatusLabels } from "@/app/(admin)/leads/_utils/leads.utils";
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
import { CreateLeadTasksDialog } from "../../[id]/tasks/_components/create/CreateLeadTasksDialog";

/**
 * Generar las columnas de la tabla de usuarios
 * @param isSuperAdmin Valor si el usuario es super administrador
 * @returns Columnas de la tabla de usuarios
 */
export const assignmentsColumns = (handleTaskasInterface: (id: string) => void): Array<ColumnDef<Lead>> => [
    {
        id: "select",
        header: ({ table }) => (
            <div className="px-2">
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() ?? (table.getIsSomePageRowsSelected() && "indeterminate")}
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
        id: "Cliente",
        accessorKey: "client.name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Cliente" />,
        cell: ({ row }) => {
            const client = row.original?.client;
            const identifier = client?.dni ? `DNI: ${client?.dni}` : client?.ruc ? `RUC: ${client?.ruc}` : "";

            return (
                <div className="min-w-32">
                    <div className="truncate capitalize">
                        {row.getValue("Cliente")}
                    </div>
                    {identifier && <div className="text-xs text-muted-foreground">
                        {identifier}
                    </div>}
                </div>
            );
        },
        // Mejorar la función de filtrado para DNI o RUC
        filterFn: (row, value) => {
            const client = row.original?.client;

            if (!client) {
                return false;
            }

            // Verificar si el filtro coincide con el DNI o RUC
            const matchesDNI = client.dni && client.dni === value;
            const matchesRUC = client.ruc && client.ruc === value;

            if (Array.isArray(value)) {
                if (value.length === 0) {
                    return true; // Si no hay filtros seleccionados, mostrar todos
                }

                // Verificar si el DNI o RUC están en el array de valores de filtro
                return (client.dni && value.includes(client.dni)) ?? (client.ruc && value.includes(client.ruc));
            }

            return matchesDNI ?? matchesRUC;
        },
        enableColumnFilter: true,
    },

    {
        id: "teléfono",
        accessorKey: "client.phoneNumber",
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
                            {formattedPhone ?? phone}
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
        id: "seguimiento",
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Seguimiento" />,
        cell: ({ row }) => {
            const leadStatus = row.getValue("seguimiento") as LeadStatus;
            const leadStatusConfig = LeadStatusLabels[leadStatus];

            if (!leadStatusConfig) {
                return <div>
                    No registrado
                </div>;
            }

            const Icon = leadStatusConfig.icon;

            return (
                <div className="text-xs min-w-32">
                    <Badge variant="outline" className={leadStatusConfig.className}>
                        <Icon className="size-4 flex-shrink-0 mr-1" aria-hidden="true" />
                        {leadStatusConfig.label}
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
        id: "procedencia",
        accessorKey: "procedency",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Procedencia" />,
        cell: ({ row }) => <div className="min-w-40 truncate capitalize">
            {row.getValue("procedencia")}
        </div>,
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
            const [createTaskDialog, setCreateTaskDialog] = useState(false);
            return (
                <div>
                    {createTaskDialog && (
                        <CreateLeadTasksDialog
                            open={createTaskDialog}
                            setOpen={setCreateTaskDialog}
                            assignedToId={row.original?.assignedToId ?? ""}
                            leadId={row.original?.id ?? ""}
                        />
                    )}
                    <div />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button aria-label="Open menu" variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted">
                                <Ellipsis className="size-4" aria-hidden="true" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onSelect={() => handleTaskasInterface(row.original.id)}>
                                Mis tareas
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={() => setCreateTaskDialog(true)}>
                                Crear tarea
                                <DropdownMenuShortcut>
                                    <NotebookPen className="size-4" aria-hidden="true" />
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
