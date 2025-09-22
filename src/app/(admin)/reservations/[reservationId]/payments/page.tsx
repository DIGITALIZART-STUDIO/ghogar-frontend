import { HeaderPage } from "@/components/common/HeaderPage";
import ErrorGeneral from "@/components/errors/general-error";
import { GetReservationById } from "../../_actions/ReservationActions";
import PaymentScheduleClient from "./_components/PaymentScheduleClient";

interface PaymentSchedulePageProps {
    params: Promise <{
        reservationId: string;
    }>;
}

export default async function PaymentSchedulePage({ params }: PaymentSchedulePageProps) {
    const { reservationId } = await params;

    // Obtener información de la reserva
    const [reservationResult, reservationError] = await GetReservationById(reservationId);

    // Manejar errores
    if (reservationError) {
        return (
            <div>
                <HeaderPage
                    title="Cronograma de Pagos"
                    description="Error al cargar la información de la reserva"
                />
                <ErrorGeneral />
            </div>
        );
    }

    const reservation = reservationResult;

    if (!reservation) {
        return (
            <div>
                <HeaderPage
                    title="Cronograma de Pagos"
                    description="Reserva no encontrada"
                />
                <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500 dark:text-gray-400">Reserva no encontrada</p>
                </div>
            </div>
        );
    }

    return (
        <PaymentScheduleClient
            reservationId={reservationId}
            reservation={{
                clientName: reservation.clientName ?? "",
                quotationCode: reservation.quotationCode ?? "",
                status: reservation.status ?? "",
                reservationDate: reservation.reservationDate,
                amountPaid: reservation.amountPaid,
                currency: reservation.currency ?? "SOLES",
            }}
        />
    );
}
