"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Table as TableInstance } from "@tanstack/react-table";
import { IdCard } from "lucide-react";

import { Lead } from "@/app/(admin)/leads/_types/lead";
import { DataTableExpanded } from "@/components/datatable/data-table-expanded";
import { facetedFilters, getUniqueIdentifiers } from "../../_utils/assignments.filter.utils";
import { AssignmentDescription } from "./AssignmentDescription";
import { assignmentsColumns } from "./AssignmentsTableColumns";
import { AssignmentsTableToolbarActions } from "./AssignmentsTableToolbarActions";

export function AssignmentsTable({ data }: { data: Array<Lead> }) {
    const router = useRouter();

    const handleTasksInterface = useCallback(
        (id: string) => {
            router.push(`/assignments/${id}/tasks`);
        },
        [router],
    );

    const columns = useMemo(() => assignmentsColumns(handleTasksInterface), [handleTasksInterface]);

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
        <DataTableExpanded
            data={data}
            columns={columns}
            toolbarActions={(table: TableInstance<Lead>) => <AssignmentsTableToolbarActions table={table} />}
            filterPlaceholder="Buscar mis leads..."
            facetedFilters={allFilters}
            renderExpandedRow={(row) => <AssignmentDescription row={row} />}
        />
    );
}
