"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Building2, Calendar, Hash } from "lucide-react";

import { formatContractCurrency } from "@/app/(admin)/contracts/_utils/contracts.utils";
import { PaymentMethodLabels } from "@/app/(admin)/reservations/_utils/reservations.utils";
import { ClientHoverCard } from "@/components/common/ClientHoverCard";
import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { IncomeReportItem, IncomeReportOrigin } from "../_types/incomeReport";
import { IncomeReportOriginLabels } from "../_utils/incomeReport.utils";
import { formatReportDate } from "../../../_utils/report-dates";

export const incomeReportColumns = (): Array<ColumnDef<IncomeReportItem>> => [
  {
    id: "fecha_pago",
    accessorKey: "paymentDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Fecha de pago" />,
    cell: ({ row }) => (
      <span className="inline-flex items-center gap-1.5 text-sm">
        <Calendar className="size-3.5 text-muted-foreground" />
        {formatReportDate(row.original.paymentDate)}
      </span>
    ),
  },
  {
    id: "cliente",
    accessorKey: "clientName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cliente" />,
    cell: ({ row }) => (
      <ClientHoverCard
        clientId={row.original.clientId ?? undefined}
        clientName={row.original.clientName || "—"}
        additionalInfo={
          <>
            <span className="text-xs text-muted-foreground">
              {row.original.clientDni ? `DNI/RUC ${row.original.clientDni}` : "Sin documento"}
            </span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Building2 className="h-3 w-3" />
              <span className="truncate">{row.original.projectName ?? "Sin proyecto"}</span>
            </div>
          </>
        }
      />
    ),
  },
  {
    id: "monto",
    accessorKey: "amountPaid",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Monto" />,
    cell: ({ row }) => (
      <span className="font-semibold">{formatContractCurrency(row.original.amountPaid, row.original.currency)}</span>
    ),
  },
  {
    id: "metodo",
    accessorKey: "paymentMethod",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Método" />,
    cell: ({ row }) => {
      const config = PaymentMethodLabels[row.original.paymentMethod];
      const Icon = config?.icon;
      return (
        <Badge variant="outline" className={cn("gap-1", config?.className)}>
          {Icon && <Icon className="size-3" />}
          {config?.label ?? row.original.paymentMethod}
        </Badge>
      );
    },
  },
  {
    id: "origen",
    accessorKey: "origin",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Origen" />,
    cell: ({ row }) => (
      <Badge variant={row.original.origin === IncomeReportOrigin.Reservation ? "secondary" : "outline"}>
        {IncomeReportOriginLabels[row.original.origin] ?? row.original.origin}
      </Badge>
    ),
  },
  {
    id: "referencia",
    accessorKey: "referenceNumber",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nº operación" />,
    cell: ({ row }) => (
      <span className={row.original.referenceNumber ? undefined : "text-muted-foreground"}>
        {row.original.referenceNumber ?? "—"}
      </span>
    ),
  },
  {
    id: "contrato",
    accessorKey: "contractCode",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Contrato" />,
    cell: ({ row }) => {
      if (!row.original.contractCode) {
        return <span className="text-xs text-muted-foreground">Sin contrato</span>;
      }

      return (
        <span className="inline-flex items-center gap-1.5 font-mono text-xs">
          <Hash className="size-3 text-muted-foreground" />
          {row.original.contractCode}
        </span>
      );
    },
  },
  {
    id: "cuotas",
    accessorKey: "quotasCovered",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cuotas cubiertas" />,
    cell: ({ row }) => <Badge variant="secondary">{row.original.quotasCovered}</Badge>,
  },
];
