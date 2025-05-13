import React from "react";

import { HeaderPage } from "@/components/common/HeaderPage";
import ErrorGeneral from "@/components/errors/general-error";
import { backend, wrapper } from "@/types/backend";
import { GetAssignedLeadsSummary } from "../../leads/_actions/LeadActions";
import CreateClientQuotationPage from "./_components/CreateClientQuotationPage";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";

export default async function CreateQuotationPage() {
    // Obtener datos del usuario actual desde la API
    const [userData, error] = await wrapper((auth) => backend.GET("/api/Users", auth));

    if (error || !userData) {
        return (
            <div>
                <HeaderPage
                    title="Creación de Cotizaciones"
                    description="Ingrese la información requerida para generar una nueva cotización"
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
                <HeaderPage
                    title="Creación de Cotizaciones"
                    description="Ingrese la información requerida para generar una nueva cotización"
                />
                <ErrorGeneral />
            </div>
        );
    }

    const [leadsAssignedResult, leadsAssignedError] = await GetAssignedLeadsSummary(userId);

    // Manejar el error si ocurre al obtener las cotizaciones
    if (leadsAssignedError) {
        return (
            <div>
                <HeaderPage
                    title="Creación de Cotizaciones"
                    description="Ingrese la información requerida para generar una nueva cotización"
                />
                <ErrorGeneral />
            </div>
        );
    }

    const leadsData = leadsAssignedResult;
    return (
        <div>
            <div className="mb-4">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <Link href="/quotation">
                                Cotizaciones
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
                title="Creación de Cotizaciones"
                description="Ingrese la información requerida para generar una nueva cotización"
            />
            <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
                <CreateClientQuotationPage leadsData={leadsData} advisorId={userId} />
            </div>
        </div>
    );
}
