"use client";

import { useMemo } from "react";
import { Table as TableInstance } from "@tanstack/react-table";
import { IdCard } from "lucide-react";

import { DataTable } from "@/components/datatable/data-table";
import { Lead } from "../../_types/lead";
import { facetedFilters, getUniqueIdentifiers } from "../../_utils/leads.filter.utils";
import { leadsColumns } from "./LeadsTableColumns";
import { LeadsTableToolbarActions } from "./LeadsTableToolbarActions";

export function LeadsTable({ data }: { data: Array<Lead> }) {
    const columns = useMemo(() => leadsColumns(), []);

    // Crear el filtro dinámico para identificadores (DNI/RUC)
    const uniqueIdentifiers = useMemo(() => getUniqueIdentifiers(data), [data]);

    // Crear todos los filtros
    const allFilters = useMemo(() => {
        const filters = [...facetedFilters];

        if (uniqueIdentifiers.length > 0) {
            filters.push({
                column: "Cliente",
                title: "Identificador",
                options: uniqueIdentifiers.map((identifier) => ({
                    label: `${identifier.type}: ${identifier.value}`,
                    value: identifier.value,
                    icon: IdCard,
                })),
            });
        }

        return filters;
    }, [uniqueIdentifiers]);

    return (
        <DataTable
            data={data}
            columns={columns}
            toolbarActions={(table: TableInstance<Lead>) => <LeadsTableToolbarActions table={table} />}
            filterPlaceholder="Buscar leads..."
            facetedFilters={allFilters}
        />
    );
}
