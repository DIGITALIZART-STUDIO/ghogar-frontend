"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
    const filterTasksRef = useRef(filterTasks);
    filterTasksRef.current = filterTasks; // Mantener la referencia actualizada

    const [tasksResult, setTasksResult] = useState<Array<LeadTaskDetail>>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    // Ref para el timeout del debounce
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Función para aplicar filtros
    const applyFilters = useCallback(async () => {
        setIsLoading(true);
        setIsError(false);
        try {
            const result = await filterTasksRef.current.mutateAsync({
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
    }, [dateRange, filters]); // Remover filterTasks de las dependencias

    // Aplicar filtros cuando cambien con debounce
    useEffect(() => {
        // Limpiar timeout anterior
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        // Establecer nuevo timeout
        debounceTimeoutRef.current = setTimeout(() => {
            applyFilters();
        }, 300); // 300ms de debounce

        // Cleanup
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, [applyFilters]);

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
