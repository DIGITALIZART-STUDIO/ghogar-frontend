"use client";

import { useMemo, useState } from "react";
import { ColumnDef, Table as TableInstance } from "@tanstack/react-table";

import { DataTableExpanded } from "@/components/datatable/data-table-expanded";
import { UsersTableToolbarActions } from "./UserActions";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Ellipsis, RefreshCcwDot, Trash } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { components } from "@/types/api";

type UserGetDTO = components["schemas"]["UserGetDTO"];

export function UsersTable({ data: _data, pageSize, pageIndex, pageCount, totalItems }:
    { data: Array<UserGetDTO>, pageSize: number, pageIndex: number, pageCount: number, totalItems: number }) {
    const columns = useMemo(() => clientsColumns(), []);
    const [data] = useState(_data);
    const [pagination] = useState({
        pageIndex: pageIndex,
        pageSize: pageSize,
        pageCount: pageCount,
        totalItems: totalItems,
    });

    const fetchData = async() => {
        // ...
        // TODO: Actually fetch data for pagination
        console.log("TODO: Actually fetch data...");
    };

    return (
        <DataTableExpanded
            data={data}
            columns={columns}
            toolbarActions={(table: TableInstance<UserGetDTO>) => <UsersTableToolbarActions table={table} />}
            filterPlaceholder="Buscar clientes..."
            serverPagination={{
                pageIndex: pagination.pageIndex,
                pageSize: pagination.pageSize,
                pageCount: pagination.pageCount,
                onPaginationChange: fetchData,
                total: pagination.totalItems,
            }}
            renderExpandedRow={(row) => (
                <p>
                    {row.user.userName}
                </p>
            )}
        />
    );
}

export const clientsColumns = (): Array<ColumnDef<UserGetDTO>> => [
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
        cell: ({ row }) => (
            <div className="min-w-40 truncate capitalize">
                {row.original.user.userName}
            </div>
        ),
    },
    {
        id: "correo",
        accessorKey: "email",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Correo" />,
        cell: ({ row }) => (
            <div>
                {row.original.user.email}
            </div>
        ),
    },
    {
        id: "phone",
        accessorKey: "phone",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Teléfono" />,
        cell: ({ row }) => (
            <div>
                {row.original.user.phoneNumber ?? "-"}
            </div>
        ),
    },
    {
        id: "roles",
        accessorKey: "roles",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Roles" />,
        cell: ({ row }) => (
            <div>
                {row.original.roles.map((role, i) => (
                    <Badge key={i} variant="secondary" className="bg-blue-100 text-blue-500 border-blue-200">
                        {role}
                    </Badge>
                ))}
            </div>
        ),
    },
    {
        id: "estado",
        accessorKey: "isActive",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
        cell: ({ row }) => (
            <div>
                {row.original.user.isActive ? (
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
            const isActive = row.original.user.isActive;
            return (
                <div>
                    <div />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button aria-label="Open menu" variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted">
                                <Ellipsis className="size-4" aria-hidden="true" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem >
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {/*             {isSuperAdmin && ( */}
                            <DropdownMenuItem >
                                Reactivar
                                <DropdownMenuShortcut>
                                    <RefreshCcwDot className="size-4" aria-hidden="true" />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                            {/*       )} */}
                            <DropdownMenuItem
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
