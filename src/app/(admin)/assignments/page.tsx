import { HeaderPage } from "@/components/common/HeaderPage";
import ErrorGeneral from "@/components/errors/general-error";
import { backend, wrapper } from "@/types/backend";
import { GetLeadsByAssignedTo } from "../leads/_actions/LeadActions";
import { AssignmentsTable } from "./_components/table/AssignmentsTable";

export default async function AssignmentsPage() {
    // Obtener datos del usuario actual desde la API
    const [userData, error] = await wrapper((auth) => backend.GET("/api/Users", auth));

    if (error || !userData) {
        return (
            <div>
                <HeaderPage
                    title="Mis Leads Asignados"
                    description="Gestión de prospectos comerciales asignados a tu usuario."
                />
                <ErrorGeneral />
            </div>
        );
    }

    // Usar el ID del usuario obtenido de la API
    const userId = userData.user.id;
    if (!userId) {
        return (
            <div>
                <HeaderPage
                    title="Mis Leads Asignados"
                    description="Gestión de prospectos comerciales asignados a tu usuario."
                />
                <ErrorGeneral />
            </div>
        );
    }
    const leadsResult = await GetLeadsByAssignedTo(userId);

    // Manejar el error si ocurre al obtener los leads
    if (!leadsResult) {
        return (
            <div>
                <HeaderPage
                    title="Mis Leads Asignados"
                    description="Gestión de prospectos comerciales asignados a tu usuario."
                />
                <ErrorGeneral />
            </div>
        );
    }

    // Verificar la estructura de datos y acceder al array de clientes correctamente
    const leadsData = Array.isArray(leadsResult) && leadsResult[0] ? leadsResult[0] : [];

    return (
        <div>
            <HeaderPage title="Mis Leads Asignados" description="Gestión de prospectos comerciales asignados a tu usuario." />
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <AssignmentsTable data={leadsData} />
            </div>
        </div>
    );
}
