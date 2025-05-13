"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Table as TableInstance } from "@tanstack/react-table";
import { IdCard } from "lucide-react";

import { DataTable } from "@/components/datatable/data-table";
import { SummaryQuotation } from "../../_types/quotation";
import { facetedFilters, getUniqueIdentifiers } from "../../_utils/quotations.filter.utils";
import { quotationsColumns } from "./QuotationsTableColumns";
import { QuotationsTableToolbarActions } from "./QuotationsTableToolbarActions";

export function QuotationsTable({ data }: { data: Array<SummaryQuotation> }) {
    const router = useRouter();

    const handleEditInterface = useCallback(
        (id: string) => {
            router.push(`/quotation/${id}/update`);
        },
        [router],
    );

    const columns = useMemo(() => quotationsColumns(handleEditInterface), [handleEditInterface]);

    // Crear el filtro dinámico para identificadores (DNI/RUC)
    const uniqueIdentifiers = useMemo(() => getUniqueIdentifiers(data), [data]);

    // Crear todos los filtros
    const allFilters = useMemo(() => {
        const filters = [...facetedFilters];

        if (uniqueIdentifiers.length > 0) {
            filters.push({
                column: "lead",
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
            toolbarActions={(table: TableInstance<SummaryQuotation>) => <QuotationsTableToolbarActions table={table} />}
            filterPlaceholder="Buscar cotizaciones..."
            facetedFilters={allFilters}
        />
    );
}
