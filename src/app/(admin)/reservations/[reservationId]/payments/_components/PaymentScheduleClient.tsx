"use client";

import { HeaderPage } from "@/components/common/HeaderPage";
import ErrorGeneral from "@/components/errors/general-error";
import { usePaymentSchedule } from "@/app/(admin)/payments-transaction/_hooks/usePaymentSchedule";
import { PaymentScheduleTable } from "./PaymentScheduleTable";
import { PaymentScheduleActions } from "./PaymentScheduleActions";
import { ReservationStatusLabels } from "../../../_utils/reservations.utils";
import { ReservationStatus } from "../../../_types/reservation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";

interface PaymentScheduleClientProps {
    reservationId: string;
    reservation: {
        clientName: string;
        quotationCode: string;
        status: string;
        reservationDate?: string;
        amountPaid?: number;
        currency: string;
    };
}

export default function PaymentScheduleClient({ reservationId, reservation }: PaymentScheduleClientProps) {
    const { data: payments, isLoading, error } = usePaymentSchedule(reservationId);

    if (isLoading) {
        return (
            <div>
                <HeaderPage
                    title="Cronograma de Pagos"
                    description="Cargando cronograma de pagos..."
                />
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <HeaderPage
                    title="Cronograma de Pagos"
                    description="Error al cargar el cronograma de pagos"
                />
                <ErrorGeneral />
            </div>
        );
    }

    return (
        <div>
            {/* Breadcrumb */}
            <div className="mb-6">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="/reservations">
                                    Reservas
                                </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href={"/reservations"}>
                                    {reservation.clientName}
                                </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>
                                Cronograma de Pagos
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className="flex sm:flex-row flex-col gap-4 justify-between items-center">
                <HeaderPage
                    title="Cronograma de Pagos"
                    description={`Cronograma de pagos para la reserva de ${reservation.clientName}`}
                />
                {/* Acciones del cronograma */}
                <PaymentScheduleActions reservationId={reservationId} />
            </div>

            {/* Información de la reserva */}
            <div className="mb-6 bg-card rounded-lg shadow p-6">
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
                        <div className="mt-1">
                            {(() => {
                                const statusInfo = ReservationStatusLabels[reservation.status as ReservationStatus];
                                if (!statusInfo) {
                                    return (
                                        <span className="text-sm text-gray-900 dark:text-gray-100">
                                            {reservation.status}
                                        </span>
                                    );
                                }
                                const Icon = statusInfo.icon;
                                return (
                                    <div className="flex items-center gap-2">
                                        <Icon className={`h-4 w-4 ${statusInfo.className}`} />
                                        <span className={"text-sm font-medium "}>
                                            {statusInfo.label}
                                        </span>
                                    </div>
                                );
                            })()}
                        </div>
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
                        <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{payments?.length ?? 0} cuotas</p>
                    </div>
                </div>
            </div>

            {/* Tabla de cronograma */}
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1">
                <PaymentScheduleTable data={payments ?? []} />
            </div>
        </div>
    );
}
