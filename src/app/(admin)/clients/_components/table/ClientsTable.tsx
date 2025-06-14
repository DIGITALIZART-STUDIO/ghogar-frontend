"use client";

import { useMemo } from "react";
import { Table as TableInstance } from "@tanstack/react-table";

import { DataTableExpanded } from "@/components/datatable/data-table-expanded";
import { Client } from "../../_types/client";
import { facetedFilters } from "../../_utils/clients.filter.utils";
import { ClientDescription } from "./ClientDescription";
import { clientsColumns } from "./ClientsTableColumns";
import { ClientsTableToolbarActions } from "./ClientsTableToolbarActions";

export function ClientsTable({ data }: { data: Array<Client> }) {
    const columns = useMemo(() => clientsColumns(), []);

    return (
        <DataTableExpanded
            isLoading={false}
            data={data}
            columns={columns}
            toolbarActions={(table: TableInstance<Client>) => <ClientsTableToolbarActions table={table} />}
            filterPlaceholder="Buscar clientes..."
            facetedFilters={facetedFilters}
            renderExpandedRow={(row) => <ClientDescription row={row} />}
        />
    );
}
