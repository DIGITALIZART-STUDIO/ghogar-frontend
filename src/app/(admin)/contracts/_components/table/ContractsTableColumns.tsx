"use client";

import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Clock, Eye, Hash, MapPin } from "lucide-react";

import { ClientHoverCard } from "@/components/common/ClientHoverCard";
import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContractDto } from "../../_types/contract";
import { ContractOriginLabels, ContractStatusLabels, formatContractCurrency } from "../../_utils/contracts.utils";

export const contractsColumns = (): Array<ColumnDef<ContractDto>> => [
  {
    id: "codigo",
    accessorKey: "code",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Código" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-2 min-w-36">
        <Hash className="h-4 w-4 text-slate-500" />
        <span className="font-medium">{row.original.code}</span>
      </div>
    ),
  },
  {
    id: "cliente",
    accessorKey: "clientName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cliente" />,
    cell: ({ row }) => (
      <ClientHoverCard
        clientId={row.original.clientId}
        clientName={row.original.clientName}
        iconColor="text-purple-600 dark:text-purple-400"
        iconBgColor="bg-purple-100 dark:bg-purple-900 border-purple-200 dark:border-purple-800"
      />
    ),
  },
  {
    id: "lote",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Proyecto / Lote" />,
    cell: ({ row }) => (
      <div className="flex flex-col min-w-40">
        <span className="flex items-center gap-1 text-sm font-medium">
          <MapPin className="h-3.5 w-3.5 text-slate-500" />
          {row.original.projectName}
        </span>
        <span className="text-xs text-muted-foreground">
          Mz {row.original.blockName} · Lt {row.original.lotNumber}
        </span>
      </div>
    ),
  },
  {
    id: "origen",
    accessorKey: "origin",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Origen" />,
    cell: ({ row }) => {
      const config = ContractOriginLabels[row.original.origin];
      const Icon = config.icon;
      return (
        <Badge variant="outline" className={config.className}>
          <Icon className="mr-1 h-3.5 w-3.5" />
          {config.label}
        </Badge>
      );
    },
  },
  {
    id: "estado",
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Estado" />,
    cell: ({ row }) => {
      const config = ContractStatusLabels[row.original.status];
      const Icon = config.icon;
      return (
        <Badge variant="outline" className={config.className}>
          <Icon className="mr-1 h-3.5 w-3.5" />
          {config.label}
        </Badge>
      );
    },
  },
  {
    id: "siguiente_pago",
    accessorKey: "nextPaymentDueDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Siguiente pago" />,
    cell: ({ row }) => {
      const nextPaymentDate = row.original.nextPaymentDueDate;
      if (!nextPaymentDate) {
        return <span className="text-sm text-muted-foreground">—</span>;
      }
      const paymentDate = parseISO(nextPaymentDate);
      const isOverdue = paymentDate.getTime() < Date.now();
      return (
        <div className="flex items-center gap-2 min-w-32">
          <Clock className={`h-4 w-4 ${isOverdue ? "text-red-600" : "text-green-600"}`} />
          <div className="flex flex-col">
            <span className={`text-sm font-medium ${isOverdue ? "text-red-600" : "text-green-600"}`}>
              {format(paymentDate, "dd MMM yyyy", { locale: es })}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatContractCurrency(row.original.nextPaymentAmount, row.original.currency)}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    id: "saldo",
    accessorKey: "remainingAmount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Saldo" />,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium">
          {formatContractCurrency(row.original.remainingAmount, row.original.currency)}
        </span>
        <span className="text-xs text-muted-foreground">
          Pagado {formatContractCurrency(row.original.amountPaid, row.original.currency)}
        </span>
      </div>
    ),
  },
  {
    id: "financiado",
    accessorKey: "amountFinanced",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Financiado" />,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium">
          {formatContractCurrency(row.original.amountFinanced, row.original.currency)}
        </span>
        <span className="text-xs text-muted-foreground">{row.original.monthsFinanced} meses</span>
      </div>
    ),
  },
  {
    id: "inicio",
    accessorKey: "startDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Inicio" />,
    cell: ({ row }) => {
      const date = row.original.startDate ? parseISO(row.original.startDate) : null;
      return (
        <span className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          {date ? format(date, "dd MMM yyyy", { locale: es }) : "—"}
        </span>
      );
    },
  },
  {
    id: "acciones",
    cell: ({ row }) => (
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/contracts/${row.original.id}`}>
          <Eye className="mr-1 h-4 w-4" />
          Ver
        </Link>
      </Button>
    ),
  },
];
