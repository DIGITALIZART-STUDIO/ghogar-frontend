"use client";

import { HeaderPage } from "@/components/common/HeaderPage";
import ErrorGeneral from "@/components/errors/general-error";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ReservationsTable } from "./ReservationsTable";
import { useAllReservations } from "../_hooks/useReservations";

export default function ReservationsClient() {
    const { data: reservations, isLoading, isError } = useAllReservations();

    if (isLoading) {
        return (
            <div>
                <HeaderPage
                    title="Separaciones"
                    description="Gestión y administración de recibos de separaciones para proyectos inmobiliarios"
                />
                <LoadingSpinner text="Cargando reservas..." />
            </div>
        );
    }

    if (isError) {
        return (
            <div>
                <HeaderPage
                    title="Separaciones"
                    description="Gestión y administración de recibos de separaciones para proyectos inmobiliarios"
                />
                <ErrorGeneral />
            </div>
        );
    }

    return (
        <div>
            <HeaderPage
                title="Separaciones"
                description="Gestión y administración de recibos de separaciones para proyectos inmobiliarios"
            />
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <ReservationsTable data={reservations ?? []} />
            </div>
        </div>
    );
}
