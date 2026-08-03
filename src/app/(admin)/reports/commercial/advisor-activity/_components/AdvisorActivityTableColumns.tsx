"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Calendar, ClipboardList, Hash, UserRoundX } from "lucide-react";

import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AdvisorActivityReportItem } from "../_types/advisorActivity";
import { formatReportDate, LeadCaptureSourceLabels, LeadStatusLabels } from "../_utils/advisorActivity.utils";

export const advisorActivityColumns = (): Array<ColumnDef<AdvisorActivityReportItem>> => [
  {
    id: "Código",
    accessorKey: "leadCode",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Código" />,
    cell: ({ row }) => (
      <span
        className="inline-flex items-center gap-2 font-mono text-xs px-2 py-1 rounded
                bg-zinc-100 text-zinc-800 border border-zinc-300
                dark:bg-zinc-900 dark:text-zinc-200 dark:border-zinc-700"
      >
        <Hash className="size-4 text-primary" aria-hidden="true" />
        {row.original.leadCode}
      </span>
    ),
    enableSorting: true,
  },
  {
    id: "Cliente",
    accessorKey: "clientName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cliente" />,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.clientName || "Sin nombre"}</span>
        <span className="text-xs text-muted-foreground">{row.original.clientPhone}</span>
      </div>
    ),
    enableSorting: true,
  },
  {
    id: "Asesor",
    accessorKey: "assignedToName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Asesor" />,
    cell: ({ row }) => {
      if (row.original.assignedToName) {
        return <span className="font-medium">{row.original.assignedToName}</span>;
      }
      return (
        <Badge variant="outline" className="text-amber-600 border-amber-300 gap-1">
          <UserRoundX className="size-3" />
          Sin asignar
        </Badge>
      );
    },
    enableSorting: true,
  },
  {
    id: "Estado",
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
    cell: ({ row }) => {
      const config = LeadStatusLabels[row.original.status];
      const Icon = config?.icon;
      return (
        <Badge variant="outline" className={cn("gap-1", config?.className)}>
          {Icon && <Icon className="size-3" />}
          {config?.label ?? row.original.status}
        </Badge>
      );
    },
    enableSorting: true,
  },
  {
    id: "Medio de Captación",
    accessorKey: "captureSource",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Medio de Captación" />,
    cell: ({ row }) => {
      const config = LeadCaptureSourceLabels[row.original.captureSource];
      const Icon = config?.icon;
      return (
        <Badge variant="outline" className={cn("gap-1", config?.className)}>
          {Icon && <Icon className="size-3" />}
          {config?.label ?? row.original.captureSource}
        </Badge>
      );
    },
    enableSorting: true,
  },
  {
    id: "Proyecto",
    accessorKey: "projectName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Proyecto" />,
    cell: ({ row }) => row.original.projectName ?? "Sin proyecto",
    enableSorting: true,
  },
  {
    id: "Fecha de Ingreso",
    accessorKey: "entryDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Fecha de Ingreso" />,
    cell: ({ row }) => (
      <span className="inline-flex items-center gap-1.5 text-sm">
        <Calendar className="size-3.5 text-muted-foreground" />
        {formatReportDate(row.original.entryDate)}
      </span>
    ),
    enableSorting: true,
  },
  {
    id: "Nº Tareas",
    accessorKey: "taskCount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nº Tareas" />,
    cell: ({ row }) => (
      <Badge variant="secondary" className="gap-1">
        <ClipboardList className="size-3" />
        {row.original.taskCount}
      </Badge>
    ),
    enableSorting: true,
  },
  {
    id: "Última Tarea",
    accessorKey: "lastTaskDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Última Tarea" />,
    cell: ({ row }) => {
      if (!row.original.lastTaskDate) {
        return <span className="text-xs text-muted-foreground">Sin tareas</span>;
      }
      return formatReportDate(row.original.lastTaskDate);
    },
    enableSorting: true,
  },
];
