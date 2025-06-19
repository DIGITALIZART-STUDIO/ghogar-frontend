import { HeaderPage } from "@/components/common/HeaderPage";
import ErrorGeneral from "@/components/errors/general-error";
import { backend, wrapper } from "@/types/backend";
import { ReservationsTable } from "./_components/ReservationsTable";
import { GetAllReservations } from "./_actions/ReservationActions";

export default async function ReservationsPage() {
    // Obtener todas las reservas
    const [reservationsResult, reservationsError] = await GetAllReservations();

    // Manejar el error si ocurre al obtener las reservas
    if (reservationsError) {
        return (
            <div>
                <HeaderPage title="Separaciones" description="Gestión de separaciones" />
                <ErrorGeneral />
            </div>
        );
    }

    const data = reservationsResult || [];

    return (
        <div>
            <HeaderPage title="Separaciones" description="Gestión de separaciones" />
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <ReservationsTable data={data} />
            </div>
        </div>
    );
}
