import React from "react";

import { HeaderPage } from "@/components/common/HeaderPage";
import ErrorGeneral from "@/components/errors/general-error";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { GetAcceptedQuotationsByAdvisor } from "../../quotation/_actions/QuotationActions";
import CreateReservationPage from "./_components/CreateReservationPage";
import { backend, wrapper } from "@/types/backend";

export default async function CreateReservationPageWrapper() {
    // Obtener datos del usuario actual desde la API
    const [userData, error] = await wrapper((auth) => backend.GET("/api/Users", auth));

    if (error || !userData) {
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

    // Usar el ID del usuario obtenido de la API
    const userId = userData.user.id;

    if (!userId) {
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
    // Get all quotations for the dropdown
    const [quotationsResult, quotationsError] = await GetAcceptedQuotationsByAdvisor(userId);

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
