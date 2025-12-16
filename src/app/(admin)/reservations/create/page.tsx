"use client";

import React from "react";
import { HeaderPage } from "@/components/common/HeaderPage";
import ErrorGeneral from "@/components/errors/general-error";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";
import CreateReservationPage from "./_components/CreateReservationPage";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { usePaginatedAcceptedQuotationsWithSearch } from "@/app/(admin)/quotation/_hooks/useQuotations";

export default function CreateReservationPageWrapper() {
    // Usar el nuevo hook de búsqueda paginada
    const { allQuotations, isLoading: loadingQuotations, isError: quotationsError } = usePaginatedAcceptedQuotationsWithSearch(10);

    // Loading cotizaciones
    if (loadingQuotations) {
        return (
            <div>
                <div className="mb-4">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link href="/reservations">Separaciones</Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbPage>Crear</BreadcrumbPage>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <HeaderPage
                    title="Crear Separación"
                    description="Ingrese la información requerida para generar una nueva separación de lote"
                />
                <LoadingSpinner text="Cargando cotizaciones..." />
            </div>
        );
    }

    // Error cotizaciones
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
                            <BreadcrumbPage>Crear</BreadcrumbPage>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <HeaderPage
                    title="Crear Separación"
                    description="Ingrese la información requerida para generar una nueva separación de lote"
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
                        <BreadcrumbPage>Crear</BreadcrumbPage>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <HeaderPage
                title="Crear Separación"
                description="Ingrese la información requerida para generar una nueva separación de lote"
            />
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <CreateReservationPage quotationsData={allQuotations} />
            </div>
        </div>
    );
}
