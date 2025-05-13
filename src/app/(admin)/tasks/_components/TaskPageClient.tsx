"use client";

import { useState } from "react";

import { GetTasksWithFilters } from "../../assignments/[id]/tasks/_actions/LeadTaskActions";
import { LeadTaskDetail, TaskFilters } from "../../assignments/[id]/tasks/_types/leadTask";
import { ClientSummaryDto } from "../../clients/_types/client";
import { UserSummaryDto } from "../../leads/_types/lead";
import { AdminTasksViewer } from "./AdminTasksViewer";

// Añadimos tipos para mejorar la seguridad
interface TaskPageClientProps {
  initialData: Array<LeadTaskDetail>;
  initialFrom: Date;
  initialTo: Date;
  usersSummary: Array<UserSummaryDto>;
  clientsSummary: Array<ClientSummaryDto>;
}
export function TaskPageClient({
    initialData,
    initialFrom,
    initialTo,
    usersSummary,
    clientsSummary,
}: TaskPageClientProps) {
    const [data, setData] = useState<Array<LeadTaskDetail>>(initialData);
    const [dateRange, setDateRange] = useState({
        from: initialFrom,
        to: initialTo,
    });

    // Estado para los filtros
    const [filters, setFilters] = useState<TaskFilters>({
        assignedToId: "",
        leadId: "",
        type: "",
        isCompleted: undefined,
    });

    // Función para aplicar los filtros y hacer la consulta
    const applyFilters = async(newRange?: { from: Date; to: Date }, newFilters?: TaskFilters) => {
    // Usar los nuevos valores o mantener los actuales
        const updatedRange = newRange ?? dateRange;
        const updatedFilters = newFilters ?? filters;

        // Construir el objeto de filtros para enviar al backend
        const queryParams: Record<string, string | boolean> = {
            from: updatedRange.from.toISOString(),
            to: updatedRange.to.toISOString(),
        };

        // Solo incluir filtros que no sean "all" o vacíos
        if (updatedFilters.assignedToId && updatedFilters.assignedToId !== "all") {
            queryParams.advisorId = updatedFilters.assignedToId;
        }

        if (updatedFilters.leadId && updatedFilters.leadId !== "all") {
            queryParams.leadId = updatedFilters.leadId;
        }

        if (updatedFilters.type && updatedFilters.type !== "all") {
            queryParams.type = updatedFilters.type;
        }

        // Solo incluir isCompleted si tiene un valor booleano específico
        if (updatedFilters.isCompleted === true || updatedFilters.isCompleted === false) {
            queryParams.isCompleted = updatedFilters.isCompleted;
        }

        // Llamar al backend con los filtros
        const [newData, error] = await GetTasksWithFilters(queryParams);

        if (!error && newData) {
            setData(newData as Array<LeadTaskDetail>);
        } else if (error) {
            console.error("Error updating tasks:", error);
        }
    };

    // Función para actualizar el dateRange y hacer la consulta
    const handleDateRangeChange = async(newRange: { from: Date; to: Date }) => {
        setDateRange(newRange);
        await applyFilters(newRange);
    };

    // Función para actualizar los filtros y hacer la consulta
    const handleFiltersChange = async(newFilters: TaskFilters) => {
        setFilters(newFilters);
        await applyFilters(undefined, newFilters);
    };

    return (
        <AdminTasksViewer
            data={data}
            dateRange={dateRange}
            setDateRange={handleDateRangeChange}
            usersSummary={usersSummary}
            clientsSummary={clientsSummary}
            filters={filters}
            setFilters={handleFiltersChange}
        />
    );
}
