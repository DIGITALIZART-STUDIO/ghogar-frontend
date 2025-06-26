"use client";

import React, { useMemo, useState } from "react";
import { ColumnDef, Table as TableInstance } from "@tanstack/react-table";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

import { DataTableExpanded } from "@/components/datatable/data-table-expanded";
import { UsersTableToolbarActions } from "./UserActions";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ellipsis, RefreshCcwDot, Trash } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { backend } from "@/types/backend2";
import ErrorGeneral from "@/components/errors/general-error";
import { UserGetDTO } from "../_types/user";
import { UpdateUsersSheet } from "./update/UpdateUsersSheet";

export function UsersTable() {
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const { data, error, isFetching } = backend.useQuery("get", "/api/Users/all", {
        params: {
            query: {
                page: pagination.pageIndex + 1,
                pageSize: pagination.pageSize,
            },
        },
    }, {
        staleTime: 60000,
    });

    // Get pagination info from API response
    const pageCount = data?.totalPages ?? 0;
    const totalItems = data?.totalCount ?? 0;

    const columns = useMemo(() => clientsColumns(), []);

    const serverPaginationConfig = useMemo(() => ({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        pageCount: pageCount,
        onPaginationChange: async(pageIndex: number, pageSize: number) => {
            setPagination({ pageIndex, pageSize });
        },
        total: totalItems,
    }), [pagination.pageIndex, pagination.pageSize, pageCount, totalItems]);

    if (error) {
        return (
            <ErrorGeneral />
        );
    }

    return (
        <DataTableExpanded
            data={data?.items ?? []}
            columns={columns}
            toolbarActions={(table: TableInstance<UserGetDTO>) => <UsersTableToolbarActions table={table} />}
            filterPlaceholder="Buscar usuarios..."
            serverPagination={serverPaginationConfig}
            isLoading={isFetching}
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
                {row.original.user.name}
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
        id: "teléfono",
        accessorKey: "user.phone",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Teléfono" />,
        cell: ({ row }) => {
            const phone = row.original.user.phoneNumber as string;
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
        id: "actions",
        cell: function Cell({ row }) {
            const isActive = row.original.user.isActive;
            const [showEditDialog, setShowEditDialog] = useState(false);
            return (
                <div>
                    <div>
                        {showEditDialog && (
                            <UpdateUsersSheet open={showEditDialog} onOpenChange={setShowEditDialog} user={row?.original} />
                        )}

                    </div>
                    <div />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button aria-label="Open menu" variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted">
                                <Ellipsis className="size-4" aria-hidden="true" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onSelect={() => setShowEditDialog(true)} >
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
