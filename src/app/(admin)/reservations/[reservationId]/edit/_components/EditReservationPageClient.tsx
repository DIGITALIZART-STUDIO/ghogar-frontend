"use client";

import React from "react";
import Link from "next/link";

import { HeaderPage } from "@/components/common/HeaderPage";
import ErrorGeneral from "@/components/errors/general-error";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useReservationById } from "../../../_hooks/useReservations";
import { useQuotationByReservationId } from "@/app/(admin)/quotation/_hooks/useQuotations";
import EditReservationPage from "./EditReservationPage";
import { Quotation } from "@/app/(admin)/quotation/_types/quotation";

interface EditReservationPageClientProps {
    reservationId: string;
}

export default function EditReservationPageClient({ reservationId }: EditReservationPageClientProps) {
    const { data: reservationData, error: reservationError, isLoading: loadingReservation } = useReservationById(reservationId);
    const { data: quotationData, error: quotationsError, isLoading: loadingQuotation } = useQuotationByReservationId(reservationId);

    if (!reservationId) {
        return <ErrorGeneral />;
    }

    if (loadingReservation || loadingQuotation) {
        return (
            <div>
                <HeaderPage title="Editar Separación" description="Cargando información..." />
                <LoadingSpinner text="Cargando cotización..." />
            </div>
        );
    }

    if (reservationError || !reservationData) {
        return (
            <div>
                <div className="mb-4">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link href="/reservations">Separaciones</Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbPage>Editar</BreadcrumbPage>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <HeaderPage
                    title="Editar Separación"
                    description="Modifique la información de la separación de lote"
                />
                <ErrorGeneral />
            </div>
        );
    }

    if (quotationsError) {
        return (
            <div>
                <div className="mb-4">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link href="/reservations">Separaciones</Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbPage>Editar</BreadcrumbPage>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <HeaderPage
                    title="Editar Separación"
                    description="Modifique la información de la separación de lote"
                />
                <ErrorGeneral />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-4">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <Link href="/reservations">Separaciones</Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbPage>Editar</BreadcrumbPage>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <HeaderPage
                title="Editar Separación"
                description="Modifique la información de la separación de lote"
            />
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <EditReservationPage
                    reservationData={reservationData}
                    quotationData={quotationData as Quotation}
                />
            </div>
        </div>
    );
}
