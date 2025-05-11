import { subDays } from "date-fns";

import { HeaderPage } from "@/components/common/HeaderPage";
import ErrorGeneral from "@/components/errors/general-error";
import { GetTasksWithFilters } from "../assignments/[id]/tasks/_actions/LeadTaskActions";
import { LeadTaskDetail } from "../assignments/[id]/tasks/_types/leadTask";
import { GetClientsSummary } from "../clients/_actions/ClientActions";
import { GetUsersSummary } from "../leads/_actions/LeadActions";
import { TaskPageClient } from "./_components/TaskPageClient";

export default async function TasksAdminPage() {
    // Fechas predefinidas como objetos Date
    const initialFromDate = subDays(new Date(), 7);
    const initialToDate = new Date();

    // Convertimos las fechas a formato ISO string para el API
    const [tasksResult, tasksError] = await GetTasksWithFilters({
        from: initialFromDate.toISOString(),
        to: initialToDate.toISOString(),
    });

    // Obtener el resumen de usuarios
    const [usersSummary, usersSummaryError] = await GetUsersSummary();

    // Obtener el resumen de clientes
    const [clientsSummary, clientsSummaryError] = await GetClientsSummary();

    if (tasksError || usersSummaryError || clientsSummaryError) {
        return (
            <div>
                <HeaderPage title="Visualización de Tareas" description="Monitoreo de tareas de seguimiento de leads" />
                <ErrorGeneral />
            </div>
        );
    }

    const data = tasksResult;

    return (
        <div>
            <HeaderPage title="Visualización de Tareas" description="Monitoreo de tareas de seguimiento de leads" />
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <TaskPageClient
                    initialData={data as Array<LeadTaskDetail>}
                    initialFrom={initialFromDate}
                    initialTo={initialToDate}
                    usersSummary={usersSummary}
                    clientsSummary={clientsSummary}
                />
            </div>
        </div>
    );
}
