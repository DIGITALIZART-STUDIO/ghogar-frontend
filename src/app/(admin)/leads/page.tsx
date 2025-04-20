import { HeaderPage } from "@/components/common/HeaderPage";
import ErrorGeneral from "@/components/errors/general-error";
import { GetAllLeads } from "./_actions/LeadActions";
import { LeadsTable } from "./_components/table/LeadsTable";

export default async function LeadsPage() {
    // Llamar directamente a la función de Server Actions
    const leadsResult = await GetAllLeads();

    // Manejar el error si ocurre
    if (!leadsResult) {
        return (
            <div>
                <HeaderPage title="Leads" description="Prospectos y contactos comerciales potenciales." />
                <ErrorGeneral />
            </div>
        );
    }

    // Verificar la estructura de datos y acceder al array de clientes correctamente
    const leadsData = Array.isArray(leadsResult) && leadsResult[0] ? leadsResult[0] : [];

    return (
        <div>
            <HeaderPage title="Leads" description="Prospectos y contactos comerciales potenciales." />
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <LeadsTable data={leadsData} />
            </div>
        </div>
    );
}
