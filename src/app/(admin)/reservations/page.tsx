import { HeaderPage } from "@/components/common/HeaderPage";
import ErrorGeneral from "@/components/errors/general-error";
import { backend, wrapper } from "@/types/backend";
import { ReservationsTable } from "./_components/ReservationsTable";

export default async function ReservationsPage() {
    // Obtener datos del usuario actual desde la API
    const [userData, error] = await wrapper((auth) => backend.GET("/api/Users", auth));

    if (error || !userData) {
        return (
            <div>
                <HeaderPage title="Separaciones" description="Gestión de separaciones" />
                <ErrorGeneral />
            </div>
        );
    }

    // Usar el ID del usuario obtenido de la API
    const userId = userData.user.id;

    if (!userId) {
        return (
            <div>
                <HeaderPage title="Separaciones" description="Gestión de separaciones" />
                <ErrorGeneral />
            </div>
        );
    }

    return (
        <div>
            <HeaderPage title="Separaciones" description="Gestión de separaciones" />
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <ReservationsTable data={[]} />
            </div>
        </div>
    );
}
