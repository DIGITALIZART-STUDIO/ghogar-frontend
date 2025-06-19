import React from "react";

import { HeaderPage } from "@/components/common/HeaderPage";
import ErrorGeneral from "@/components/errors/general-error";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { GetAllQuotations } from "../../quotation/_actions/QuotationActions";
import CreateReservationPage from "./_components/CreateReservationPage";

export default async function CreateReservationPageWrapper() {
    // Get all quotations for the dropdown
    const [quotationsResult, quotationsError] = await GetAllQuotations();

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
                                Crear
                            </BreadcrumbPage>
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

    const quotationsData = quotationsResult || [];

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
                            Crear
                        </BreadcrumbPage>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <HeaderPage
                title="Crear Separación"
                description="Ingrese la información requerida para generar una nueva separación de lote"
            />
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <CreateReservationPage quotationsData={quotationsData} />
            </div>
        </div>
    );
}