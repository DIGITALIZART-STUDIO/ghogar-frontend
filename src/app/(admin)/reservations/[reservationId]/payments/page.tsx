import { HeaderPage } from "@/components/common/HeaderPage";
import ErrorGeneral from "@/components/errors/general-error";
import { GetPaymentScheduleByReservation } from "../../_actions/PaymentActions";
import { GetReservationById } from "../../_actions/ReservationActions";
import { PaymentScheduleTable } from "./_components/PaymentScheduleTable";
import { PaymentScheduleActions } from "./_components/PaymentScheduleActions";

interface PaymentSchedulePageProps {
    params: Promise <{
        reservationId: string;
    }>;
}

export default async function PaymentSchedulePage({ params }: PaymentSchedulePageProps) {
    const { reservationId } = await params;

    // Obtener información de la reserva y su cronograma de pagos
    const [reservationResult, reservationError] = await GetReservationById(reservationId);
    const [paymentsResult, paymentsError] = await GetPaymentScheduleByReservation(reservationId);

    // Manejar errores
    if (reservationError || paymentsError) {
        return (
            <div>
                <HeaderPage
                    title="Cronograma de Pagos"
                    description="Error al cargar la información"
                />
                <ErrorGeneral />
            </div>
        );
    }

    const reservation = reservationResult;
    const payments = paymentsResult ?? [];

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
        <div>
            <HeaderPage
                title="Cronograma de Pagos"
                description={`Cronograma de pagos para la reserva de ${reservation.clientName}`}
            />

            {/* Información de la reserva */}
            <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Cliente</p>
                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{reservation.clientName}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Código de Cotización</p>
                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{reservation.quotationCode}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Estado</p>
                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{reservation.status}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Fecha de Reserva</p>
                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                            {reservation.reservationDate ? new Date(reservation.reservationDate).toLocaleDateString() : "No disponible"}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Monto Inicial Pagado</p>
                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                            {reservation.currency === "SOLES" ? "S/ " : "$ "}{(reservation.amountPaid ?? 0).toFixed(2)}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total de Cuotas</p>
                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{payments.length} cuotas</p>
                    </div>
                </div>
            </div>

            {/* Acciones del cronograma */}
            <PaymentScheduleActions reservationId={reservationId} />

            {/* Tabla de cronograma */}
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1">
                <PaymentScheduleTable data={payments} />
            </div>
        </div>
    );
}
