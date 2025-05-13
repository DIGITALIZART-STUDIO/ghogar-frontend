import { HeaderPage } from "@/components/common/HeaderPage";
import ErrorGeneral from "@/components/errors/general-error";
import { backend, wrapper } from "@/types/backend";
import { GetQuotationsByAdvisor } from "./_actions/QuotationActions";
import { QuotationsTable } from "./_components/table/QuotationsTable";

export default async function QuotationPage() {
    // Obtener datos del usuario actual desde la API
    const [userData, error] = await wrapper((auth) => backend.GET("/api/Users", auth));

    if (error || !userData) {
        return (
            <div>
                <HeaderPage title="Mis Cotizaciones" description="Gestión de cotizaciones generadas por el usuario." />
                <ErrorGeneral />
            </div>
        );
    }

    // Usar el ID del usuario obtenido de la API
    const userId = userData.user.id;

    if (!userId) {
        return (
            <div>
                <HeaderPage title="Mis Cotizaciones" description="Gestión de cotizaciones generadas por el usuario." />
                <ErrorGeneral />
            </div>
        );
    }

    const [quotationResult, quotationError] = await GetQuotationsByAdvisor(userId);

    // Manejar el error si ocurre al obtener las cotizaciones
    if (quotationError) {
        return (
            <div>
                <HeaderPage title="Mis Cotizaciones" description="Gestión de cotizaciones generadas por el usuario." />
                <ErrorGeneral />
            </div>
        );
    }

    const data = quotationResult;

    return (
        <div>
            <HeaderPage title="Mis Cotizaciones" description="Gestión de cotizaciones generadas por el usuario." />
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <QuotationsTable data={data} />
            </div>
        </div>
    );
}
