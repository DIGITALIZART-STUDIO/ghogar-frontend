"use client";

import { useState } from "react";
import { useTasksWithFilters } from "../../assignments/[id]/tasks/_hooks/useLeadTasks";
import { LeadTaskDetail, TaskFilters } from "../../assignments/[id]/tasks/_types/leadTask";
import { AdminTasksViewer } from "./AdminTasksViewer";
import ErrorGeneral from "@/components/errors/general-error";

interface TaskPageClientProps {
  initialFrom: Date;
  initialTo: Date;
}

export function TaskPageClient({
    initialFrom,
    initialTo,
}: TaskPageClientProps) {
    const [dateRange, setDateRange] = useState({
        from: initialFrom,
        to: initialTo,
    });

    const [filters, setFilters] = useState<TaskFilters>({
        assignedToId: "",
        leadId: "",
        type: "",
        isCompleted: undefined,
    });

    const [showFilters, setShowFilters] = useState(false);

    // Hook react-query para obtener tareas con filtros
    const {
        data: tasksResult = [],
        isLoading,
        isError,
    } = useTasksWithFilters({
        from: dateRange.from.toISOString(),
        to: dateRange.to.toISOString(),
        assignedToId: filters.assignedToId && filters.assignedToId !== "" ? filters.assignedToId : undefined,
        leadId: filters.leadId && filters.leadId !== "" ? filters.leadId : undefined,
        type: filters.type && filters.type !== "" ? filters.type : undefined,
        isCompleted: filters.isCompleted,
    });

    // Función para actualizar el rango de fechas
    const handleDateRangeChange = (newRange: { from: Date; to: Date }) => {
        setDateRange(newRange);
    };

    // Función para actualizar los filtros
    const handleFiltersChange = (newFilters: TaskFilters) => {
        setFilters(newFilters);
    };

    if (isError) {
        return <ErrorGeneral />;
    }

    return (
        <AdminTasksViewer
            data={tasksResult as Array<LeadTaskDetail>}
            dateRange={dateRange}
            setDateRange={handleDateRangeChange}
            filters={filters}
            setFilters={handleFiltersChange}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            isLoading={isLoading}
        />
    );
}
