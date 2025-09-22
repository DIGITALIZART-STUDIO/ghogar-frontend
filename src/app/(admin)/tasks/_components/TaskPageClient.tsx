"use client";

import { useState, useEffect, useCallback } from "react";
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
    const filterTasks = useTasksWithFilters();
    const [tasksResult, setTasksResult] = useState<Array<LeadTaskDetail>>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    // Función para aplicar filtros
    const applyFilters = useCallback(async () => {
        setIsLoading(true);
        setIsError(false);
        try {
            const result = await filterTasks.mutateAsync({
                body: {
                    from: dateRange.from.toISOString(),
                    to: dateRange.to.toISOString(),
                    assignedToId: filters.assignedToId && filters.assignedToId !== "" ? filters.assignedToId : undefined,
                    leadId: filters.leadId && filters.leadId !== "" ? filters.leadId : undefined,
                    type: filters.type && filters.type !== "" ? filters.type : undefined,
                    isCompleted: filters.isCompleted,
                }
            });
            setTasksResult((result as Array<LeadTaskDetail>) || []);
        } catch {
            setIsError(true);
            setTasksResult([]);
        } finally {
            setIsLoading(false);
        }
    }, [filterTasks, dateRange, filters]);

    // Aplicar filtros cuando cambien
    useEffect(() => {
        applyFilters();
    }, [dateRange, filters, applyFilters]);

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
