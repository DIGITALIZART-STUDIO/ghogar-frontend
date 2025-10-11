"use client";

import { HeaderPage } from "@/components/common/HeaderPage";
import ErrorGeneral from "@/components/errors/general-error";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useReservationById } from "../../../_hooks/useReservations";
import PaymentScheduleClient from "./PaymentScheduleClient";

interface PaymentSchedulePageClientProps {
    reservationId: string;
}

export default function PaymentSchedulePageClient({ reservationId }: PaymentSchedulePageClientProps) {
    const { data: reservation, isLoading, isError } = useReservationById(reservationId);

    if (isLoading) {
        return (
            <div>
                <HeaderPage
                    title="Cronograma de Pagos"
                    description="Cargando información de la reserva..."
                />
                <LoadingSpinner text="Cargando información de la reserva..." />
            </div>
        );
    }

    if (isError) {
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
