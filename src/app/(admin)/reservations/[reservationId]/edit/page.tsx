import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";

import { HeaderPage } from "@/components/common/HeaderPage";
import ErrorGeneral from "@/components/errors/general-error";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

import { GetReservationById } from "../../_actions/ReservationActions";
import { GetAllQuotations } from "../../../quotation/_actions/QuotationActions";
import EditReservationPage from "./_components/EditReservationPage";

interface EditReservationPageWrapperProps {
    params: Promise<{ reservationId: string }>;
}

export default async function EditReservationPageWrapper({ params }: EditReservationPageWrapperProps) {
    const { reservationId } = await params;

    if (!reservationId) {
        notFound();
    }

    // Fetch reservation data and quotations in parallel
    const [reservationResult, quotationsResult] = await Promise.all([
        GetReservationById(reservationId),
        GetAllQuotations(),
    ]);

    const [reservationData, reservationError] = reservationResult;
    const [quotationsData, quotationsError] = quotationsResult;

    // Handle reservation not found or error
    if (reservationError || !reservationData) {
        return (
            <div>
                <div className="mb-4">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link href="/reservations">
                                    Separaciones
                                </Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbPage>
                                Editar
                            </BreadcrumbPage>
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

    // Handle quotations error (we still need quotations for display)
    if (quotationsError) {
        return (
            <div>
                <div className="mb-4">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link href="/reservations">
                                    Separaciones
                                </Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbPage>
                                Editar
                            </BreadcrumbPage>
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
                            <Link href="/reservations">
                                Separaciones
                            </Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbPage>
                            Editar
                        </BreadcrumbPage>
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
                    quotationsData={quotationsData || []}
                />
            </div>
        </div>
    );
}
