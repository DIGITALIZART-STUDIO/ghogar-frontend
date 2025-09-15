"use client";

import { subDays } from "date-fns";

import { HeaderPage } from "@/components/common/HeaderPage";
import { TaskPageClient } from "./_components/TaskPageClient";

export default function TasksAdminPage() {
    // Fechas predefinidas como objetos Date
    const initialFromDate = subDays(new Date(), 7);
    const initialToDate = new Date();

    return (
        <div>
            <HeaderPage title="Visualización de Tareas" description="Monitoreo de tareas de seguimiento de leads" />
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <TaskPageClient
                    initialFrom={initialFromDate}
                    initialTo={initialToDate}
                />
            </div>
        </div>
    );
}
