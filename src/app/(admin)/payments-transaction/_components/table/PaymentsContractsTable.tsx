"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ColumnDef, Table as TableInstance } from "@tanstack/react-table";
import { Banknote, ChevronDown, ChevronRight, Eye, Hash, MapPin } from "lucide-react";

import { ContractDto } from "@/app/(admin)/contracts/_types/contract";
import { formatContractCurrency } from "@/app/(admin)/contracts/_utils/contracts.utils";
import { ClientHoverCard } from "@/components/common/ClientHoverCard";
import { DataTable } from "@/components/datatable/data-table";
import { DataTableColumnHeader } from "@/components/datatable/data-table-column-header";
import { Button } from "@/components/ui/button";
import {
  CustomPaginationTableParams,
  ServerPaginationChangeEventCallback,
} from "@/types/tanstack-table/CustomPagination";
import { PaymentsContractExpandedContent } from "./PaymentsContractExpandedContent";

interface PaymentsContractsTableProps {
  data: Array<ContractDto>;
  pagination: CustomPaginationTableParams;
  onPaginationChange: ServerPaginationChangeEventCallback;
  search?: string;
  onSearchChange: (search: string) => void;
  isLoading?: boolean;
}

const columns = (): Array<ColumnDef<ContractDto>> => [
  {
    id: "codigo",
    accessorKey: "code",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Contrato" />,
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
    header: ({ column }) => <DataTableColumnHeader column={column} title="Lote" />,
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
    id: "saldo",
    accessorKey: "remainingAmount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Saldo" />,
    cell: ({ row }) => (
      <span className="text-sm font-medium">
        {formatContractCurrency(row.original.remainingAmount, row.original.currency)}
      </span>
    ),
  },
  {
    id: "expand",
    header: () => null,
    cell: ({ row }) => (
      <Button variant="ghost" size="sm" onClick={() => row.toggleExpanded()}>
        {row.getIsExpanded() ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>
    ),
  },
  {
    id: "actions",
    cell: function Cell({ row }) {
      const router = useRouter();
      return (
        <div className="flex gap-1">
          <Button size="sm" onClick={() => router.push(`/payments-transaction/${row.original.id}/create`)}>
            <Banknote className="mr-1 h-4 w-4" />
            Registrar pago
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/contracts/${row.original.id}`}>
              <Eye className="mr-1 h-4 w-4" />
              Ficha
            </Link>
          </Button>
        </div>
      );
    },
  },
];

export function PaymentsContractsTable({
  data,
  pagination,
  onPaginationChange,
  search,
  onSearchChange,
  isLoading = false,
}: PaymentsContractsTableProps) {
  const cols = useMemo(() => columns(), []);

  return (
    <DataTable
      isLoading={isLoading}
      data={data}
      columns={cols}
      toolbarActions={(_table: TableInstance<ContractDto>) => null}
      filterPlaceholder="Buscar contratos..."
      externalFilterValue={search}
      onGlobalFilterChange={onSearchChange}
      renderExpandedRow={(contract) => <PaymentsContractExpandedContent contract={contract} />}
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
