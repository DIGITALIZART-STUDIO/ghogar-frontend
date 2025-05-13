"use client";

import React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Ellipsis, Pencil } from "lucide-react";

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
import { QuotationStatus, SummaryQuotation } from "../../_types/quotation";
import { QuotationStatusLabels } from "../../_utils/quotations.utils";
/* import { QuotationViewDialog } from "../view/QuotationViewDialog"; */

/**
 * Generar las columnas de la tabla de usuarios
 * @param isSuperAdmin Valor si el usuario es super administrador
 * @returns Columnas de la tabla de usuarios
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
        cell: ({ row }) => <div className="min-w-40 truncate capitalize">
            {row.getValue("código")}
        </div>,
    },

    {
        id: "lead",
        accessorKey: "clientName",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Cliente" />,
        cell: ({ row }) => {
            const type = row.original?.clientIdentificationType;
            const clientIdentification = row.original?.clientIdentification;
            const identifier =
        type === "DNI" ? `DNI: ${clientIdentification}` : type === "RUC" ? `RUC: ${clientIdentification}` : "";

            return (
                <div className="min-w-32">
                    <div className="truncate capitalize">
                        {row.getValue("lead")}
                    </div>
                    {identifier && <div className="text-xs text-muted-foreground">
                        {identifier}
                    </div>}
                </div>
            );
        },
        // Mejorar la función de filtrado para DNI o RUC
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        filterFn: (row, value) => {
            const clientIdentification = row.original?.clientIdentification;

            if (!clientIdentification) {
                return false;
            }

            // Verificar si el filtro coincide con el DNI o RUC
            const matchesDNI = clientIdentification && clientIdentification === value;
            const matchesRUC = clientIdentification && clientIdentification === value;

            if (Array.isArray(value)) {
                if (value.length === 0) {
                    return true; // Si no hay filtros seleccionados, mostrar todos
                }

                // Verificar si el DNI o RUC están en el array de valores de filtro
                return (
                    (clientIdentification && value.includes(clientIdentification)) ??
          (clientIdentification && value.includes(clientIdentification))
                );
            }

            return matchesDNI ?? matchesRUC;
        },
        enableColumnFilter: true,
    },

    {
        id: "proyecto",
        accessorKey: "projectName",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Proyecto" />,
        cell: ({ row }) => <div className="min-w-40 truncate capitalize">
            {row.getValue("proyecto")}
        </div>,
    },

    {
        id: "lote",
        accessorKey: "lotNumber",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Lote" />,
        cell: ({ row }) => <div className="min-w-40 truncate capitalize">
            {row.getValue("lote")}
        </div>,
    },

    {
        id: "área",
        accessorKey: "area",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Área" />,
        cell: ({ row }) => <div className="min-w-40 truncate">
            {row.getValue("área")}
            {" "}
            m²
        </div>,
    },

    {
        id: "estado",
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
        cell: ({ row }) => {
            const quotationStatus = row.getValue("estado") as QuotationStatus;
            const quotationStatusConfig = QuotationStatusLabels[quotationStatus];

            if (!quotationStatusConfig) {
                return <div>
                    No registrado
                </div>;
            }

            const Icon = quotationStatusConfig.icon;

            return (
                <div className="text-xs min-w-32">
                    <Badge variant="outline" className={quotationStatusConfig.className}>
                        <Icon className="size-4 flex-shrink-0 mr-1" aria-hidden="true" />
                        {quotationStatusConfig.label}
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
            /*       const [openViewDialog, setOpenViewDialog] = useState(false);
      const onClose = () => {
        setOpenViewDialog(false);
      }; */
            return (
                <div>
                    {/* <QuotationViewDialog isOpen={openViewDialog} onClose={onClose} data={row.original} /> */}
                    <div />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button aria-label="Open menu" variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted">
                                <Ellipsis className="size-4" aria-hidden="true" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onSelect={() => id && handleEditInterface(id)}>
                                Ver
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={() => id && handleEditInterface(id)}>
                                Editar
                                <DropdownMenuShortcut>
                                    <Pencil className="size-4" aria-hidden="true" />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                            {/*             {isSuperAdmin && ( */}
                            {/*               <DropdownMenuItem onSelect={() => setShowReactivateDialog(true)} disabled={isActive}>
                Reactivar
                <DropdownMenuShortcut>
                  <RefreshCcwDot className="size-4" aria-hidden="true" />
                </DropdownMenuShortcut>
              </DropdownMenuItem> */}
                            {/*       )} */}
                            {/*              <DropdownMenuItem
                onSelect={() => setShowDeleteDialog(true)}
                disabled={!isActive}
                className="text-red-700"
              >
                Eliminar
                <DropdownMenuShortcut>
                  <Trash className="size-4 text-red-700" aria-hidden="true" />
                </DropdownMenuShortcut>
              </DropdownMenuItem> */}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
        enablePinning: true,
    },
];
