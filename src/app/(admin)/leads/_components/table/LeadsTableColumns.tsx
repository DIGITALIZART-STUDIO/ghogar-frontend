"use client";

import React, { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Bell, Ellipsis, Hash, RefreshCcwDot, Trash, UserRoundPen } from "lucide-react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import { toast } from "sonner";

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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Lead, LeadCaptureSource, LeadStatus } from "../../_types/lead";
import { LeadCaptureSourceLabels, LeadStatusLabels } from "../../_utils/leads.utils";
import { DeleteLeadsDialog } from "../state-management/DeleteLeadsDialog";
import { ReactivateLeadsDialog } from "../state-management/ReactivateLeadsDialog";
import { UpdateLeadSheet } from "../update/UpdateLeadsSheet";
import { UpdateClientSheet } from "@/app/(admin)/clients/_components/update/UpdateClientsSheet";
import { Client } from "@/app/(admin)/clients/_types/client";
import { useSendPersonalizedLeadNotification } from "../../_hooks/useLeads";

/**
 * Generar las columnas de la tabla de usuarios
 * @param isSuperAdmin Valor si el usuario es super administrador
 * @returns Columnas de la tabla de usuarios
 */
export const leadsColumns = (): Array<ColumnDef<Lead>> => [
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
        id: "Código",
        accessorKey: "code",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Código" />,
        cell: ({ row }) => (
            <span className="inline-flex items-center gap-2 font-mono text-xs px-2 py-1 rounded
                bg-zinc-100 text-zinc-800 border border-zinc-300
                dark:bg-zinc-900 dark:text-zinc-200 dark:border-zinc-700"
            >
                <Hash className="size-4 text-primary" aria-hidden="true" />
                {row.original?.code ?? "Sin datos"}
            </span>
        ),
        enableColumnFilter: false,
        enableSorting: true,
    },

    {
        id: "Cliente",
        accessorKey: "client.name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Cliente" />,
        cell: ({ row }) => {
            if (!row.original || !row.original.client) {
                return (
                    <div className="min-w-32 text-muted-foreground italic">
                        Cliente sin datos
                    </div>
                );
            }
            const client = row.original.client!;
            const phone = client.phoneNumber;

            let phoneContent = null;
            if (phone) {
                try {
                    const country = RPNInput.parsePhoneNumber(phone)?.country;
                    const formattedPhone = RPNInput.formatPhoneNumberIntl(phone);

                    phoneContent = (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {country && (
                                <span className="flex h-4 w-6 overflow-hidden rounded-sm">
                                    {flags[country] && React.createElement(flags[country], { title: country })}
                                </span>
                            )}
                            <span>{formattedPhone ?? phone}</span>
                        </div>
                    );
                } catch {
                    phoneContent = (
                        <div className="text-xs text-muted-foreground">{phone}</div>
                    );
                }
            }

            return (
                <div className="min-w-32 flex flex-col gap-1">
                    <div className="truncate capitalize">{row.getValue("Cliente") ?? "Sin datos"}</div>
                    {phoneContent}
                </div>
            );
        },
        enableColumnFilter: true,
    },

    {
        id: "seguimiento",
        accessorKey: "status",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Seguimiento" />,
        cell: ({ row }) => {
            const leadStatus = row.getValue("seguimiento") as LeadStatus;
            const leadStatusConfig = LeadStatusLabels[leadStatus];

            if (!leadStatusConfig) {
                return <div>No registrado</div>;
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
        id: "asesor",
        accessorKey: "assignedTo.name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Asesor" />,
        cell: ({ row }) => <div className="min-w-40 truncate capitalize">{row.getValue("asesor")}</div>,
    },

    {
        id: "Medio de captación",
        accessorKey: "captureSource",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Medio de captación" />,
        cell: ({ row }) => {
            const documentType = row.getValue("Medio de captación") as LeadCaptureSource;
            const documentTypeConfig = LeadCaptureSourceLabels[documentType];

            if (!documentTypeConfig) {
                return <div>No registrado</div>;
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
        id: "fecha de Expiración",
        accessorKey: "expirationDate",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Expiración" />,
        cell: ({ row }) => {
            const expirationDate = row.getValue("fecha de Expiración") as string;
            const status = row.original?.status;

            // Si está completado o cancelado, no mostrar días
            if (status === "Completed" || status === "Canceled") {
                return (
                    <Badge variant="secondary" className="bg-gray-100 text-gray-500 border-gray-200">
                        No aplica
                    </Badge>
                );
            }

            if (!expirationDate) {
                return <div>No definida</div>;
            }

            const expDate = new Date(expirationDate);
            const currentDate = new Date();

            // Calcular la diferencia en días
            const diffTime = expDate.getTime() - currentDate.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            // Determinar el estado basado en los días restantes
            let badgeClass = "";
            let label = "";

            if (diffDays > 3) {
                badgeClass = "bg-emerald-100 text-emerald-500 border-emerald-200";
                label = `${diffDays} días restantes`;
            } else if (diffDays >= 0) {
                badgeClass = "bg-amber-100 text-amber-500 border-amber-200";
                label =
                diffDays === 0
                    ? "Expira hoy"
                    : `${diffDays} día${diffDays !== 1 ? "s" : ""} restante${diffDays !== 1 ? "s" : ""}`;
            } else {
                badgeClass = "bg-red-100 text-red-500 border-red-200";
                label = `Expirado hace ${Math.abs(diffDays)} día${Math.abs(diffDays) !== 1 ? "s" : ""}`;
            }

            return (
                <div className="flex flex-col gap-1">
                    <Badge variant="secondary" className={badgeClass}>
                        {label}
                    </Badge>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            if (!row.getValue(id)) {
                return false;
            }

            const expirationDate = new Date(row.getValue(id) as string);
            const currentDate = new Date();
            const diffTime = expirationDate.getTime() - currentDate.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            // Estado: "próximo" (verde), "cercano" (amarillo), "expirado" (rojo)
            const status = diffDays > 3 ? "próximo" : diffDays >= 0 ? "cercano" : "expirado";

            if (Array.isArray(value)) {
                if (value.length === 0) {
                    return true;
                }
                return value.includes(status);
            }

            return status === value;
        },
        enableColumnFilter: true,
    },

    {
        id: "actions",
        cell: function Cell({ row }) {
            const [showDeleteDialog, setShowDeleteDialog] = useState(false);
            const [showReactivateDialog, setShowReactivateDialog] = useState(false);
            const [showEditDialog, setShowEditDialog] = useState(false);
            const [showEditClientDialog, setShowEditClientDialog] = useState(false);

            const { isActive, id } = row.original ?? {};
            const client = row.original?.client;

            // Hook para enviar notificación personalizada
            const sendNotification = useSendPersonalizedLeadNotification();

            // Función para manejar el envío de notificación
            const handleSendNotification = async () => {
                if (!id) {
                    toast.error("No se pudo identificar el lead");
                    return;
                }

                const promise = sendNotification.mutateAsync({
                    params: {
                        path: {
                            leadId: id
                        }
                    }
                });

                toast.promise(promise, {
                    loading: "Enviando notificación...",
                    success: "Notificación enviada exitosamente",
                    error: (e) => `Error al enviar notificación: ${e.message ?? e}`,
                });

                promise.catch((error) => {
                    // Manejar errores específicos si es necesario
                    console.error("Error enviando notificación:", error);
                });
            };
            return (
                <div className="flex items-center gap-2">
                    {/* Botón de notificación separado con tooltip */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleSendNotification}
                                disabled={!isActive || sendNotification.isPending}
                                aria-label="Enviar notificación"
                            >
                                <Bell className="size-4 text-primary" aria-hidden="true" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>
                                {sendNotification.isPending
                                    ? "Enviando notificación..."
                                    : "Enviar notificación"
                                }
                            </p>
                        </TooltipContent>
                    </Tooltip>

                    {/* Dropdown menu */}
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
                            <DropdownMenuItem
                                onSelect={() => setShowEditClientDialog(true)}
                                disabled={
                                    row.original?.status === LeadStatus.Expired || row.original?.status === LeadStatus.Canceled
                                }
                            >
                                Editar cliente
                                <DropdownMenuShortcut>
                                    <UserRoundPen className="size-4" aria-hidden="true" />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
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

                    {/* Diálogos */}
                    <div>
                        {showEditDialog && (
                            <UpdateLeadSheet open={showEditDialog} onOpenChange={setShowEditDialog} lead={row?.original} />
                        )}

                        {showDeleteDialog && (
                            <DeleteLeadsDialog
                                open={showDeleteDialog}
                                onOpenChange={setShowDeleteDialog}
                                leads={[row?.original]}
                                showTrigger={false}
                                onSuccess={() => {
                                    row.toggleSelected(false);
                                }}
                            />
                        )}

                        {showReactivateDialog && (
                            <ReactivateLeadsDialog
                                open={showReactivateDialog}
                                onOpenChange={setShowReactivateDialog}
                                leads={[row?.original]}
                                showTrigger={false}
                                onSuccess={() => {
                                    row.toggleSelected(false);
                                }}
                            />
                        )}
                        {showEditClientDialog && (
                            <UpdateClientSheet open={showEditClientDialog} onOpenChange={setShowEditClientDialog} client={client as Client} />
                        )}
                    </div>
                </div>
            );
        },
        enablePinning: true,
    },
];
