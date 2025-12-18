"use client";

import { subDays } from "date-fns";

import { HeaderPage } from "@/components/common/HeaderPage";
import ErrorGeneral from "@/components/errors/general-error";
import { TaskPageClient } from "./_components/TaskPageClient";
import { useUsersSummary } from "../leads/_hooks/useLeads";
import { useClientsSummary } from "../clients/_hooks/useClients";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function TasksAdminPage() {
    // Fechas predefinidas como objetos Date
    const initialFromDate = subDays(new Date(), 7);
    const initialToDate = new Date();

    // Hook para usuarios
    const {
        data: usersSummary,
        isLoading: usersLoading,
        isError: usersError,
    } = useUsersSummary();

    // Hook para clientes
    const {
        data: clientsSummary,
        isLoading: clientsLoading,
        isError: clientsError,
    } = useClientsSummary();

    // Manejo de loading y error
    if (usersLoading || clientsLoading) {
        return (
            <div>
                <HeaderPage title="Visualización de Tareas" description="Monitoreo de tareas de seguimiento de leads" />
                <LoadingSpinner text="Cargando datos..." />
            </div>
        );
    }

    if (usersError || clientsError) {
        return (
            <div>
                <HeaderPage title="Visualización de Tareas" description="Monitoreo de tareas de seguimiento de leads" />
                <ErrorGeneral />
            </div>
        );
    }

    return (
        <div>
            <HeaderPage title="Visualización de Tareas" description="Monitoreo de tareas de seguimiento de leads" />
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <TaskPageClient
                    initialFrom={initialFromDate}
                    initialTo={initialToDate}
                    usersSummary={usersSummary ?? []}
                    clientsSummary={clientsSummary ?? []}
                />
            </div>
        </div>
    );
}
