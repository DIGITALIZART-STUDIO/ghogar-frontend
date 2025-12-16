"use client";

import React, { useMemo, useState } from "react";
import { ColumnDef, Table as TableInstance } from "@tanstack/react-table";
import { Ellipsis, RefreshCcwDot, Trash, Users } from "lucide-react";
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
import { UserGetDTO } from "../_types/user";
import { DeleteUsersDialog } from "./state-management/DeleteUsersDialog";
import { ReactivateUsersDialog } from "./state-management/ReactivateUsersDialog";
import { UpdateUsersSheet } from "./update/UpdateUsersSheet";
import { AssignConsultorsDialog } from "./assignments/AssignConsultorsDialog";
import { UsersTableToolbarActions } from "./UserActions";
import { createFacetedFilters } from "../_utils/user.filter.utils";
import { UserRoleLabels } from "../_utils/user.utils";
import { DataTable } from "@/components/datatable/data-table";

export interface UsersTableProps {
    data: Array<UserGetDTO>;
    pagination: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    };
    onPaginationChange: (page: number, pageSize: number) => void;
    search?: string;
    onSearchChange: (search: string) => void;
    isActive?: Array<boolean>;
    onIsActiveChange: (isActive: Array<boolean>) => void;
    roleName?: Array<string>;
    onRoleNameChange: (roleName: Array<string>) => void;
    isLoading?: boolean;
}

export function UsersTable({
    data,
    pagination,
    onPaginationChange,
    search,
    onSearchChange,
    isActive,
    onIsActiveChange,
    roleName,
    onRoleNameChange,
    isLoading = false,
}: UsersTableProps) {
    const columns = useMemo(() => usersColumns(), []);

    // Crear filtros personalizados con callbacks del servidor
    const customFacetedFilters = useMemo(
        () => createFacetedFilters(onIsActiveChange, onRoleNameChange, isActive, roleName),
        [onIsActiveChange, onRoleNameChange, isActive, roleName]
    );

    return (
        <DataTable
            isLoading={isLoading}
            data={data}
            columns={columns}
            toolbarActions={(table: TableInstance<UserGetDTO>) => (
                <UsersTableToolbarActions table={table} />
            )}
            filterPlaceholder="Buscar usuarios..."
            facetedFilters={customFacetedFilters}
            externalFilterValue={search}
            onGlobalFilterChange={onSearchChange}
            serverPagination={{
                pageIndex: pagination.page - 1,
                pageSize: pagination.pageSize,
                pageCount: pagination.totalPages,
                total: pagination.total,
                onPaginationChange: async (pageIndex, pageSize) => {
                    onPaginationChange(pageIndex + 1, pageSize);
                },
            }}
        />
    );
}

export const usersColumns = (): Array<ColumnDef<UserGetDTO>> => [
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
        cell: ({ row }) => <div className="min-w-40 truncate capitalize">{row.original.user.name}</div>,
    },
    {
        id: "correo",
        accessorKey: "email",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Correo" />,
        cell: ({ row }) => <div>{row.original.user.email}</div>,
    },
    {
        id: "teléfono",
        accessorKey: "user.phone",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Teléfono" />,
        cell: ({ row }) => {
            const phone = row.original.user.phoneNumber as string;
            if (!phone) {
                return <div>-</div>;
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
                        <span>{formattedPhone ?? phone}</span>
                    </div>
                );
            } catch {
                // Si hay algún error al parsear el número, mostramos el número original
                return <div>{phone}</div>;
            }
        },
    },
    {
        id: "rol",
        accessorKey: "roles",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Rol" />,
        cell: ({ row }) => {
            const roles = row.getValue("rol") as Array<string>;
            const mainRole = roles?.[0] as keyof typeof UserRoleLabels | undefined;
            const roleConfig = mainRole && UserRoleLabels[mainRole] ? UserRoleLabels[mainRole] : UserRoleLabels.Other;

            if (!mainRole || !roleConfig) {
                return <div>No registrado</div>;
            }

            const Icon = roleConfig.icon;

            return (
                <div className="text-xs min-w-32">
                    <Badge variant="outline" className={roleConfig.className}>
                        <Icon className="size-4 flex-shrink-0 mr-1" aria-hidden="true" />
                        {roleConfig.label}
                    </Badge>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            const roles = row.getValue(id) as Array<string>;
            const mainRole = roles?.[0];
            if (Array.isArray(value)) {
                if (value.length === 0) {
                    return true;
                }
                return value.includes(mainRole);
            }
            return mainRole === value;
        },
        enableColumnFilter: true,
    },
    {
        id: "estado",
        accessorKey: "user.isActive",
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
    },

    {
        id: "actions",
        cell: function Cell({ row }) {
            const isActive = row.original.user.isActive;
            const userRoles = row.original.roles || [];
            const isSupervisor = userRoles.includes("Supervisor");

            const [showEditDialog, setShowEditDialog] = useState(false);
            const [showReactivateDialog, setShowReactivateDialog] = useState(false);
            const [showDeleteDialog, setShowDeleteDialog] = useState(false);
            const [showAssignDialog, setShowAssignDialog] = useState(false);

            return (
                <div>
                    <div>
                        {showEditDialog && (
                            <UpdateUsersSheet
                                open={showEditDialog}
                                onOpenChange={setShowEditDialog}
                                user={row?.original}
                            />
                        )}
                        {showDeleteDialog && (
                            <DeleteUsersDialog
                                open={showDeleteDialog}
                                onOpenChange={setShowDeleteDialog}
                                user={row?.original}
                                onSuccess={() => {
                                    setShowDeleteDialog(false);
                                    row.toggleSelected(false);
                                }}
                            />
                        )}

                        {showReactivateDialog && (
                            <ReactivateUsersDialog
                                open={showReactivateDialog}
                                onOpenChange={setShowReactivateDialog}
                                user={row?.original}
                                onSuccess={() => {
                                    setShowReactivateDialog(false);
                                    row.toggleSelected(false);
                                }}
                            />
                        )}

                        {showAssignDialog && (
                            <AssignConsultorsDialog
                                open={showAssignDialog}
                                onOpenChange={setShowAssignDialog}
                                supervisor={row?.original}
                            />
                        )}
                    </div>
                    <div />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button aria-label="Open menu" variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted">
                                <Ellipsis className="size-4" aria-hidden="true" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onSelect={() => setShowEditDialog(true)}>Editar</DropdownMenuItem>

                            <DropdownMenuSeparator />
                            {isSupervisor && (
                                <DropdownMenuItem onSelect={() => setShowAssignDialog(true)}>
                                    Asignar Asesores
                                    <DropdownMenuShortcut>
                                        <Users className="size-4" aria-hidden="true" />
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onSelect={() => setShowReactivateDialog(true)} disabled={isActive}>
                                Reactivar
                                <DropdownMenuShortcut>
                                    <RefreshCcwDot className="size-4" aria-hidden="true" />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
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
